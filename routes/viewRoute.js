const express = require('express');
const viewController = require('./../controllers/viewController');
const authController = require('./../controllers/authController');

const router = express.Router();

router.use(viewController.headAlert);

router.get('/', authController.isLoggedIn, viewController.getOverview);
router.get('/tour/:slug', authController.isLoggedIn, viewController.getTour);
router.get('/login', authController.isLoggedIn, viewController.getLogInForm);
router.get('/signup', viewController.getSignupForm);
router.get('/me', authController.protect, viewController.getMe);
router.get('/myReviews', authController.protect, viewController.getMyreviews);
router.get(
    '/my-tours',
    // bookingController.createBookingCheckout,
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
