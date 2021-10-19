const express = require('express');
const productController = require('../controllers/product');
// const path = require('path');
// const rootDir = require('../utils/path');
// const adminData = require('./admin');
const router = express.Router();


router.get('/', productController.getAllProducts);


module.exports = router;