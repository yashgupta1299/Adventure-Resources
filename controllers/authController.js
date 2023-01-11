const jwt = require('jsonwebtoken');
const { promisify } = require('util');
const jwksClient = require('jwks-rsa');

// const crypto = require('crypto');

const Google = require('./../models/googleModel');
const catchAsync = require('./../utils/catchAsync');
const User = require('./../models/userModel');
const AppError = require('./../utils/AppError');
const Email = require('./../utils/email');

// obtaining public key from authentication server
const publicKey = async kid => {
    // kid is unique id given by creater to each jwk
    const client = jwksClient({
        jwksUri: `${process.env.AUTHENTICATION_DOMAIN}/.well-known/jwks.json`,
        cache: true,
        rateLimit: true
    });
    // we can obtain key according to kid value
    const key = await client.getSigningKey(kid);
    return key.getPublicKey();
};

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

exports.logout = (req, res) => {
    // altered jwt so that verification failed when server reloads it
    // time expire so that browser delete the cookie from itself
    res.cookie('sta', 'logged-out', {
        expires: new Date(Date.now() + 10 * 1000),
        httpOnly: true,
        sameSite: 'strict',
        secure:
            process.env.cookieSecure ||
            req.secure ||
            req.headers['x-forwarded-proto'] === 'https'
    });
    res.cookie('at', 'logged-out', {
        expires: new Date(Date.now() + 10 * 1000),
        httpOnly: true,
        sameSite: 'strict',
        secure:
            process.env.cookieSecure ||
            req.secure ||
            req.headers['x-forwarded-proto'] === 'https'
    });
    res.cookie('rt', 'logged-out', {
        expires: new Date(Date.now() + 10 * 1000),
        httpOnly: true,
        sameSite: 'strict',
        secure:
            process.env.cookieSecure ||
            req.secure ||
            req.headers['x-forwarded-proto'] === 'https'
    });

    res.cookie('tm', Date.now() + 365 * 24 * 60 * 60 * 1000, {
        expires: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000),
        httpOnly: false,
        sameSite: 'strict',
        secure:
            process.env.cookieSecure ||
            req.secure ||
            req.headers['x-forwarded-proto'] === 'https'
    });
    res.status(200).json({
        status: 'success'
    });
};

exports.protect = catchAsync(async (req, res, next) => {
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
    }

    let kid;
    if (req.cookies && req.cookies.at) {
        kid = 'abcd';
        token = req.cookies.at;
    } else if (req.cookies && req.cookies.rt) {
        kid = 'abcd';
        token = req.cookies.rt;
        res.cookie('tm', Date.now() - 1, {
            expires: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000),
            // can be changed by browser
            httpOnly: false,

            // cookie send back from browser if generated from the same origin
            sameSite: 'strict',

            // connection can be done only over https
            secure:
                process.env.cookieSecure ||
                req.secure ||
                req.headers['x-forwarded-proto'] === 'https'
        });
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
    let decoded;
    try {
        const pk = await publicKey(kid);
        decoded = await promisify(jwt.verify)(token, pk, {
            algorithm: ['RS256']
        });
    } catch (err) {
        return next(new AppError('Email authentication failed', 401));
    }

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
    }
    if (req.cookies && req.cookies.sta) {
        token = req.cookies.sta;
    }

    if (!token) {
        return next(new AppError('Email authentication failed', 401));
    }

    //2. verify the token and if it failed promise is rejected

    let decoded;
    try {
        const kid = 'abcd';
        const pk = await publicKey(kid);
        decoded = await promisify(jwt.verify)(token, pk, {
            algorithm: ['RS256']
        });
    } catch (err) {
        return next(new AppError('Email authentication failed', 401));
    }

    // important so that no one can make false attack

    req.body.user = undefined;
    //4. check if password is changed or not after the issue of token only for forget password logic
    const userEmail = (await Google.findOne({ googleId: decoded.id })).email;

    if (!userEmail) {
        return next(
            new AppError('Something went wrong, please try again!', 401)
        );
    }
    const dbUser = await User.findOne({ email: userEmail });
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

    req.body.email = userEmail;

    // all safe Grant Access
    next();
});

exports.isLoggedIn = catchAsync(async (req, res, next) => {
    //1. Check weather token is present or not and extract it if present
    // we will use them in future middlewares
    res.locals.user = undefined;
    req.user = undefined;
    // console.log(req.cookies);
    try {
        let token;
        let kid;
        if (req.cookies && req.cookies.at) {
            kid = 'abcd';
            token = req.cookies.at;
        } else if (req.cookies && req.cookies.rt) {
            kid = 'abcd';
            token = req.cookies.rt;
            res.cookie('tm', Date.now() - 1, {
                expires: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000),
                // can be changed by browser
                httpOnly: false,

                // cookie send back from browser if generated from the same origin
                sameSite: 'strict',

                // connection can be done only over https
                secure:
                    process.env.cookieSecure ||
                    req.secure ||
                    req.headers['x-forwarded-proto'] === 'https'
            });
        }

        if (!token) {
            return next();
        }

        //2. verify the token and if it failed promise is rejected
        let decoded;
        try {
            const pk = await publicKey(kid);
            decoded = await promisify(jwt.verify)(token, pk, {
                algorithm: ['RS256']
            });
        } catch (err) {
            return next();
        }

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
