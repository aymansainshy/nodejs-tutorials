const express = require('express');
const adminController = require('../controllers/admin');
const isAuth = require('../middleware/is-auth');

const router = express.Router();


router.get('/add-product', isAuth, adminController.getAddProductPage);

// //  /Admin/products => GET
router.get('/products', isAuth, adminController.getAdminProducts);

router.post('/add-product', isAuth, adminController.postAddNewProduct);

router.get('/edit-product/:productId', isAuth, adminController.getEditProduct);

router.post('/edit-product', isAuth, adminController.postEditProduct);

router.post('/delete-product', isAuth, adminController.postDeleteProduct);


module.exports = router;