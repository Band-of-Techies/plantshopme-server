const express = require('express');
const router = express.Router();
const Category = require('../../models/Categories/Categories'); // Import your Category model

// Route to add a new category
router.post('/addCategory', async (req, res) => {
  try {
    const { name, parentCategory } = req.body;

    // Check if the category already exists
    const existingCategory = await Category.findOne({ name });
    if (existingCategory) {
      return res.status(400).json({ message: 'Category already exists.' });
    }

    // Create a new category
    const category = new Category({ name, parentCategory });
    await category.save();

    res.status(201).json({ message: 'Category added successfully.' });
  } catch (error) {
    console.error('Error adding category:', error);
    res.status(500).json({ message: 'Error adding category.' });
  }
});

// Route to get categories by parent category
router.get('/getCategoriesByParent/:parentCategory', async (req, res) => {
  try {
    const parentCategory = req.params.parentCategory;
    const categories = await Category.find({ parentCategory });
    res.json(categories);
  } catch (error) {
    console.error('Error fetching categories:', error);
    res.status(500).json({ message: 'Error fetching categories.' });
  }
});



// Route to get categories by parent category or categories
router.get('/getCategoriesByParent', async (req, res) => {
  try {
    let parentCategories = req.query.parentCategories;

    // Ensure parentCategories is an array
    if (!Array.isArray(parentCategories)) {
      parentCategories = [parentCategories];
    }

    if (parentCategories.length === 0) {
      return res.status(400).json({ message: 'Invalid or missing parentCategories parameter.' });
    }

    const categories = await Category.find({ parentCategory: { $in: parentCategories } });
    res.json(categories);
  } catch (error) {
    console.error('Error fetching categories:', error);
    res.status(500).json({ message: 'Error fetching categories.' });
  }
});




// Route to update a category
router.put('/updateCategory/:id', async (req, res) => {
  try {
    const id = req.params.id;
    const { name, parentCategory } = req.body;

    const updatedCategory = await Category.findByIdAndUpdate(
      id,
      { name, parentCategory },
      { new: true } // To get the updated document
    );

    if (!updatedCategory) {
      return res.status(404).json({ message: 'Category not found.' });
    }

    res.json(updatedCategory);
  } catch (error) {
    console.error('Error updating category:', error);
    res.status(500).json({ message: 'Error updating category.' });
  }
});



router.delete('/deleteCategory/:id', async (req, res) => {
  try {
    const id = req.params.id;

    // Check if the category exists
    const category = await Category.findByIdAndDelete(id);

    if (!category) {
      return res.status(404).json({ message: 'Category not found.' });
    }

    res.json({ message: 'Category deleted successfully.' });
  } catch (error) {
    console.error('Error deleting category:', error);
    res.status(500).json({ message: 'Error deleting category.' });
  }
});




module.exports = router;
