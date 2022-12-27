const express = require('express');
const userController = require('./../controllers/userController');
const authController = require('./../controllers/authController');

const router = express.Router();

router.route('/signup').post(authController.signup);
router.route('/login').post(authController.login);
router.route('/forgotPassword').post(authController.forgotPassword);
router.route('/resetPassword/:token').patch(authController.resetPassword);

router
    .route('/updateMe')
    .patch(authController.protect, userController.updateMe);

router
    .route('/updateMyPassword')
    .patch(authController.protect, authController.updateMyPassword);

router
    .route('/')
    .get(userController.getAllUser)
    .post(userController.createNewUser);

router
    .route('/:id')
    .get(userController.getUser)
    .patch(userController.updateUser)
    .delete(userController.deleteUser);

module.exports = router;
