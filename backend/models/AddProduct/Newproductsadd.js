const mongoose = require('mongoose');

const categorySchema = new mongoose.Schema({
    maincategory: [String],
    category: [String],
    subcategory: [String],
});

const Category = mongoose.model('newCategoryList', categorySchema);

module.exports = Category;
