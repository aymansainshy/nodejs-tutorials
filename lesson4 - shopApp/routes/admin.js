const express = require('express');
const productController = require('../controllers/product');
// const path = require('path');
// const rootDir = require('../utils/path');
const router = express.Router();


router.get('/add-product', productController.getAddProductPage);

router.post('/add-product', productController.addNewProduct);


module.exports = router;