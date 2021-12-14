const Product = require('../models/product');


exports.getAddProductPage = (req, res, next) => {

    res.render('admin/edit-product', {
        pageTitle: 'Add product',
        path: '/admin/add-product',
        editing: false,
    });
}


exports.postAddNewProduct = async(req, res, next) => {

    const title = req.body.title;
    const price = req.body.price;
    const description = req.body.description;
    const imageUrl = req.body.imageUrl;
    // const userId = req.user._id;

    const product = new Product({
        title: title,
        price: price,
        description: description,
        imageUrl: imageUrl,
        userId: req.user, // This is also work mongoose will pick just the Id field .
    });

    try {
        await product.save();

        console.log("Product created successfully");
        res.redirect('/admin/products');
    } catch (err) {
        console.log(err);
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
            });
        }).catch(err => console.log(err));
}



exports.postEditProduct = async(req, res, next) => {

    const prodId = req.body.productId;
    const updatedTitle = req.body.title;
    const updatedImageUrl = req.body.imageUrl;
    const updatedDescription = req.body.description;
    const updatedPrice = req.body.price;

    try {
        const product = await Product.findById(prodId);

        if (product.userId.toString() !== req.user._id.toString()) {
            return res.redirect('/');
        }

        product.title = updatedTitle;
        product.price = updatedPrice;
        product.description = updatedDescription;
        product.imageUrl = updatedImageUrl;

        await product.save();
        res.redirect('/admin/products');
    } catch (err) {
        return console.log(err);
    }
}



exports.getAdminProducts = async(req, res, next) => {
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



exports.postDeleteProduct = async(req, res, next) => {
    const prodId = req.body.productId;
    try {
        await Product.deleteOne({ _id: prodId, userId: req.user._id });
        console.log("Product Destroyed Successfully");

        res.redirect('/admin/products');
    } catch (err) {
        console.log(err);
    }
}