const AppError = require('../utils/AppError');
const Tour = require('./../models/tourModel');
const User = require('./../models/userModel');
const catchAsync = require('./../utils/catchAsync');

exports.getOverview = catchAsync(async (req, res) => {
    //1 get tour data from collection
    const tours = await Tour.find();

    //2 build template
    //3 Render that template using tour data
    res.status(200).render('overview', {
        title: 'All tours',
        tours
    });
});
exports.getTour = catchAsync(async (req, res, next) => {
    // get the data, for requested tour (including reviews and guides)
    // even after adding hash at the end of slug it gives same name as before
    // console.log(req.params.slug);
    const tour = await Tour.findOne({ slug: req.params.slug }).populate({
        path: 'reviews',
        field: 'review rating user'
    });

    // if tour not found
    if (!tour) {
        return next(new AppError('There is no tour with that name!', 404));
    }

    //2 build template
    //3 Render that template using tour data
    res.status(200).render('tour', {
        title: `${tour.name} Tour`,
        tour
    });
});

exports.getLogInForm = (req, res) => {
    res.status(200).render('login', {
        title: 'Log into your account'
    });
};

exports.getMe = (req, res) => {
    res.status(200).render('account', {
        title: 'Your Account'
    });
};

exports.updateUserData = catchAsync(async (req, res) => {
    const updUser = await User.findByIdAndUpdate(
        req.user.id,
        {
            name: req.body.name,
            email: req.body.email
        },
        {
            new: true,
            runValidators: true
        }
    );
    // We want that we remain at the same page and information also update and display
    // Note: if we do not send user then account page render by using old data
    res.status(200).render('account', {
        title: 'Your Account',
        user: updUser
    });
});
