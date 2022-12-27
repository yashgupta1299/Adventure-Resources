const jwt = require('jsonwebtoken');
const util = require('util');
const crypto = require('crypto');
const catchAsync = require('./../utils/catchAsync');
const User = require('./../models/userModel');
const AppError = require('./../utils/AppError');
const sendEmail = require('./../utils/email');

const jwtSignToken = id => {
    return jwt.sign({ id }, process.env.JWT_SECRET_KEY, {
        expiresIn: process.env.JWT_EXPIRES_IN
    });
};

exports.signup = catchAsync(async (req, res, next) => {
    const newUser = await User.create({
        name: req.body.name,
        email: req.body.email,
        password: req.body.password,
        passwordConfirm: req.body.passwordConfirm
    });
    const token = jwtSignToken(newUser._id);
    res.status(201).json({
        status: 'success',
        token,
        data: {
            user: newUser
        }
    });
});

exports.login = catchAsync(async (req, res, next) => {
    const { email, password } = req.body;

    //1. check wheather email and password is given or not
    if (!email || !password) {
        return next(new AppError('Please provide email and password', 400));
    }

    //2. check if user exists and password is correct or not
    const user = await User.findOne({ email }).select('+password');
    // password is original which is taken from user
    // user.passwor is coming from a database which is stored in hash form
    if (!user || !(await user.correctPassword(password, user.password))) {
        return next(new AppError('Please enter valid email or password', 401));
    }

    // everything is ok
    const token = jwtSignToken(user._id);
    res.status(201).json({
        status: 'success',
        token
    });
});

exports.protect = catchAsync(async (req, res, next) => {
    //1. Check weather token is present or not and extract it if present
    let token;
    if (
        req.headers.authorization &&
        req.headers.authorization.startsWith('Bearer')
    ) {
        token = req.headers.authorization.split(' ')[1];
    }
    if (!token) {
        return next(
            new AppError('you are not logged in please log in to get access')
        );
    }

    //2. verify the token and if it failed promise is rejected
    const decoded = await util.promisify(jwt.verify)(
        token,
        process.env.JWT_SECRET_KEY
    );

    //3. check if user still exists in our database
    const dbUser = await User.findById(decoded.id);
    if (!dbUser) {
        return next(new AppError('The user no longer exists!'));
    }

    //4. check if password is changed or not after the issue of token
    if (dbUser.isTokenIssuedBeforePassChanged(decoded.iat) === true) {
        return next(
            new AppError('Password is recently changed, please log in again:')
        );
    }

    // storing for using in upcoming middlewares
    req.user = dbUser;

    // all safe Grant Access
    next();
});

exports.restricedTo = (...roles) => {
    return (req, res, next) => {
        // roles is an array ['admin','lead-guide']
        if (!roles.includes(req.user.role)) {
            return next(
                new AppError(
                    'you are not authorized to perform this action!',
                    403
                )
            );
        }
        next();
    };
};

exports.forgotPassword = catchAsync(async (req, res, next) => {
    // check email provided or not
    if (!req.body.email) {
        return next(new AppError(`Provide valid email address`, 400));
    }

    // 1. obtain the user from the database acc to email if user exist in db
    const dbUser = await User.findOne({ email: req.body.email });
    if (!dbUser) {
        return next(
            new AppError(
                `User with email-address: ${req.body.email} do not exist!`,
                404
            )
        );
    }

    // 2. generate the random reset token
    const resetToken = dbUser.createPasswordResetToken();
    // save token to database
    await dbUser.save({ validateBeforeSave: false });

    // 3. send it to users email

    // generating resetURL
    // req.get('host') is "127.0.0.1:3000"
    // req.protocol is "http"
    const resetURL = `${req.protocol}://${req.get(
        'host'
    )}/api/v1/users/resetPassword/${resetToken}`;

    const message = `Forgot your password? Submit a PATCH request with your new password and passwordConfirm to: ${resetURL}.\nIf you didn't forget your password, please ignore this email!`;

    try {
        await sendEmail({
            email: req.body.email,
            subject: 'Your password reset token (valid for 10 min)',
            message
        });
        res.status(200).json({
            status: 'success',
            message: 'Token sent to email'
        });
    } catch (err) {
        dbUser.passwordResetToken = undefined;
        dbUser.passwordResetExpires = undefined;
        await dbUser.save({ validateBeforeSave: false });
        return next(
            new AppError(
                'There is an error in sending the email please try again later!'
            ),
            500
        );
    }
});

exports.resetPassword = catchAsync(async (req, res, next) => {
    // create hashed token again from the given token
    const hashedToken = crypto
        .createHash('sha256')
        .update(req.params.token)
        .digest('hex');

    // find user acc to hashed token and also check pass reset expire or not
    const dbUser = await User.findOne({
        passwordResetToken: hashedToken,
        passwordResetExpires: { $gt: Date.now() }
    });
    if (!dbUser) {
        return next(new AppError('Token is invalid or has expired!', 400));
    }

    // change the data
    dbUser.password = req.body.password;
    dbUser.passwordConfirm = req.body.passwordConfirm;
    dbUser.passwordResetToken = undefined;
    dbUser.passwordResetExpires = undefined;
    // here we run save because we want validation of our argument again
    // because of save function validators will run
    await dbUser.save();

    // send the jwt token
    const token = jwtSignToken(dbUser._id);
    res.status(201).json({
        status: 'success',
        token
    });
});
