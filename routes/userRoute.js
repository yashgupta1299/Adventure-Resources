const express = require('express');
const userController = require('./../controllers/userController');
const authController = require('./../controllers/authController');

const router = express.Router();

router.route('/signup').post(authController.signup);
router.route('/login').post(authController.login);
router.route('/forgotPassword').patch(authController.forgotPassword);
router.route('/resetPassword').patch(authController.resetPassword);

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
