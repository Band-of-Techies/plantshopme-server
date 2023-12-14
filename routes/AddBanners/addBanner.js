const express = require('express');
const router = express.Router();
const Banner = require('../../models/AddBanners/addBanner');
const multer = require('multer');
const path = require('path');
const { storage } = require('../../cloudinary/index')


const upload = multer({ storage: storage });


router.post('/addBanner', upload.fields([
    { name: 'photos', maxCount: 10 },
  ]), async (req, res) => {
    
    try {
        const newBanner = new Banner({
            typeName: req.query.typeName,  
            navigate:req.body.navigate,
            photos: req.files['photos'].map(f => ({ url: f.path, filename: f.filename })),
        });
        
  
      const savedBanner = await newBanner.save();
         
      res.status(200).json(savedBanner);
    } catch (err) {

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
  
      if (req.files && req.files['photos']) {
        existingBanner.photos = req.files['photos'].map(f => ({ url: f.path, filename: f.filename }));
      }
      const updatedBanner = await existingBanner.save();
      
      res.status(200).json(updatedBanner);
    } catch (err) {
      console.log(err);
      res.status(500).json({ error: err.message });
    }
  });


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