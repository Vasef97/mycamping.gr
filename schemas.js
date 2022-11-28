const BaseJoi = require('joi');
const sanitizeHtml = require('sanitize-html');


const extension = (joi) => ({         //xrisimopoioume auto to extension gia HTML sanitizing, to pairnoume opws exei
    type: 'string',
    base: joi.string(),
    messages: {
        'string.escapeHTML': '{{#label}} must not include HTML!'
    },
    rules: {
        escapeHTML: {
            validate(value, helpers) {
                const clean = sanitizeHtml(value, {
                    allowedTags: [],
                    allowedAttributes: {},
                });
                if (clean !== value) return helpers.error('string.escapeHTML', { value })
                return clean;
            }
        }
    }
});

const Joi = BaseJoi.extend(extension); //kanontas extend to sanitize-extension apo panw, exoume prosvasi sto ->
//-> escapeHTML{} wste na xrisimopoihthei sto schema mas. Opou exoume eisodo text vazoume escapeHTML().

module.exports.campgroundSchema = Joi.object({
    campground: Joi.object({
        title: Joi.string().required().escapeHTML(),  
        website:Joi.string().required().escapeHTML(), 
        price: Joi.number().required().min(0),
        // image: Joi.string().required(),
        location: Joi.string().required().escapeHTML(),
        description: Joi.string().required().escapeHTML()
    }).required(),
    deleteImages: Joi.array()
});

module.exports.reviewSchema = Joi.object({
    review: Joi.object({
        rating: Joi.number().required().min(1).max(5),
        body: Joi.string().required().escapeHTML()
    }).required()
})
