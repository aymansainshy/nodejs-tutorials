const express = require('express');
const { check } = require('express-validator'); // Check Validation .... importing check function from validate module .
const authController = require('../controllers/auth');


const router = express.Router();



router.get('/login', authController.getLogin);
router.post('/login', authController.postLogin);

router.get('/signup', authController.getSignup);
router.post('/signup', check('email').isEmail().withMessage('Please enter a valid email'), authController.postSignup);

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