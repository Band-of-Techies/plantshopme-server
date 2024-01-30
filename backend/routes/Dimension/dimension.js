const express = require('express');
const router = express.Router();
const Dimension = require('../../models/Dimensions/dimensions'); // Assuming your model is in the correct path
const SelectedLengthDetails=require('../../models/Dimensions/Selecteddimension')

const Fields=require('../../models/Dimensions/Fields')
// Create a new length tag
router.post('/addDimensionTag', async (req, res) => {
  const { name, Status } = req.body; // Assuming you send the length tag name in the request body

  try {
    // Create a new Dimension instance
    const newDimensionTag = new Dimension({ Dimension: name, Status });

    // Save the new dimension tag to the database
    const savedDimensionTag = await newDimensionTag.save();

    res.status(201).json(savedDimensionTag);
  } catch (error) {
    console.error('Error adding Dimension tag:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get dimensions based on status
router.get('/getDimensionTags/:status', async (req, res) => {
  const { status } = req.params;

  try {
    // Fetch dimensions from the database based on the provided status
    const dimensionTags = await Dimension.find({ Status: status });

    res.status(200).json(dimensionTags);
  } catch (error) {
    console.error('Error fetching Dimensions tags:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

router.delete('/deletedimensions1/:id', async (req, res) => {
  const { id } = req.params;

  try {
    const deletedDimension = await Dimension.findByIdAndDelete(id);
    if (!deletedDimension) {
      return res.status(404).json({ error: 'Fields not found' });
    }
    res.json(deletedDimension);
  } catch (error) {
    res.status(500).json({ error: 'Internal Server Error' });
  }
});


router.delete('/deletedimensions/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const deletedDimension = await Fields.findByIdAndDelete(id);
    if (!deletedDimension) {
      return res.status(404).json({ error: 'Fields not found' });
    }
    res.json(deletedDimension);
  } catch (error) {
    res.status(500).json({ error: 'Internal Server Error' });
  }
});


router.get('/selectedDimensionsDetails/:productName', async (req, res) => {
  try {
    const productName = req.params.productName;

    // Check if productName is provided
    if (!productName) {
      res.status(400).json({ error: 'Product name is required.' });
      return;
    }


    // Find details based on the provided product name
    const lengthDetails = await SelectedLengthDetails.find({ productName });

   
  const result={
    _id:lengthDetails._id,
    productName:lengthDetails.productName,
    Field1:lengthDetails.Field1,
    Value1:lengthDetails.Value1,
    Field2:lengthDetails.Field2,
    Value2:lengthDetails.Value2,
    Price:lengthDetails.Price,
  }
    // Check if details are found
    if (lengthDetails.length === 0) {
      res.status(404).json({ error: 'No details found for the provided product name.' });
    } else {
      res.status(200).json(result);
    }
  } catch (error) {
    console.error('Error handling selectedDimensionsDetails:', error);
    res.status(500).json({ error: 'Internal server error', details: error.message });
  }
});



router.post('/selectedDimensionsDetails', async (req, res) => {
  try {
    const {
      Field1,
      Field2,
      Value1,
      Value2,
      Price,
      Color,
      
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

    // // Check for an existing length with the same combination of length and productName
    // const existingLengthDetails = await SelectedLengthDetails.findOne({
    //   Value1,
    //   Field1,
    //   Value2,
    //   Field2,
    //   Price,
    //   productName,
    //   subCategory,
    // });

    // if (existingLengthDetails) {
    //   // If a length with the same length and productName exists, provide an error message
    //   res.status(400).json({ error: 'Duplicate data: A product with the same Measure and productName already exists in the database.' });
    // } else {
      // If no length with the same length and productName is found, allow the insertion
      // Create a new SelectedLengthDetails instance using the data from the request body
      const newLengthDetails = new SelectedLengthDetails({
        Field1,
        Field2,
        Value1,
        Value2,
        Price,
        productName,
        subCategory,
        category,
        mainCategory,
        Color,
    
      });

      // Save the new SelectedLengthDetails instance to the database
      const savedLengthDetails = await newLengthDetails.save();

      // Send a response indicating success and the saved data
      res.status(201).json(savedLengthDetails);
    //}
  }  catch (error) {
  console.error('Error handling selectedDimensionsDetails:', error);
  res.status(500).json({ error: 'Internal server error', details: error.message });
}
});


router.get('/details-by-product/:productName', async (req, res) => {
  try {
    const productName = req.params.productName;
    const details = await SelectedLengthDetails.find({ productName });
    res.json(details);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

router.put('/update-by-id/:_id', async (req, res) => {
  try {
    const _id = req.params._id;
    const updatedDetails = req.body; // Assuming the updated details are sent in the request body
    const result = await SelectedLengthDetails.findByIdAndUpdate(_id, updatedDetails, { new: true });
    res.json(result);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});


router.delete('/delete-by-id/:id', async (req, res) => {
  try {
    const id = req.params.id;
    const result = await SelectedLengthDetails.deleteOne({ _id: id });
    res.json(result);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});



const Colors = require('../../models/Dimensions/colors'); // Adjust the path based on your project structure

// Route to insert a new color
router.post('/insertColor', async (req, res) => {
  try {
    const { color } = req.body; // Assuming the color value is passed in the request body

    // Validate that the required fields are present
    if (!color) {
      return res.status(400).json({ message: 'Color is required.' });
    }

    // Create a new Colors instance
    const newColor = new Colors({
      Color: color,
    });

    // Save the new color to the database
    const savedColor = await newColor.save();

    res.status(201).json(savedColor);
  } catch (error) {
    console.error('Error inserting color:', error);
    res.status(500).json({ message: 'Error inserting color.' });
  }
});


// Route to get all colors
router.get('/getAllColors', async (req, res) => {
  try {
    // Retrieve all colors from the database
    const allColors = await Colors.find();

    res.status(200).json(allColors);
  } catch (error) {
    console.error('Error fetching colors:', error);
    res.status(500).json({ message: 'Error fetching colors.' });
  }
});


// const Fields = require('../../models/Dimensions/Fields');


router.get('/getAllFields', async (req, res) => {
  try {
    // Retrieve all fields from the database
    const allFields = await Fields.find();

    res.status(200).json(allFields);
  } catch (error) {
    console.error('Error fetching fields:', error);
    res.status(500).json({ message: 'Error fetching fields.' });
  }
});


router.post('/insertField', async (req, res) => {
  try {
    const { field } = req.body; // Assuming the field value is passed in the request body

    // Validate that the required fields are present
    if (!field) {
      return res.status(400).json({ message: 'Field is required.' });
    }

    // Create a new Fields instance
    const newField = new Fields({
      Field: field,
    });

    // Save the new field to the database
    const savedField = await newField.save();

    res.status(201).json(savedField);
  } catch (error) {
    console.error('Error inserting field:', error);
    res.status(500).json({ message: 'Error inserting field.' });
  }
});

module.exports = router;
