const express = require('express');
const morgan = require('morgan');
const rateLimit = require('express-rate-limit');
const helmet = require('helmet');
const mongoSanitize = require('express-mongo-sanitize');
const xss = require('xss-clean');
const hpp = require('hpp');
const path = require('path');
const tourRouter = require('./routes/tourRoute');
const userRouter = require('./routes/userRoute');
const reviewRouter = require('./routes/reviewRoute');
const viewRouter = require('./routes/viewRoute');
const AppError = require('./utils/AppError');
const globalErrorController = require('./controllers/globalErrorController');

const app = express();
// Global Middlewares

app.set('view engine', 'pug');
app.set('views', path.join(__dirname, '/views'));

// serving static files
app.use(express.static(path.join(__dirname, '/public')));

// set security http headers
// app.use(helmet()); // helmet() will return a function which sits here
app.use(
    helmet({
        crossOriginEmbedderPolicy: false,
        crossOriginResourcePolicy: {
            allowOrigins: ['*']
        },
        contentSecurityPolicy: {
            directives: {
                defaultSrc: ['*'],
                scriptSrc: ["* data: 'unsafe-eval' 'unsafe-inline' blob:"]
            }
        }
    })
);

// development logging
if (process.env.NODE_ENV === 'development') {
    app.use(morgan('dev'));
}

// limit requests from same api
const limiter = rateLimit({
    max: 300,
    windowMs: 60 * 60 * 1000,
    message: 'Too many requests from this IP, please try again in an hour!'
});
app.use('/api', limiter);

// body parser reading data from body into req.body and also limit the body size
app.use(express.json({ limit: '10kb' }));

// data sanitization against NoSQL query injection
// check  req.boby, req.params etc to prevent from
// "email":{ "$gt" : ""}, this type of things
app.use(mongoSanitize());

// Data sanitization again xss
// prevent from adding javascript or html code, say by changing html symbol to its entities
app.use(xss());

//Prevent parameter pollution
// say if i give ?sort=price&sort=ratingsAverage then it will take
// only last value of sort
// whitelist means it will ignore those fields
// say if i give ?ratingsAverage=4.8&ratingsAverage=4.5
// default behaviour req.query = { ratingsAverage: [ '4.8', '4.5' ] }
app.use(
    hpp({
        whitelist: [
            'duration',
            'ratingsQuantity',
            'ratingsAverage',
            'maxGroupSize',
            'difficulty',
            'price'
        ]
    })
);

// test middleware
app.use((req, res, next) => {
    req.requestTime = new Date().toISOString();
    next();
});

// Routes
app.use('/', viewRouter);
app.use('/api/v1/tours', tourRouter);
app.use('/api/v1/users', userRouter);
app.use('/api/v1/reviews', reviewRouter);

// error generator for all other routes
// for all methods hence all is used
// for all routes hence * is used
app.all('*', (req, res, next) => {
    next(
        new AppError(
            `url: ${req.originalUrl} this request cannot be processed by this server.`,
            404
        )
    );
});

// error handler (error sender to client)
app.use(globalErrorController);

module.exports = app;
