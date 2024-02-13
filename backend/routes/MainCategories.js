const express = require('express');
const router = express.Router();
const MainCategory = require('../models/MainCategories');
const multer = require('multer');
const path = require('path');
const { storage } = require('../cloudinary/index')
const authenticateToken = require('./tokenGeneration');
// const storage = multer.diskStorage({
//   destination: (req, file, cb) => {
//     cb(null, 'Icon/'); // Make sure the 'Icon' directory exists
//   },
//   filename: (req, file, cb) => {
//     const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
//     const fileExtension = path.extname(file.originalname); // Get the file extension
//     cb(null, uniqueSuffix + fileExtension); // Append the extension to the filename
//   }
// });

const upload = multer({ storage: storage });

// Route to add a new MainCategory with image upload
// router.post('/addMainCategory', upload.single('image'), async (req, res) => {
//   console.log('triggered');
//   try {
//     const { name } = req.body;

//     // Check if a MainCategory with the same name already exists
//     const existingMainCategory = await MainCategory.findOne({ name });

//     if (existingMainCategory) {
//       // If a MainCategory with the same name exists, send an error response
//       return res.status(400).json({ error: 'MainCategory with this name already exists' });
//     }

//     // Get the file path of the uploaded image
//     const image = req.file ? req.file.path : null;

//     // Create a new MainCategory with the name and imagePath
//     const mainCategory = new MainCategory({
//       name: name,
//       photo: {
//         url: image,
//         filename: name
//       }
//     });

//     // Save the MainCategory to the database
//     await mainCategory.save();

//     res.status(201).json(mainCategory);
//   } catch (error) {
//     res.status(400).json({ error: error.message });
//   }
// });

router.post('/addMainCategory',authenticateToken, upload.single('image'), async (req, res) => {
  
  try {
    const { name } = req.body;

    // Check if a MainCategory with the same name already exists
    const existingMainCategory = await MainCategory.findOne({ name });

    if (existingMainCategory) {
      // If a MainCategory with the same name exists, send an error response
      return res.status(400).json({ error: 'MainCategory with this name already exists' });
    }

    // Check if the photo is present in the request
    if (!req.file) {
      
      return res.status(400).json({ error: "Photo is required" });
    }

    // Get the file path of the uploaded image
    const image = req.file.path;

    // Create a new MainCategory with the name and imagePath
    const mainCategory = new MainCategory({
      name: name,
      photo: {
        url: image,
        filename: name
      }
    });

    // Save the MainCategory to the database
    await mainCategory.save();

    res.status(201).json(mainCategory);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});


// Route to update an existing MainCategory
// router.put('/MainCategory/:MainCategoryId', async (req, res) => { // Corrected the route path
//   try {
//     const { MainCategoryId } = req.params;
//     const { name } = req.body;

//     // Find the MainCategory by ID and update its name
//     const mainCategory = await MainCategory.findByIdAndUpdate(MainCategoryId, { name }, { new: true });

//     if (!mainCategory) {
//       return res.status(404).json({ error: 'MainCategory not found' });
//     }

//     res.json(mainCategory);
//   } catch (error) {
//     res.status(400).json({ error: error.message });
//   }
// });

router.put('/MainCategory/:MainCategoryId', upload.single('photo'), async (req, res) => {
  try {
    const mainCategoryId = req.params.MainCategoryId;
    const mainCategory = await MainCategory.findById(mainCategoryId);

    if (!mainCategory) {
      return res.status(404).json({ message: 'MainCategory not found' });
    }

    // Update the name if provided in the request body
    if (req.body.name) {
      mainCategory.name = req.body.name;
    }

    // Update the photo if provided in the request file
    if (req.file) {
      const newPhoto = { url: req.file.path, filename: req.file.filename };
      // Update the existing photo with the new one
      mainCategory.photo = newPhoto;
    }

    // Save the updated MainCategory
    const updatedMainCategory = await mainCategory.save();

    res.status(200).json({ updatedMainCategory });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});





// Route to get all MainCategories
router.get('/getMainCategories', async (req, res) => { // Renamed the route
  try {
    // Retrieve all MainCategories from the database
    const mainCategories = await MainCategory.find();

    res.json(mainCategories);
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Route to delete a MainCategory
router.delete('/MainCategory/:MainCategoryId', async (req, res) => {
  try {
    const { MainCategoryId } = req.params;

    // Find the MainCategory by ID and remove it
    const deletedMainCategory = await MainCategory.findByIdAndRemove(MainCategoryId);

    if (!deletedMainCategory) {
      return res.status(404).json({ error: 'MainCategory not found' });
    }

    res.json({ message: 'MainCategory deleted successfully' });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});


module.exports = router;
