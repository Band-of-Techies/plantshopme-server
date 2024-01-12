const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const DimensiontagSchema = new Schema(
  {
    Dimension: { type: String, required: true },

    Status: { type: String},
  },
  
);

const DimensionTag = mongoose.model('Dimension', DimensiontagSchema);

module.exports = DimensionTag;
