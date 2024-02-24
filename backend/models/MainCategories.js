const mongoose = require('mongoose');

const PhotoSchema = new mongoose.Schema({
  url: String,
  filename: String,

});

PhotoSchema.virtual('thumbnail').get(function () {
  return this.url.replace('/upload', '/upload/w_250');
});

const MainCategorySchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  photo: PhotoSchema,
});

module.exports = mongoose.model('MainCategory', MainCategorySchema);
