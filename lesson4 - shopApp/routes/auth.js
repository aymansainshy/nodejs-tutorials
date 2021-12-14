const express = require('express');
const authController = require('../controllers/auth');


const router = express.Router();



router.get('/login', authController.getLogin);
router.post('/login', authController.postLogin);

router.get('/signup', authController.getSignup);
router.post('/signup', authController.postSignup);

router.post('/logout', authController.postLogout);

// @desc
// RESET Password .. Send email ....
router.get('/reset', authController.getReset);

// @desc
// Post Reset Request to Current email Address .....
router.post('/reset', authController.postReset);

// @desc
// GET reset user password Page & And sending some information to page .....
router.get('/new-password:token', authController.getNewPassword);

// @desc
// Post new password to Reset USER PASSWORD .....
router.post('/new-password', authController.postNewPassword);


module.exports = router;