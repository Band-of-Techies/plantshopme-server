const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const newsletterSchema = new Schema({
    userName:{ type: String, required: true, unique: true },
    email: { type: String, required: true, unique: true }
});

const NewsletterModel = mongoose.model('Newsletter', newsletterSchema);

module.exports = NewsletterModel;