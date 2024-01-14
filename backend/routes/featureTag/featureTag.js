const express = require('express');
const router = express.Router();
const FeatureTag = require('../../models/FeatureTag/Featuretag'); // Assuming your model is in a 'models' directory

// Create a new feature name
router.post('/addFeature', async (req, res) => {
  const { name } = req.body; // Assuming you send the feature name in the request body

  try {
    // Create a new FeatureTag instance
    const newFeature = new FeatureTag({ name });

    // Save the new feature name to the database
    const savedFeature = await newFeature.save();

    res.status(201).json(savedFeature);
  } catch (error) {
    console.error('Error adding feature name:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

router.get('/getFeatures', async (req, res) => {
    try {
      // Fetch all feature names from the database
      const features = await FeatureTag.find();
  
      res.status(200).json(features);
    } catch (error) {
      console.error('Error fetching feature names:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  });
  



// Route to update the level based on _id
// router.put('/updateFeatureLevel/:id', async (req, res) => {
//   const { id } = req.params;
//   const { level } = req.body;

//   try {
//     // Find the document by _id
//     const feature = await FeaturTag.findById(id);

//     if (!feature) {
//       return res.status(404).json({ error: 'Feature not found' });
//     }

//     // Update the level with the provided value
//     feature.level = String(level);

//     // Save the updated document
//     await feature.save();

//     res.json({ message: 'Feature level updated successfully', feature });
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ error: 'Internal Server Error' });
//   }
// });


router.put('/updateFeatureLevel/:id', async (req, res) => {
  const { id } = req.params;
  const { level } = req.body;
console.log(req.body);
  try {

    const existingLocation = await FeatureTag.findById(id);
    if (!existingLocation) {
      return res.status(404).json({ error: 'Feature not found' });
    }

    existingLocation.level = level;
   
    
    const updatedLocation = await existingLocation.save();
    console.log(updatedLocation);
    res.status(200).json(updatedLocation);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal server error' });
  }
});


module.exports = router;
