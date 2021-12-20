const { validationResult } = require('express-validator');
const Product = require('../models/product');
const { deleteFile } = require('../utils/file');


exports.getAddProductPage = (req, res, next) => {

    res.render('admin/edit-product', {
        pageTitle: 'Add product',
        path: '/admin/add-product',
        editing: false,
        hasError: false,
        errorMessage: null,
    });
}


exports.postAddNewProduct = async (req, res, next) => {

    const title = req.body.title;
    const price = req.body.price;
    const description = req.body.description;
    const image = req.file;
    // const userId = req.user._id;
    if (!image) {
        return;
    }

    const product = new Product({
        title: title,
        price: price,
        description: description,
        imageUrl: image.path,
        userId: req.user._id, // This is also work mongoose will pick just the Id field .
    });

    try {
        await product.save();

        console.log("Product created successfully");
        res.redirect('/admin/products');

    } catch (err) {
        const error = new Error(err);
        error.status(500);
        return next(error);
    }
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
                hasError: false,
                errorMessage: null,
            });
        }).catch(err => console.log(err));
}



exports.postEditProduct = async (req, res, next) => {

    const prodId = req.body.productId;
    const updatedTitle = req.body.title;
    const image = req.file;
    const updatedDescription = req.body.description;
    const updatedPrice = req.body.price;

    const errors = validationResult(req);

    if (!errors.isEmpty()) {
        console.log(errors.array());
        return res.status(422).render('admin/edit-product', {
            pageTitle: 'Edit product',
            path: '/admin/add-product',
            editing: true,
            hasError: true,
            errorMessage: errors.array()[0].msg,
            product: {
                title: updatedTitle,
                price: updatedPrice,
                description: updatedDescription,
                _id: userId,
            },
        });
    }


    try {
        const product = await Product.findById(prodId);

        if (product.userId.toString() !== req.user._id.toString()) {
            return res.redirect('/');
        }

        product.title = updatedTitle;
        product.price = updatedPrice;
        product.description = updatedDescription;

        if (image) {
            deleteFile(product.imageUrl); //DELETE Ole image for product .
            product.imageUrl = image.path;
        }

        await product.save();
        res.redirect('/admin/products');
    } catch (err) {
        return console.log(err);
    }
}



exports.getAdminProducts = async (req, res, next) => {
    try {
        const userProducts = await Product.find({ userId: req.user._id });

        res.render('admin/products', {
            products: userProducts,
            pageTitle: 'All Products',
            path: '/admin/products',
        });

    } catch (err) {
        console.log(err);
    }
}



exports.postDeleteProduct = async (req, res, next) => {
    const prodId = req.body.productId;
    try {
 
        const product = await Product.findById(prodId);
        if (!product) {
            return next(new Error('Product not found'));
        }
        deleteFile(product.imageUrl); //DELETE Old image for product .


        await Product.deleteOne({ _id: prodId, userId: req.user._id });
        console.log("Product Destroyed Successfully");

        res.redirect('/admin/products');
    } catch (err) {
        console.log(err);
    }
}