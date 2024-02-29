
const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const paymentIntentSchema = new Schema(
  {
    orderId:{type:String,required:true},
    updatedCartItems: { type: [Object], required: true }, 
    shipping_fee: { type: Number, required: true },
    total: { type: Number, required: true },
    user: { type: Object, required: true },
    checkoutData: { type: Object, required: true },
    paymentData:{type: Object, required: true} ,
    Orderstatus:{type:String,default: 'Order Placed'},
    couponData:{type:Object},
    coinsData:{type:Object},
    GoogleLocation:{type:Object}
  },
  {
    timestamps: true,
  }
);

const PaymentIntent = mongoose.model('PaymentIntent', paymentIntentSchema);

module.exports = PaymentIntent;

