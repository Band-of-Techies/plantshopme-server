
const express = require('express');
const router = express.Router();
const PlantCare = require('../../models/Plantcare/plantcare'); // Import the PlantCare model
const multer = require('multer');
const path = require('path');
const { storage } = require('../../cloudinary/index')
// const storage = multer.diskStorage({
//   destination: (req, file, cb) => {
//     cb(null, 'Image/'); // Make sure the 'Image' directory exists
//   },
//   filename: (req, file, cb) => {
//     const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
//     const fileExtension = path.extname(file.originalname); // Get the file extension
//     cb(null, uniqueSuffix + fileExtension); // Append the extension to the filename
//   }
// });

const upload = multer({ storage: storage });

// Define your route for adding plant care data
// router.post('/addPlantcare', upload.single('image'), async (req, res) => {
//   try {
//     // const image = req.file.filename; 
//     const image = req.file ? req.file.path : null;
//     // Create a new PlantCare document
//     const newPlantcare = new PlantCare({
//       name: req.body.name, 
//       description: req.body.description, 
//       photo: {
//         url: image,
//         filename: req.body.name
//       }
//     });
   
//     const savedPlantcare = await newPlantcare.save();


//     res.status(200).json(savedPlantcare);
//   } catch (err) {
    
//     res.status(500).json({ error: err.message });
//   }
// });
// Route to get all PlantCare names for a dropdown list
router.get('/getPlantcareNames', async (req, res) => {
    try {
    
      const plantcareNames = await PlantCare.find({}, 'name');
  
      
      const names = plantcareNames.map((plantcare) => plantcare.name);
  
      res.status(200).json(names);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  });
  router.get('/getPlantcare/:plantcarename', async (req, res) => {
    const { plantcarename } = req.params;
  
    try {
      // Find the PlantCare document by name
      const plantcareData = await PlantCare.findOne({ name: plantcarename });
    
      if (!plantcareData) {
        return res.status(404).json({ error: 'PlantCare not found' });
      }
  
      // Extract the image name and description
      const { name, description, photo } = plantcareData;
  
      // Assuming you want to include the full image URL
      const imageURL = photo.url;
  
      res.status(200).json({ name, description, image: imageURL });
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  });
  
  
  // router.put('/updatePlantcare/:name', upload.single('image'), async (req, res) => {
  //   try {
  //     const updatedFields = {
  //       name: req.body.name,
  //       description: req.body.description,
  //     };
  
  //     if (req.file) {
  //       updatedFields.image = req.file.filename;
  //     }
  
  //     // Update the PlantCare item based on the provided name
  //     const updatedItem = await PlantCare.findOneAndUpdate(
  //       { name: req.params.name }, // Find by name
  //       { $set: updatedFields }, // Update fields
  //       { new: true } // Get the updated document
  //     );
  
  //     if (!updatedItem) {
  //       return res.status(404).json({ message: 'PlantCare not found' });
  //     }
  
  //     res.status(200).json(updatedItem);
  //   } catch (err) {
  //     res.status(500).json({ error: err.message });
  //   }
  // });
  

 

module.exports = router;
