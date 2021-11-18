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
    const imageUrl = req.body.imageUrl;
    const description = req.body.description;
    const price = req.body.price;
    // Product.create ...
    req.user.createProduct({
        title: title,
        price: price,
        imageUrl: imageUrl,
        description: description,
    }).then((result) => {
        console.log(console.log("Product created successfully"));
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
    req.user.getProducts({ where: { id: prodId } })
        // Product.findById(prodId)
        .then(products => {
            const product = products[0];
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

    Product.findById(prodId).then(product => {

        product.title = updatedTitle;
        product.imageUrl = updatedImageUrl;
        product.description = updatedDescription;
        product.price = updatedPrice;

        return product.save();

        // return product.update({
        //     id: prodId,
        //     title: updatedTitle,
        //     price: updatedPrice,
        //     imageUrl: updatedImageUrl,
        //     description: updatedDescription,
        // }).then(result => {
        //     res.redirect('/admin/products');
        // })

    }).then(result => {
        res.redirect('/admin/products');
    }).catch(err => console.log(err));
}



exports.getAdminProducts = (req, res, next) => {

    // Product.findAll() 
    req.user.getProducts()
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

    Product.destroy({ where: { id: prodId } }).then(result => {
        console.log("Product Destroyed Successfully");
        res.redirect('/admin/products');
    }).catch(err => console.log(err));

    // Product.findById(prodId).then(product => {
    //    return product.destroy();
    // }).then(result => {
    //     res.redirect('/admin/products');
    // }).catch(err => console.log(err));
}