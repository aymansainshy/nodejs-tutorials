const express = require('express');
const path = require('path');
const mongoose = require('mongoose');

const app = express();

const adminRoutes = require('./routes/admin');
const shopRoutes = require('./routes/shop');

const User = require('./models/user');

const errorController = require('./controllers/error');


app.set('view engine', 'ejs');
app.set('views', 'views');


app.use(express.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));


app.use((req, res, next) => {

    User.findById('61a8bf0c0797645a77ea2876')
        .then(user => {
            req.user = user;
            // console.log(user);
            next();
        }).catch(err => console.log(err));

});


app.use('/admin', adminRoutes);
app.use(shopRoutes);

app.use(errorController.get404Page);


const dbUrl = 'mongodb+srv://ayman:ayman123@ayman.4gnhj.mongodb.net/Shop-database?retryWrites=true&w=majority';


mongoose.connect(dbUrl).then(result => {
    console.log('Connected to database');

    User.findOne().then(user => {
        if (!user) {
            const user = new User({
                name: 'Ayman',
                email: 'ayman@gmail.com',
                cart: {
                    items: []
                }
            });
            user.save();
        }
    })

    app.listen(3000);
}).catch(err => {
    console.log(err);
});