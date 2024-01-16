const express = require('express');
const router = express.Router();
const Product = require('../../models/AddProduct/AddProduct');
const multer = require('multer');
const path = require('path');
const selectedPlantCare = require('../../models/Plantcare/selectedPlantcare');
const SelectedLengthDetails = require('../../models/PlantLength/SelectedLength')
const PlantCare = require('../../models/Plantcare/plantcare')
const Pot = require('../../models/Pot/Pot')
const Length = require('../../models/PlantLength/Length');
const Review = require('../../models/Review')
const { User} = require("../../models/Token/customer");
const FlashSale =  require("../../models/FlashSale/FlashSales")  
const { storage } = require('../../cloudinary/index')
const checkFlashState = require('../../utils/checkFlashState')
const SelectedDimensions = require('../../models/Dimensions/Selecteddimension')

const upload = multer({ storage: storage });

// Define route for adding product details
router.post('/addProduct',  upload.fields([
  { name: 'photos', maxCount: 10 },
  
]), async (req, res) => {
  try {


    const images = req.files['photos'].map((file) => file.filename); // Get an array of uploaded image filenames
    
    // Create a new Product document
    const newProduct = new Product({
      title: req.query.title, // Get the product title from the query parameter
      maincategory: req.query.maincategory,
      category: req.query.category,
      subcategory: req.query.subcategory,
      stock: req.query.stock,
      description: req.query.description,
      photos: req.files['photos'].map(f => ({ url: f.path, filename: f.filename })),
      FeatureTag: req.query.FeatureTag, // Get the FeatureTag array from the query parameter
      length: req.query.length,
      Pots: req.query.Pots,
      careType: req.query.careType,
      careName: req.query.careName,
      caredes: req.query.caredes,
      price: req.query.price,
      currency: req.query.currency,
      scienticName:req.query.scienticName,
      ptype:req.query.ptype,
    });
   
    const savedProduct = await newProduct.save();

    res.status(200).json(savedProduct);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});



//Other Product adding

router.post('/addOtherProduct',  upload.fields([
  { name: 'photos', maxCount: 10 },
  
]), async (req, res) => {
  try {


    const images = req.files['photos'].map((file) => file.filename); // Get an array of uploaded image filenames
    
    // Create a new Product document
    const newProduct = new Product({
      title: req.query.title, // Get the product title from the query parameter
      maincategory: req.query.maincategory,
      Mdiscription:req.query.Mdiscription,
      Mname:req.query.Mname,
      category: req.query.category,
      subcategory: req.query.subcategory,
      stock: req.query.stock,
      description: req.query.description,
      photos: req.files['photos'].map(f => ({ url: f.path, filename: f.filename })),
      FeatureTag: req.query.FeatureTag, // Get the FeatureTag array from the query parameter
      length: req.query.length,
      Pots: req.query.Pots,
      careType: req.query.careType,
      careName: req.query.careName,
      caredes: req.query.caredes,
      price: req.query.price,
      currency: req.query.currency,
      scienticName:req.query.scienticName,
      impdescription:req.query.impdescription,
      ptype:'Other Product',
    });
   
    const savedProduct = await newProduct.save();

    res.status(200).json(savedProduct);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});


//fetch all products based on the all the parameters which is called by the frontend
router.get('/getAllProducts', async (req, res) => {
  const { search, maincategory, category, subcategory, sort, FeatureTag, max_price, min_price } = req.query;
  console.log(FeatureTag);
  let queryArray = [];
  
  if (maincategory && maincategory !== 'all' && (!category || category === 'all') && (!subcategory || subcategory === 'all')) {
    const mainCategoryArray = maincategory.split(',');
    queryArray.push({ maincategory: { $in: mainCategoryArray } });
  }
  
  if (category && category !== 'all') {
    const categoryArray = category.split(',');
    queryArray.push({ category: { $in: categoryArray } });
  }
  
  if (subcategory && subcategory !== 'all') {
    const subCategoryArray = subcategory.split(',');
    queryArray.push({ subcategory: { $in: subCategoryArray } });
  }
  if (FeatureTag && FeatureTag !== 'all') {
    const FeatureTagArray = FeatureTag.split(',');
    queryArray.push({ FeatureTag: { $in: FeatureTagArray } });
  }
  
  
  let queryObject = {};
  if (queryArray.length > 0) {
    queryObject = { $or: queryArray };
  }
  
  if (search) {
    queryObject.$or = [
      { title: { $regex: search, $options: 'i' } },
      { description: { $regex: search, $options: 'i' } },
      { SKU: { $regex: search, $options: 'i' } },
      { scienticName: { $regex: search, $options: 'i' } },
      // { FeatureTag: { $regex: search, $options: 'i' } },

    ];
  }
  
  
  let result = Product.find(queryObject);

  const page = Number(req.query.page) || 1;
  const limit = Number(req.query.limit) || 20;
  const skip = (page - 1) * limit;

  result = result.skip(skip).limit(limit);

  let products = await result;

  // Fetch FlashSale data and merge it into the products
  const productIds = products.map((product) => product._id);
  const flashSaleData = await FlashSale.find({ ProductId: { $in: productIds } });

  // Fetch 'pots' and 'allLengths' data for each product
  products = await Promise.all(
    products.map(async (product) => {
      const flashSaleInfo = flashSaleData.find(
        (flashSale) => flashSale.ProductId.toString() === product._id.toString()
      );
      const dimensions = await SelectedDimensions.find({productName: product.title })
  
      // Check if the flash sale is still active
      let flashState= false
      let isFlashSaleActive = false;
      if (flashSaleInfo) {
        
        let state = checkFlashState(flashSaleInfo.StartDate, flashSaleInfo.TimeInHours,flashSaleInfo.OfferPercentage,flashSaleInfo.StartTime);
        flashState=state.isActive
      }

      // Find the lowest price among the dimensions
      let lowestPrice = Math.min(...dimensions.map(dimension => parseFloat(dimension.Price)));

      return {
        ...product._doc,
        dimensions,
        price: lowestPrice,
        flashSaleInfo:
          flashSaleInfo && (flashSaleInfo.Status === 'Unlimited' || flashState)
            ? {
                ...flashSaleInfo.toObject(),
                Status: flashSaleInfo.Status || 'Unlimited',
              }
            : null,
      };
      
    })
  );

  // Now you can filter and sort the products based on the price
  if (max_price && min_price) {
    products = products.filter(product => product.price >= parseFloat(min_price) && product.price <= parseFloat(max_price));
  }

  if (sort === 'price-lowest') {
    products.sort((a, b) => a.price - b.price);
  }
  if (sort === 'price-highest') {
    products.sort((a, b) => b.price - a.price);
  }
  if (sort === 'latest') {
    products.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
  }
  if (sort === 'oldest') {
    products.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));
  }
  if (sort === 'a-z') {
    products.sort((a, b) => a.title.localeCompare(b.title));
  }
  if (sort === 'z-a') {
    products.sort((a, b) => b.title.localeCompare(a.title));
  }

  const totalProducts = await Product.countDocuments(queryObject);
  const numOfPages = Math.ceil(totalProducts / limit);

  res.json({ products: products, totalProducts, numOfPages });
});




