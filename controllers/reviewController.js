const Review = require('./../models/reviewModel');
const factory = require('./handlerFactory');
const catchAsync = require('./../utils/catchAsync');
const AppError = require('./../utils/AppError');

exports.extractUserIdAndTourId = (req, res, next) => {
    if (!req.body.user) {
        req.body.user = req.user.id;
    }
    if (!req.body.tour) {
        req.body.tour = req.params.tourId;
    }
    next();
};

exports.isCreator = catchAsync(async (req, res, next) => {
    const review = await Review.findById(req.params.id);
    if (review) {
        if (review.user.id === req.user.id) {
            return next();
        }
        next(
            new AppError('You are not authorized to perform this action', 401)
        );
    }
    next(new AppError('Review do not exists!', 400));
});

exports.getAllReview = factory.getAll(Review);
exports.getReview = factory.getOne(Review);
exports.createNewReview = factory.createOne(Review);
exports.updateReview = factory.updateOne(Review);
exports.deleteReview = factory.deleteOne(Review);
