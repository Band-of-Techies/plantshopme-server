// models/Plantcare.js
const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const PhotoSchema = new mongoose.Schema({  
  url:String,
  filename:String
})

const plantCareSchema = new Schema(
    {
      title: { type: String }, 
      careName: { type: String },
      caredes: { type: String },
      maincategory: { type: String },
      category: { type: String },
      subcategory: { type: String },
      photo: String,
    },
    {
      timestamps: true,
    }
  );

const PlantCare = mongoose.model('selectedPlantCare', plantCareSchema);

module.exports = PlantCare;
