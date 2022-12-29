const APIfeatures = require('./../utils/apiFeatures');
const AppError = require('../utils/AppError');
const catchAsync = require('./../utils/catchAsync');

exports.deleteOne = Mod => {
    return catchAsync(async (req, res, next) => {
        const doc = await Mod.findByIdAndDelete(req.params.id);
        if (!doc) {
            return next(
                new AppError(`Doc with ID: ${req.params.id} do not exists`, 404)
            );
        }
        res.status(204).json({
            status: 'success',
            data: null
        });
    });
};

exports.updateOne = Mod => {
    return catchAsync(async (req, res, next) => {
        const doc = await Mod.findByIdAndUpdate(req.params.id, req.body, {
            new: true,
            runValidators: true
        });
        if (!doc) {
            return next(
                new AppError(`Doc with ID: ${req.params.id} do not exists`, 404)
            );
        }
        res.status(200).json({
            status: 'success',
            data: {
                doc
            }
        });
    });
};

exports.createOne = Mod => {
    return catchAsync(async (req, res, next) => {
        const newDoc = await Mod.create(req.body);
        res.status(201).json({
            status: 'success',
            data: {
                tour: newDoc
            }
        });
    });
};

exports.getOne = (Mod, populateOptions) => {
    return catchAsync(async (req, res, next) => {
        let query = Mod.findById(req.params.id);
        if (populateOptions) {
            query = query.populate(populateOptions);
        }
        const doc = await query;
        if (!doc) {
            return next(
                new AppError(`Doc with ID: ${req.params.id} do not exists`, 404)
            );
        }
        res.status(200).json({
            status: 'success',
            data: {
                doc
            }
        });
    });
};

exports.getAll = Mod => {
    return catchAsync(async (req, res, next) => {
        // to allow for nested get reviews on tour
        const filter = {};
        if (req.params.tourId) {
            filter.tour = req.params.tourId;
        }

        const features = new APIfeatures(Mod.find(filter), req.query)
            .filtering()
            .sort()
            .limitFields()
            .pagination();

        // const docs = (await features.query.explain())[0].executionStats;
        const docs = await features.query;

        res.status(200).json({
            status: 'success',
            requestTime: req.requestTime,
            results: docs.length,
            data: {
                docs
            }
        });
    });
};
