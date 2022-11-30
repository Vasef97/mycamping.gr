const Review = require('../models/review');
const Campground = require('../models/campground');



module.exports.createReview = async (req, res) => {
    const campground = await Campground.findById(req.params.id);
    const review = new Review(req.body.review);
    review.author = req.user._id;          //anathetoume sto author enos review tis vasis to ._id apo to req.user tou Passport. 
    campground.reviews.push(review);       //Etsi syndeoume to onoma tou xristi pou ekane to review stin vasi, me to req.user._id tou session.
    await review.save();
    await campground.save();
    req.flash('success', 'Created new Review');       //vazoume to flash mas edw
    res.redirect(`/campgrounds/${campground._id}`);
}


module.exports.deleteReview = async (req, res) => {
    const { id, reviewId } = req.params;
    await Campground.findByIdAndUpdate(id, { $pull: { reviews: reviewId } });
    await Review.findByIdAndDelete(reviewId);
    req.flash('success', 'Successfully deleted Review');       //vazoume to flash mas edw
    res.redirect(`/campgrounds/${id}`);
}