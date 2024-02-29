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
const AddProduct = require('../../models/AddProduct/AddProduct');
const upload = multer({ storage: storage });
const authenticateToken = require('../tokenGeneration');
const { uploadToS3 } = require('../../S3/index');




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

// router.post('/addOtherProduct',  upload.fields([
//   { name: 'photos', maxCount: 10 },
  
// ]), async (req, res) => {
//   try {


//     const images = req.files['photos'].map((file) => file.filename); // Get an array of uploaded image filenames
    
//     // Create a new Product document
//     const newProduct = new Product({
//       title: req.query.title, // Get the product title from the query parameter
//       maincategory: req.query.maincategory,
//       Mdiscription:req.query.Mdiscription,
//       Mname:req.query.Mname,
//       category: req.query.category,
//       subcategory: req.query.subcategory,
//       stock: req.query.stock,
//       description: req.query.description,
//       photos: req.files['photos'].map(f => ({ url: f.path, filename: f.filename })),
//       FeatureTag: req.query.FeatureTag, // Get the FeatureTag array from the query parameter
//       length: req.query.length,
//       Pots: req.query.Pots,
//       careType: req.query.careType,
//       careName: req.query.careName,
//       caredes: req.query.caredes,
//       price: req.query.price,
//       currency: req.query.currency,
//       scienticName:req.query.scienticName,
//       impdescription:req.query.impdescription,
//       ptype:'Other Product',
//     });
   
//     const savedProduct = await newProduct.save();

//     res.status(200).json(savedProduct);
//   } catch (err) {
//     res.status(500).json({ error: err.message });
//   }
// });


// router.post('/addOtherProduct', upload.fields([
//   { name: 'photos', maxCount: 10 },
// ]), async (req, res) => {
//   try {
//     // Extract relevant details from the request query
//     const { title, subcategory, category, maincategory } = req.query;

//     // Validate required fields
//     if (!title || !req.files['photos']) {
//       return res.status(400).json({ error: "Title and photos are required fields." });
//     }

//     // Check if at least one dimension exists for the given product details
//     const existingDimensions = await SelectedDimensions.findOne({
//       productName: title,
//     });

//     if (!existingDimensions) {
//       return res.status(400).json({ error: "At least one dimension must be inserted before adding products." });
//     }

//     // Check if a product with the same title already exists
//     const existingProduct = await Product.findOne({ title: title });

//     if (existingProduct) {
//       return res.status(400).json({ error: "A product with the same title already exists." });
//     }

//     // Continue with other product creation logic
//     const images = req.files['photos'].map((file) => file.filename);

//     // Create a new Product document
//     const newProduct = new Product({
//       title: title,
//       maincategory: maincategory,
//       Mdiscription: req.query.Mdiscription,
//       Mname: req.query.Mname,
//       category: category,
//       subcategory: subcategory,
//       stock: req.query.stock,
//       description: req.query.description,
//       photos: req.files['photos'].map(f => ({ url: f.path, filename: f.filename })),
//       FeatureTag: req.query.FeatureTag,
//       length: req.query.length,
//       Pots: req.query.Pots,
//       careType: req.query.careType,
//       careName: req.query.careName,
//       caredes: req.query.caredes,
//       price: req.query.price,
//       currency: req.query.currency,
//       scienticName: req.query.scienticName,
//       impdescription: req.query.impdescription,
//       ptype: 'Other Product',
//       WhatsappMsg:req.query.WhatsappMsg,

//     });

//     const savedProduct = await newProduct.save();

//     res.status(200).json(savedProduct);
//   } catch (err) {
//     res.status(500).json({ error: err.message });
//   }
// });



// router.post('/addOtherProducts',  upload.single('photos'), async (req, res) => {
//   try {
//     const { name } = req.body;

//     // Check if a MainCategory with the same name already exists
//     const existingMainCategory = await AddProduct.findOne({ title: name });

//     if (existingMainCategory) {
//       // If a MainCategory with the same name exists, send an error response
//       return res.status(400).json({ error: 'MainCategory with this name already exists' });
//     }

//     // Check if the photo is present in the request
//     if (!req.file) {
//       return res.status(400).json({ error: "Photo is required" });
//     }

//     // Upload file to S3
//     const fileName = Date.now().toString(); // Generate a unique filename
//     await uploadToS3(req.file.buffer, fileName);

//     // Construct the S3 URL
//     const s3Url = `https://${process.env.AWS_S3_BUCKET_NAME}.s3.amazonaws.com/${fileName}`;

//     // Create a new MainCategory with the name and image URL
//     const mainCategory = new AddProduct({ // Change Product to AddProduct
//       title: name,
//       photos: {
//         url: s3Url,
//         filename: fileName
//       }
//     });

//     // Save the MainCategory to the database
//     await mainCategory.save();

//     res.status(201).json(mainCategory);
//   } catch (error) {
//     // If an error occurs, log the error for debugging and send an appropriate error response
//     console.error('Error:', JSON.stringify(error)); // Stringify the error object before logging
//     res.status(500).json({ error: 'An internal server error occurred. Please try again later.' });
//   }
// });









