const Tour = require('./../models/tourModel');

exports.alias = (req, res, next) => {
    req.query.limit = 5;
    req.query.sort = '-ratingAverage,price';
    req.query.fields = 'name,price,ratingAverage,summary,difficulty';
    next();
};
exports.getAllTour = async (req, res) => {
    try {
        console.log('orig', req.query);

        //1a filtering
        const queryObj = { ...req.query };
        const differenFields = ['page', 'sort', 'limit', 'fields'];
        differenFields.forEach(key => delete queryObj[key]);

        //1b advanced filtering
        let queryStr = JSON.stringify(queryObj);
        queryStr = queryStr.replace(
            /\b(gte|gt|lte|lt)\b/g,
            match => `$${match}`
        );
        // console.log('##', queryStr);
        let query = Tour.find(JSON.parse(queryStr));

        //2 sorting
        if (req.query.sort) {
            const sortBy = req.query.sort.split(',').join(' ');
            query.sort(sortBy);
        } else {
            query = query.sort('-createdAt');
        }

        //3 limiting fields
        if (req.query.fields) {
            const reqFields = req.query.fields.split(',').join(' ');
            query = query.select(reqFields);
        } else {
            query = query.select('-__v');
        }

        //4 pagination
        const page = req.query.page * 1 || 1;
        const limit = req.query.limit * 1 || 100;
        const skip = (page - 1) * limit;

        query = query.skip(skip).limit(limit);

        if (req.query.page) {
            const totalNum = await Tour.countDocuments();
            if (skip >= totalNum) {
                throw new Error('This page does not exist');
            }
        }

        // executing query
        const tours = await query;

        res.status(200).json({
            status: 'success',
            requestTime: req.requestTime,
            results: tours.length,
            data: {
                tours
            }
        });
    } catch (err) {
        res.status(404).json({
            status: 'fail',
            err
        });
    }
};

exports.createNewTour = async (req, res) => {
    try {
        // const testTour = new Tour({});
        // testTour.save((doc)=>{});
        // console.log("here");
        console.log('here', req.body);
        const newTour = await Tour.create(req.body);
        res.status(201).json({
            status: 'success',
            data: {
                tour: newTour
            }
        });
    } catch (err) {
        res.status(400).json({
            status: 'fail',
            message: 'Invalid Content',
            err
        });
    }
};

exports.getTour = async (req, res) => {
    try {
        const tour = await Tour.findById(req.params.id);
        // const tour = await Tour.findOne({ _id: req.params.id });
        res.status(200).json({
            status: 'success',
            data: {
                tour
            }
        });
    } catch (err) {
        res.status(404).json({
            status: 'fail',
            err
        });
    }
};

exports.updateTour = async (req, res) => {
    try {
        const tour = await Tour.findByIdAndUpdate(req.params.id, req.body, {
            new: true, // without this working?
            runValidators: true // without this working?
        });
        res.status(200).json({
            status: 'success',
            data: {
                tour
            }
        });
    } catch (err) {
        res.status(404).json({
            status: 'fail',
            err
        });
    }
};

exports.deleteTour = async (req, res) => {
    try {
        await Tour.findByIdAndDelete(req.params.id);
        res.status(204).json({
            status: 'success',
            data: null
        });
    } catch (err) {
        res.status(404).json({
            status: 'fail',
            err
        });
    }
};
