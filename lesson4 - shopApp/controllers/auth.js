const bcrypt = require('bcryptjs');
const User = require('../models/user');

exports.getLogin = (req, res, next) => {
    // const isLoggedIn = req.get('Cookie').split('=')[1] === 'true';
    console.log(req.session.isLoggedIn);

    res.render('auth/login', {
        pageTitle: 'login',
        path: '/login',
        errorMessage: req.flash('error'),
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

    res.render('auth/signup', {
        pageTitle: 'signup',
        path: '/signup',
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