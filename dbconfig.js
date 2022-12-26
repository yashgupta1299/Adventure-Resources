const fs = require('fs');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Tour = require('./models/tourModel');
const User = require('./models/userModel');

dotenv.config({ path: './config.env' });
// console.log(process.argv);
let DB;
if (process.argv[4] === 'local' || process.argv[4] === 'l') {
    DB = process.env.DATABASE_LOCAL;
} else if (process.argv[4] === 'cloud' || process.argv[4] === 'c') {
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

let data;
let Model;

if (process.argv[3] === 'tours' || process.argv[3] === 't') {
    Model = Tour;
    data = JSON.parse(
        fs.readFileSync(`${__dirname}/dev-data/data/tours-simple.json`, 'utf-8')
    );
} else if (process.argv[3] === 'users' || process.argv[3] === 'u') {
    Model = User;
    data = JSON.parse(
        fs.readFileSync(`${__dirname}/dev-data/data/users-simple.json`, 'utf-8')
    );
} else {
    console.log('Invalid Command!');
    process.exit();
}

const deleteAllData = async Mod => {
    try {
        await Mod.deleteMany();
        console.log('All Data Successfully Deleted!');
    } catch (err) {
        console.log('error 🔥', err);
    }
    process.exit();
};

const importAllData = async Mod => {
    try {
        await Mod.create(data);
        console.log('All Data Successfully Inserted!');
    } catch (err) {
        console.log('error 🔥 ', err);
    }
    process.exit();
};

// console.log(process.argv);

if (process.argv[2] === 'import' || process.argv[2] === 'i') {
    importAllData(Model);
} else if (process.argv[2] === 'delete' || process.argv[2] === 'd') {
    deleteAllData(Model);
} else {
    console.log('Invalid Command!');
    process.exit();
}
