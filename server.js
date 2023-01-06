const mongoose = require('mongoose');
const dotenv = require('dotenv'); // note: dotenv.config must be configured before app

process.on('uncaughtException', err => {
    console.log('uncaughtException 🔥');
    console.log(err.name, err.message);
    process.exit(1);
});

dotenv.config({ path: './config.env' });
const app = require('./app');

// connecting to a remote database
const DB = process.env.DATABASE.replace(
    '<PASSWORD>',
    process.env.DATABASE_PASSWORD
);

// connecting to a local database
// const DB = process.env.DATABASE_LOCAL;
// console.log(DB);

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
    });
// .catch(err => {
//     console.log('error 🔥 ', err);
// });

// Starting Server
const port = process.env.port || 3000;
const server = app.listen(port, () => {
    console.log(`listening to port ${port}..`);
});

process.on('unhandledRejection', err => {
    console.log('unhandledRejection 🔥');
    console.log(err.name, err.message);
    server.close(() => {
        process.exit(1);
    });
});

process.on('SIGTERM', () => {
    console.log('👋 SIGTERM RECEIVED. Shutting down gracefully');
    server.close(() => {
        console.log('💥 Process terminated!');
    });
});
