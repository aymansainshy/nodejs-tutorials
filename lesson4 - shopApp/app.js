const express = require('express');
const path = require('path');

const app = express();

const adminRoutes = require('./routes/admin');
const shopRoutes = require('./routes/shop');

const mongoConnect = require('./utils/database').mongoConnect;
const User = require('./models/user');

const errorController = require('./controllers/error');


app.set('view engine', 'ejs');
app.set('views', 'views');


app.use(express.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));


app.use((req, res, next) => {
    User.findById('61a21db5e612ccf54d82cf69')
        .then(user => {
            req.user = new User(user.name, user.email, user.cart, user._id);
            console.log(user);
            next();
        }).catch(err => console.log(err));

});


app.use('/admin', adminRoutes);
app.use(shopRoutes);

app.use(errorController.get404Page);


mongoConnect(() => {
    app.listen(3000);
});




