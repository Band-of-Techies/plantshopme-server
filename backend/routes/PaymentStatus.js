const mongoose = require('mongoose');

// Define the schema
const PaymentStatusSchema = new mongoose.Schema({
  clientSecret: {
    type: String,
    required: true,
  },
  paymentStatus: {
    type: String,
   
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

// Create the model
const PaymentStatus = mongoose.model('PaymentStatus', PaymentStatusSchema);

module.exports = PaymentStatus;
