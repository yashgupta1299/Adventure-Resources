const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const Booking = require('../models/bookingModel');
const Tour = require('./../models/tourModel');
const catchAsync = require('./../utils/catchAsync');
const factory = require('./handlerFactory');
// const AppError = require('../utils/AppError');

exports.getCheckoutSession = catchAsync(async (req, res, next) => {
    // 1) Get the currently booked tour
    const tour = await Tour.findById(req.params.tourId);

    // 2) Create checkout session old method not working
    // const session = await stripe.checkout.sessions.create({
    // payment_method_types: ['card'],

    //// just to create booking in a temporaray way for chekking purpose
    // // success_url: `${req.protocol}://${req.get('host')}/?tour=${
    // //     req.params.tourId
    // // }&user=${req.user.id}&price=${tour.price}`,

    // success_url: `${req.protocol}://${req.get('host')}/`,
    // cancel_url: `${req.protocol}://${req.get('host')}/tour/${tour.slug}`,
    //some items that will help as when this request again comeback to us after payment
    // customer_email: req.user.email,
    // client_reference_id: req.params.tourId,
    // some items that will help stripe to show the booking
    // line_items: [
    //     {
    //         name: `${tour.name} Tour`,
    //         description: tour.summary,
    //         // image should be somewhere hosted so that stripe can use it
    //         images: [
    //             `https://www.natours.dev/img/tours/${tour.imageCover}`
    //         ],
    //         amount: tour.price * 100,
    //         currency: 'usd',
    //         quantity: 1
    //     }
    // ]
    // });

    const session = await stripe.checkout.sessions.create({
        payment_method_types: ['card'],
        // just to create booking in a temporaray way for chekking purpose
        success_url: `${req.protocol}://${req.get('host')}/?tour=${
            req.params.tourId
        }&user=${req.user.id}&price=${tour.price}`,
        // success_url: `${req.protocol}://${req.get('host')}/`,
        cancel_url: `${req.protocol}://${req.get('host')}/tour/${tour.slug}`,
        customer_email: req.user.email,
        client_reference_id: req.params.tourId,
        mode: 'payment',
        line_items: [
            {
                quantity: 1,
                price_data: {
                    unit_amount: tour.price * 1000, // in paise
                    // currency: 'usd',
                    currency: 'inr',
                    product_data: {
                        name: `${tour.name} Tour`,
                        description: tour.summary,
                        // image should be somewhere hosted so that stripe can use it
                        images: [
                            `https://www.natours.dev/img/tours/${tour.imageCover}`
                        ]
                    }
                }
            }
        ]
    });

    // 3) Create session as response
    res.status(200).json({
        status: 'success',
        session
    });
});

exports.createBookingCheckout = catchAsync(async (req, res, next) => {
    // This is only TEMPORARY, because it's UNSECURE: everyone can make bookings without paying
    const { tour, user, price } = req.query;

    if (!tour && !user && !price) return next();
    await Booking.create({ tour, user, price });

    res.redirect(req.originalUrl.split('?')[0]);
});

// create
exports.createBooking = factory.createOne(Booking);
// read
exports.getAllBookings = factory.getAll(Booking);
exports.getBooking = factory.getOne(Booking);
// update
exports.updateBooking = factory.updateOne(Booking);
// delete
exports.deleteBooking = factory.deleteOne(Booking);
