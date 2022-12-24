const fs = require('fs');
const mongoose = require('mongoose');
const Tour = require('./models/tourModel');
const dotenv = require('dotenv');

dotenv.config({ path: './config.env' });

// connecting to a remote database
const DB = process.env.DATABASE.replace(
    '<PASSWORD>',
    process.env.DATABASE_PASSWORD
);

// connecting to a local database
// const DBL = process.env.DATABASE_LOCAL;
// console.log(DB);

mongoose
    .connect(DB, {
        useNewUrlParser: true,
        useCreateIndex: true,
        useFindAndModify: false,
        useUnifiedTopology: true
    })
    .then(con => {
        // console.log(con.connections);
        console.log('DB connection successful!');
    })
    .catch(err => {
        console.log('error 🔥 ', err);
    });

// reading a file
const data = JSON.parse(
    fs.readFileSync(`${__dirname}/dev-data/data/tours-simple.json`, 'utf-8')
);

const deleteAllData = async () => {
    try {
        await Tour.deleteMany();
        console.log('All Data Successfully Deleted!');
    } catch (err) {
        console.log('error 🔥', err);
    }
    process.exit();
};

const importAllData = async () => {
    try {
        await Tour.create(data);
        console.log('All Data Successfully Inserted!');
    } catch (err) {
        console.log('error 🔥 ', err);
    }
    process.exit();
};

// console.log(process.argv);
if (process.argv[2] == '--import') {
    importAllData();
} else if (process.argv[2] == '--delete') {
    deleteAllData();
} else {
    console.log('Invalid Command!');
    process.exit();
}
