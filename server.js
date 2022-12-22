const app = require('./app');

// 4.Starting Server
const port = 3000;
app.listen(port, () => {
    console.log(`listening to port ${port}..`);
});
