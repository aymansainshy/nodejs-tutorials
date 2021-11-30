const Product = require('../models/product');


exports.getAddProductPage = (req, res, next) => {
    res.render('admin/edit-product', {
        pageTitle: 'Add product',
        path: '/admin/add-product',
        editing: false,
    });
}



exports.postAddNewProduct = (req, res, next) => {
    const title = req.body.title;
    const price = req.body.price;
    const description = req.body.description;
    const imageUrl = req.body.imageUrl;

    const product = new Product(title, price, description, imageUrl, null, req.user._id);
    // Product.create ...
    product.save().then((result) => {
        console.log("Product created successfully");
        res.redirect('/admin/products');
    }).catch((err) => {
        console.log(err);
    });
}


exports.getEditProduct = (req, res, next) => {
    const editMode = req.query.edit;
    if (!editMode) {
        return res.redirect('/');
    }

    const prodId = req.params.productId;
    Product.findById(prodId)
        .then(product => {

            if (!product) {
                return res.redirect('/');
            }

            res.render('admin/edit-product', {
                pageTitle: 'Edit product',
                path: '/admin/add-product',
                editing: editMode,
                product: product,
            });
        }).catch(err => console.log(err));
}



exports.postEditProduct = (req, res, next) => {

    const prodId = req.body.productId;
    const updatedTitle = req.body.title;
    const updatedImageUrl = req.body.imageUrl;
    const updatedDescription = req.body.description;
    const updatedPrice = req.body.price;

    const product = new Product(
        updatedTitle,
        updatedPrice,
        updatedDescription,
        updatedImageUrl,
        prodId
    );

    return product.save().then(result => {
        console.log(result);
        res.redirect('/admin/products');
    }).catch(err => console.log(err));
}



exports.getAdminProducts = (req, res, next) => {
    Product.fetchAll()
        .then(products => {
            res.render('admin/products', {
                products: products,
                pageTitle: 'All Products',
                path: '/admin/products',
            });
        }).catch(err => console.log(err));
}



exports.postDeleteProduct = (req, res, next) => {
    const prodId = req.body.productId;

    Product.deleteById(prodId).then(result => {
        console.log("Product Destroyed Successfully");
        res.redirect('/admin/products');
    }).catch(err => console.log(err));
}