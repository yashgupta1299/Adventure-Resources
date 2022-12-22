const fs = require('fs');

const tours = JSON.parse(
    fs.readFileSync(`${__dirname}/../dev-data/data/tours-simple.json`)
);

exports.getAllTour = (req, res) => {
    res.status(200).json({
        status: 'success',
        requestTime: req.requestTime,
        results: tours.length,
        data: { tours },
    });
};

exports.createNewTour = (req, res) => {
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

exports.getTour = (req, res) => {
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

exports.updateTour = (req, res) => {
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

exports.deleteTour = (req, res) => {
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
