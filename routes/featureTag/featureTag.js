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
  

module.exports = router;
