const express = require('express');
const tourController = require('./../controllers/tourController');

const router = express.Router();
// router.param('id', tourController.checkId);

router
    .route('/top-5-cheap')
    .get(tourController.alias, tourController.getAllTour);

router
    .route('/')
    .get(tourController.getAllTour)
    .post(tourController.createNewTour);

router
    .route('/:id')
    .get(tourController.getTour)
    .patch(tourController.updateTour)
    .delete(tourController.deleteTour);

module.exports = router;
