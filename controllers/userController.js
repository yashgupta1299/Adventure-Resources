const User = require('./../models/userModel');
const catchAsync = require('./../utils/catchAsync');
const AppError = require('./../utils/AppError');
const { findByIdAndUpdate } = require('./../models/userModel');

const filterObj = (body, ...fieldKeep) => {
    const obj = {};
    Object.keys(body).forEach(el => {
        if (fieldKeep.includes(el)) {
            obj[el] = body[el];
        }
    });
    return obj;
};

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

exports.updateMe = catchAsync(async (req, res, next) => {
    if (req.body.password || req.body.passwordConfirm) {
        return next(
            new AppError(
                'You do not have access to change password, if you want then go to /updateMyPassword',
                401
            )
        );
    }
    const filteredBody = filterObj(req.body, 'name', 'email');
    // note here we are not using because then either all validator run
    // or we can turn all off hence we are using particular function
    // so that only their validaror will run
    const updatedUser = await User.findByIdAndUpdate(
        req.user.id,
        filteredBody,
        {
            new: true,
            runValidators: true
        }
    );
    res.status(200).json({
        status: 'success',
        data: {
            updatedUser
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
