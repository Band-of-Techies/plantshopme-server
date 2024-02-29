const express = require('express');
const router = express.Router();
const SelectedLengthDetails = require('../../models/PlantLength/SelectedLength');

// Route to insert new length details with the conditions
router.post('/selectedLengthDetails', async (req, res) => {
  try {
    const {
      length,
      price,
      currency,
      productName,
      subCategory,
      category,
      mainCategory,
    } = req.body;

    // Check if length is null or empty
     // Check if title is null or empty
     if (!productName) {
        res.status(400).json({ error: 'Title cannot be null or empty.' });
        return;
      }
    if (!length) {
      res.status(400).json({ error: 'Length cannot be null or empty.' });
      return;
    }

    // Check for an existing length with the same combination of length and productName
    const existingLengthDetails = await SelectedLengthDetails.findOne({
      length,
      productName,
      subCategory,
    });

    if (existingLengthDetails) {
      // If a length with the same length and productName exists, provide an error message
      res.status(400).json({ error: 'Duplicate data: A product with the same length and productName already exists in the database.' });
    } else {
      // If no length with the same length and productName is found, allow the insertion
      // Create a new SelectedLengthDetails instance using the data from the request body
      const newLengthDetails = new SelectedLengthDetails({
        length,
        price,
        currency,
        productName,
        subCategory,
        category,
        mainCategory,
      });

      // Save the new SelectedLengthDetails instance to the database
      const savedLengthDetails = await newLengthDetails.save();

      // Send a response indicating success and the saved data
      res.status(201).json(savedLengthDetails);
    }
  } catch (error) {
    // Handle other errors
    console.error(error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get Method
router.get('/getSelectedLengthDetails/:subCategory/:productName', async (req, res) => {
    try {
      const productName = req.params.productName;
      const subCategory = req.params.subCategory;
  
     
  
      // Query the database for records that match both productName and subCategory
      const selectedLengthDetails = await SelectedLengthDetails.find({ productName, subCategory });
  
      res.json(selectedLengthDetails);
    } catch (error) {
      console.error('Error fetching selected length details:', error);
      res.status(500).json({ message: 'Error fetching selected length details.' });
    }
  });

  
  

// Deleting length details
router.delete('/deleteSelectedLengthDetails/:subCategory/:length/:productName', async (req, res) => {
  try {
    const length = req.params.length;
    const subCategory = req.params.subCategory;
    const productName = req.params.productName;

    // Delete the record that matches both subCategory and length
    const deletedLengthDetails = await SelectedLengthDetails.deleteOne({ subCategory, length, productName });

    res.json({ message: 'Selected length details deleted successfully', deletedLengthDetails });
  } catch (error) {
    console.error('Error deleting selected length details:', error);
    res.status(500).json({ message: 'Error deleting selected length details.' });
  }
});

// Getting All List
router.get('/getAllSelectedLengthDetails', async (req, res) => {
  try {
    // Fetch all selected length details from the database
    const lengthDetailsList = await SelectedLengthDetails.find();

    res.status(200).json(lengthDetailsList);
  } catch (error) {
    console.error('Error fetching selected length details list:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

router.put('/updateLengthAndPrice/:id', async (req, res) => {
  try {
    const { length, price } = req.body;

    // Validate input
    if (!length || !price) {
      return res.status(400).json({ error: 'Length and price are required' });
    }


    const updatedDetails = await SelectedLengthDetails.findByIdAndUpdate(
      req.params.id,
      { length, price },
      { new: true } 
    );

    if (!updatedDetails) {
      return res.status(404).json({ error: 'SelectedLengthDetails not found' });
    }

    // Send the updated details as a response
    res.json(updatedDetails);
  } catch (error) {
    console.error('Error updating length and price:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

router.get('/getLengthAndPrice/:title', async (req, res) => {
  try {
    const { title } = req.params;

    // Build the query based on the careName parameter
    const query = title ? { productName: new RegExp(title, 'i') } : {};

    // Fetch plant care entries from the database based on the query
    const plantCareList = await SelectedLengthDetails.find(query);

    res.status(200).json(plantCareList);
  } catch (error) {
    console.error('Error fetching plant care list:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});


// router.delete('/deleteLengthAndPrice/:id', async (req, res) => {
//   const { id } = req.params;

//   try {
//     // Find the length and price entry by ID
//     const lengthAndPriceEntry = await SelectedLengthDetails.findById(id);

//     // Check if the length and price entry exists
//     if (!lengthAndPriceEntry) {
//       return res.status(404).json({ error: 'Length and price entry not found' });
//     }

//     // Remove the length and price entry from the database
//     await lengthAndPriceEntry.remove();

//     // Respond with a success message
//     res.status(200).json({ message: 'Length and price entry deleted successfully' });
//   } catch (error) {
//     console.error('Error deleting length and price entry:', error);
//     res.status(500).json({ error: 'Internal server error', details: error.message });
//   }
// });

router.delete('/deleteLengthAndPrice/:id', async (req, res) => {
  const { id } = req.params;

  try {
    // Log the received ID for debugging
    console.log('Received request to delete plant care item with ID:', id);

    // Fetch the plant care item
    const plantCareItem = await SelectedLengthDetails.findById(id);

    // Log the plantCareItem for debugging
    console.log('length Item:', plantCareItem);

    // Use deleteOne or deleteMany instead of remove
    await SelectedLengthDetails.deleteOne({ _id: id });

    // Respond with a success message
    res.status(200).json({ message: 'length item deleted successfully' });
  } catch (error) {
    console.error('Error deleting length item:', error);
    res.status(500).json({ error: 'Internal server error', details: error.message });
  }
});


module.exports = router;
