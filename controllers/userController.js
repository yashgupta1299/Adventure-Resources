const User = require('./../models/userModel');
const catchAsync = require('./../utils/catchAsync');
const AppError = require('./../utils/AppError');
const factory = require('./handlerFactory');

const filterObj = (body, ...fieldKeep) => {
    const obj = {};
    Object.keys(body).forEach(el => {
        if (fieldKeep.includes(el)) {
            obj[el] = body[el];
        }
    });
    return obj;
};

exports.getMe = (req, res, next) => {
    req.params.id = req.user.id;
    next();
};

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

exports.deleteMe = catchAsync(async (req, res, next) => {
    // get the user id using privous middleware as (req.user.id) and delete it
    await User.findByIdAndUpdate(req.user.id, { active: false });
    res.status(204).json({
        status: 'success',
        data: null
    });
});

// implimented via signup
exports.createNewUser = (req, res) => {
    res.status(500).json({
        status: 'fail',
        message: 'please use /api/v1/users/signup route for this'
    });
};

exports.getAllUser = factory.getAll(User);
exports.getUser = factory.getOne(User);
//Do not use for update password
exports.updateUser = factory.updateOne(User);
exports.deleteUser = factory.deleteOne(User);
