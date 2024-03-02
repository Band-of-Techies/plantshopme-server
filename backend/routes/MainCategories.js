const express = require('express');
const router = express.Router();
const MainCategory = require('../models/MainCategories');
const multer = require('multer');
const path = require('path');
const { storage } = require('../S3/index')
const authenticateToken = require('./tokenGeneration');
const { uploadToS3 } = require('../S3/index');
const upload = multer({ storage: storage });
const Product = require('../models/AddProduct/AddProduct');
const SelectedDimensions = require('../models/Dimensions/Selecteddimension')
// router.post('/addMainCategory',authenticateToken, upload.single('image'), async (req, res) => {
  
//   try {
//     const { name } = req.body;

//     // Check if a MainCategory with the same name already exists
//     const existingMainCategory = await MainCategory.findOne({ name });

//     if (existingMainCategory) {
//       // If a MainCategory with the same name exists, send an error response
//       return res.status(400).json({ error: 'MainCategory with this name already exists' });
//     }

//     // Check if the photo is present in the request
//     if (!req.file) {
      
//       return res.status(400).json({ error: "Photo is required" });
//     }

//     // Get the file path of the uploaded image
//     const image = req.file.path;

//     // Create a new MainCategory with the name and imagePath
//     const mainCategory = new MainCategory({
//       name: name,
//       photo: {
//         url: image,
//         filename: name
//       }
//     });

//     // Save the MainCategory to the database
//     await mainCategory.save();

//     res.status(201).json(mainCategory);
//   } catch (error) {
//     res.status(400).json({ error: error.message });
//   }
// });
const Banner = require('../models/AddBanners/addBanner');
const PlantCare = require('../models/Plantcare/plantcare'); 

router.post('/addMainCategory', upload.single('image'), async (req, res) => {
  try {
      const { name } = req.body;

      // Check if a MainCategory with the same name already exists
      const existingMainCategory = await MainCategory.findOne({ name });

      if (existingMainCategory) {
          // If a MainCategory with the same name exists, send an error response
          return res.status(400).json({ error: 'MainCategory with this name already exists' });
      }

      // Check if the photo is present in the request
      if (!req.file) {
          return res.status(400).json({ error: "Photo is required" });
      }

      const file = req.file; // Access the uploaded file object

      // Upload file to S3
      const fileName = file.originalname; // Use the original filename
      await uploadToS3(file);

      // Construct the S3 URL
      const s3Url = `https://${process.env.AWS_S3_BUCKET_NAME}.s3.amazonaws.com/${fileName}`;

      // Create a new MainCategory with the name and image URL
      const mainCategory = new MainCategory({
          name: name,
          photo: {
              url: s3Url,
              filename: fileName // Use the original filename
          }
      });

      // Save the MainCategory to the database
      await mainCategory.save();

      res.status(201).json(mainCategory);
  } catch (error) {
      res.status(400).json({ error: error.message });
  }
});




router.post('/addPlantcare', upload.single('image'), async (req, res) => {
  try {
    
    const file = req.file; // Access the uploaded file object

      // Upload file to S3
      const fileName = file.originalname; // Use the original filename
      await uploadToS3(file);

      // Construct the S3 URL
      const s3Url = `https://${process.env.AWS_S3_BUCKET_NAME}.s3.amazonaws.com/${fileName}`;

    const newPlantcare = new PlantCare({
      name: req.body.name, 
      description: req.body.description, 
      photo: {
        url: s3Url,
        filename: fileName
      }
    });
   
    const savedPlantcare = await newPlantcare.save();


    res.status(200).json(savedPlantcare);
  } catch (err) {
    
    res.status(500).json({ error: err.message });
  }
});




