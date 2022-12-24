const mongoose = require('mongoose');
// note: dotenv.config must be configured before app
const dotenv = require('dotenv');
dotenv.config({ path: './config.env' });
const app = require('./app');

// connecting to a remote database
// const DB = process.env.DATABASE.replace(
//     '<PASSWORD>',
//     process.env.DATABASE_PASSWORD
// );

// connecting to a local database
const DB = process.env.DATABASE_LOCAL;
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

// Starting Server
const port = process.env.PORT || 3000;
app.listen(port, () => {
    console.log(`listening to port ${port}..`);
});
