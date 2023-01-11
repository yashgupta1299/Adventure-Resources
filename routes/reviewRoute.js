const express = require('express');
const controller = require('./../controllers/reviewController');
const authController = require('./../controllers/authController');

// { mergeParams: true } Preserve the req.params values from the parent router.
// If the parent and the child have conflicting param names,
// the child’s value take precedence.
const router = express.Router({ mergeParams: true });

router.use(authController.protect);

router
    .route('/')
    .get(controller.getAllReview)
    .post(
        // authController.restricedTo('user'),
        authController.restricedTo('user', 'admin'),
        controller.extractUserIdAndTourId,
        controller.createNewReview
    );

router
    .route('/:id')
    .get(controller.getReview)
    .patch(
        authController.restricedTo('user', 'admin'),
        controller.isCreator,
        controller.updateReview
    )
    .delete(
        authController.restricedTo('user', 'admin'),
        controller.isCreator,
        controller.deleteReview
    );

module.exports = router;
