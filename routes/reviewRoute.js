const express = require('express');
const controller = require('./../controllers/reviewController');
const authController = require('./../controllers/authController');

// { mergeParams: true } Preserve the req.params values from the parent router.
// If the parent and the child have conflicting param names,
// the child’s value take precedence.
const router = express.Router({ mergeParams: true });

router
    .route('/')
    .get(controller.getAllReview)
    .post(
        authController.protect,
        authController.restricedTo('user'),
        controller.createNewReview
    );

module.exports = router;
