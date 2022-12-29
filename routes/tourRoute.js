const express = require('express');
const tourController = require('./../controllers/tourController');
const authController = require('./../controllers/authController');
const reviewRouter = require('./reviewRoute');

const router = express.Router();
// router.param('id', tourController.checkId);

// POST /tour/21435afaf/reviews
// GET /tour/21435afaf/reviews
router.use('/:tourId/reviews', reviewRouter);

router
    .route('/top-5-cheap')
    .get(tourController.alias, tourController.getAllTour);

router.route('/tour-stats').get(tourController.getTourStats);

router
    .route('/monthly-plan/:year')
    .get(
        authController.protect,
        authController.restricedTo('admin', 'lead-guide', 'guide'),
        tourController.getmonthlyPlan
    );

router
    .route('/tours-within/:distance/center/:latlng/unit/:unit')
    .get(tourController.getToursWithin);
// another way => /tours-within?distance=233&center=-40,45&unit=mi
// betterone => /tours-within/233/center/-40,45/unit/mi

router.route('/distances/:latlng/unit/:unit').get(tourController.getDistances);

router
    .route('/')
    .get(tourController.getAllTour)
    .post(
        authController.protect,
        authController.restricedTo('admin', 'lead-guide'),
        tourController.createNewTour
    );

router
    .route('/:id')
    .get(tourController.getTour)
    .patch(
        authController.protect,
        authController.restricedTo('admin', 'lead-guide'),
        tourController.updateTour
    )
    .delete(
        authController.protect,
        authController.restricedTo('admin', 'lead-guide'),
        tourController.deleteTour
    );

module.exports = router;
