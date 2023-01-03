const fs = require('fs');
const { promisify } = require('util');
const multer = require('multer');
const sharp = require('sharp');
const Tour = require('./../models/tourModel');
const catchAsync = require('./../utils/catchAsync');
const factory = require('./handlerFactory');
const AppError = require('../utils/AppError');

const unlinkAsync = promisify(fs.unlink);

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

// /tours-within/:distance/center/:latlng/unit/:unit
// /tours-within/233/center/34.111745,-118.113491/unit/mi
exports.getToursWithin = catchAsync(async (req, res, next) => {
    const { distance, latlng, unit } = req.params;
    const [lat, lng] = latlng.split(',');

    const radius = unit === 'mi' ? distance / 3963.2 : distance / 6378.1;

    if (!lat || !lng) {
        next(
            new AppError(
                'Please provide latitutde and longitude in the format "lat,lng".',
                400
            )
        );
    }

    const tours = await Tour.find({
        startLocation: { $geoWithin: { $centerSphere: [[lng, lat], radius] } }
    });

    res.status(200).json({
        status: 'success',
        results: tours.length,
        data: {
            data: tours
        }
    });
});

exports.getDistances = catchAsync(async (req, res, next) => {
    const { latlng, unit } = req.params;
    const [lat, lng] = latlng.split(',');

    const multiplier = unit === 'mi' ? 0.000621371 : 0.001;

    if (!lat || !lng) {
        next(
            new AppError(
                'Please provide latitutde and longitude in the format "lat,lng".',
                400
            )
        );
    }

    const distances = await Tour.aggregate([
        {
            $geoNear: {
                near: {
                    type: 'Point',
                    coordinates: [lng * 1, lat * 1]
                },
                distanceField: 'distance',
                distanceMultiplier: multiplier
            }
        },
        {
            $project: {
                distance: 1,
                name: 1
            }
        }
    ]);

    res.status(200).json({
        status: 'success',
        data: {
            data: distances
        }
    });
});

exports.getAllTour = factory.getAll(Tour);
const populateOptions = { path: 'reviews' };
exports.getTour = factory.getOne(Tour, populateOptions);
exports.createNewTour = factory.createOne(Tour);
exports.deleteTour = factory.deleteOne(Tour);

// multiple tour images update processing
const storage = multer.memoryStorage();
const fileFilter = (req, file, cb) => {
    if (file.mimetype.startsWith('image')) {
        cb(null, true); // null means no error and true means we can proceed
    } else {
        cb(new AppError('Not an image. Please upload only image!', 400), false);
    }
};
const upload = multer({ fileFilter, storage });
exports.uploadTourImages = upload.fields([
    { name: 'imageCover', maxCount: 1 },
    { name: 'images', maxCount: 3 }
]);
// upload.single('image') req.file
// upload.array('images', 6) req.files
exports.resizeTourImages = catchAsync(async (req, res, next) => {
    if (!req.files) {
        return next();
    }
    if (!req.files.imageCover || !req.files.images) {
        return next();
    }

    // 1) Cover image
    //saving imageCover file name in this way so that we can use it in updateTour middleware
    req.body.imageCover = `tour-${req.params.id}-${Date.now()}-cover.jpeg`;
    await sharp(req.files.imageCover[0].buffer)
        .resize(2000, 1333)
        .toFormat('jpeg')
        .jpeg({ quality: 90 })
        .toFile(`public/img/tours/${req.body.imageCover}`);

    // 2) Images
    //saving images file name in this way so that we can use it in updateTour middleware
    // return array of unresolved promises hence Promis.all()
    req.body.images = [];
    await Promise.all(
        req.files.images.map(async (file, i) => {
            const filename = `tour-${req.params.id}-${Date.now()}-${i +
                1}.jpeg`;

            await sharp(file.buffer)
                .resize(2000, 1333)
                .toFormat('jpeg')
                .jpeg({ quality: 90 })
                .toFile(`public/img/tours/${filename}`);

            req.body.images.push(filename);
        })
    );

    // 3) deleteing old images in database
    try {
        const oldTour = await Tour.findById(req.params.id).select(
            'imageCover images'
        );
        await Promise.all(
            oldTour.images.map(async fileName => {
                await unlinkAsync(`public/img/tours/${fileName}`);
            })
        );
        await unlinkAsync(`public/img/tours/${oldTour.imageCover}`);
    } catch (err) {
        console.log(err);
    }
    next();
});
exports.updateTour = factory.updateOne(Tour);
