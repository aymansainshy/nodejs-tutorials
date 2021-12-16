const crypto = require('crypto');

const bcrypt = require('bcryptjs');
const nodemailer = require('nodemailer');
const sendgridTransport = require('nodemailer-sendgrid-transport');
const { validationResult } = require('express-validator');


const User = require('../models/user');

// This to send email to varify user ....
const transporter = nodemailer.createTransport(
    sendgridTransport({
        auth: {
            api_key: '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',
        }
    })
);



exports.getLogin = (req, res, next) => {
    // const isLoggedIn = req.get('Cookie').split('=')[1] === 'true';
    // console.log(req.session.isLoggedIn);

    let errorMessage = req.flash('error');
    if (errorMessage.length > 0) {
        errorMessage = errorMessage[0];
    } else {
        errorMessage = null;
    }

    res.render('auth/login', {
        pageTitle: 'login',
        path: '/login',
        errorMessage: errorMessage,
    });
}




exports.postLogin = async(req, res, next) => {
    // res.setHeader('Set-Cookie', 'loggedIn=true; Max-Age=10 ');
    const email = req.body.email;
    const password = req.body.password;

    try {
        const user = await User.findOne({ email: email });
        if (!user) {
            req.flash('error', 'invalid email or password');
            return res.redirect('/login');
        }

        const isMatch = bcrypt.compare(password, user.password);
        if (!isMatch) {
            req.flash('error', 'invalid email or password');
            return res.redirect('/login');
        }

        req.session.isLoggedIn = true;
        req.session.user = user;

        return req.session.save(err => {
            console.log(err);
            res.redirect('/');
        });

    } catch (err) {
        console.log(err);
    }
}



exports.getSignup = (req, res, next) => {

    let errorMessage = req.flash('error');
    if (errorMessage.length > 0) {
        errorMessage = errorMessage[0];
    } else {
        errorMessage = null;
    }

    res.render('auth/signup', {
        pageTitle: 'signup',
        path: '/signup',
        errorMessage: errorMessage,
    });
}



exports.postSignup = async function(req, res, next) {
    const email = req.body.email;
    const password = req.body.password;
    const confirmPassword = req.body.confirmPassword;

    const errors = validationResult(req);

    if (!errors.isEmpty()) {
        console.log(errors.array());

        return res.status(422).render('auth/signup', {
            pageTitle: 'signup',
            path: '/signup',
            errorMessage: errors.array()[0].msg,
        });
    }

    try {

        const isUserExist = await User.findOne({ email: email });

        if (isUserExist) {
            console.log('User already exists');
            req.flash('error', 'User already exists');
            return res.redirect('/signup');
        }

        const hashedPassword = await bcrypt.hash(password, 12);

        const newUser = new User({
            email: email,
            password: hashedPassword,
            cart: { items: [] }
        });

        await newUser.save();
        console.log('User Created Successfully');

        res.redirect('/login');

        await transporter.sendMail({
            to: email,
            from: 'ayman.abdulrahman95@gmail.com',
            subject: 'Signup succeded',
            html: '<h1>You Successfully signed up!</h1>',
        });


    } catch (err) {
        console.log(err);
    }
}



exports.postLogout = (req, res, next) => {
    req.session.destroy((err) => {
        console.log(err);
        res.redirect('/');
    });
}


exports.getReset = (req, res, next) => {

    let errorMessage = req.flash('error');
    if (errorMessage.length > 0) {
        errorMessage = errorMessage[0];
    } else {
        errorMessage = null;
    }

    res.render('auth/reset', {
        pageTitle: 'Reset Password',
        path: '/reset',
        errorMessage: errorMessage,
    });
}


// @desc
// Post Reset Request to Current email Address .....
exports.postReset = (req, res, next) => {

    crypto.randomBytes(32, async(err, buffer) => {
        if (err) {
            console.log(err);
            return res.redirect('/reset');
        }

        const token = buffer.toString('hex');

        try {
            const user = await User.findOne({ email: req.body.email });

            if (!user) {
                req.flash('error', 'No account with that email was found');
                return res.redirect('/reset');
            }

            user.resetToken = token;
            user.resetTokenExpiration = Date.now() + 3600000;
            await user.save();

            res.redirect('/');

            await transporter.sendMail({
                to: req.body.email,
                from: 'ayman.abdulrahman95@gmail.com',
                subject: 'Password Reset',
                html: `
                   <p> You requested a password reset</p>
                   <p> Click this <a href="http://localhost:3000/reset/${token}"> link </a>to reset your password </p>
                `,
            });

            console.log('email sended done');
        } catch (err) {
            console.log(err);
        }
    });

}



// @desc
// GET reset user password Page & And sending some information to page ...
exports.getNewPassword = async(req, res, next) => {

    const token = req.params.token;
    try {
        const user = await User.findOne({ resetToken: token, resetTokenExpiration: { $gt: Date.now() } });

        let errorMessage = req.flash('error');
        if (errorMessage.length > 0) {
            errorMessage = errorMessage[0];
        } else {
            errorMessage = null;
        }

        if (user) {
            return res.redirect('/login');
        }

        res.render('auth/new-password', {
            pageTitle: 'New Password',
            path: '/new-password',
            errorMessage: errorMessage,
            passwordToken: token,
            userId: user._id.toString(),
        });
    } catch (err) {
        console.log(err);
    }
}



// @desc
// Post new password to Reset USER PASSWORD ....
exports.postNewPassword = async(req, res, next) => {
    const newPassword = req.body.password;
    const userId = req.body.userId;
    const passwordToken = req.body.passwordToken;

    try {
        const user = await User.findOne({
            resetToken: passwordToken,
            resetTokenExpiration: { $gt: Date.now() },
            _id: userId,
        });

        const newHashedPassword = await bcrypt.hash(newPassword, 12);

        user.password = newHashedPassword;
        user.resetToken = undefined;
        user.resetTokenExpiration = undefined;

        await user.save();

        res.redirect('/login');

    } catch (err) {
        console.log(err);
    }

}