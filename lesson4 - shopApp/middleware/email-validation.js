const { check, body } = require('express-validator'); // Check Validation .... importing check function from validate module .
const User = require('../models/user');

exports.emailValidation = (email, password, confirmPassword) => {
    return [
        check(email)
            .isEmail()
            .withMessage('Please enter a valid email')
            .normalizeEmail()
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
            
        /// Validating Password
        body(
            password,
            'Please enter a valid password '
        ).isLength({ min: 5 }).isAlphanumeric().trim(),

        /// Validating ConfirmPassword
        body(confirmPassword)
            .trim()
            .custom((value, { req }) => {
                if (value !== req.body.password) {
                    throw new Error('Password does not match');
                }
                return true;
            }),
    ]
}