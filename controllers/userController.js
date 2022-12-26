const User = require('./../models/userModel');
const catchAsync = require('./../utils/catchAsync');

exports.getAllUser = catchAsync(async (req, res, next) => {
    const users = await User.find();

    res.status(200).json({
        status: 'success',
        requestTime: req.requestTime,
        results: users.length,
        data: {
            users
        }
    });
});
exports.createNewUser = (req, res) => {
    res.status(500).json({
        status: 'fail',
        message: 'functions yet to be implimented'
    });
};
exports.getUser = (req, res) => {
    res.status(500).json({
        status: 'fail',
        message: 'functions yet to be implimented'
    });
};
exports.updateUser = (req, res) => {
    res.status(500).json({
        status: 'fail',
        message: 'functions yet to be implimented'
    });
};
exports.deleteUser = (req, res) => {
    res.status(500).json({
        status: 'fail',
        message: 'functions yet to be implimented'
    });
};
