const Campground = require('../models/campground');
const { cloudinary } = require('../cloudinary');
const mbxGeocoding = require('@mapbox/mapbox-sdk/services/geocoding');
const mapBoxToken = process.env.MAPBOX_TOKEN;      //pairnoume to MAPBOX_TOKEN apo to .env arxeio
const geocoder = mbxGeocoding({ accessToken: mapBoxToken });     //energopoihsh mapbox geocoding mesw tou token mas



module.exports.index = async (req, res) => {        //emfanisi   olwn twn campgrounds sto index.ejs
    const campgrounds = await Campground.find({});
    res.render('campgrounds/index', { campgrounds })
}


module.exports.renderNewForm = (req, res) => {   //render formas gia new campground
    res.render('campgrounds/new');
}


module.exports.createCampground = async (req, res, next) => {  //dhmiourgia enos neou campground
    //if (!req.body.campground) throw new ExpressError('Invalid Campground Data', 400);
    const geoData = await geocoder.forwardGeocode({        //gia geocoding, stelnoume perioxi, mas epistrefei syntetagmenes (to geoData)
        query: req.body.campground.location,
        limit: 1
    }).send()

    const campground = new Campground(req.body.campground);
    campground.geometry = geoData.body.features[0].geometry;  //apothikeuoume sto schema mas auto pou theloume apo to geodata. (GeoJSON)
    campground.images = req.files.map(f => ({ url: f.path, filename: f.filename })); //prosvasi sto req.files xaris to multer kai pairnoume to path kai filename gia kathe fwto pou anevainei
    campground.author = req.user._id;  //anathetoume sto author enos campground tis vasis to ._id apo to req.user tou Passport. 
    await campground.save();
    req.flash('success', 'Successfully made a new Campground');       //vazoume to flash mas edw
    res.redirect(`/campgrounds/${campground._id}`)
}


module.exports.showCampground = async (req, res,) => {           //to vasiko show route enos campground, kanoume populate ta reviews kai to author wste na paroume auto pou theloume
    const campground = await Campground.findById(req.params.id).populate({
        path: 'reviews',           //se autin tin periptwsi kanoume ena nested populate, kanoume 1on populate ta reviews =>
        populate: {             //meta 2on gia kathe review kanoume populate ton author tous. Kai epeita ksexwrista, kanoume apla =>
            path: 'author'      //populate ton author gia olo to Campground. *Na psaksw nested populate sto mongoose*
        }
    }).populate('author');

    if (!campground) {
        req.flash('error', 'Campground Unavailable');
        return res.redirect('/campgrounds');
    }
    res.render('campgrounds/show', { campground });
}


module.exports.renderEditForm = async (req, res) => {
    const campground = await Campground.findById(req.params.id);
    if (!campground) {
        req.flash('error', 'Campground Unavailable');
        return res.redirect('/campgrounds');
    }
    res.render('campgrounds/edit', { campground });
}


module.exports.updateCampground = async (req, res) => {
    const { id } = req.params;
    const campground = await Campground.findByIdAndUpdate(id, { ...req.body.campground });
    const imgs = req.files.map(f => ({ url: f.path, filename: f.filename }));  //prosvasi sto req.files xaris to multer kai pairnoume to path kai filename gia kathe fwto pou anevainei
    campground.images.push(...imgs); //pusharoume perrisoteres photo kata to update ean theloume
    await campground.save();
    if (req.body.deleteImages) {      //an yparxei deleteImages sto req.body
        for (let filename of req.body.deleteImages) {
            await cloudinary.uploader.destroy(filename, type = "authenticated"); //gia diagrafi tou image kai apo to Cloudinary
        }
        await campground.updateOne({ $pull: { images: { filename: { $in: req.body.deleteImages } } } }) //me to $pull: kanoume pull elements apo ena array. Xrisimopoioume auto to kommati kwdika gia delete photo
    }
    req.flash('success', 'Successfully updated Campground');       //vazoume to flash mas edw
    res.redirect(`/campgrounds/${campground._id}`)
}


module.exports.deleteCampground = async (req, res) => {
    const { id } = req.params;
    await Campground.findByIdAndDelete(id);
    req.flash('success', 'Successfully deleted Campground');       //vazoume to flash mas edw
    res.redirect('/campgrounds');
}