const Tour = require('./../models/tourModel');
const APIfeatures = require('./../utils/apiFeatures');
const AppError = require('../utils/AppError');
const catchAsync = require('./../utils/catchAsync');

exports.alias = (req, res, next) => {
    req.query.limit = 5;
    req.query.sort = 'price,-ratingsAverage';
    req.query.fields = 'name,price,ratingsAverage,summary,difficulty';
    next();
};

exports.getTourStats = catchAsync(async (req, res, next) => {
    const stats = await Tour.aggregate([
        {
            $match: { ratingsAverage: { $gte: 4.5 } }
        },
        {
            $group: {
                // _id: null,
                // _id: '$difficulty',
                _id: { $toUpper: '$difficulty' },
                tourCount: { $sum: 1 },
                avgPrice: { $avg: '$price' },
                avgRating: { $avg: '$ratingsAverage' },
                minPrice: { $min: '$price' },
                maxPrice: { $max: '$price' }
            }
        },
        {
            $sort: { avgPrice: 1 }
        },
        {
            $match: { _id: { $ne: 'EASY' } }
        }
    ]);
    res.status(200).json({
        status: 'success',
        results: stats.length,
        data: {
            stats
        }
    });
});

exports.getmonthlyPlan = catchAsync(async (req, res, next) => {
    const year = req.params.year * 1;
    const plan = await Tour.aggregate([
        {
            $unwind: '$startDates'
        },
        {
            $match: {
                startDates: {
                    $gte: new Date(`${year}-01-01`),
                    $lte: new Date(`${year}-12-31`)
                }
            }
        },
        {
            $group: {
                _id: { $month: '$startDates' },
                numTourStarts: { $sum: 1 },
                tours: { $push: '$name' }
            }
        },
        {
            $addFields: { month: '$_id' }
        },
        {
            $project: { _id: 0 }
        },
        {
            $sort: { numTourStarts: -1 }
        },
        {
            $limit: 12
        }
    ]);
    res.status(200).json({
        status: 'success',
        results: plan.length,
        data: {
            plan
        }
    });
});

exports.getAllTour = catchAsync(async (req, res, next) => {
    console.log(req.query);
    const features = new APIfeatures(Tour.find(), req.query)
        .filtering()
        .sort()
        .limitFields()
        .pagination();

    const tours = await features.query;

    res.status(200).json({
        status: 'success',
        requestTime: req.requestTime,
        results: tours.length,
        data: {
            tours
        }
    });
});

exports.createNewTour = catchAsync(async (req, res, next) => {
    // const testTour = new Tour({});
    // testTour.save((doc)=>{});

    const newTour = await Tour.create(req.body);
    res.status(201).json({
        status: 'success',
        data: {
            tour: newTour
        }
    });
});

exports.getTour = catchAsync(async (req, res, next) => {
    const tour = await Tour.findById(req.params.id);
    // const tour = await Tour.findOne({ _id: req.params.id });
    if (!tour) {
        // console.log('here');
        return next(
            new AppError(`Tour with ID: ${req.params.id} not exists`, 404)
        );
    }
    res.status(200).json({
        status: 'success',
        data: {
            tour
        }
    });
});

exports.updateTour = catchAsync(async (req, res, next) => {
    const tour = await Tour.findByIdAndUpdate(req.params.id, req.body, {
        new: true,
        runValidators: true
    });
    if (!tour) {
        return next(
            new AppError(`Tour with ID: ${req.params.id} not exists`, 404)
        );
    }
    res.status(200).json({
        status: 'success',
        data: {
            tour
        }
    });
});

exports.deleteTour = catchAsync(async (req, res, next) => {
    const tour = await Tour.findByIdAndDelete(req.params.id);
    if (!tour) {
        return next(
            new AppError(`Tour with ID: ${req.params.id} not exists`, 404)
        );
    }
    res.status(204).json({
        status: 'success',
        data: null
    });
});
