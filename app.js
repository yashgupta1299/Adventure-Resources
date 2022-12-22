const fs = require('fs');
const express = require('express');
const app = express();
const morgan = require('morgan');

// 1. Middleware
app.use(morgan('dev'));

app.use(express.json());

app.use((req, res, next) => {
    console.log('Hello from the middleware!');
    next();
});

app.use((req, res, next) => {
    req.requestTime = new Date().toISOString();
    next();
});

// 2. founction for tours
const tours = JSON.parse(
    fs.readFileSync(
        `${__dirname}/dev-data/data/tours-simple.json`
    )
);

const getAllTour = (req, res) => {
    res.status(200).json({
        status: 'success',
        requestTime: req.requestTime,
        results: tours.length,
        data: { tours },
    });
};

const createNewTour = (req, res) => {
    const newID = tours[tours.length - 1].id + 1;
    const newTour = Object.assign({ id: newID }, req.body);
    tours.push(newTour);
    fs.writeFile(
        `${__dirname}/dev-data/data/tours-simple.json`,
        JSON.stringify(tours),
        (err) => {
            res.status(201).json({
                status: 'success',
                data: {
                    tour: newTour,
                },
            });
        }
    );
};

const getTour = (req, res) => {
    // app.get('/api/v1/tours/:id/:x?', (req, res) => {
    const id = req.params.id * 1;
    const tour = tours.find((el) => el.id === id);

    if (id >= tours.length) {
        // if (!tour) {
        return res.status(404).json({
            status: 'fail',
            message: 'invalid id',
        });
    }

    res.status(200).json({
        status: 'success',
        data: {
            tour,
        },
    });
};

const updateTour = (req, res) => {
    if (req.params.id * 1 >= tours.length) {
        return res.status(404).json({
            status: 'fail',
            message: 'invalid id',
        });
    }

    res.status(200).json({
        status: 'success',
        data: {
            tour: '< updated tour here >',
        },
    });
};

const deleteTour = (req, res) => {
    if (req.params.id * 1 >= tours.length) {
        return res.status(404).json({
            status: 'fail',
            message: 'invalid id',
        });
    }

    res.status(204).json({
        status: 'success',
        data: null,
    });
};

// app.get('/api/v1/tours', getAllTour);
// app.post('/api/v1/tours', createNewTour);
// app.get('/api/v1/tours/:id', getTour);
// app.patch('/api/v1/tours/:id', updateTour);
// app.delete('/api/v1/tours/:id', deleteTour);

// 3. Routes
app.route('/api/v1/tours')
    .get(getAllTour)
    .post(createNewTour);

app.route('/api/v1/tours/:id')
    .get(getTour)
    .patch(updateTour)
    .delete(deleteTour);

// 4.Listening request
const port = 3000;
app.listen(port, () => {
    console.log(`listening to port ${port}..`);
});

/*
200 = success
201 = create
204 = no longer exist (after delete)

404 = not found 

*/
