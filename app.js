const express = require('express');
const morgan = require('morgan');
const rateLimit = require('express-rate-limit');
const helmet = require('helmet');
const mongoSanitize = require('express-mongo-sanitize');
const xss = require('xss-clean');
const hpp = require('hpp');
const path = require('path');
const cookieParser = require('cookie-parser');
const compression = require('compression');
const cors = require('cors');
const tourRouter = require('./routes/tourRoute');
const userRouter = require('./routes/userRoute');
const reviewRouter = require('./routes/reviewRoute');
const bookingRouter = require('./routes/bookingRoute');
const viewRouter = require('./routes/viewRoute');
const AppError = require('./utils/AppError');
const globalErrorController = require('./controllers/globalErrorController');

const app = express();
// Global Middlewares

app.enable('trust proxy');

app.set('view engine', 'pug');
app.set('views', path.join(__dirname, '/views'));

// Implement CORS
// Access-Control-Allow-Origin to *
// not we can add custom origin or custom routes for this action
// as it is a normal middleware which basically set headers
app.use(cors());
// say our api is at api.natours.com and front-end at natours.com
// then we can allow only custom origin
// app.use(cors({
//   origin: 'https://www.natours.com'
// }))

// A CORS preflight request is a CORS request that checks to see if the
//CORS protocol is understood and a server is aware using specific methods and headers.
// it is basically similar thing but started by browser in case of some complex requests
// like put, patch, delete, or request having cookies that weather we allow that origin or not
// options is just a method like get, post we are just setting headers for preflight request which
// goes to browser again
app.options('*', cors());
// app.options('/api/v1/tours/:id', cors());

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
// cookie parser
app.use(cookieParser());
// for parses data submitted through form in url encoded form (in POST method)
app.use(express.urlencoded({ extended: true, limit: '10kb' }));

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

// use to compress text which is send to the client
app.use(compression());

// test middleware
app.use((req, res, next) => {
    // console.log(req.cookies);
    req.requestTime = new Date().toISOString();
    next();
});

// Routes
app.use('/', viewRouter);
app.use('/api/v1/tours', tourRouter);
app.use('/api/v1/users', userRouter);
app.use('/api/v1/reviews', reviewRouter);
app.use('/api/v1/bookings', bookingRouter);

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
