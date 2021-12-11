const bcrypt = require('bcryptjs');
const nodemailer = require('nodemailer');
const sendgridTransport = require('nodemailer-sendgrid-transport');


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