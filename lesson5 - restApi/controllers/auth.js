const { validationResult } = require('express-validator');
const bcript = require('bcryptjs');

const User = require('../models/user');

exports.signup = async (req, res, next) => {

    const errors = validationResult(req);

    if (!errors.isEmpty()) {
        const error = new Error('Validation Failed.');
        error.statusCode = 422;
        error.errors = errors.array();
        throw error;
        // error.data = errors.array();
    }

    const email = req.body.email;
    const password = req.body.password;
    const name = req.body.name;

    try {
        const hashedPassword = await bcript.hash(password, 12);

        const user = new User({
            email: email,
            password: hashedPassword,
            name: name,
        });

        const result = await user.save();

        res.status(201).json({ message: "User Created Successfully", user: result });

    } catch (error) {
        if (!error.statusCode) {
            error.statusCode = 500;
        }
        next(error);
    }
}