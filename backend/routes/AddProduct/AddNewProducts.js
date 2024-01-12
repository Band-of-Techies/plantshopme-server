
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

  module.exports = router;