router.post('/api/post', upload.single('image'), async (req, res) => {
  try {
    const file = req.file; // Access the uploaded file object

    // Upload file to S3
    const fileName = file.originalname; // Use the original filename
    await uploadToS3(file);
    
    const s3Url = `https://${process.env.AWS_S3_BUCKET_NAME}.s3.amazonaws.com/${fileName}`;

    const { title, summary, content, author, tags } = req.body;
    const parsedTags = JSON.parse(tags);

    // Create the post with the S3 URL
    const postDoc = await Post.create({
      title,
      summary,
      content,
      photo: {
        url: s3Url,
        filename: fileName
      },
      author,
      tags: parsedTags,
    });

    res.json({ postDoc });
  } catch (error) {
    console.error('File upload error:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
});



// router.put('/MainCategory/:MainCategoryId', upload.single('photo'), async (req, res) => {
//   try {
//     const mainCategoryId = req.params.MainCategoryId;
//     const mainCategory = await MainCategory.findById(mainCategoryId);

//     if (!mainCategory) {
//       return res.status(404).json({ message: 'MainCategory not found' });
//     }

//     // Update the name if provided in the request body
//     if (req.body.name) {
//       mainCategory.name = req.body.name;
//     }

//     // Update the photo if provided in the request file
//     if (req.file) {
//       const newPhoto = { url: req.file.path, filename: req.file.filename };
//       // Update the existing photo with the new one
//       mainCategory.photo = newPhoto;
//     }

//     // Save the updated MainCategory
//     const updatedMainCategory = await mainCategory.save();

//     res.status(200).json({ updatedMainCategory });
//   } catch (error) {
//     res.status(500).json({ error: error.message });
//   }
// });





// Route to get all MainCategories

router.put('/MainCategory/:MainCategoryId', upload.single('photo'), async (req, res) => {
  try {
    const mainCategoryId = req.params.MainCategoryId;
    const mainCategory = await MainCategory.findById(mainCategoryId);

    if (!mainCategory) {
      return res.status(404).json({ message: 'MainCategory not found' });
    }

    // Update the name if provided in the request body
    if (req.body.name) {
      mainCategory.name = req.body.name;
    }

    // Update the photo if provided in the request file
    if (req.file) {
      // Upload file to S3
      const fileName = req.file.originalname; // Use the original filename
      await uploadToS3(req.file);

      // Construct the S3 URL
      const s3Url = `https://${process.env.AWS_S3_BUCKET_NAME}.s3.amazonaws.com/${fileName}`;

      // Create a new photo object with the S3 URL
      const newPhoto = { url: s3Url, filename: fileName };

      // Update the existing photo with the new one
      mainCategory.photo = newPhoto;
    }

    // Save the updated MainCategory
    const updatedMainCategory = await mainCategory.save();

    res.status(200).json({ updatedMainCategory });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});



router.put('/post', upload.single('image'), async (req, res) => {
  const image = req.file ? req.file : null;
  const { id, title, summary, content, author } = req.body;

  try {
    const postDoc = await Post.findById(id);

    let s3ImageUrl = postDoc.photo; // Default to existing image URL
    let newPhoto = postDoc.photo; // Default to existing photo

    if (image) {
      // Upload file to S3
      const fileName = req.file.originalname; // Use the original filename
      await uploadToS3(image);

      // Construct the S3 URL
      s3ImageUrl = `https://${process.env.AWS_S3_BUCKET_NAME}.s3.amazonaws.com/${fileName}`;
      newPhoto = { url: s3ImageUrl, filename: fileName }; // Define newPhoto here
    }

    await Post.findByIdAndUpdate(
      id,
      {
        $set: {
          title,
          summary,
          content,
          photo: newPhoto,
        },
      },
      { new: true } // to return the updated document
    );

    // Fetch the updated document after update
    const updatedPost = await Post.findById(id);

    res.json(updatedPost);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
});



router.put('/updatePlantcare/:name', upload.single('image'), async (req, res) => {
  try {
    const updatedFields = {
      name: req.body.name,
      description: req.body.description,
    };

    if (req.file) {
      // Upload file to S3
      const fileName = req.file.originalname; // Use the original filename
      await uploadToS3(req.file);

      // Construct the S3 URL
      const s3Url = `https://${process.env.AWS_S3_BUCKET_NAME}.s3.amazonaws.com/${fileName}`;

      updatedFields.photo = { url: s3Url, filename: fileName }; // Store the object
    }

    // Update the PlantCare item based on the provided name
    const updatedItem = await PlantCare.findOneAndUpdate(
      { name: req.params.name }, // Find by name
      { $set: updatedFields }, // Update fields
      { new: true } // Get the updated document
    );

    if (!updatedItem) {
      return res.status(404).json({ message: 'PlantCare not found' });
    }

    res.status(200).json(updatedItem);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});






router.get('/getMainCategories', async (req, res) => { // Renamed the route
  try {
    // Retrieve all MainCategories from the database
    const mainCategories = await MainCategory.find();

    res.json(mainCategories);
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Route to delete a MainCategory
router.delete('/MainCategory/:MainCategoryId', async (req, res) => {
  try {
    const { MainCategoryId } = req.params;

    // Find the MainCategory by ID and remove it
    const deletedMainCategory = await MainCategory.findByIdAndRemove(MainCategoryId);

    if (!deletedMainCategory) {
      return res.status(404).json({ error: 'MainCategory not found' });
    }

    res.json({ message: 'MainCategory deleted successfully' });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});




// router.post('/addOtherProduct',  upload.fields([
//   { name: 'photos', maxCount: 10 },
// ]), async (req, res) => {
//   try {
//       const { title, subcategory, category, maincategory } = req.query;

//       // Validate required fields
//       if (!title || !req.files['photos']) {
//           return res.status(400).json({ error: "Title and photos are required fields." });
//       }

//       // Continue with other product creation logic
//       const uploadedPhotos = [];

//       // Iterate over each uploaded file and upload it to S3
//       for (const file of req.files['photos']) {
//           console.log("File:", file); // Log the file object to check its structure
          
//           const fileName = Date.now().toString(); // Generate a unique filename
//           console.log("Filename:", fileName); // Log the generated filename
          
          

//           // Construct the S3 URL for the uploaded photo
//           const s3Url = `https://${process.env.AWS_S3_BUCKET_NAME}.s3.amazonaws.com/${fileName}`;
//           // Add the uploaded photo details to the array
//           await uploadToS3(fileName, fileName);
//           uploadedPhotos.push({
//               url: s3Url,
//               filename: fileName
//           });
//       }

//       // Create a new Product document with S3 URLs
//       const newProduct = new Product({
//           title: title,
//           maincategory: maincategory,
//           Mdiscription: req.query.Mdiscription,
//           Mname: req.query.Mname,
//           category: category,
//           subcategory: subcategory,
//           stock: req.query.stock,
//           description: req.query.description,
//           photos: uploadedPhotos,
//           FeatureTag: req.query.FeatureTag,
//           length: req.query.length,
//           Pots: req.query.Pots,
//           careType: req.query.careType,
//           careName: req.query.careName,
//           caredes: req.query.caredes,
//           price: req.query.price,
//           currency: req.query.currency,
//           scienticName: req.query.scienticName,
//           impdescription: req.query.impdescription,
//           ptype: 'Other Product',
//           WhatsappMsg:req.query.WhatsappMsg,
//       });

//       const savedProduct = await newProduct.save();

//       res.status(200).json(savedProduct);
//   } catch (err) {
//       res.status(500).json({ error: err.message });
//   }
// });


router.post('/addOtherProduct',  upload.fields([
  { name: 'photos', maxCount: 10 },
]), async (req, res) => {
  try {
      const { title, subcategory, category, maincategory } = req.query;

      // Validate required fields
      if (!title || !req.files['photos']) {
          return res.status(400).json({ error: "Title and photos are required fields." });
      }

      // Continue with other product creation logic
      const uploadedPhotos = [];

      // Iterate over each uploaded file and upload it to S3
      for (const file of req.files['photos']) {
          console.log("File:", file); // Log the file object to check its structure
          
          // Use the original file name as the key and file content as the body
          await uploadToS3(file);
          
          // Construct the S3 URL for the uploaded photo
          const s3Url = `https://${process.env.AWS_S3_BUCKET_NAME}.s3.amazonaws.com/${file.originalname}`;
          
          // Add the uploaded photo details to the array
          uploadedPhotos.push({
              url: s3Url,
              filename: file.originalname // Store the original file name
          });
      }

      // Create a new Product document with S3 URLs
      const newProduct = new Product({
          title: title,
          maincategory: maincategory,
          Mdiscription: req.query.Mdiscription,
          Mname: req.query.Mname,
          category: category,
          subcategory: subcategory,
          stock: req.query.stock,
          description: req.query.description,
          photos: uploadedPhotos,
          FeatureTag: req.query.FeatureTag,
          length: req.query.length,
          Pots: req.query.Pots,
          careType: req.query.careType,
          careName: req.query.careName,
          caredes: req.query.caredes,
          price: req.query.price,
          currency: req.query.currency,
          scienticName: req.query.scienticName,
          impdescription: req.query.impdescription,
          ptype: 'Other Product',
          WhatsappMsg:req.query.WhatsappMsg,
      });

      const savedProduct = await newProduct.save();

      res.status(200).json(savedProduct);
  } catch (err) {
      res.status(500).json({ error: err.message });
  }
});





router.post('/addBanner', upload.array('photos', 10), async (req, res) => {
  try {
    const typeName = req.query.typeName;
    const uploadedPhotos = req.files;
    const navigate = req.body.navigate;

    // Check if 'photos' field exists in req.files
    if (!uploadedPhotos || uploadedPhotos.length === 0) {
      return res.status(400).json({ error: 'No images provided' });
    }

    // Check if typeName is 'banner1' and there are exactly two images
    if (typeName === 'banner1' && uploadedPhotos.length !== 2) {
      return res.status(400).json({ error: 'Please provide exactly two images for typeName banner1' });
    }

    const uploadedPhotoUrls = [];

    // Upload each photo to S3 and store the S3 URLs
    for (const file of uploadedPhotos) {
      const fileName = file.originalname; // Use the original filename
      await uploadToS3(file);

      // Construct the S3 URL
      const s3Url = `https://${process.env.AWS_S3_BUCKET_NAME}.s3.amazonaws.com/${fileName}`;
      uploadedPhotoUrls.push({ url: s3Url, filename: fileName });
    }

    // Extract navigate from the array
    const navigateValue = navigate && Array.isArray(navigate) ? navigate[0] : navigate;

    const newBanner = new Banner({
      typeName: typeName,
      navigate: navigateValue,
      photos: uploadedPhotoUrls,
    });

    // Save the new banner
    const savedBanner = await newBanner.save();

    res.status(200).json(savedBanner);
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: err.message });
  }
});




  router.put('/updateBanner/:id', upload.fields([
    { name: 'photos', maxCount: 10 },
  ]), async (req, res) => {
    const { id } = req.params;
  
    try {
      console.log(req.body);
      const existingBanner = await Banner.findById(id);
      if (req.body.navigate) {
        existingBanner.navigate = req.body.navigate;
      }

      // const uploadedPhotoUrls = [];

      // // Upload each photo to S3 and store the S3 URLs
      // for (const file of  req.files) {
      //   const fileName = file.originalname; // Use the original filename
      //   await uploadToS3(file);
  
      //   // Construct the S3 URL
      //   const s3Url = `https://${process.env.AWS_S3_BUCKET_NAME}.s3.amazonaws.com/${fileName}`;
      //   uploadedPhotoUrls.push({ url: s3Url, filename: fileName });
      // }
  
      // if (req.files && req.files['photos']) {
      //   existingBanner.photos = uploadedPhotoUrls;
      // }
      const updatedBanner = await existingBanner.save();
      
      res.status(200).json(updatedBanner);
    } catch (err) {
      console.log(err);
      res.status(500).json({ error: err.message });
    }
  });


  router.put('/editProductPhotos/:id', upload.array('photos', 10), async (req, res) => {
    try {
      const productId = req.params.id;
      const product = await Product.findById(productId);
  
      if (!product) {
        return res.status(404).json({ message: 'Product not found' });
      }
  
      // Continue with other product creation logic
      const uploadedPhotos = [];
  
      // Iterate over each uploaded file and upload it to S3
      for (const file of req.files) { // Access req.files directly
        console.log("File:", file); // Log the file object to check its structure
        
        // Use the original file name as the key and file content as the body
        await uploadToS3(file);
        
        // Construct the S3 URL for the uploaded photo
        const s3Url = `https://${process.env.AWS_S3_BUCKET_NAME}.s3.amazonaws.com/${file.originalname}`;
        
        // Add the uploaded photo details to the array
        uploadedPhotos.push({
          url: s3Url,
          filename: file.originalname // Store the original file name
        });
      }
  
      // Append new photos to the existing ones
      product.photos.push(...uploadedPhotos);
  
      // Save the updated product with new photos
      const updatedProduct = await product.save();
  
      res.status(200).json({ updatedProduct });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  });
  const Post = require('../models/Blogs/post')


  
  router.post('/post', upload.single('image'), async (req, res) => {
    const image = req.file ? req.file.path : null;

    // Assume you have a user ID stored in a cookie
    // const userId = 'jdhjghjghsgsh'

    // You may want to add additional validation for userId

    const { title, summary, content , author, tags} = req.body;
    const parsedTags = JSON.parse(tags);
    try {
        const postDoc = await Post.create({
            title,
            summary,
            content,
            photo: image,
            author,
            tags: parsedTags,
        });
        res.json({ postDoc });
    } catch (error) {
        console.error('File upload error:', error);
        res.status(500).json({ message: 'Internal Server Error' })
    }
});



module.exports = router;



