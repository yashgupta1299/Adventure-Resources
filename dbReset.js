// firt comment pre query of hash password in ./models/userModel
// A = import or delete or their initials,
// B = local or cloud or their initials
// run: "node dbReset.js <%A%> <%B%>"

const fs = require('fs');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Tour = require('./models/tourModel');
const User = require('./models/userModel');
const Review = require('./models/reviewModel');

dotenv.config({ path: './config.env' });

// console.log(process.argv);
let DB;
if (process.argv[3] === 'local' || process.argv[3] === 'l') {
    DB = process.env.DATABASE_LOCAL;
} else if (process.argv[3] === 'cloud' || process.argv[3] === 'c') {
    DB = process.env.DATABASE.replace(
        '<PASSWORD>',
        process.env.DATABASE_PASSWORD
    );
} else {
    console.log('Invalid Command!');
    process.exit();
}

mongoose
    .connect(DB, {
        useNewUrlParser: true,
        useCreateIndex: true,
        useFindAndModify: false,
        useUnifiedTopology: true
    })
    .then(() => {
        // console.log(con.connections);
        console.log('DB connection successful!');
    })
    .catch(err => {
        console.log('error 🔥 ', err);
    });

// READ JSON FILES
const tours = JSON.parse(
    fs.readFileSync(`${__dirname}/dev-data/data/tours.json`, 'utf-8')
);
const users = JSON.parse(
    fs.readFileSync(`${__dirname}/dev-data/data/users.json`, 'utf-8')
);
const reviews = JSON.parse(
    fs.readFileSync(`${__dirname}/dev-data/data/reviews.json`, 'utf-8')
);

// IMPORT DATA INTO DB
const importData = async () => {
    try {
        await Tour.create(tours);
        await User.create(users, { validateBeforeSave: false });
        await Review.create(reviews);
        console.log('Data successfully loaded!');
    } catch (err) {
        console.log(err);
    }
    process.exit();
};

// DELETE ALL DATA FROM DB
const deleteData = async () => {
    try {
        await Tour.deleteMany();
        await User.deleteMany();
        await Review.deleteMany();
        console.log('Data successfully deleted!');
    } catch (err) {
        console.log(err);
    }
    process.exit();
};

if (process.argv[2] === 'import' || process.argv[2] === 'i') {
    importData();
} else if (process.argv[2] === 'delete' || process.argv[2] === 'd') {
    deleteData();
}
