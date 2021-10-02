const express = require('express');
const morgan = require('morgan');
const mongoose = require('mongoose');
const blogRoutes = require('./routes/blogRoutes');


// express app
const app = express();

// Db connection .......
const dbUrl = 'mongodb+srv://ayman:ayman123@ayman.4gnhj.mongodb.net/Blog-database?retryWrites=true&w=majority';
mongoose.connect(dbUrl)
    // Listing after connecting to DB
    .then((result) => app.listen(3000))
    .catch((err) => console.log(err));

//register view engine ......
app.set('view engine', 'ejs');

// Listen to server ....
// app.listen(3000);

// Meddleware  & Static
// app.use((req, res, next) => {
//     console.log("Request made to Server ");
//     console.log('Honst : ', req.hostname);
//     console.log('Path : ', req.path);
//     console.log('Method : ', req.method);
//     // To move to currect route ..
//     next();
// });
app.use(express.static('public'));
app.use(express.urlencoded({ extended: true })); // This is Require for Hendling requist Body ....
app.use(morgan('dev'));



app.get('/', (req, res) => {
    // res.send('<h1>Home Page from express</h1>');
    // res.sendFile('./views/index.htm', {root : __dirname});
    res.redirect('/blogs');
    // const blogs = [
    //     { title: 'Yoshi finds eggs', snippet: 'Lorem ipsum dolor sit amet consectetur' },
    //     { title: 'Mario finds stars', snippet: 'Lorem ipsum dolor sit amet consectetur' },
    //     { title: 'How to defeat bowser', snippet: 'Lorem ipsum dolor sit amet consectetur' },
    // ];
    // res.render('index', { title: 'Home', blogs });
});


app.get('/about', (req, res) => {
    // res.sendFile('./views/about.htm', {root : __dirname});
    res.render('about', { title: 'about' });
});


// Blog Routes .......
app.use('/blogs', blogRoutes);


// 404 error ........
app.use((req, res) => {
    // res.status(404).sendFile('./views/404.htm', {root : __dirname});
    res.render('404', { title: '404' });
});