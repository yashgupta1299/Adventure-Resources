const express = require('express');
const userController = require('./../controllers/userController');

const userRouter = express.Router();

userRouter
    .route('/')
    .get(userController.getAllUser)
    .post(userController.createNewUser);

userRouter
    .route('/:id')
    .get(userController.getUser)
    .patch(userController.updateUser)
    .delete(userController.deleteUser);

module.exports = userRouter;
