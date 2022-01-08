const path = require('path');
const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const multer = require('multer');

const feedRoutes = require('./routes/feed');
const authRoutes = require('./routes/auth');

const app = express();

const maxSize = 2 * 1024 * 1024;


// For upload files to server...........
const fileStorage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'images');
    },
    filename: (req, file, cb) => {
        cb(null, new Date().toISOString() + '-' + file.originalname);
    },
});


// For upload files to server...........
const fileFilter = (req, file, cb) => {
    if (file.mimeType === 'image/png' ||
        file.mimeType === 'image/jpg' ||
        file.mimeType === 'image/jpeg'
    ) {
        cb(null, true);
    } else {
        cb(null, false);
    }
}



// app.use(bodyPa.urlencoded()); // x-www-form-urlencoded <form>
app.use(bodyParser.json()); // application/json ................

app.use(multer({
    storage: fileStorage,
    fileFilter: fileFilter,
    limits: { fileSize: maxSize },
}).single('image')); // Configration for file Upload .

app.use('/images', express.static(path.join(__dirname, 'images')));


app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PATCH, DELETE, PUT');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    next();
});


app.use('/feed', feedRoutes);
app.use('/auth', authRoutes);


// Hendling genaral Errors .........
app.use((error, req, res, next) => {
    
    const status = error.statusCode || 500;
    const message = error.message;
    const errors = error.errors;
    

    console.log(error);

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

