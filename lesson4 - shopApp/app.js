const express = require('express');

const path = require('path');

const app = express();
app.use('view engine', 'ejs');

const adminData = require('./routes/admin');
const shopRouter = require('./routes/shop');


app.use(express.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));


app.use('/admin',adminData.routes);
app.use(shopRouter); 

app.use((req, res, next) => {
    res.status(404).sendFile(path.join(__dirname, 'views', '404.html'));
});
// const server = http.createServer(app); 

// server.listen(3000);
app.listen(3000); 