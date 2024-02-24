const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const LengthtagSchema = new Schema(
  {
    name: { type: String, required: true },

    price: { type: Number },
    currency: { type: String},
  },
  
);

const LengthTag = mongoose.model('PotLength', LengthtagSchema);

module.exports = LengthTag;