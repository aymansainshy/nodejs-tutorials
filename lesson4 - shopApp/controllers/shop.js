const Product = require('../models/product');
const Cart = require('../models/cart');


exports.getAllProducts = (req, res, next) => {
    Product.fetchAll((products => {
        res.render('shop/product-list', {
            pageTitle: 'All Products',
            path: '/products',
            products: products,
        });
    }));
}


exports.getProduct = (req, res, next) => {
    const prodId = req.params.productId;
    Product.findById(prodId, product => {
        console.log(product);
        res.render('shop/product-detail', {
            pageTitle: 'P - Details',
            product: product,
            path: '/products',
        });
    });

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
    Cart.getCart(cart => {
        Product.fetchAll(products => {
            const cartProducts = [];

            for (const product of products) {
                const cartProductsData = cart.products.find(prod => prod.id === product.id);

                if (cartProductsData) {
                    cartProducts.push({ productData: product, qty: cartProductsData.qty });
                }
            }

            res.render('shop/cart', {
                pageTitle: 'Cart',
                path: '/cart',
                products: cartProducts,
            });
        });
    })
}


exports.postCart = (req, res, next) => {
    const prodId = req.body.productId;

    Product.findById(prodId, product => {
        Cart.addProduct(prodId, product.price);
    });
    res.redirect('/cart');
}


exports.postCartDeleteProduct = (req, res, next) => {
    const prodId = req.body.productId;
    // const prodPrice = req.body.productPrice;
    Product.findById(prodId, product => {
        Cart.deleteProduct(prodId, product.price);
        res.redirect('/cart');
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
