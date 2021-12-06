const User = require('../models/user');

exports.getLogin = (req, res, next) => {
    // const isLoggedIn = req.get('Cookie').split('=')[1] === 'true';
    console.log(req.session.isLoggedIn);

    res.render('auth/login', {
        pageTitle: 'login',
        path: '/login',
        isAuthenticated: false,
    });
}


exports.postLogin = (req, res, next) => {
    // res.setHeader('Set-Cookie', 'loggedIn=true; Max-Age=10 ');

    User.findById('61a8bf0c0797645a77ea2876')
        .then(user => {
            req.session.isLoggedIn = true;
            req.session.user = user;
            req.session.save(err => {
                console.log(err);
                res.redirect('/');
            });
        }).catch(err => console.log(err));
}


exports.postLogout = (req, res, next) => {
    req.session.destroy((err) => {
        console.log(err);
        res.redirect('/');
    });
}