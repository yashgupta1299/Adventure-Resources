const mongoose = require('mongoose');
const Tour = require('./tourModel');

const reviewSchema = new mongoose.Schema(
    {
        review: {
            type: String,
            required: [true, 'Review can not be empty!']
        },
        rating: {
            type: Number,
            min: 1,
            max: 5
        },
        createdAt: {
            type: Date,
            default: Date.now
        },
        tour: {
            type: mongoose.Schema.ObjectId,
            ref: 'Tour',
            required: [true, 'Review must belong to a tour.']
        },
        user: {
            type: mongoose.Schema.ObjectId,
            ref: 'User',
            required: [true, 'Review must belong to a user']
        }
    },
    {
        toJSON: { virtuals: true },
        toObject: { virtuals: true }
    }
);

// create a index and prevents a user to write more
// than one review for a particular tour
reviewSchema.index({ tour: 1, user: 1 }, { unique: true });

reviewSchema.pre(/^find/, async function(next) {
    // this.populate({
    //     path: 'tour',
    //     select: 'name '
    // }).populate({
    //     path: 'user',
    //     select: 'name photo'
    // });
    this.populate({
        path: 'user',
        select: 'name photo'
    });
    next();
});

// static method which is available for a model like Review.nameOfMethod
// this points to current Model
reviewSchema.statics.calcAverageRatings = async function(tourId) {
    const stats = await this.aggregate([
        {
            $match: { tour: tourId }
        },
        {
            $group: {
                _id: '$tour',
                nRating: { $sum: 1 },
                avgRating: { $avg: '$rating' }
            }
        }
    ]);
    // console.log(stats);
    if (stats.length > 0) {
        await Tour.findByIdAndUpdate(tourId, {
            ratingsQuantity: stats[0].nRating,
            ratingsAverage: stats[0].avgRating
        });
    } else {
        // not: if there are zero reviews for a particular tour
        // than its average rating is set to be zer0
        await Tour.findByIdAndUpdate(tourId, {
            ratingsQuantity: 0,
            ratingsAverage: 4.5
        });
    }
};

// will run on save and create
// document middleware this point to current review
//for create review
reviewSchema.post('save', function() {
    // console.log(this);
    this.constructor.calcAverageRatings(this.tour);
});

// findByIdAndUpdate = findOneAndUpdate
// findByIdAndDelete = findOneAnDelete
// for update and delete reveiw
// query middleware functions, this refers to the query.
reviewSchema.pre(/^findOneAnd/, async function(next) {
    //console.log(this.getQuery()); // { _id: 63adf046dc0955076b4ea2b1 }
    // const docToUpdate = await this.model.findOne(this.getQuery());

    // saving only id of the tour that will going to update
    // this.r = await this.findOne(); below give same result
    this.docToUpdate = await this.model.findOne(this.getQuery());
    // console.log(this.docToUpdate);
    next();
});

reviewSchema.post(/^findOneAnd/, async function() {
    // await this.findOne(); does NOT work here, query has already executed
    // this.docToUpdate.tour gives id of tour that we got from previous query
    await this.docToUpdate.constructor.calcAverageRatings(
        this.docToUpdate.tour
    );
});

const Review = mongoose.model('Review', reviewSchema);

module.exports = Review;
