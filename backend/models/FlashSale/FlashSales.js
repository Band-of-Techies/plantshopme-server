const mongoose = require('mongoose');

const FlashSalesSchema = new mongoose.Schema({
  ProductId: {
    type: String,
   
  },
  ProductName: {
    type: String,
    
  },
  SubCategory: {
    type: String,
    
  },
  OfferPercentage: {
    type: Number, 
   
  },
  TimeInHours: {
    type: Number,
   
  },
  StartTime: {
    type: String,

  },
  StartDate: {
    type: Date, 
   
  },
  Status: {
    type: String,
    default:'Unlimited'
    
  },
});

module.exports = mongoose.model('FlashSale', FlashSalesSchema);
