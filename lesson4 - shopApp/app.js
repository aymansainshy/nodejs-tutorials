const express = require('express');
const path = require('path');
const mongoose = require('mongoose');
const session = require('express-session');
const MongoDBStore = require('connect-mongodb-session')(session);
const csrf = require('csurf');
const flash = require('connect-flash');


const dbUrl = 'mongodb+srv://ayman:ayman123@ayman.4gnhj.mongodb.net/Shop-database?retryWrites=true&w=majority';

const app = express();

const store = new MongoDBStore({
    uri: dbUrl,
    collection: 'sessions',
}); // To save session in MongoDB

const csrfProtection = csrf();


const adminRoutes = require('./routes/admin');
const shopRoutes = require('./routes/shop');
const authRoutes = require('./routes/auth');

const User = require('./models/user');

const errorController = require('./controllers/error');


app.set('view engine', 'ejs');
app.set('views', 'views');


app.use(express.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));

app.use(
    session({
        secret: 'my secret',
        resave: false,
        saveUninitialized: false,
        store: store,
    })
);

app.use(csrfProtection);
app.use(flash());



app.use((req, res, next) => {
    if (!req.session.user) {
        return next();
    }

    User.findById(req.session.user._id)
        .then(user => {
            if (!user) {
                return next();
            }
            req.user = user;
            next();
        }).catch(err => {
            throw new Error(err);
        });
});



// To Send local variables to every view .. 
app.use((req, res, next) => {
    res.locals.isAuthenticated = req.session.isLoggedIn;
    res.locals.csrfToken = req.csrfToken();
    next();
});


app.use('/admin', adminRoutes);
app.use(shopRoutes);
app.use(authRoutes);

app.use(errorController.get404Page);

// Error hendling middleware.
app.use((error, req, res, next) => {
    console.log(error);
});



mongoose.connect(dbUrl).then(result => {
    console.log('Connected to database');

    app.listen(3000);
}).catch(err => {
    console.log(err);
});