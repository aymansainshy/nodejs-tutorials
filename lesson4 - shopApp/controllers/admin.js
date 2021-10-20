const Product = require('../models/product');


exports.getAddProductPage = (req, res, next) => {
    res.render('admin/add-product', {
        pageTitle: 'Add product',
        path: '/admin/add-product'
    });
}


exports.postAddNewProduct = (req, res, next) => {
    const title = req.body.title;
    const imageUrl = req.body.imageUrl;
    const description = req.body.description;
    const price = req.body.price;

    const product = new Product(title,imageUrl,description,price);
    
    product.save();
    res.redirect('/');
}


exports.getAdminProducts = (req, res, next) => {
    Product.fetchAll(products => {
        res.render('admin/products', {
            products: products,
            pageTitle: 'All Products',
            path: '/admin/products',
        });
    });
}