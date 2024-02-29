const mongoose = require('mongoose');

const Schema = mongoose.Schema;
const PhotoSchema = new mongoose.Schema({  
  url:String,
  filename:String
})
const plantCareSchema = new Schema(
  {
    name: { type: String, required: true },
    description: { type: String },
    photo: PhotoSchema,
  },
  {
    timestamps: true,
  }
);

const PlantCare = mongoose.model('PlantCare', plantCareSchema);

module.exports = PlantCare;
