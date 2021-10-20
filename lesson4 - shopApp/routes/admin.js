const express = require('express');
const adminController = require('../controllers/admin');
// const path = require('path');
// const rootDir = require('../utils/path');
const router = express.Router();


router.get('/add-product', adminController.getAddProductPage);

//  /Admin/products => GET
router.get('/products', adminController.getAdminProducts);

router.post('/add-product', adminController.postAddNewProduct);


module.exports = router;