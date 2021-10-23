const express = require('express');
const shopController = require('../controllers/shop');
// const path = require('path');
// const rootDir = require('../utils/path');
// const adminData = require('./admin');
const router = express.Router();


router.get('/', shopController.getIndex);

router.get('/products', shopController.getAllProducts);

router.get('/products/:productId', shopController.getProduct);

router.get('/cart', shopController.getCart);

router.post('/cart', shopController.postCart);

router.post('/cart-delete-item', shopController.postCartDeleteProduct);

router.get('/orders', shopController.getOrders);

router.get('/checkout', shopController.getCheckOut);


module.exports = router;