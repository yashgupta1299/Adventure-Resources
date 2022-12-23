const mongoose = require('mongoose');
const dotenv = require('dotenv');

dotenv.config({ path: './config.env' }); // note: must be declared before app
const app = require('./app');

// connecting to a remote database
const DB = process.env.DATABASE.replace(
    '<PASSWORD>',
    process.env.DATABASE_PASSWORD
);
// connecting to a local database
// const DBL = process.env.DATABASE_LOCAL;
console.log(DB);
mongoose
    .connect(DB, {
        useNewUrlParser: true,
        useCreateIndex: true,
        useFindAndModify: false,
        useUnifiedTopology: true
    })
    .then(() => {
        // console.log(con.connections);
        console.log('successful!');
    });

// Starting Server
const port = process.env.PORT || 3000;
app.listen(port, () => {
    console.log(`listening to port ${port}..`);
});
