const express = require('express');
const router = express.Router();
const FlashSale = require('../../models/FlashSale/FlashSales');
const Product = require('../../models/AddProduct/AddProduct');
const Pot = require('../../models/Pot/Pot')
const SelectedLengthDetails = require('../../models/PlantLength/SelectedLength')
const moment = require('moment-timezone');
const { DateTime } = require("luxon");
const SelectedDimensions = require('../../models/Dimensions/Selecteddimension')

// Route to handle GET requests to retrieve details from all rows in FlashSales in to admin side
router.get('/getFlashSalesDetails', async (req, res) => {
  try {
    const flashSales = await FlashSale.find();

    // Create an array to store flash sales with product details
    const flashSalesWithProductDetails = [];

    // Iterate through flash sales and fetch corresponding product details
    for (const flashSale of flashSales) {
      const product = await Product.findOne({ _id: flashSale.ProductId })
        .select('stock price length'); // Select specific fields from AddProduct model

      // If the product with matching ID is found, add it to the response
      if (product) {
        const flashSaleWithProduct = {
          flashSale: flashSale.toObject(), // Convert to plain JavaScript object if needed
          product: product.toObject(), // Convert to plain JavaScript object if needed
        };
        flashSalesWithProductDetails.push(flashSaleWithProduct);
      }
    }

    res.status(200).json(flashSalesWithProductDetails);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
});


// Route to handle GET requests to retrieve details from all rows in FlashSales in to customer side
router.get('/getFlashSalesInfo', async (req, res) => {
  try {
    const flashSales = await FlashSale.find();

    const flashSalesWithProductDetails = [];

    const currentTime = new Date();

    const checkFlashState = (startDate, timeInHours, offerPercentage, startTime) => {
      const startDateMoment = moment.tz(startDate, 'YYYY-MM-DD', 'Asia/Dubai');
    
      const startTimeMoment = moment.tz(startTime, 'HH:mm', 'Asia/Dubai');
    
      const startDateTime = startDateMoment.set({
        hour: startTimeMoment.get('hour'),
        minute: startTimeMoment.get('minute'),
      });
    
      const endDateTime = startDateTime.clone().add(timeInHours, 'hours');
    
      
      const currentTimeDubai = moment().tz('Asia/Dubai');
    
      const isActive = currentTimeDubai >= startDateTime && currentTimeDubai <= endDateTime;
    
      return {
        isActive,
        offerPercentage,
        startDateTime: startDateTime.isValid() ? startDateTime.format() : 'Invalid date',
        endDateTime: endDateTime.isValid() ? endDateTime.format() : 'Invalid date',
        currentTimeDubai: currentTimeDubai.format(),
        
      };
    };
    

    for (const flashSale of flashSales) {
      const product = await Product.findOne({ _id: flashSale.ProductId });

      if (product) {
        // console.log('StartDate:',flashSale.StartDate,'TimeInHours,:', flashSale.TimeInHours,'OfferPercentage:', flashSale.
        // OfferPercentage,'StartTime', flashSale.StartTime);

        const flashState = checkFlashState(flashSale.StartDate, flashSale.TimeInHours, flashSale.
          OfferPercentage, flashSale.StartTime);

        // console.log(flashState)

        if (flashState.isActive) {
 
          const dimensions = await SelectedDimensions.find({productName: product.title })

          const flashSaleWithProduct = {
            ...flashSale.toObject(),
            dimensions:dimensions,
            FeatureTag: product.FeatureTag,
            careName: product.careName,
            careType: product.careType,
            caredes: product.caredes,
            category: product.category,
            createdAt: product.createdAt,
            currency: product.currency,
            length: product.length,
            maincategory: product.maincategory,
            photos: product.photos,
            price: product.price,
            stock: product.stock,
            subcategory: product.subcategory,
            // Add other properties as needed
          };

          flashSalesWithProductDetails.push(flashSaleWithProduct);
        }
      }
    }

    res.json(flashSalesWithProductDetails);
  } catch (err) {
    console.error(err);
    res.status(500).send('Server Error');
  }
});


// Route to handle POST requests to create a new flash sale
router.post('/flash-sales', async (req, res) => {
  try {
    const {
      ProductId,
      ProductName,
      SubCategory,
      OfferPercentage,
      TimeInHours,
      StartTime,
      StartDate
    } = req.body;
  
    
    const newFlashSale = new FlashSale({
      ProductId,
      ProductName,
      SubCategory,
      OfferPercentage,
      TimeInHours,
      StartTime,
      StartDate
    });

    
    await newFlashSale.save();

    res.status(201).json(newFlashSale); 
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});


// Route to handle GET requests to retrieve all flash sales
router.get('/flash-sales', async (req, res) => {
    try {
      const flashSales = await FlashSale.find();
      res.status(200).json(flashSales);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  });

  // Route to handle DELETE requests to delete a flash sale by ID
router.delete('/flash-sales/:id', async (req, res) => {
    const { id } = req.params;
  
    try {
      const deletedFlashSale = await FlashSale.findByIdAndDelete(id);
  
      if (!deletedFlashSale) {
        return res.status(404).json({ error: 'Flash sale not found' });
      }
  
      res.status(200).json({ message: 'Flash sale deleted successfully' });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  });
  

  router.put('/flash-sales/:id', async (req, res) => {
    const { id } = req.params;
    const {
      ProductId,
      ProductName,
      SubCategory,
      OfferPercentage,
      TimeInHours,
      StartTime,
      StartDate
    } = req.body;
  
    try {
      const updatedFlashSale = await FlashSale.findByIdAndUpdate(
        id,
        {
          ProductId,
          ProductName,
          SubCategory,
          OfferPercentage,
          TimeInHours,
          StartTime,
          StartDate
        },
        { new: true }
      );
  
      if (!updatedFlashSale) {
        return res.status(404).json({ error: 'Flash sale not found' });
      }
  
      // Check if StartDate and StartTime are updated and not null
      if (StartDate && StartTime) {
        // Update the Status to "Unlimited"
        updatedFlashSale.Status = 'Flash Sale';
        await updatedFlashSale.save();
      }
  
      res.status(200).json(updatedFlashSale);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  });
  

module.exports = router;
