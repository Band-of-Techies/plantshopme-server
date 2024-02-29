const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const ColorsSchema = new Schema(
  {
    Color: { type: String, required: true },

   
  },
  
);

const Colors = mongoose.model('colors', ColorsSchema);

module.exports = Colors;