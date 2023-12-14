// const mongoose = require('mongoose');

// const cartSchema = new mongoose.Schema(
//   {
//     userId: {
//       type: mongoose.Schema.Types.ObjectId,
//       ref: 'User', // Assuming there is a User model to reference for user details
//     },
//     productName: {
//       type: String,
//       required: true,
//     },
//     subcategory: {
//       type: String,
//     },
//     productQuantity: {
//       type: Number,
//       required: true,
//     },
//     potName: {
//       type: String,
//     },
//     size: {
//       type: String,
//     },
//     totalPrice: {
//       type: Number,
//       required: true,
//     },
//   },
//   {
//     timestamps: true,
//   }
// );

// module.exports = mongoose.model('Cart', cartSchema);
const mongoose = require('mongoose');


const cartSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    image:{
      type:String,
      required:true
    },
    productId:{
      type: String,
      required: true,
    },
    title: {
      type: String,
      required: true,
    },
    productQuantity: {
      type: Number,
      required: true,
    },
    dimension:{
      type:Object,
      required:true
    },
    Status:{
      type:String,
    },
    flashSalePrice:{
      type:Number
    },
    flashSaleStartDate:{
      type:Date,
    },
    flashSaleStartTime:{
      type:String,
    },
    flashSaleEndTime:{
      type:String,
    },
    flashSaleDiscount:{
      type:Number
    },
    totalPrice: {
      type: Number,
      required: true,
    },
    OtherProductDetails:{
      type:Object
    },
    maincategory: {
      type: [String],  
    },
    category: {
      type: [String],  
    },
    subcategory: {
      type: [String],  
    },
    stock:Number,
  },

  {
    timestamps: true,
  }
);

module.exports = mongoose.model('Cart', cartSchema);