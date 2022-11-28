const mongoose = require('mongoose');
const Review = require('./review');
const Schema = mongoose.Schema;


const ImageSchema = new Schema(
    {
        url: String,
        filename: String
    }
);


const opts = { toJSON: { virtuals: true } };  //to xrisimopoioume wste to campgroundSchema na periexei to virtual properties pou vazoume parakatw


ImageSchema.virtual('thumbnail').get(function () {          //eikoniko, xrisimopoihtai gia photo thumbnails sto edit.ejs
    return this.url.replace('/upload', '/upload/w_200');
})


const CampgroundSchema = new Schema({
    title: String,
    images: [ImageSchema],
    website: String,
    geometry: {                                   //gia geoJSON, to schema prepei na einai etsi gia ta coordinates
        type: {
            type: String,
            enum: ['Point'], // 'location.type' must be 'Point'
            required: true
        },
        coordinates: {
            type: [Number],
            required: true
        }
    },
    price: Number,
    description: String,
    location: String,
    author: {                          //dimiourgoume anafora ston User opws exoume dei sto related mongo
        type: Schema.Types.ObjectId,
        ref: 'User'
    },
    reviews: [
        {
            type: Schema.Types.ObjectId,
            ref: 'Review'
        }
    ],
}, opts);


CampgroundSchema.virtual('properties.popUpMarkup').get(function () {          //eikoniko, xrisimopoihtai gia popup sta clusters sto clusterMap.js
    return `
    <strong><a class="map-campnames" href="/campgrounds/${this._id}">${this.title}</a></strong>
    <p>${this.description.substring(0,100)}...</p> 
    `;  //stin ousia stelnoume auto to text pou tha axiopoihthei sto clusterMap.js
})   //substring: tha emfanistoun 50 xaraktires tou description


CampgroundSchema.post('findOneAndDelete', async function (doc) {
    if (doc) {                                                         //doc shows if anything was deleted, so if something was found..do..
        await Review.deleteMany({
            _id: {
                $in: doc.reviews
            }
        })
    }
});


module.exports = mongoose.model('Campground', CampgroundSchema);