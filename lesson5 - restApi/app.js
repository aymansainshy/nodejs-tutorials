const path = require('path');
const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

const feedRoutes = require('./routes/feed');

const app = express();

// app.use(bodyPa.urlencoded()); // x-www-form-urlencoded <form>
app.use(bodyParser.json()); // application/json
app.use('/images', express.static(path.join(__dirname, 'images')));

app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PATCH, DELETE, PUT');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    next();
});


app.use('/feed', feedRoutes);

// Hendling genaral Errors ..... 
app.use((error, req, res, next) => {
    console.log(error);

    const status = error.statusCode || 500;
    const message = error.message;
    const errors = error.errors;

    res.status(status).json({
        message: message,
        errors: errors,
    });
});


const dbUrl = 'mongodb+srv://ayman:ayman123@ayman.4gnhj.mongodb.net/Blog-database?retryWrites=true&w=majority';


mongoose.connect(dbUrl).then(results => {
    app.listen(8080, () => {
        console.log("App Started in port 8080");
    });
}).catch(err => console.log(err));

