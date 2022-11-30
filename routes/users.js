const express = require('express');
const router = express.Router({ mergeParams: true });
const catchAsync = require('../utils/catchAsync');
const users = require('../controllers/users');        //auto to users object (controller) pou ftiaksame exei mesa oles tis methodous tou /controllers/users.js, to xrisimopoiw gia refactoring
const passport = require('passport');



router.get('/register', users.renderRegisterForm);    //register routes

router.post('/register', catchAsync(users.register));

router.get('/login', users.renderLoginForm);    //login routes

router.post('/login', passport.authenticate('local', { failureFlash: true, failureRedirect: '/login', keepSessionInfo: true },), users.login);

router.get('/logout', users.logout);     //logout route



module.exports = router;