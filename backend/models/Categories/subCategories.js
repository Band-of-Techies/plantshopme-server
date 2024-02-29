const mongoose = require('mongoose');

const subcategorySchema = new mongoose.Schema({
  name: {
    type: String,
    
  },
  Category: {
    type: String,
    
  },
  parentCategory: {
    type: String,
    
  },
});

module.exports = mongoose.model('subCategory', subcategorySchema);
