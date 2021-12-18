const Product = require('../models/product');
const Order = require('../models/order');


exports.getAllProducts = (req, res, next) => {
    Product.find()
        // .select('title price - _id') // this will select spcefic field ...
        // .populate('userId' , 'name')
        .then(products => {
            console.log(products);
            res.render('shop/product-list', {
                pageTitle: 'All Products',
                path: '/products',
                products: products,
            });
        }).catch(err => {
            console.log(err);
        });
}


exports.getProduct = (req, res, next) => {
    const prodId = req.params.productId;

    Product.findById(prodId).then(product => {

        res.render('shop/product-detail', {
            pageTitle: product.title,
            product: product,
            path: '/products',
        })
    }).catch(err => console.log(err));
}



exports.getIndex = (req, res, next) => {
    Product.find().then(products => {
        res.render('shop/index', {
            pageTitle: 'Shop',
            path: '/',
            products: products,
        });
    }).catch(err => {
        console.log(err);
    });
}



exports.getCart = (req, res, next) => {

    req.user.cart.populate('items.product')
        // To make populate return a Promise.
        .then(products => {
            console.log(products.items);
            res.render('shop/cart', {
                pageTitle: 'Cart',
                path: '/cart',
                products: products.items,
            });
        }).catch(err => console.log(err));
}


exports.postCart = (req, res, next) => {

    const prodId = req.body.productId;

    Product.findById(prodId).then(product => {
        return req.user.addToCart(product);
    }).then(resutl => {
        console.log(resutl);
        res.redirect('/cart');
    }).catch(err => {
        console.log(err);
    });
}


exports.postCartDeleteProduct = (req, res, next) => {
    const prodId = req.body.productId;

    req.user.deleteItemFromCart(prodId).then(() => {
        res.redirect('/cart');
    }).catch(err => console.log(err));
}




exports.postOrder = async (req, res, next) => {
    try {
        const productsData = await req.user.cart.populate('items.product');

        const products = productsData.items.map(i => {

            return {
                quantity: i.quantity,
                product: { ...i.product._doc },
            }
        });

        const order = new Order({
            user: {
                email: req.user.email,
                userId: req.user,
            },
            products: products,
        });

        await order.save();
        await req.user.clearCart();

        res.redirect('/orders');
    } catch (err) {
        console.log(err);
    }

}



exports.getOrders = async (req, res, next) => {
    try {
        const orders = await Order.find({ 'user.userId': req.user._id });

        console.log(orders);
        res.render('shop/orders', {
            orders: orders,
            pageTitle: 'Orders',
            path: '/orders',
        });

    } catch (err) {
        console.log(err);
    }
}