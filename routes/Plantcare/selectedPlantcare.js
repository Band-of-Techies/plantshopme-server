const express = require('express');
const router = express.Router();
const selectedPlantCare = require('../../models/Plantcare/selectedPlantcare'); // Import your PlantCare model

// Route to insert new data with the conditions
router.post('/selectedPlantcare', async (req, res) => {
  try {
    const {
      title,
      careName,
      caredes,
      maincategory,
      category,
      subcategory,
      photo
    } = req.body;

    // Check if title is null or empty
    if (!title) {
      res.status(400).json({ error: 'Title cannot be null or empty.' });
      return;
    }

    // Check for an existing row with the same combination of title and careName
    const existingPlantCare = await selectedPlantCare.findOne({
      title,
      careName,
      subcategory,
    });

    if (existingPlantCare) {
      // If a row with the same title and careName exists, provide an error message
      res.status(400).json({ error: 'Duplicate data: A product with the same title and careName already exists in the database.' });
    } else {
      // If no row with the same title and careName is found, allow the insertion
      // Create a new PlantCare instance using the data from the request body
      const newPlantCare = new selectedPlantCare({
        title,
        careName,
        caredes,
        maincategory,
        category,
        subcategory,
        photo
      });

      // Save the new PlantCare instance to the database
      const savedPlantCare = await newPlantCare.save();

      // Send a response indicating success and the saved data
      res.status(201).json(savedPlantCare);
    }
  } catch (error) {
    // Handle other errors
    console.error(error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get Method..............................................................
router.get('/getselectedCarename/:title', async (req, res) => {
  try {
    const title = req.params.title;

    // Check if title is provided
    if (!title) {
      res.status(400).json({ message: 'Title parameter is required.' });
      return;
    }

    // Query the database for records that match the provided title
    const selectedCarenames = await selectedPlantCare.find({ title });

    // Check if records are found
    if (selectedCarenames.length === 0) {
      res.status(404).json({ message: 'No records found for the provided title.' });
    } else {
      res.json(selectedCarenames);
    }
  } catch (error) {
    console.error('Error fetching selectedCarenames:', error);
    res.status(500).json({ message: 'Internal server error', error: error.message });
  }
});

  //removing plantcare

  router.delete('/deleteselectedCarename/:title/:careName', async (req, res) => {
    try {
      const title = req.params.title;
   
      const careName = req.params.careName;
  
      // Delete the record that matches both subcategory and title
      const deletedCarename = await selectedPlantCare.deleteOne({title,careName });
  
      res.json({ message: 'SelectedCarenames deleted successfully', deletedCarename });
    } catch (error) {
      console.error('Error deleting selectedCarenames:', error);
      res.status(500).json({ message: 'Error deleting selectedCarenames.' });
    }
  });
  
  

  //Getting All List

  router.get('/getAllPlantCare', async (req, res) => {
    try {
      // Fetch all plant care entries from the database
      const plantCareList = await selectedPlantCare.find();
  
      res.status(200).json(plantCareList);
    } catch (error) {
      console.error('Error fetching plant care list:', error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  });

  router.get('/getPlantCareList/:title', async (req, res) => {
    try {
      const { title } = req.params;
  
      // Build the query based on the careName parameter
      const query = title ? { title: new RegExp(title, 'i') } : {};
  
      // Fetch plant care entries from the database based on the query
      const plantCareList = await selectedPlantCare.find(query);
  
      res.status(200).json(plantCareList);
    } catch (error) {
      console.error('Error fetching plant care list:', error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  });

  router.put('/updatePlantCareList/:id', async (req, res) => {
    try {
      const { careName, caredes } = req.body;
  
      // Find the plant care entry by ID
      const plantCare = await selectedPlantCare.findById(req.params.id);
  
      // Update care name and description
      plantCare.careName = careName;
      plantCare.caredes = caredes;
  
      // Save the updated plant care entry
      const updatedPlantCare = await plantCare.save();
  
      res.status(200).json(updatedPlantCare);
    } catch (error) {
      console.error('Error updating plant care entry:', error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  });
  

  router.delete('/deletePlantCare/:id', async (req, res) => {
    const { id } = req.params;
  
    try {
      // Log the received ID for debugging
      console.log('Received request to delete plant care item with ID:', id);
  
      // Fetch the plant care item
      const plantCareItem = await selectedPlantCare.findById(id);
  
      // Log the plantCareItem for debugging
      console.log('Plant Care Item:', plantCareItem);
  
      // Use deleteOne or deleteMany instead of remove
      await selectedPlantCare.deleteOne({ _id: id });
  
      // Respond with a success message
      res.status(200).json({ message: 'Plant care item deleted successfully' });
    } catch (error) {
      console.error('Error deleting plant care item:', error);
      res.status(500).json({ error: 'Internal server error', details: error.message });
    }
  });
  
  

module.exports = router;
