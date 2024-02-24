const express = require('express');
const router = express.Router();
const Length = require('../../models/PlantLength/Length'); // Assuming your model is in the correct path

// Create a new length tag
router.post('/addLengthTag', async (req, res) => {
  const { name,price,currency} = req.body; // Assuming you send the length tag name in the request body
  
  try {
    // Create a new LengthTag instance
    const newLengthTag = new Length({ length:name,price,currency });

    // Save the new length tag name to the database
    const savedLengthTag = await newLengthTag.save();

    res.status(201).json(savedLengthTag);
  } catch (error) {
    console.error('Error adding length tag:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get all length tags
router.get('/getLengthTags', async (req, res) => {
  try {
    // Fetch all length tags from the database
    const lengthTags = await Length.find();

    res.status(200).json(lengthTags);
  } catch (error) {
    console.error('Error fetching length tags:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

module.exports = router;
