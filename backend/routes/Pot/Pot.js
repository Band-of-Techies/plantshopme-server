const express = require('express');
const router = express.Router();
const Pot = require('../../models/Pot/Pot'); 
const multer = require('multer');
const path = require('path');

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'Image/'); 
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    const fileExtension = path.extname(file.originalname); // 
    cb(null, uniqueSuffix + fileExtension);
  }
});

const upload = multer({ storage: storage });

// Define your route for adding plant care data
router.post('/addPot', upload.array('photos', 10), async (req, res) => {
  try {
    const images = req.files.map((file) => file.filename); // Get an array of uploaded image filenames


    // Create a new Pot document
    const newPot = new Pot({
      name: req.query.name, 
      price: req.query.price, 
      Currency: req.query.Currency,
      potstock: req.query.potstock,
      image: images,
      lengthPrice:req.query.lengthPrice
       // Wrap image filename in an array
    });

    const savedPot = await newPot.save();

    res.status(200).json(savedPot);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Define your route for getting Pot information by ID
router.get('/getPot/:Potname', async (req, res) => {
  const { Potname } = req.params;
  try {
    // Retrieve the Pot based on the provided name
    const pot = await Pot.findOne({ name: Potname });

    if (!pot) {
      // If Pot is not found, return a 404 response
      return res.status(404).json({ message: 'Pot not found' });
    }

    const { name, price, Currency,potstock ,lengthPrice} = pot;

   

    // Return Pot data including image URL
    res.status(200).json({ name, price, Currency,potstock,lengthPrice });
  } catch (err) {
    // Handle any errors and return an error response
    res.status(500).json({ error: err.message });
  }
});

 // Define your route for listing all Pot data
router.get('/listAllPots', async (req, res) => {
    try {
      // Retrieve all Pot documents from the database
      const pots = await Pot.find();
  
      // Return the list of Pot documents as a JSON response
      res.status(200).json(pots);


    } catch (err) {
      // Handle any errors and return an error response
      res.status(500).json({ error: err.message });
    }
  });


  // Define your route for fetching images related to a Pot by name
router.get('/getPotImages/:Potname', async (req, res) => {
  const { Potname } = req.params;
  try {
    // Retrieve the Pot based on the provided name
    const pot = await Pot.findOne({ name: Potname });

    if (!pot) {
      // If Pot is not found, return a 404 response
      return res.status(404).json({ message: 'Pot not found' });
    }

    const { image } = pot;

    // Assuming you want to include the full image URLs for all images
    const imageURLs = image.map((filename) => `http://localhost:5000/api/Image/${filename}`);

    // Return image URLs related to the Pot
    res.status(200).json({ images: imageURLs });
  } catch (err) {
    // Handle any errors and return an error response
    res.status(500).json({ error: err.message });
  }
});


// Update a Pot by ID
router.put('/updatePot/:name', upload.single('image'), async (req, res) => {
  try {
    const updatedFields = {
      name: req.body.name,
      price: req.body.price,
      Currency: req.body.Currency,
      potstock: req.body.potstock,
      lengthPrice: req.body.lengthPrice // Assuming lengthPrice is an array of objects with length and price properties
    };

    if (req.file) {
      updatedFields.image = req.file.filename;
    }

    // Update the Pot item based on the provided name
    const updatedItem = await Pot.findOneAndUpdate(
      { name: req.params.name }, // Find by name
      { $set: updatedFields }, // Update fields
      { new: true } // Get the updated document
    );

    if (!updatedItem) {
      return res.status(404).json({ message: 'Pot not found' });
    }

    res.status(200).json(updatedItem);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});



// Update images for a Pot by name
// Update images for a Pot by ID
router.put('/updatePotImage/:Potname/:imageIndex', upload.single('image'), async (req, res) => {
  try {
    const { Potname, imageIndex } = req.params;

    // Retrieve the Pot based on the provided name
    const pot = await Pot.findOne({ name: Potname });

    if (!pot) {
      // If Pot is not found, return a 404 response
      return res.status(404).json({ message: 'Pot not found' });
    }

    // Handle the uploaded image and update the Pot's image at the specified index
    if (req.file) {
      const newImage = req.file.filename;
      const { image } = pot;

      if (image && image.length > imageIndex) {
        image[imageIndex] = newImage;
        await pot.save();
      } else {
        return res.status(404).json({ message: 'Image not found' });
      }
    } else {
      return res.status(400).json({ message: 'No image uploaded' });
    }

    res.status(200).json(pot);
  } catch (err) {
    // Handle any errors and return an error response
    res.status(500).json({ error: err.message });
  }
});



  

module.exports = router;