router.get('/getAllProducts/all-cart-items', async (req, res) => {
  const { id } = req.params;
})


//get single product
// router.get('/getSingleProduct/:id', async (req, res) => {
//   try {
//     const { id: productId } = req.params;
//     const product = await Product.findOne({ _id: productId });

//     if (product) {
//       const selectedPlantCares = await selectedPlantCare.find({ title: product.title });
//       const Allplantcares = await PlantCare.find();
      
//        const selectedPlantCaresWithImage = selectedPlantCares.map(selectedCare => {
//         const image = Allplantcares.find(plantCare => plantCare.name === selectedCare.careName)?.image;
//         return { ...selectedCare.toObject(), image };
//     });


//       // console.log(Allplantcares,selectedPlantCares);
//       const pots = await Pot.find({ name: { $in: product.Pots } });
//       const allLengths = await SelectedLengthDetails.find({ productName: product.title });
//       const reviews = await Review.find({ product_id: productId });

//       // Create an array to store user names
//       const reviewsWithUserNames = [];
//       // Loop through the reviews and fetch user names
//       for (const review of reviews) {
//         const user = await User.findById(review.userId);
//         if (user) {
//           const reviewWithUserName = {
//             review: review,
//             userName: user.name, 
//           };
//           reviewsWithUserNames.push(reviewWithUserName);
//         }
//       }

//       // Fetch flashSaleInfo data
//       const flashSaleInfo = await FlashSale.findOne({ ProductId: productId });

//       let isFlashSaleActive = false;
  
//       if (flashSaleInfo) {
//         // const flashSaleStartTime = new Date(flashSaleInfo.StartDate);
//         // const flashSaleEndTime = new Date(flashSaleStartTime);
//         // flashSaleEndTime.setHours(flashSaleEndTime.getHours() + flashSaleInfo.TimeInHours);
//         // const startTimeParts = flashSaleInfo.StartTime.split(':');
//         // flashSaleEndTime.setHours(parseInt(startTimeParts[0], 10));
//         // flashSaleEndTime.setMinutes(parseInt(startTimeParts[1], 10));
  
