const express = require('express');
const router = express.Router();
const campgrounds = require('../controllers/campgrounds'); //auto to campgrounds object (controller) pou ftiaksame exei mesa oles tis methodous tou /controllers/campgrounds.js, to xrisimopoiw gia refactoring
const catchAsync = require('../utils/catchAsync');
const { isLoggedIn, isAuthor, validateCampground } = require('../middleware');   //require to isLoggedIn middleware mas gia elegxo
const multer = require('multer');     //gia to cloudinary
const { storage } = require('../cloudinary');    // de xreiazetai /index gt to node psaxnei automata gia index.js

const upload = multer({ storage });   //gia to Cloudinary



router.get('/', catchAsync(campgrounds.index));  //campgrounds.index: o vasikos kwdikas autou tou route apo ton fakelo controllers

router.get('/new', isLoggedIn, campgrounds.renderNewForm); //campgrounds.renderNewForm: o vasikos kwdikas autou tou route apo ton fakelo controllers

router.post('/', isLoggedIn, upload.array('image'), validateCampground, catchAsync(campgrounds.createCampground)); //to upload.array('image') apotelei middleware tou multer

router.get('/:id', catchAsync(campgrounds.showCampground));

router.get('/:id/edit', isLoggedIn, isAuthor, catchAsync(campgrounds.renderEditForm));

router.put('/:id', isLoggedIn, isAuthor, upload.array('image'), validateCampground, catchAsync(campgrounds.updateCampground));

router.delete('/:id', isLoggedIn, isAuthor, catchAsync(campgrounds.deleteCampground));



module.exports = router;

// Yparxei enas deuteros tropos organwshs twn routes pou exoun idio syndesmo alla diaforetikh entolh get, post,
// put, delete apo to express router. Px gia ta /:id routes mas pou exoume apo panw, ta omadopoioume etsi:


            // router.route('/:id')
            //     .get(catchAsync(campgrounds.showCampground))
            //     .put(isLoggedIn, isAuthor, validateCampground, catchAsync(campgrounds.updateCampground))
            //     .delete(isLoggedIn, isAuthor, catchAsync(campgrounds.deleteCampground));


// Etsi omadopoioume apo to router ama theloume routes pou ksekinoun me ton idio syndesmo
// alla exoun diaforetikh entolh express.