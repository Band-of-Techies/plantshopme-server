// models/review.js
const mongoose = require('mongoose');

const reviewSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'user',
    required: true,
  },
  product_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'product',
    required: true,
  },
  content:{
    type:String,
    required:true
  },
  rating:{
    type:String,
    required:true
  },
},
{
  timestamps: true,
});

const Review = mongoose.model('Review', reviewSchema);

module.exports = Review;
