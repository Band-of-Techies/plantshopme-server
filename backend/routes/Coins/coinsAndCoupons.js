const { User} = require("../../models/Token/customer");
const {User : GoogleUser} = require("../../passport")
const express = require('express');
const router = express.Router();
const moment = require('moment');
const paymentIntentSchema = require('../../models/Payment/Payment'); 

router.get('/couponsAndCoins/:id', async (req, res) => {
    try {
      const { id } = req.params;
  
      // Try to find the user in the User collection
      let user = await User.findById(id);
  
      if (!user) {
        // If not found in User collection, try to find in GoogleUser collection
        user = await GoogleUser.findById(id);
  
        if (!user) {
          // console.log(`User with ID ${id} not found in either collection.`);
          return res.status(404).json({ error: 'User not found' });
        }
      }
  
      const { _id, redeemCoupon, coins } = user;
  
      // Fetch OrderStatus from paymentIntentSchema based on coins' orderId
      const updatedCoins = await Promise.all(coins.map(async coin => {
        if (
          coin.orderId &&
          coin.lastAddedAt
        ) {
          
          const paymentIntentData = await paymentIntentSchema.findOne({ orderId: coin.orderId });
   
          if (paymentIntentData && paymentIntentData.Orderstatus !=='refund' && moment(coin.lastAddedAt).add(1, 'days').isBefore(moment())) {
            coin.valid = true;
            await User.updateOne({ _id, 'coins._id': coin._id }, { $set: { 'coins.$.valid': true } });
          }
  
          // Check if the current date is 365 days later than lastAddedAt
          if (moment(coin.lastAddedAt).add(365, 'days').isBefore(moment()) || paymentIntentData.Orderstatus ==='refund') {
            // If it is, set the coin to null
            coin = null;
          }
        }
        return coin;
      }));
  
      // Filter out any null values from the array
      const finalCoins = updatedCoins.filter(coin => coin !== null);
  
      // Calculate the sum of coins where valid is true
      const totalCoins = finalCoins.reduce((sum, coin) => (coin.valid ? sum + coin.coins : sum), 0);
  
      // Send the updated coins and totalCoins to the frontend
      res.status(200).json({ redeemCoupon, coins: finalCoins, totalCoins });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: error.message });
    }
  });

  router.post('/addCouponsAndCoins/:id', async (req, res) => {
    
    try {
      const { id } = req.params;
      // console.log('Received request for ID:', id);
      // Try to find the user in the User collection
      let user = await User.findById(id);
  
      if (!user) {
        // If not found in User collection, try to find in GoogleUser collection
        user = await GoogleUser.findById(id);
  
        if (!user) {
          // console.log(`User with ID ${id} not found in either collection.`);
          return res.status(404).json({ error: 'User not found' });
        }
      }
  
      // Add a new entry to the coins array
      const newCoinsEntry = {
        coins: req.query.coins, // Set the desired number of coins
        orderId: 'Gift coins',
        valid: true,
        lastAddedAt: new Date(new Date() - 10 * 24 * 60 * 60 * 1000), // Set lastAddedAt as 10 days ago
      };
  
      user.coins.push(newCoinsEntry);
  
      // Save the updated user
      await user.save();
  
      res.json({ success: true, message: 'Coins added successfully', user });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  });

  
module.exports = router;