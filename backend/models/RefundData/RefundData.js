
const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const refundSchema = new Schema(
  {
    paymentIntentId:{type:String,required:true},
    orderId:{type:String,required: true},
    name :{ type: String, required: true }, 
    transactionId: { type: String },
    state: { type: String, required: true },
    city: { type: String, required: true },
    houseNumber: { type: String, required: true },
    landmark:{type: String, required: true} ,
    phone:{type:String,required: true},
    phone2:{type:String ,required: true},
    reason:{type:String ,required: true},
    userId:{type:String,required: true},
    status: { type: String, default: 'Requested' },
    
  },
  {
    timestamps: true,
  }
);

const RefundData = mongoose.model('RefundData', refundSchema);

module.exports = RefundData;

