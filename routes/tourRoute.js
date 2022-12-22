const express = require('express');
const tourController = require('./../controllers/tourController');

const tourRouter = express.Router();
tourRouter
    .route('/')
    .get(tourController.getAllTour)
    .post(tourController.createNewTour);
tourRouter
    .route('/:id')
    .get(tourController.getTour)
    .patch(tourController.updateTour)
    .delete(tourController.deleteTour);

module.exports = tourRouter;