//         isFlashSaleActive = checkFlashState(flashSaleInfo.StartDate, flashSaleInfo.TimeInHours,flashSaleInfo.StartTime);

//         // const currentTime = new Date();
//         // isFlashSaleActive = currentTime >= flashSaleStartTime && currentTime <= flashSaleEndTime;
//       }
//       let selectedDimensions
//       if (pots.length === 0 && allLengths.length === 0) {
//         selectedDimensions = await SelectedDimensions.find({productName:product.title });
//       }

//       const productWithAllData = {
//         ...product._doc,
       
//         selectedPlantCares:selectedPlantCaresWithImage,
       
//         reviews: reviewsWithUserNames,
//         flashSaleInfo: isFlashSaleActive ? flashSaleInfo : null,
//         dimensions:selectedDimensions
//       };

//       res.status(200).json({ product: productWithAllData });
//     } else {
//       res.status(404).json({ message: 'Product not found' });
//     }
//   } catch (err) {
  
//     res.status(500).json({ error: err.message });
//   }
// });

router.get('/getSingleProduct/:id', async (req, res) => {
  try {
    const { id: productId } = req.params;
    const product = await Product.findOne({ _id: productId });

    if (product) {
      const selectedPlantCares = await selectedPlantCare.find({ title: product.title });
      const Allplantcares = await PlantCare.find();

      const selectedPlantCaresWithImage = selectedPlantCares.map(selectedCare => {
        const image = Allplantcares.find(plantCare => plantCare.name === selectedCare.careName)?.image;
        return { ...selectedCare.toObject(), image };
      });

      const pots = await Pot.find({ name: { $in: product.Pots } });
      const allLengths = await SelectedLengthDetails.find({ productName: product.title });
      const reviews = await Review.find({ product_id: productId });

      // Create an array to store user names
      const reviewsWithUserNames = [];
      // Loop through the reviews and fetch user names
      for (const review of reviews) {
        const user = await User.findById(review.userId);
        if (user) {
          const reviewWithUserName = {
            review: review,
            userName: user.name,
          };
          reviewsWithUserNames.push(reviewWithUserName);
        }
      }

      // Fetch flashSaleInfo data
      const flashSaleInfo = await FlashSale.findOne({ ProductId: productId });
     
      let isFlashSaleActive = false;

      if (flashSaleInfo) {
        let state = checkFlashState(flashSaleInfo.StartDate, flashSaleInfo.TimeInHours,flashSaleInfo.OfferPercentage,flashSaleInfo.StartTime);
        isFlashSaleActive = state.isActive
      }

      let selectedDimensions;
      if (pots.length === 0 && allLengths.length === 0) {
        selectedDimensions = await SelectedDimensions.find({ productName: product.title });
      }

      const productWithAllData = {
        ...product._doc,
        selectedPlantCares: selectedPlantCaresWithImage,
        reviews: reviewsWithUserNames,
        flashSaleInfo:
        flashSaleInfo && (flashSaleInfo.Status === 'Unlimited' || isFlashSaleActive)
          ? {
              ...flashSaleInfo.toObject(),
              Status: flashSaleInfo.Status || 'Unlimited',
            }
          : null,
        dimensions: selectedDimensions,
      };

      res.status(200).json({ product: productWithAllData });
    } else {
      res.status(404).json({ message: 'Product not found' });
    }
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});


router.get('/getFeaturedProducts', async (req, res) => {
  try {
    // Query products where FeatureTag array exists and is not null/empty
    const featuredProducts = await Product.find({
      FeatureTag: { $exists: true, $ne: null, $ne: [] },
    });

    if (!featuredProducts) {
      return res.status(404).json({ message: 'No featured products found.' });
    }
    const productIds = featuredProducts.map((product) => product._id);
    const flashSaleData = await FlashSale.find({ ProductId: { $in: productIds } });

    // Fetch 'pots' and 'allLengths' data for each product
    const productsWithAdditionalData = await Promise.all(
      featuredProducts.map(async (product) => {
        const flashSaleInfo = flashSaleData.find(
          (flashSale) => flashSale.ProductId.toString() === product._id.toString()
        );

        const pots = await Pot.find({ name: { $in: product.Pots } });
        const allLengths = await SelectedLengthDetails.find({ productName: product.title });
        const dimensions = await SelectedDimensions.find({productName: product.title })

        let isFlashSaleActive = false;
      if (flashSaleInfo) {
        let state = checkFlashState(flashSaleInfo.StartDate, flashSaleInfo.TimeInHours,flashSaleInfo.OfferPercentage,flashSaleInfo.StartTime);
        isFlashSaleActive = state.isActive
      }
  

        return {
          ...product._doc,
          flashSaleInfo:
        flashSaleInfo && (flashSaleInfo.Status === 'Unlimited' || isFlashSaleActive)
          ? {
              ...flashSaleInfo.toObject(),
              Status: flashSaleInfo.Status || 'Unlimited',
            }
          : null,
          dimensions:dimensions
        };
      })
    );

    res.json(productsWithAdditionalData);
  } catch (error) {
  
    res.status(500).json({ message: 'Internal Server Error' });
  }
});

router.put('/updateProduct/:id', async (req, res) => {
  try {
    const { id } = req.params; // Get the product ID from the URL parameter
    const { title,scienticName,Mname,impdescription,Mdiscription, description, maincategory, category, subcategory, stock, FeatureTag, length, Pots, careType, careName, caredes, price, currency } = req.body;

    const updatedFields = {
      title,
      scienticName,
      description,
      Mdiscription,
      impdescription,
      Mname,
      maincategory,
      category,
      subcategory,
      stock,
      FeatureTag,
      length,
      Pots,
      careType,
      careName,
      caredes,
      price,
      
      currency,
    };

    // // Check if 'photos' field exists in req.files
    // if (req.files && req.files['photos']) {
    //   updatedFields.photos = req.files['photos'].map(f => ({ url: f.path, filename: f.filename }));
    // }

    // Find the product by its ID and update the specified fields
    const updatedProduct = await Product.findByIdAndUpdate(
      id,
      { $set: updatedFields },
      { new: true } // Get the updated document
    );

    if (!updatedProduct) {
      return res.status(404).json({ message: 'Product not found' });
    }

    res.status(200).json(updatedProduct);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});







// Get all photos of a particular product
router.get('/getProductPhotos/:id', async (req, res) => {
  try {
    const { id } = req.params; // Get the product ID from the URL parameter
    const product = await Product.findById(id);

    if (product) {
      // Return the array of photos for the product
      res.status(200).json({ photos: product.photos });
    } else {
      res.status(404).json({ message: 'Product not found' });
    }
  } catch (err) {
  
    res.status(500).json({ error: err.message });
  }
});


// Edit photos of a particular product
// ...

// Update photos in the database for a specific product
router.put('/editProductPhotos/:id', upload.array('photos', 10), async (req, res) => {
  try {
    const productId = req.params.id;
    const product = await Product.findById(productId);

    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    const newPhotos = req.files.map((file) => ({ url: file.path, filename: file.filename }));
    
    // Append new photos to the existing ones
    product.photos.push(...newPhotos);

    // Save the updated product with new photos
    const updatedProduct = await product.save();

    res.status(200).json({ updatedProduct });
  } catch (error) {
    
    res.status(500).json({ error: error.message });
  }
});

// ..


router.delete('/deleteProductPhoto/:productId/:photoId', async (req, res) => {
  try {
    const { productId, photoId } = req.params;

    // Find the product by its ID
    const product = await Product.findById(productId);

    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    // Find the index of the photo with the specified photo ID
    const photoIndex = product.photos.findIndex((photo) => photo._id.toString() === photoId);

    if (photoIndex === -1) {
      return res.status(404).json({ message: 'Photo not found in the product' });
    }

    // Remove the photo from the array
    product.photos.splice(photoIndex, 1);

    // Save the updated product without the deleted photo
    const updatedProduct = await product.save();

    res.status(200).json({ message: 'Photo deleted successfully', updatedProduct });
  } catch (error) {

    res.status(500).json({ error: error.message });
  }
});

// router.delete('/deleteProduct/:id', async (req, res) => {
//   try {
//     const productId = req.params.id;

//     const product = await Product.findById(productId);
//     if (!product) {
//       return res.status(404).json({ message: 'Product not found' });
//     }

//     const title = product.title; 

//     const deletedProduct = await Product.findByIdAndRemove(productId);
//     const deleteplantcare= await selectedPlantCare.find(title)
//     if (!deletedProduct) {
//       return res.status(404).json({ message: 'Product not found' });
//     }

//     res.status(200).json({ message: 'Product deleted successfully', title });
//   } catch (error) {
//     res.status(500).json({ error: error.message });
//   }
// });

router.delete('/deleteProduct/:id', async (req, res) => {
  try {
    const productId = req.params.id;
    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }
    const title = product.title; 
    const deletedProduct = await Product.findByIdAndRemove(productId);
    if (!deletedProduct) {
      return res.status(404).json({ message: 'Product not found' });
    }
    const deletePlantCareResult = await selectedPlantCare.deleteMany({ title });
    const deletelength=await SelectedLengthDetails.deleteMany({ title });
    const deleteddimension=await SelectedDimensions.deleteMany({ title });
    res.status(200).json({ message: 'Product deleted successfully', title});
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});



module.exports = router;
