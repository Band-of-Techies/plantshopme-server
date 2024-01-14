const { User} = require("../../models/Token/customer");
const {GoogleUser} = require("../../passport")
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
          console.log(`User with ID ${id} not found in either collection.`);
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



  router.get('/CouponUser', async (req, res) => {
    try {
      const { id, name } = req.query;
  
      let user;
  
      if (id) {
        // If id is provided, try to find the user in both collections by _id
        user = await User.findById(id) || await GoogleUser.findById(id);
      } else if (name) {
        // If name is provided, try to find the user in both collections by name
        user = await User.findOne({ name }) || await GoogleUser.findOne({ name });
      } else {
        // If neither id nor name is provided, retrieve all users from both collections
        const allUsers = await Promise.all([User.find(), GoogleUser.find()]);
        const users = allUsers.flat().map(user => ({ _id: user._id, redeemCoupon: user.redeemCoupon, coins: user.coins }));
        return res.status(200).json(users);
      }
  
      if (!user) {
        console.log(`User with ID or name ${id || name} not found.`);
        return res.status(404).json({ error: 'User not found' });
      }
  
      // Rest of your logic to fetch and process coins and coupons
      // Modify the response accordingly
  
      res.status(200).json({ _id: user._id, redeemCoupon: user.redeemCoupon, coins: user.coins });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: error.message });
    }
  });
  
  

module.exports = router;