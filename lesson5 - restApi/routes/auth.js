const express = require('express');
const { body } = require('express-validator');

const User = require('../models/user');
const authController = require('../controllers/auth');

const router = express.Router();

// @desc  ... Create New User 
// @route ... POST { /auth/singup } ...
router.post('/signup',
    [
        body('email')
            .isEmail()
            .withMessage('Please enter a valid email')
            .custom((value, { req }) => {
                return User.findOne({ email: value }).then((userDoc) => {
                    if (userDoc) {
                        return Promise.reject("E-mail address is already exists!");
                    }
                })
            })
            .normalizeEmail(),

        body('password').trim().isLength({ min: 5 }),

        body('name').trim().not().isEmpty()
    ]
    , authController.signup);



// @desc  
// POST {/auth/login } .... Login User 
router.post('/login', authController.logIn);


module.exports = router;