const Product = require('../models/product');


exports.getAllProducts = (req, res, next) => {
    Product.fetchAll((products => {
        res.render('shop/product-list', {
            pageTitle: 'All Products',
            path: '/products',
            products: products,
        });
    }));
}


exports.getIndex = (req, res, next) => { 
    Product.fetchAll((products => {
        res.render('shop/index', {
            pageTitle: 'Shop',
            path: '/',
            products: products,
        });
    }));
}


exports.getCart = (req, res, next) => {
    res.render('shop/cart', {
        pageTitle: 'Cart',
        path: '/cart'
    });
}


exports.getOrders = (req, res, next) => {
    res.render('shop/orders', {
        pageTitle: 'Orders',
        path: '/orders'
    });
}


exports.getCheckOut = (req, res, next) => {
    res.render('shop/checkout', {
        pageTitle: 'CheckOut',
        path: 'checkout'
    });
}
