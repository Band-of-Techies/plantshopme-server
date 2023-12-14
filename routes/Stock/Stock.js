const express = require('express');
const router = express.Router();
const AddProduct = require('../../models/AddProduct/AddProduct'); // Assuming your model is in the correct location

// Route to get product details where stock is less than 20
router.get('/getLowStockProducts', async (req, res) => {
  try {
    // Query the database to retrieve product details where stock is less than 20
    const products = await AddProduct.find({ stock: { $lt: 20 } }, 'title maincategory category subcategory price stock');

    res.status(200).json(products);
  } catch (error) {
    console.error('Error fetching low stock products:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Add this route in your Express backend
router.put('/updateProductStock/:productId', async (req, res) => {
    try {
      const { productId } = req.params;
      const { stock } = req.body;
  
      // Update the product's stock in the database
      const updatedProduct = await AddProduct.findByIdAndUpdate(
        productId,
        { stock },
        { new: true }
      );
  
      res.status(200).json(updatedProduct);
    } catch (error) {
      console.error('Error updating product stock:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  });

  // Route to get product details based on main category, category, and subcategory
router.get('/getProductDetails/:maincategory/:category/:subcategory', async (req, res) => {
    const { maincategory, category, subcategory } = req.params;
  
    try {
      // Query the database to retrieve the desired product details
      const products = await AddProduct.find(
        {
          maincategory,
          category,
          subcategory,
        },
        'title maincategory category subcategory price stock'
      );
  
      res.status(200).json(products);
    } catch (error) {
      console.error('Error fetching product details:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  });
  

module.exports = router;
