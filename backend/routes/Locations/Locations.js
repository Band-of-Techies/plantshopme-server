const express = require('express');
const router = express.Router();
const Location = require('../../models/DeliveryLocation/DeliveryLocation')

// Location checking
router.post('/post-locations', async (req, res) => {
  const { location,days} = req.body;
  
  try {
    const newLocation = new Location({ location,days });

    const savedLocation = await newLocation.save();
    console.error(savedLocation);
    res.status(200).json(savedLocation);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

router.get('/get-locations',async(req,res)=>{
    try {
        const locations = await Location.find()
        res.status(200).json(locations)
    } catch (error) {
        res.status(500).json({ error: 'Internal server error' });
    }
})

router.put('/update-location/:id', async (req, res) => {
    const { location, days } = req.body;
    const { id } = req.params;
  console.log(req.body);
    try {

      const existingLocation = await Location.findById(id);
      if (!existingLocation) {
        return res.status(404).json({ error: 'Location not found' });
      }
  
      existingLocation.location = location;
      existingLocation.days = days;
      
      const updatedLocation = await existingLocation.save();
      console.log(updatedLocation);
      res.status(200).json(updatedLocation);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Internal server error' });
    }
  });
  
  router.delete('/delete-location/:id', async (req, res) => {
    const { id } = req.params;
   console.log(id);
    try {

      const existingLocation = await Location.findById(id);
      if (!existingLocation) {
        return res.status(404).json({ error: 'Location not found' });
      }
      await Location.deleteOne({ _id: id });
  
      res.status(200).json({ message: 'Location deleted successfully' });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Internal server error' });
    }
  });
  
  
module.exports = router;