const express = require('express');
const { check, body } = require('express-validator'); // Check Validation .... importing check function from validate module .
const authController = require('../controllers/auth');
const User = require('../models/user');


const router = express.Router();



router.get('/login', authController.getLogin);
router.post('/login', authController.postLogin);

router.get('/signup', authController.getSignup);

router.post('/signup', [
        check('email')
        .isEmail()
        .withMessage('Please enter a valid email')
        .custom((value, { req }) => {
            // if (value === 'test@test.com') {
            //     throw new Error('This email is forbidden');
            // }
            // return true;

            return User.findOne({ email: value }).then((userDoc) => {
                if (userDoc) {
                    return Promise.reject('User already exists');
                }
            });
        }),


        body(
            'password',
            'Please enter a valid password '
        ).isLength({ min: 5 }).isAlphanumeric(),


        body('confirmPassword')
        .custom((value, { req }) => {
            if (value !== req.body.password) {
                throw new Error('Password does not match');
            }
            return true;
        }),

    ],
    authController.postSignup);



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