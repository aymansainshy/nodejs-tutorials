const Product = require('../models/product');


exports.getAddProductPage = (req, res, next) => {
    res.render('add-product', {
        pageTitle: 'Add product',
        path: '/admin/add-product'
    });
}

exports.addNewProduct = (req, res, next) => {
    const product = new Product(req.body.title);
    product.save();
    res.redirect('/');
}

exports.getAllProducts = (req, res, next) => {
    Product.fetchAll((products => {
        res.render('shop', {
            pageTitle: 'Products',
            path: '/',
            products: products,
        });
    }));

    // res.json(products);
}

