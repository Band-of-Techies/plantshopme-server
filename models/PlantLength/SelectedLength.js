const mongoose = require('mongoose');
const Product = require('../../models/AddProduct/AddProduct');
const Schema = mongoose.Schema;

const selectedLengthDetailsSchema = new Schema(
  {
    product_id: {
      type: Schema.Types.ObjectId,
      ref: 'AddProduct',
    },
    length: { type: String },
    price: { type: String },
    currency: { type: String },
    productName: { type: String },
    subCategory: { type: String },
    category: { type: String },
    mainCategory: { type: String },
  },
  {
    timestamps: true,
  }
);

const SelectedLengthDetails = mongoose.model('SelectedLengthDetails', selectedLengthDetailsSchema);

module.exports = SelectedLengthDetails;
