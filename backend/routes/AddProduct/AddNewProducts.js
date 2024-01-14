
const express = require('express');
const router = express.Router();
const Category  = require('../../models/AddProduct/Newproductsadd'); // Import your Category model

router.post('/submitCategories', async (req, res) => {
  const { maincategory, category, subcategory } = req.body;

  try {
    const newCategories = new Category({
      maincategory,
      category,
      subcategory,
    });

    const insertedCategories = await newCategories.save();

    res.json({ success: true, insertedCategories });
  } catch (error) {
    console.error('Error inserting categories to the database:', error);
    res.status(500).json({ success: false, error: 'Internal Server Error' });
  }
});


const Product = require('../../models/AddProduct/AddProduct'); // Adjust the path as needed

router.get('/getProductDetails', async (req, res) => {
  try {
    const { productName, SKU } = req.query;

    if (!productName && !SKU) {
      return res.status(400).json({ error: 'Either productName or SKU should be provided' });
    }

    // Find the product based on productName and SKU
    let product;

    if (productName && SKU) {
      // If both productName and SKU are provided, prioritize by both
      product = await Product.findOne({
        title: { $regex: new RegExp(productName, 'i') },
        SKU: { $regex: new RegExp(SKU, 'i') },
      });
    } else {
      // If either productName or SKU is provided, find the product
      const query = productName
        ? { title: { $regex: new RegExp(productName, 'i') } }
        : { SKU: { $regex: new RegExp(SKU, 'i') } };

      product = await Product.findOne(query);
    }

    if (!product) {
      return res.status(404).json({ error: 'Product not found' });
    }

    // Extract the desired fields
    const { _id, title, maincategory, category, subcategory } = product;

    // Send the extracted data in the response
    res.status(200).json({ _id, title, maincategory, category, subcategory });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal server error' });
  }
});



router.put('/updateCategories/:productId', async (req, res) => {
  try {
    const productId = req.params.productId;
    const { maincategory, category, subcategory } = req.body; // Updated the variable names

    // Find the document by _id
    const product = await Product.findById(productId);

    // Check if the product exists
    if (!product) {
      return res.status(404).json({ error: 'Product not found' });
    }

    // Update the fields
    if (maincategory) {
      product.maincategory = maincategory;
    }

    if (category) {
      product.category = category;
    }

    if (subcategory) {
      product.subcategory = subcategory;
    }

    // Save the changes
    await product.save();

    return res.json({ message: 'Product categories updated successfully' });
  } catch (error) {
    console.error('Error updating product categories:', error.message);
    return res.status(500).json({ error: 'Internal server error' });
  }
});








  module.exports = router;