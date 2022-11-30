const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const passportLocalMongoose = require('passport-local-mongoose'); //xrisi passport gia to user schema


const UserSchema = new Schema({
    email: {
        type: String,
        required: true,
        unique: true
    }
})


UserSchema.plugin(passportLocalMongoose);  // auto to plugin vazei sto UserSchema username kai password me ta katallilla ->
//-> pedia xaris to passport, opote orizoume mono mail sto schema san epipleon


module.exports = mongoose.model('User', UserSchema);                                          