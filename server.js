const dotenv = require('dotenv');
dotenv.config({ path: './config.env' }); // note: must be declared before app
const app = require('./app');

// console.log(process.env.NODE_ENV);

// Starting Server
const port = process.env.PORT || 3000;
app.listen(port, () => {
    console.log(`listening to port ${port}..`);
});
