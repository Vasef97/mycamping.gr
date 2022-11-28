const User = require('../models/user');



module.exports.renderRegisterForm = (req, res) => {
    res.render('users/register');
}


module.exports.register = async (req, res, next) => {
    try {
        const { email, username, password } = req.body;      //destructure
        const user = new User({ email, username });  //sto User model pername mono email username, ta grafoume opws einai
        const registeredUser = await User.register(user, password);   //me xrisi passport, pername to user instance pou-> 
        //->ftiaksame (mia grammi panw) kai to password sto register() method, to password tha ginei mono tou hash kai tha->
        //->apothikeftoun ola sto user model sto mongoose. Ta grafoume ola opws einai, kaname xrisi tou passport gia ola auta
        req.login(registeredUser, err => {  //to grafoume opws einai apo to Passport, otan ginetai register stin ousia ginetai automata kai login
            if (err) { return next(err); }
            else {
                req.flash('success', 'Welcome to Yelp Camp!');
                res.redirect('/campgrounds');
            }
        })
    } catch (e) {
        req.flash('error', e.message);
        res.redirect('register');
    }
}


module.exports.renderLoginForm = (req, res) => {                 //login routes
    res.render('users/login');
}


module.exports.login = (req, res) => {
    req.flash('success', `Welcome back ${req.user.username}!`);  //xrisimopoioume opws vlepoume to passport.authenticate, elegxei an einai egkyra ta stoixeia kata to login
    const redirectUrl = req.session.returnTo || '/campgrounds';  //pairnoume to apothikeumeno url pou pirame apo to middleware kai to anathetoume sto redirectUrl
    delete req.session.returnTo;  //diagrafoume to Url apo to req.sessions 
    res.redirect(redirectUrl);
}


module.exports.logout = function (req, res, next) {
    req.logout(function (err) {           //to logout() apotelei asynchronous function tou Passport, to grafw opws einai
        if (err) {
            return next(err);
        }
        req.flash('success', 'Logged out');
        res.redirect('/campgrounds');
    });
}