// fetch all products based on the all the parameters which is called by the frontend
router.get('/getAllProducts',authenticateToken, async (req, res) => {
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


router.get('/getAllProducts', async (req, res) => {
  const { search, sort, FeatureTag, max_price, min_price,maincategory,category,subcategory} = req.query;

let unique =true
  let queryArray = [];
   console.log(unique,maincategory ,category,subcategory);
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
  
  let queryObject = {};
  if (queryArray.length > 0) {
    queryObject = (unique === 'unique') ? { $and: queryArray } : { $or: queryArray };
  }
 
  
  if (search) {
    queryObject.$or = [
      { title: { $regex: search, $options: 'i' } },
      { description: { $regex: search, $options: 'i' } },
      { SKU: { $regex: search, $options: 'i' } },
      { scienticName: { $regex: search, $options: 'i' } }

    ];
  }
  
  if (FeatureTag && FeatureTag !== 'all') {
    queryObject.FeatureTag = FeatureTag;
  }
  
  let result = Product.find(queryObject);

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
        flashState = checkFlashState(flashSaleInfo.StartDate, flashSaleInfo.TimeInHours,flashSaleInfo.StartTime);
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
  let productsCount = 0;

  // Now you can filter and sort the products based on the price
  if (max_price && min_price) {
      products = products.filter(product => product.price >= parseFloat(min_price) && product.price <= parseFloat(max_price));
      productsCount = products.length;
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
  
  const page = Number(req.query.page) || 1;
  const limit = Number(req.query.limit) || 20;
  const skip = (page - 1) * limit;
  
  // Use products instead of result here
  products = products.slice(skip, skip + limit);
  
  const totalProducts = await Product.countDocuments(queryObject);
  const numOfPages = Math.ceil(productsCount / limit);
  console.log(products);
  res.json({ products, totalProducts: productsCount, numOfPages });
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
    const { WhatsappMsg,title,scienticName,Mname,impdescription,Mdiscription, description, maincategory, category, subcategory, stock, FeatureTag, length, Pots, careType, careName, caredes, price, currency } = req.body;

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
      WhatsappMsg,
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
// router.put('/editProductPhotos/:id', upload.array('photos', 10), async (req, res) => {
//   try {
//     const productId = req.params.id;
//     const product = await Product.findById(productId);

//     if (!product) {
//       return res.status(404).json({ message: 'Product not found' });
//     }

//     const newPhotos = req.files.map((file) => ({ url: file.path, filename: file.filename }));
    
//     // Append new photos to the existing ones
//     product.photos.push(...newPhotos);

//     // Save the updated product with new photos
//     const updatedProduct = await product.save();

//     res.status(200).json({ updatedProduct });
//   } catch (error) {
    
//     res.status(500).json({ error: error.message });
//   }
// });

// ..


// router.delete('/deleteProductPhoto/:productId/:photoId', async (req, res) => {
//   try {
//     const { productId, photoId } = req.params;

//     // Find the product by its ID
//     const product = await Product.findById(productId);

//     if (!product) {
//       return res.status(404).json({ message: 'Product not found' });
//     }

//     // Find the index of the photo with the specified photo ID
//     const photoIndex = product.photos.findIndex((photo) => photo._id.toString() === photoId);

//     if (photoIndex === -1) {
//       return res.status(404).json({ message: 'Photo not found in the product' });
//     }

//     // Remove the photo from the array
//     product.photos.splice(photoIndex, 1);

//     // Save the updated product without the deleted photo
//     const updatedProduct = await product.save();

//     res.status(200).json({ message: 'Photo deleted successfully', updatedProduct });
//   } catch (error) {

//     res.status(500).json({ error: error.message });
//   }
// });


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

    // Ensure there is more than one photo before deletion
    if (product.photos.length > 1) {
      // Remove the photo from the array
      product.photos.splice(photoIndex, 1);

      // Save the updated product without the deleted photo
      const updatedProduct = await product.save();

      res.status(200).json({ message: 'Photo deleted successfully', updatedProduct });
    } else {
      // Deletion not allowed when there is only one photo
      res.status(400).json({ message: 'Deletion not allowed. At least one photo must remain for the product.' });
    }
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

router.delete('/deleteProduct/:id', authenticateToken,async (req, res) => {
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
    
    res.status(200).json({ message: 'Product deleted successfully', title});
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});



router.put('/updateProductCategories', async (req, res) => {
  try {
    const { maincategory, category, subcategory, newmaincategory, newcategory, newsubcategory } = req.body;

    // Find products matching the user-defined categories
    const productsToUpdate = await AddProduct.find({
      maincategory: { $in: maincategory },
      category: { $in: category },
      subcategory: { $in: subcategory }
    });

    // Update categories for matching products
    for (const product of productsToUpdate) {
      product.maincategory = newmaincategory;
      product.category = newcategory;
      product.subcategory = newsubcategory;
      await product.save();
    }

    res.json({ success: true, message: 'Product categories updated successfully' });
  } catch (error) {
    console.error('Error updating product categories:', error);
    res.status(500).json({ success: false, error: 'Internal server error' });
  }
});



module.exports = router;
