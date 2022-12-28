const Review = require('./../models/reviewModel');
const catchAsync = require('./../utils/catchAsync');
const AppError = require('./../utils/AppError');
// .get(controller.getAllReview)
// .post(controller.createNewReview);

exports.getAllReview = catchAsync(async (req, res, next) => {
    const filter = {};
    if (req.params.tourId) {
        filter.tour = req.params.tourId;
    }
    const reviews = await Review.find(filter);
    res.status(200).json({
        status: 'success',
        results: reviews.length,
        data: {
            reviews
        }
    });
});

exports.createNewReview = catchAsync(async (req, res, next) => {
    if (!req.body.user) {
        req.body.user = req.user.id;
    }
    if (!req.body.tour) {
        req.body.tour = req.params.tourId;
    }
    const review = await Review.create(req.body);
    res.status(201).json({
        status: 'success',
        data: {
            review
        }
    });
});
