const express = require('express');
const tourController = require('./../controllers/tourController');
const authController = require('./../controllers/authController');

const router = express.Router();
// router.param('id', tourController.checkId);

router
    .route('/top-5-cheap')
    .get(tourController.alias, tourController.getAllTour);

router.route('/tour-stats').get(tourController.getTourStats);

router.route('/monthly-plan/:year').get(tourController.getmonthlyPlan);

router
    .route('/')
    .get(authController.protect, tourController.getAllTour)
    // .get(tourController.getAllTour)
    .post(tourController.createNewTour);

router
    .route('/:id')
    .get(tourController.getTour)
    .patch(tourController.updateTour)
    .delete(tourController.deleteTour);

module.exports = router;
