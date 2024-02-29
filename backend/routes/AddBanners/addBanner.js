const express = require('express');
const router = express.Router();
const Banner = require('../../models/AddBanners/addBanner');
const multer = require('multer');
const path = require('path');
const { storage } = require('../../cloudinary/index')


const upload = multer({ storage: storage });


// router.post('/addBanner', upload.fields([
//   { name: 'photos', maxCount: 10 },
// ]), async (req, res) => {
//   try {
//     const typeName = req.query.typeName;
//     const uploadedPhotos = req.files['photos'];
//     const navigate = req.body.navigate;

//     // Check if 'photos' field exists in req.files
//     if (!uploadedPhotos) {
//       return res.status(400).json({ error: 'No images provided' });
//     }

//     // Check if typeName is 'banner1' and there are exactly two images
//     if (typeName === 'banner1' && uploadedPhotos.length !== 2) {
//       return res.status(400).json({ error: 'Please provide exactly two images for typeName banner1' });
//     }

//     // Extract navigate from the array
//     const navigateValue = navigate && Array.isArray(navigate) ? navigate[0] : navigate;

//     const newBanner = new Banner({
//       typeName: typeName,
//       navigate: navigateValue,
//       photos: uploadedPhotos.map(f => ({ url: f.path, filename: f.filename })),
//     });

//     // Save the new banner
//     const savedBanner = await newBanner.save();

//     res.status(200).json(savedBanner);
//   } catch (err) {
//     console.log(err);
//     res.status(500).json({ error: err.message });
//   }
// });
//   router.put('/updateBanner/:id', upload.fields([
//     { name: 'photos', maxCount: 10 },
//   ]), async (req, res) => {
//     const { id } = req.params;
  
//     try {
//       console.log(req.body);
//       const existingBanner = await Banner.findById(id);
//       if (req.body.navigate) {
//         existingBanner.navigate = req.body.navigate;
//       }
  
//       if (req.files && req.files['photos']) {
//         existingBanner.photos = req.files['photos'].map(f => ({ url: f.path, filename: f.filename }));
//       }
//       const updatedBanner = await existingBanner.save();
      
//       res.status(200).json(updatedBanner);
//     } catch (err) {
//       console.log(err);
//       res.status(500).json({ error: err.message });
//     }
//   });


  router.get('/getBanners',async(req,res)=>{
    try {
        const resp = await Banner.find();
        res.status(200).json(resp);
    } catch (error) {
        res.status(500).json({ error: err.message });
    }
  })

  router.delete('/banner/delete', async (req, res) => {

    try {
        const deletedBanners = await Banner.deleteMany({
            _id: { $in: req.body.bannerIds },
        });

        if (deletedBanners.deletedCount === 0) {
            return res.status(404).json({ error: 'Banner items not found' });
        }

        res.status(200).json({ message: 'Banners removed successfully' });
    } catch (error) {
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

  
module.exports = router;