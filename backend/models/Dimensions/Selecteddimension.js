const mongoose = require('mongoose');
const Product = require('../../models/AddProduct/AddProduct');
const Schema = mongoose.Schema;

const selectedLengthDetailsSchema = new Schema(
  {
   
    Field1: { type: String },
    Field2: { type: String },
    Value1: { type: String },
    Value2: { type: String },
    Price: { type: Number,required: true},
    Color: { type: String },
    productName: { type: String },
    subCategory: { type: String },
    category: { type: String },
    mainCategory: { type: String },
  },
  {
    timestamps: true,
  }
);

const SelectedLengthDetails = mongoose.model('SelectedDimensions', selectedLengthDetailsSchema);

module.exports = SelectedLengthDetails;
