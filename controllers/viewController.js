const AppError = require('../utils/AppError');
const Tour = require('./../models/tourModel');
const User = require('./../models/userModel');
const Review = require('./../models/reviewModel');
const Booking = require('./../models/bookingModel');
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

exports.getMyTours = catchAsync(async (req, res, next) => {
    // get booking of all tours booked by a user
    const myBookings = await Booking.find({ user: req.user.id });

    // get ids of all tours booked by a user
    const Ids = myBookings.map(doc => {
        return doc.tour.id;
    });

    // get all tour docs booked by a user
    const tours = await Tour.find({ _id: { $in: Ids } });

    //render my booking page (just like overview)
    res.status(200).render('overview', {
        title: 'My Bookings',
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

    // if user is logged in
    let myReview;
    let booking;
    if (req.user) {
        myReview = await Review.findOne({ tour: tour.id, user: req.user.id });
        booking = await Booking.findOne({ tour: tour.id, user: req.user.id });
        // console.log(booking);
        if (booking) {
            booking = true;
        }
    }
    //2 build template
    //3 Render that template using tour data
    res.status(200).render('tour', {
        title: `${tour.name} Tour`,
        tour,
        // user, full as db also available assigned in previous middleware as res.locals.user=dbUser
        myReview,
        booking
    });
});

exports.getLogInForm = (req, res) => {
    res.status(200).render('login', {
        title: 'Log into your account'
    });
};
exports.getSignupForm = (req, res) => {
    res.status(200).render('signup', {
        title: 'SignUp'
    });
};

exports.getMe = (req, res) => {
    res.status(200).render('account', {
        title: 'Your Account'
    });
};
exports.getMyreviews = catchAsync(async (req, res) => {
    const reviews = await Review.find({ user: res.locals.user.id }).populate({
        path: 'tour',
        select: 'name slug'
    });

    res.status(200).render('myReview', {
        title: 'My reviews',
        reviews
    });
});

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

exports.headAlert = (req, res, next) => {
    const { alert } = req.query;
    if (alert === 'bookingDone') {
        res.locals.alert =
            "Your booking was successful please check your mail for confirmation. If your booking doesn't show up here immediately, please come back later.";
    } else if (alert === 'bookingFailed') {
        res.locals.alert = 'Your booking was failed';
    }
    next();
};
