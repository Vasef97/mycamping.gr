const express = require('express');
const router = express.Router({ mergeParams: true });
const reviews = require('../controllers/reviews');     //auto to reviews object (controller) pou ftiaksame exei mesa oles tis methodous tou /controllers/reviews.js, to xrisimopoiw gia refactoring
const catchAsync = require('../utils/catchAsync');
const { validateReview, isLoggedIn, isReviewAuthor } = require('../middleware');



router.post('/', isLoggedIn, validateReview, catchAsync(reviews.createReview));

router.delete('/:reviewId', isLoggedIn, isReviewAuthor, catchAsync(reviews.deleteReview));

 

module.exports = router;