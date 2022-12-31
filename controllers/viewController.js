const Tour = require('./../models/tourModel');
const catchAsync = require('./../utils/catchAsync');

exports.getOverview = catchAsync(async (req, res) => {
    //1 get tour data from collection
    const tours = await Tour.find();

    //2 build template
    //3 Render that template using tour data
    res.status(200).render('overview', {
        title: 'All tours',
        tours
    });
});
exports.getTour = catchAsync(async (req, res) => {
    // get the data, for requested tour (including reviews and guides)
    const tour = await Tour.findOne({ slug: req.params.slug }).populate({
        path: 'reviews',
        field: 'review rating user'
    });

    //2 build template
    //3 Render that template using tour data
    res.status(200).render('tour', {
        title: 'The Forest Hiker Tour',
        tour
    });
});
