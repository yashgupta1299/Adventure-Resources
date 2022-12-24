const Tour = require('./../models/tourModel');

exports.getAllTour = async (req, res) => {
    try {
        const tours = await Tour.find();
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
