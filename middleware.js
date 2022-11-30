const { campgroundSchema, reviewSchema } = require('./schemas.js');
const ExpressError = require('./utils/ExpressError');
const Campground = require('./models/campground');
const Review = require('./models/review');



module.exports.isLoggedIn = (req, res, next) => {
    if (!req.isAuthenticated()) {                         //to isAuthenticated() einai method tou Passport, to grafoume opws einai
        req.session.returnTo = req.originalUrl;    //se periptosi pou o xristis den einai logged in, apothikeuoume to url sto req.session, epeita pame sto users.js sto POST /login->
        req.flash('error', 'You must be signed in first!');
        return res.redirect('/login');
    }
    next();
}


module.exports.isAuthor = async (req, res, next) => {   //isAuthor middleware pou elegxei ean to id enos campground einai idio me to id tou author wste na mporei na kanei edit/delete
    const { id } = req.params;
    const campground = await Campground.findById(id);
    if (!campground.author.equals(req.user._id)) {      //an den isxuei tote petame error kai o xristis den mporei na kanei edit/delete/update klp
        req.flash('error', 'You do not have permission to do that');
        return res.redirect(`/campgrounds/${id}`);
    }
    next();
}


module.exports.isReviewAuthor = async (req, res, next) => {   //isReviewAuthor middleware pou elegxei ean to id enos review einai idio me to id tou author wste na mporei na kanei edit/delete to review
    const { id, reviewId } = req.params;
    const review = await Review.findById(reviewId);
    if (!review.author.equals(req.user._id)) {      //an den isxuei tote petame error kai o xristis den mporei na kanei edit/delete klp
        req.flash('error', 'You do not have permission to do that');
        return res.redirect(`/campgrounds/${id}`);
    }
    next();
}


module.exports.validateCampground = (req, res, next) => {
    const { error } = campgroundSchema.validate(req.body);
    if (error) {
        const msg = error.details.map(el => el.message).join(',');
        throw new ExpressError(msg, 400);
    } else {
        next();
    }
}


module.exports.validateReview = (req, res, next) => {
    const { error } = reviewSchema.validate(req.body);
    if (error) {
        const msg = error.details.map(el => el.message).join(',');
        throw new ExpressError(msg, 400);
    } else {
        next();
    }
}




