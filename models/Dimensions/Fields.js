const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const Fieldschema = new Schema(
  {
    Field: { type: String, required: true },

   
  },
  
);

const Fields = mongoose.model('fie', Fieldschema);

module.exports = Fields;