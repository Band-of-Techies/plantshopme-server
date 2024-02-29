const mongoose = require('mongoose');

// Define the schema
const orderSchema = new mongoose.Schema(
  {
    orderId: {
      type: String,
      unique: true,
    },
    status: {
      type: String,
      default: 'not'
    }
  },
  {
    timestamps: true,
  }
);

// Create a model using the schema
const Order = mongoose.model('Notification', orderSchema);

module.exports = Order;
