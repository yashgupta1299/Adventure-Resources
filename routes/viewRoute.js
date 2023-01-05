const express = require('express');
const viewController = require('./../controllers/viewController');
const authController = require('./../controllers/authController');
const bookingController = require('./../controllers/bookingController');

const router = express.Router();

router.get('/', authController.isLoggedIn, viewController.getOverview);
router.get('/tour/:slug', authController.isLoggedIn, viewController.getTour);
router.get('/login', authController.isLoggedIn, viewController.getLogInForm);
router.get('/me', authController.protect, viewController.getMe);
router.get(
    '/my-tours',
    bookingController.createBookingCheckout, // not safe please comment it out
    authController.protect,
    viewController.getMyTours
);

// for form
router.post(
    '/submit-user-data',
    authController.protect,
    viewController.updateUserData
);

module.exports = router;
