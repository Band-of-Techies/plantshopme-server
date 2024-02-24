const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const LengthtagSchema = new Schema(
  {
    length: { type: String, required: true },

    price: { type: Number },
    currency: { type: String},
  },
  
);

const LengthTag = mongoose.model('Length', LengthtagSchema);

module.exports = LengthTag;
