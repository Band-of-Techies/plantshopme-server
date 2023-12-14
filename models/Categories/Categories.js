const mongoose = require('mongoose');

const categorySchema = new mongoose.Schema({
  name: {
    type: String,
    
  },
  parentCategory: {
    type: String,
    
  },
});

module.exports = mongoose.model('Category', categorySchema);
