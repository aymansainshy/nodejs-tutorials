const express = require('express');

const path = require('path');
const rootDir = require('../utils/path');

const router = express.Router();

const products = [];


router.get('/add-product', (req, res, next) => {
    res.render('add-product', { 
        pageTitle: 'Add product',
        path: '/admin/add-product'
     });
});

router.post('/add-product', (req, res, next) => {
    products.push({ title: req.body.title });
    // console.log(req.body);
    res.redirect('/');
});


exports.routes = router;
exports.products = products;