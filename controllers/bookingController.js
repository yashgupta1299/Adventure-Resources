const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const Booking = require('../models/bookingModel');
const Tour = require('./../models/tourModel');
// const User = require('./../models/userModel');
const catchAsync = require('./../utils/catchAsync');
const factory = require('./handlerFactory');
// const AppError = require('../utils/AppError');

exports.getCheckoutSession = catchAsync(async (req, res, next) => {
    // 1) Get the currently booked tour
    const tour = await Tour.findById(req.params.tourId);

    // 2) Create checkout session old method not working
    const session = await stripe.checkout.sessions.create({
        payment_method_types: ['card'],
        // just to create booking in a temporaray way for chekking purpose
        // success_url: `${req.protocol}://${req.get('host')}/my-tours/?tour=${
        //     req.params.tourId
        // }&user=${req.user.id}&price=${tour.price}`,
        success_url: `${req.protocol}://${req.get(
            'host'
        )}/my-tours/?alert=bookingDone`,
        cancel_url: `${req.protocol}://${req.get('host')}/tour/${
            tour.slug
        }/?alert=bookingFailed`,
        customer_email: req.user.email,
        client_reference_id: req.params.tourId,
        mode: 'payment',
        line_items: [
            {
                quantity: 1,
                price_data: {
                    unit_amount: tour.price * 1000, // in paise
                    currency: 'inr',
                    product_data: {
                        name: `${tour.name} Tour`,
                        description: tour.summary,
                        // image should be somewhere hosted so that stripe can use it
                        images: [
                            `${req.protocol}://${req.get('host')}/img/tours/${
                                tour.imageCover
                            }`
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

// exports.createBookingCheckout = catchAsync(async (req, res, next) => {
//     // This is only TEMPORARY, because it's UNSECURE: everyone can make bookings without paying
//     const { tour, user, price } = req.query;

//     if (!tour && !user && !price) return next();
//     await Booking.create({ tour, user, price });

//     res.redirect(req.originalUrl.split('?')[0]);
// });
const createBookingCheckout = async session => {
    console.log(session);
    // const tourId = session.client_reference_id;
    // const userId = (await User.findOne({ email: session.customer_email })).id;
    // const price = session.display_items[0].amount / 100;
    // await Booking.create({ tourId, userId, price });
};

exports.webhookCheckout = catchAsync(async (req, res, next) => {
    const signature = req.headers['stripe-signature'];
    let event;
    try {
        event = stripe.webhooks.constructEvents(
            req.body,
            signature,
            process.env.STRIPE_WEBHOOK_SECRET
        );
    } catch (err) {
        res.status(400).send(`webhook error: ${err.message}\n${err}`);
    }

    if (event.type === 'checkout.session.completed') {
        createBookingCheckout(event.data.object);
        res.status(200).json({
            status: 'success'
        });
    } else {
        res.status(400).json({
            status: 'fail',
            message: 'unknown event type',
            eventType: event.type
        });
    }
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
