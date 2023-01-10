const express = require('express');
const userController = require('./../controllers/userController');
const authController = require('./../controllers/authController');

const router = express.Router();

// !router.route('/login').post(authController.login);
router.post('/signup', authController.isEmailVerified, authController.signup);
router.get('/logout', authController.logout);
// Protect all routes after this middleware
router.use(authController.protect);

router.patch('/updateMyPassword', authController.updateMyPassword);
router.get('/me', userController.getMe, userController.getUser);

// const upload = multer({ dest: `${__dirname}/public/img/users` });

router.patch(
    '/updateMe',
    userController.uploadUserPhoto,
    userController.resizeUserPhoto,
    userController.updateMe
);

router.delete('/deleteMe', userController.deleteMe);

// Protect all routes after this middleware to admin only
router.use(authController.restricedTo('admin'));

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
