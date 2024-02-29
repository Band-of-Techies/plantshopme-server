const express = require('express');
const router = express.Router();
const SubCategory = require('../../models/Categories/subCategories'); // Import the SubCategory model
const MainCategory = require('../../models/MainCategories');
const Categories = require('../../models/Categories/Categories')

// Route to create a new subcategory
router.post('/subCategory', async (req, res) => {
  try {
    const { name, Category, parentCategory } = req.body;

    // Create a new subcategory
    const subcategory = new SubCategory({
      name,
      Category,
      parentCategory,
    });

    // Save the subcategory to the database
    await subcategory.save();

    res.status(201).json({ message: 'Subcategory created successfully', subcategory });
  } catch (error) {
    console.error('Error creating subcategory:', error);
    res.status(500).json({ message: 'Error creating subcategory' });
  }
});

// Route to update a subcategory
router.put('/subCategory/:id', async (req, res) => {
  try {
    const { name } = req.body;
    const id = req.params.id;

    // Find the subcategory by ID and update its name
    await SubCategory.findByIdAndUpdate(id, { name });

    res.json({ message: 'Subcategory updated successfully' });
  } catch (error) {
    console.error('Error updating subcategory:', error);
    res.status(500).json({ message: 'Error updating subcategory' });
  }
});

// Route to delete a subcategory
router.delete('/subCategory2/:id', async (req, res) => {
  try {
    const id = req.params.id;

    // Find the subcategory by ID and delete it
    await SubCategory.findByIdAndDelete(id);

    res.json({ message: 'Subcategory deleted successfully' });
  } catch (error) {
    console.error('Error deleting subcategory:', error);
    res.status(500).json({ message: 'Error deleting subcategory' });
  }
});

// Route for fetching subcategories by parentCategory and Category
router.get('/getSubcategories/:parentCategory/:Category', async (req, res) => {
  try {
   const parentCategory = req.params.parentCategory;
  
    const Category = req.params.Category;

    // Query the database for subcategories that match both parentCategory and Category
    const subcategories = await SubCategory.find({parentCategory,Category });

    res.json(subcategories);
  } catch (error) {
    console.error('Error fetching subcategories:', error);
    res.status(500).json({ message: 'Error fetching subcategories.' });
  }
});


// router.get('/getSubCategoriesByParent', async (req, res) => {
//   try {
//     let parentCategory = req.query.parentCategory; // use req.query to get query parameters
//     let Category = req.query.Category;

//     // Ensure parentCategory is an array
//     if (!Array.isArray(parentCategory)) {
//       parentCategory = [parentCategory];
//     }

//     // Ensure Category is an array
//     if (!Array.isArray(Category)) {
//       Category = [Category];
//     }

//     if (parentCategory.length === 0 && Category.length === 0) {
//       return res.status(400).json({ message: 'Invalid or missing parameters.' });
//     }

//     const categories = await Category.find({ parentCategory: { $in: parentCategory }, Category: { $in: Category } });
//     res.json(categories);
//   } catch (error) {
//     console.error('Error fetching categories:', error);
//     res.status(500).json({ message: 'Error fetching categories.' });
//   }
// });


router.get('/getThirdCategoriesBySub', async (req, res) => {
  try {
    let subCategory  = req.query.subCategory;

    // Ensure parentCategories is an array
    if (!Array.isArray(subCategory )) {
      subCategory  = [subCategory];
    }

    if (subCategory.length === 0) {
      return res.status(400).json({ message: 'Invalid or missing parentCategories parameter.' });
    }

    const categories = await SubCategory.find({ Category : { $in: subCategory } });
    res.json(categories);
  } catch (error) {
    console.error('Error fetching categories:', error);
    res.status(500).json({ message: 'Error fetching categories.' });
  }
});



// Route for fetching Categories as a tree structure to pass frontend
router.get('/getAllSubCategories', async (req, res) => {
  try {
    const maincategory = await MainCategory.find({})
    // console.log(maincategory);
    const categories = await Categories.find({})
    // console.log(categories);
    const subcategories = await SubCategory.find({})
    // console.log(subcategories);
// Initialize an empty array for the final result
let idCounter = 99;

const result = [];
// Iterate through the maincategories array
maincategory.forEach(mainCat => {
  // Create a new node for the main category
  const mainCatNode = {
    name: mainCat.name,
    id: idCounter++,
    children: [],
    image: mainCat.photo
  };

  // Find categories that belong to this main category
  const relatedCategories = categories.filter(cat => cat.parentCategory === mainCat.name);

  // Iterate through the related categories
  relatedCategories.forEach(relatedCat => {
    // Create a new node for the category
    const relatedCatNode = {
      name: relatedCat.name,
      id: idCounter++,
      children: []
    };

    // Find subcategories that belong to this category
    const relatedSubcategories = subcategories.filter(subCat => subCat.Category === relatedCat.name);

    // Iterate through the related subcategories
    relatedSubcategories.forEach(relatedSubCat => {
      // Create a new node for the subcategory
      const relatedSubCatNode = {
        name: relatedSubCat.name,
        id: idCounter++
      };

      // Add the subcategory node to the category node
      relatedCatNode.children.push(relatedSubCatNode);
    });

    // Remove 'children' key if it's an empty array
    if (relatedCatNode.children.length === 0) {
      delete relatedCatNode.children;
    }

    // Add the category node to the main category node
    mainCatNode.children.push(relatedCatNode);
  });

  // Remove 'children' key if it's an empty array
  if (mainCatNode.children.length === 0) {
    delete mainCatNode.children;
  }

  // Add the main category node to the final result array
  result.push(mainCatNode);
});

// Send the result as JSON
    res.json(result);
  } catch (error) {
    console.error('Error fetching subcategories:', error);
    res.status(500).json({ message: 'Error fetching subcategories.' });
  }
});


module.exports = router;
