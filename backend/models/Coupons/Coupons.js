// Coupon.js
const mongoose = require('mongoose');

const couponSchema = new mongoose.Schema({
  code: {
    type: String,
    unique: true,
    required: true,
    minLength: 5,
  },
  type: {
    type: String,
    enum: ['Percentage', 'Flat'],
    required: true,
  },
  value: {
    type: Number,
    required: true,
  },
  usage: {
    type: String,
    enum: ['Single', 'Multiple'],
    required: true,
  },
  startDate: {
    type: Date,
    required: true,
  },
  minvalue: {
    type: Number,
    
  },
  endDate: {
    type: Date,
    required: true,
  },
  Exclusive: {
    type: String,
    default:false
    
  },
});

const Coupon = mongoose.model('Coupon', couponSchema);

module.exports = Coupon;
