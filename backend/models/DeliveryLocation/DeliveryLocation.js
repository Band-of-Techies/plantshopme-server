// Coupon.js
const mongoose = require('mongoose');

const deliveryLocationSchema = new mongoose.Schema({
  location: {
    type: String,
    unique: true,
    required: true,
  },
  days: {
    type: String,
    required: true,
  },
});

const Location = mongoose.model('Location', deliveryLocationSchema);

module.exports = Location;
