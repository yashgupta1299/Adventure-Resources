const jwt = require('jsonwebtoken');
const util = require('util');
// const crypto = require('crypto');
const Google = require('./../models/googleModel');
const catchAsync = require('./../utils/catchAsync');
const User = require('./../models/userModel');
const AppError = require('./../utils/AppError');
const Email = require('./../utils/email');

const sendResponse = (user, statusCode, req, res) => {
    user.password = undefined;
    if (process.env.NODE_ENV === 'development') {
        res.status(statusCode).json({
            status: 'success',
            data: {
                user
            }
        });
    } else {
        res.status(statusCode).json({
            status: 'success'
        });
    }
};

exports.signup = catchAsync(async (req, res, next) => {
    // check from a previous middleware coming data if req.body.user exist then it means it is a change password request
    if (req.body.user) {
        // change the data
        req.body.user.name = req.body.name;
        req.body.user.password = req.body.password;
        req.body.user.passwordConfirm = req.body.passwordConfirm;

        // here we run save because we want validation of our argument again
        // because of save function validators will run
        // updating passwordChangedAt variable also in pre 'save'
        await req.body.user.save();

        // send the jwt token
        sendResponse(req.body.user, 201, req, res);
    } else {
        const newUser = await User.create({
            name: req.body.name,
            email: req.body.email,
            password: req.body.password,
            passwordConfirm: req.body.passwordConfirm
        });
        // email send for uploading user photo
        const userNE = { name: newUser.name, email: newUser.email };
        const meSectionUrl = `${req.protocol}://${req.get('host')}/me`;
        await new Email(userNE, meSectionUrl).sendWelcome();

        // send jwt
        sendResponse(newUser, 201, req, res);
    }
});

// !exports.login = catchAsync(async (req, res, next) => {
//     const { email, password } = req.body;

//     //1. check wheather email and password is given or not
//     if (!email || !password) {
//         return next(new AppError('Please provide email and password', 400));
//     }

//     //2. check if user exists and password is correct or not
//     const user = await User.findOne({ email }).select('+password');
//     // password is original which is taken from user
//     // user.passwor is coming from a database which is stored in hash form
//     if (!user || !(await user.correctPassword(password, user.password))) {
//         return next(new AppError('Please enter valid email or password', 401));
//     }

//     // everything is ok
//     createSendjwt(user, 201, req, res);
// });

// !exports.logout = (req, res) => {
//     // altered jwt so that verification failed when server reloads it
//     // time expire sso that browser delete the cookie from itself
//     res.cookie('jwt', 'logged-out', {
//         expires: new Date(Date.now() + 10 * 1000),
//         httpOnly: true
//     });
//     res.status(200).json({
//         status: 'success'
//     });
// };

exports.protect = catchAsync(async (req, res, next) => {
    //1. Check weather token is present or not and extract it if present
    let token;
    if (
        req.headers.authorization &&
        req.headers.authorization.startsWith('Bearer')
    ) {
        token = req.headers.authorization.split(' ')[1];
    } else if (req.cookies && req.cookies.jwt) {
        token = req.cookies.jwt;
    }

    if (!token) {
        return next(
            new AppError(
                'you are not logged in please log in to get access',
                401
            )
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
        return next(new AppError('The user no longer exists!', 401));
    }

    //4. check if password is changed or not after the issue of token
    if (dbUser.isTokenIssuedBeforePassChanged(decoded.iat) === true) {
        return next(
            new AppError(
                'Password is recently changed, please log in again:',
                401
            )
        );
    }

    // storing for using in upcoming middlewares
    req.user = dbUser;

    // storing for using in upcoming middlewares or in pug files. user is
    // now a local variable for them
    res.locals.user = dbUser;

    // all safe Grant Access
    next();
});

exports.isEmailVerified = catchAsync(async (req, res, next) => {
    //1. Check weather token is present or not and extract it if present
    let token;
    // note either give bearer token or cookie token
    if (process.env.NODE_ENV === 'development') {
        if (
            req.headers.authorization &&
            req.headers.authorization.startsWith('Bearer')
        ) {
            token = req.headers.authorization.split(' ')[1];
        }
    } else if (req.cookies && req.cookies.sta) {
        token = req.cookies.sta;
    }

    if (!token) {
        return next(new AppError('Email authentication failed', 401));
    }

    //2. verify the token and if it failed promise is rejected
    let decoded;
    try {
        decoded = await util.promisify(jwt.verify)(
            token,
            process.env.JWT_SECRET_KEY
        );
    } catch (err) {
        return next(new AppError('Email authentication failed', 401));
    }

    // important so that no one can make false attack

    req.body.user = undefined;
    //4. check if password is changed or not after the issue of token only for forget password logic
    const email = (await Google.findOne({ googleId: decoded.id })).email;

    if (!email) {
        return next(
            new AppError('Something went wrong, please try again!', 401)
        );
    }
    const dbUser = await User.findOne({ email });
    if (dbUser) {
        if (dbUser.isTokenIssuedBeforePassChanged(decoded.iat) === true) {
            return next(
                new AppError(
                    'Password is recently changed, please try again!',
                    401
                )
            );
        }
        // storing for changing the data in next middleware
        req.body.user = dbUser;
    }

    // storing for using in upcoming middlewares

    req.body.email = email;

    // all safe Grant Access
    next();
});

exports.isLoggedIn = catchAsync(async (req, res, next) => {
    //1. Check weather token is present or not and extract it if present
    // we will use them in future middlewares
    res.locals.user = undefined;
    req.user = undefined;
    try {
        let token;
        if (req.cookies && req.cookies.jwt) {
            token = req.cookies.jwt;
        }

        if (!token) {
            return next();
        }

        //2. verify the token and if it failed promise is rejected
        const decoded = await util.promisify(jwt.verify)(
            token,
            process.env.JWT_SECRET_KEY
        );

        //3. check if user still exists in our database
        const dbUser = await User.findById(decoded.id);
        if (!dbUser) {
            return next();
        }

        //4. check if password is changed or not after the issue of token
        if (dbUser.isTokenIssuedBeforePassChanged(decoded.iat) === true) {
            return next();
        }

        // storing for using in upcoming middlewares or in pug files. user is
        // now a local variable for them
        res.locals.user = dbUser;

        // add for display of user review in view controller
        req.user = dbUser;
    } catch (err) {
        return next();
    }
    // all safe Grant Access
    next();
});

exports.restricedTo = (...roles) => {
    return (req, res, next) => {
        // say  roles is an array ['admin','lead-guide']
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

exports.updateMyPassword = catchAsync(async (req, res, next) => {
    // 1 get user from the database
    // note: req.user.id is same as req.user._id
    const dbUser = await User.findById(req.user.id).select('+password');

    // 2 check if posted current password is correct
    if (
        !(await dbUser.correctPassword(
            req.body.currentPassword,
            dbUser.password
        ))
    ) {
        return next(new AppError('Current password is wrong!', 401));
    }

    dbUser.password = req.body.password;
    dbUser.passwordConfirm = req.body.passwordConfirm;
    // 3 passwordChangedAt variable also updated
    await dbUser.save();

    // 4 log user in, send jwt
    sendResponse(dbUser, 201, req, res); // login again
});
