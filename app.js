const express = require('express');

const app = express();
const morgan = require('morgan');
const tourRouter = require('./routes/tourRoute');
const userRouter = require('./routes/userRoute');
const AppError = require('./utils/AppError');
const globalErrorController = require('./controllers/globalErrorController');

// Middleware
if (process.env.NODE_ENV === 'development') {
    app.use(morgan('dev'));
}
app.use(express.json());
app.use(express.static(`${__dirname}/public`));
app.use((req, res, next) => {
    req.requestTime = new Date().toISOString();
    next();
});

// Routes
app.use('/api/v1/tours', tourRouter);
app.use('/api/v1/users', userRouter);

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
