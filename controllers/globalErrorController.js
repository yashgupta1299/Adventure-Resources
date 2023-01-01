const AppError = require('./../utils/AppError');

const sendErrorDev = (err, req, res) => {
    // a) for API
    if (req.originalUrl.startsWith('/api')) {
        return res.status(err.statusCode).json({
            status: err.status,
            error: err,
            message: err.message,
            stack: err.stack
        });
    }

    // b) for rendered website
    console.log('ERROR 🔥', err);
    res.status(err.statusCode).render('error', {
        title: 'Something went wrong!',
        msg: err.message
    });
};

const sendErrorProd = (err, req, res) => {
    // a) for API
    if (req.originalUrl.startsWith('/api')) {
        //a.1 Operational, trusted error: send message to client
        if (err.isOperational) {
            return res.status(err.statusCode).json({
                status: err.status,
                message: err.message
            });
        }

        //a.2 Programming or other unknown error: don't leak error details
        // Log error to see later in hosting site to fix it
        console.error('ERROR 🔥', err);
        // Send generic message as this is a new error
        return res.status(500).json({
            status: 'error',
            message: 'Something went wrong!'
        });
    }

    // b) for rendered website

    //b.1 Operational, trusted error: send message to client
    if (err.isOperational) {
        console.log(err);
        return res.status(err.statusCode).render('error', {
            title: 'Something went wrong!',
            msg: err.message
        });
    }

    //b.2 Programming or other unknown error: don't leak error details
    // Log error to see later in hosting site to fix it
    console.error('ERROR 🔥', err);
    // Send generic message as this is a new error
    res.status(err.statusCode).render('error', {
        title: 'Something went wrong!',
        msg: 'Please try again later!'
    });
};

const handleCastErrorDB = err => {
    const message = `Invalid ${err.path}: ${err.value}`;
    return new AppError(message, 400);
};
// const handleDuplicateFieldsDB = err => {
//     console.log('🔥🔥', err);
//     const value = err.errmsg.match(/(["'])(\\?.)*?\1/)[0];
//     const message = `Duplicate field value: ${value}. Please use another value!`;
//     return new AppError(message, 400);
// };
const handleDuplicateFieldsDB = err => {
    let message;
    if (err.keyValue.name) {
        message = `field value, name: ${err.keyValue.name}, Already present please use another value!`;
    }
    if (err.keyValue.email) {
        message = `field value, email: ${err.keyValue.email}, Already present please use another value!`;
    }
    if (err.keyValue.tour && err.keyValue.user) {
        message = `Review already created, if you want to create another one then please delete first one!`;
    }
    return new AppError(message, 400);
};
const handleValidationErrorDB = err => {
    const errors = Object.values(err.errors).map(el => el.message);
    const message = `Invalid input data. ${errors.join('. ')}`;
    return new AppError(message, 400);
};
const handleJsonWebTokenError = () => {
    return new AppError('Invalid token please log in again!', 401);
};
const handleTokenExpiredError = () => {
    return new AppError('Your token is expired please log in again!', 401);
};
module.exports = (err, req, res, next) => {
    // console.log(err.stack);
    err.statusCode = err.statusCode || 500;
    err.status = err.status || 'error';
    if (process.env.NODE_ENV === 'development') {
        sendErrorDev(err, req, res);
    } else if (process.env.NODE_ENV === 'production') {
        // let error = { ...err }; // wrong
        let error = JSON.parse(JSON.stringify(err)); // deep copy
        error.message = err.message;
        if (error.name === 'CastError') {
            error = handleCastErrorDB(error);
        }
        if (error.code === 11000) {
            // console.log('here', error);
            error = handleDuplicateFieldsDB(error);
        }
        if (error.name === 'ValidationError') {
            error = handleValidationErrorDB(error);
        }
        if (err.name === 'JsonWebTokenError') {
            error = handleJsonWebTokenError();
        }
        if (err.name === 'TokenExpiredError') {
            error = handleTokenExpiredError();
        }
        sendErrorProd(error, req, res);
    }
};

/*
200 = success
201 = create
204 = no longer exist (after delete)
400 = bad request
401 = unauthorized
403 = authorization
404 = not found 
500 = internal server error
*/
