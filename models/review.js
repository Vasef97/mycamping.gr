const mongoose = require('mongoose');
const Schema = mongoose.Schema;


const reviewSchema = new Schema({
    body: String,
    rating: Number,
    author: {
        type: Schema.Types.ObjectId,              //dimiourgoume anafora ston User opws exoume dei sto related mongo
        ref: 'User'                      
    }
});


module.exports = mongoose.model("Review", reviewSchema);