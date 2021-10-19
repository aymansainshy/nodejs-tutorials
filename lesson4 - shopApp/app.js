const express = require('express');

const path = require('path');

const app = express();

const adminData = require('./routes/admin');
const shopRouter = require('./routes/shop');

app.set('view engine', 'ejs');
app.set('views', 'views');


app.use(express.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));

  
app.use('/admin', adminData.routes);
app.use(shopRouter);

app.use((req, res, next) => {
    res.status(404).render('404', { pageTitle: 'Page not found !' });
});

app.listen(3000);