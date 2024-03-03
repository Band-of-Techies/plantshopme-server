const express = require('express');
const router = express.Router();
const paymentIntentSchema = require('../models/Payment/Payment'); // Assuming the schema is in a separate file
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const FlashSale = require('../models/FlashSale/FlashSales');
const Product = require('../models/AddProduct/AddProduct');
const SelectedLengthDetails = require('../models/PlantLength/SelectedLength')
const Length = require('../models/PlantLength/Length');
const Pot = require('../models/Pot/Pot');
const checkFlashState = require('../utils/checkFlashState');
const Coupon = require('../models/Coupons/Coupons')
const moment = require('moment-timezone');
const { User} = require("../models/Token/customer");
const {GoogleUser} = require("../passport")
const SelectedDimensions = require('../models/Dimensions/Selecteddimension')
const { v4: uuidv4 } = require('uuid');
const RefundData = require('../models/RefundData/RefundData')
const generateOrderId = require('../utils/generateOrderId')
const coinsData = require('../utils/coinsData')
const ObjectId = require('mongoose').Types.ObjectId;
const authenticateToken = require('./tokenGeneration');
// router.post('/create-payment-intent', async (req, res) => {
//   // console.log(req.body)
//   try {
//     const { updatedCartItems, shipping_fee, total, user, checkoutData,redeem } = req.body;
//     console.log(updatedCartItems);
//     console.log(checkoutData);
//     console.log(redeem)
//     console.log(shipping_fee, total)
//     const calculateOrderAmount = () => {
//       const amountInFils = (shipping_fee + total) * 100;
//       return amountInFils;
//     };
    
//     const paymentIntent = await stripe.paymentIntents.create({
//       amount: calculateOrderAmount(),
//       currency: 'AED',
//     });
//     if(paymentIntent){
//       const newPaymentIntent = new paymentIntentSchema({
//         updatedCartItems,
//         shipping_fee,
//         total,
//         user,
//         checkoutData:checkoutData,
//         paymentData: paymentIntent,
//       });
//       await newPaymentIntent.save();
//     }
//     res.status(200).json({ clientSecret: paymentIntent.client_secret });
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ error: error.message });
//   }
// });


router.post('/create-payment-intent', async (req, res) => {
  
  try {
    const { updatedCartItems, shipping_fee, total, user, checkoutData,redeem ,GoogleMap} = req.body;
    // Define a function to calculate the total price for all items in the cart.
    
  

    const calculateOrderAmount = async () => {
      const gifWrapPrice = 20;
      let totalAmount = 0;
    
      try {
        // Ensure updatedCartItems is always an array
        if (!Array.isArray(updatedCartItems)) {
          updatedCartItems = [updatedCartItems];
        }
    
        // Use Promise.all to wait for all promises to resolve
        const results = await Promise.all(updatedCartItems.map(async (cartItem) => {
          const product = await Product.findById(cartItem.productId);
    
          if (!product || product.stock <= 0) {
            throw new Error('Product Sold out! Out of Stock.');
          }
    
          const dimensions = await SelectedDimensions.findById(cartItem.dimension._id);
    
          let itemTotalPrice = Number(cartItem.amount) * Number(dimensions.Price);
    
          if (cartItem.flashSaleDiscount) {
            const flashSaleInfo = await FlashSale.findOne({ ProductId: cartItem.productId });
    
            if (flashSaleInfo && cartItem.flashSalePrice && cartItem.flashSaleStartDate && cartItem.flashSaleStartTime && cartItem.flashSaleEndTime && cartItem.flashSaleDiscount) {
              const flashState = checkFlashState(flashSaleInfo.StartDate, flashSaleInfo.TimeInHours, flashSaleInfo.StartTime);
    
              if (flashState || (cartItem.Status === "Unlimited")) {
                const offerPrice = itemTotalPrice * Number(flashSaleInfo.OfferPercentage) / 100;
                itemTotalPrice -= offerPrice;
              }
            }
          }
          if (cartItem.GiftWrap) {
            itemTotalPrice += Number(gifWrapPrice) * Number(cartItem.amount);
          }
    
          return itemTotalPrice;
        }));
    
        // Sum up all the results
        totalAmount = results.reduce((a, b) => a + b, 0);
    
        totalAmount += Number(shipping_fee);
    
        return Math.round(totalAmount * 100); // Round to the nearest integer
      } catch (error) {

        throw new Error('Oops, something went wrong...');
      }
    };
    


    let priceWithRedeem

    let isRedeem =false
    let currentPrice = await calculateOrderAmount();
   
   
    if(redeem && !redeem.coins){
      let userData = await User.findById(updatedCartItems[0].userId)

      if (!userData) {
        userData = await GoogleUser.findById(updatedCartItems[0].userId);
      }
     
      let alreadyRedeemed =false
      const CheckRedeem =  (id)=>{
        if(userData && userData.redeemCoupon){
          userData.redeemCoupon.map((coupon,idx)=>{
            if(coupon.couponId === id){
              return false
            }
          })
          return true
        }
      }

      alreadyRedeemed =CheckRedeem(redeem._id)
      const redeemData=  await Coupon.findById(redeem._id)

      const currentDate = moment().tz('Asia/Dubai');
      const tu =currentDate.isBetween(redeemData.startDate, redeemData.endDate, null, '[]')
      if (redeemData && (currentDate.isBetween(redeemData.startDate, redeemData.endDate, null, '[]'))) {
        if((redeem.usage!=='Single') || ((redeem.usage!=='Multiple') && alreadyRedeemed)){
           if(redeem.type ==='Flat'){
            let priceRedeem =( redeemData.value * 100);
            let amt = currentPrice - priceRedeem
            currentPrice = (amt > redeem?.minvalue) ? amt : currentPrice;
            isRedeem=true
           }else{
            let priceRedeem = (currentPrice* Number(redeemData.value)/100);
            let amt = currentPrice - priceRedeem
            currentPrice = (amt > redeem?.minvalue) ? amt : currentPrice;
            // currentPrice -= priceRedeem;
            isRedeem=true
           }
        }
     } 

    }

    let isCoins = false
    if(redeem && redeem.coins){
      let userData = await User.findById(updatedCartItems[0].userId);
      if (!userData) {
          userData = await GoogleUser.findById(updatedCartItems[0].userId);
      }
      if (!userData) {
          throw new Error('User not found');
      }
  
      const { _id, redeemCoupon, coins } = userData;
  
      const updatedCoins = await Promise.all(coins.map(async coin => {
        if (
          coin.orderId &&
          coin.lastAddedAt
        ) {
          const paymentIntentData = await paymentIntentSchema.findOne({ orderId: coin.orderId });
   
          if (paymentIntentData && paymentIntentData.Orderstatus !=='refund' && moment(coin.lastAddedAt).add(1, 'days').isBefore(moment())) {
            coin.valid = true;
          }
          if (moment(coin.lastAddedAt).add(365, 'days').isBefore(moment()) || paymentIntentData.Orderstatus ==='refund') {

            coin = null;
          }
        }
        return coin;
      }));
  
      const finalCoins = updatedCoins.filter(coin => coin !== null);

      const totalCoins = finalCoins.reduce((sum, coin) => (coin.valid ? sum + coin.coins : sum), 0);
      if(redeem.coins > totalCoins){
        throw new Error('Coin redeeming failed...')
      }
      const redeemedCoin = coinsData.find(coin => coin._id === redeem._id);
      let priceAfterRedeem=0;
      let temp = currentPrice
      
      if(redeemedCoin){
        if(redeemedCoin.type==='Percentage'){
          const discount = (currentPrice*Number(redeemedCoin.value)/100)
          priceAfterRedeem = currentPrice-discount
          isCoins= true
        }else{
          priceAfterRedeem = (currentPrice-redeemedCoin.value)
          isCoins= true
        }
        isCoins= true
      }
      if(priceAfterRedeem > 5){
        isCoins= true
        currentPrice =priceAfterRedeem;
      }else{
        throw new Error('Coin redeem failed...')
      }
    }

    const orderId = generateOrderId()

    const paymentIntent = await stripe.paymentIntents.create({
      amount: currentPrice,
      currency: 'AED',
    });
    
    if (paymentIntent) {
      const newPaymentIntent = new paymentIntentSchema({
        orderId:orderId,
        updatedCartItems,
        shipping_fee,
        total:(currentPrice/100),
        user,
        checkoutData: checkoutData,
        paymentData: paymentIntent,
        couponData:isRedeem?redeem:'none',
        coinsData:isCoins?redeem:'none',
        GoogleLocation:GoogleMap?GoogleMap:'none'
      });


      let userData = await User.findById(updatedCartItems[0].userId);
      if (!userData) {
          userData = await GoogleUser.findById(updatedCartItems[0].userId);
      }
      if (!userData) {
          throw new Error('User not found');
      }
      
      if (isRedeem) {
          const redeemCouponId = redeem._id;
          userData.redeemCoupon.push({ couponId: redeem._id, orderId: orderId, redeemedAt: new Date() });
      }

      let isRedeemedCoins = false;
      if (redeem && redeem.coins) {
          // Sort the coins based on lastAddedAt in descending order
          userData.coins.sort((a, b) => new Date(a.lastAddedAt) - new Date(b.lastAddedAt));
      
          let tempCoins = redeem.code;
      
          for (const coin of userData.coins) {
              if (coin.valid && tempCoins > 0) {
                  if (tempCoins >= coin.coins) {
                      // Deduct the entire coin value
                      tempCoins -= coin.coins;
                      coin.coins = 0;
                      if (coin.coins === 0) {
                          coin.valid = false; // Set the coin as invalid
                      }
                  } else {
                      // Deduct part of the coin value
                      coin.coins -= tempCoins;
                      tempCoins = 0;
                  }
      
                  // Update the User document with the modified userData
                  try {
                      await User.updateOne(
                          { _id: userData._id, 'coins._id': coin._id },
                          { $set: { 'coins.$': coin } }
                      );
                  } catch (error) {
                      console.error('Error updating user:', error);
                  }
              }
          }
      
          isRedeemedCoins = true;
      }
      
      
      if(!isRedeemedCoins){
        const coins = Math.round(currentPrice/100);
        userData.coins.push({coins: coins, orderId: orderId, redeemedAt: new Date()});
      }
      
      await userData.save();
      

      await newPaymentIntent.save();
    }
 
    res.status(200).json({ clientSecret: paymentIntent.client_secret });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error.message });
  }
});

router.post('/create-cod-intent', async (req, res) => {
  try {
    const { updatedCartItems, shipping_fee, total, user, checkoutData,redeem,GoogleMap } = req.body;


    const orderId = generateOrderId()
    // Define a function to calculate the total price for all items in the cart.
    const calculateOrderAmount = async () => {
      const gifWrapPrice = 20;
      let totalAmount = 0;
    
      try {
        // Ensure updatedCartItems is always an array
        if (!Array.isArray(updatedCartItems)) {
          updatedCartItems = [updatedCartItems];
        }
    
        // Use Promise.all to wait for all promises to resolve
        const results = await Promise.all(updatedCartItems.map(async (cartItem) => {
          const product = await Product.findById(cartItem.productId);
    
          if (!product || product.stock <= 0) {
            throw new Error('Product Sold out! Out of Stock.');
          }
    
          const dimensions = await SelectedDimensions.findById(cartItem.dimension._id);
    
          let itemTotalPrice = Number(cartItem.amount) * Number(dimensions.Price);
    
          if (cartItem.flashSaleDiscount) {
            const flashSaleInfo = await FlashSale.findOne({ ProductId: cartItem.productId });
    
            if (flashSaleInfo && cartItem.flashSalePrice && cartItem.flashSaleStartDate && cartItem.flashSaleStartTime && cartItem.flashSaleEndTime && cartItem.flashSaleDiscount) {
              const flashState = checkFlashState(flashSaleInfo.StartDate, flashSaleInfo.TimeInHours, flashSaleInfo.StartTime);
    
              if (flashState || (cartItem.Status === "Unlimited")) {
                const offerPrice = itemTotalPrice * Number(flashSaleInfo.OfferPercentage) / 100;
                itemTotalPrice -= offerPrice;
              }
            }
          }
          if (cartItem.GiftWrap) {
            itemTotalPrice += Number(gifWrapPrice) * Number(cartItem.amount);
          }
    
          return itemTotalPrice;
        }));
    
        // Sum up all the results
        totalAmount = results.reduce((a, b) => a + b, 0);
    
        totalAmount += Number(shipping_fee);
    
        return Math.round(totalAmount * 100); // Round to the nearest integer
      } catch (error) {
        throw new Error('Oops, something went wrong...');
      }
    };
    


    let priceWithRedeem

    let isRedeem =false
    let currentPrice = await calculateOrderAmount();
  
   
    if(redeem && !redeem.coins){
      let userData = await User.findById(updatedCartItems[0].userId)

      if (!userData) {
        userData = await GoogleUser.findById(updatedCartItems[0].userId);
      }
     
      let alreadyRedeemed =false
      const CheckRedeem =  (id)=>{
        if(userData && userData.redeemCoupon){
          userData.redeemCoupon.map((coupon,idx)=>{
            if(coupon.couponId === id){
              return false
            }
          })
          return true
        }
      }

      alreadyRedeemed =CheckRedeem(redeem._id)
      const redeemData=  await Coupon.findById(redeem._id)

      const currentDate = moment().tz('Asia/Dubai');
      const tu =currentDate.isBetween(redeemData.startDate, redeemData.endDate, null, '[]')
      if (redeemData && (currentDate.isBetween(redeemData.startDate, redeemData.endDate, null, '[]'))) {
        if((redeem.usage!=='Single') || ((redeem.usage!=='Multiple') && alreadyRedeemed)){
           if(redeem.type ==='Flat'){
            let priceRedeem =( redeemData.value * 100);
            let amt = currentPrice - priceRedeem
            currentPrice = (amt > redeem?.minvalue) ? amt : currentPrice;
            isRedeem=true
           }else{
            let priceRedeem = (currentPrice* Number(redeemData.value)/100);
            let amt = currentPrice - priceRedeem
            currentPrice = (amt > redeem?.minvalue) ? amt : currentPrice;
            // currentPrice -= priceRedeem;
            isRedeem=true
           }
        }
     } 

    }
    let isCoins = false
    if(redeem && redeem.coins){
      let userData = await User.findById(updatedCartItems[0].userId);
      if (!userData) {
          userData = await GoogleUser.findById(updatedCartItems[0].userId);
      }
      if (!userData) {
          throw new Error('User not found');
      }
  
      const { _id, redeemCoupon, coins } = userData;
  
      const updatedCoins = await Promise.all(coins.map(async coin => {
        if (
          coin.orderId &&
          coin.lastAddedAt
        ) {
          const paymentIntentData = await paymentIntentSchema.findOne({ orderId: coin.orderId });
   
          if (paymentIntentData && paymentIntentData.Orderstatus !=='refund' && moment(coin.lastAddedAt).add(1, 'days').isBefore(moment())) {
            coin.valid = true;
          }
          if (moment(coin.lastAddedAt).add(365, 'days').isBefore(moment()) || paymentIntentData.Orderstatus ==='refund') {

            coin = null;
          }
        }
        return coin;
      }));
  
      const finalCoins = updatedCoins.filter(coin => coin !== null);

      const totalCoins = finalCoins.reduce((sum, coin) => (coin.valid ? sum + coin.coins : sum), 0);
      if(redeem.coins > totalCoins){
        throw new Error('Coin redeeming failed...')
      }
      const redeemedCoin = coinsData.find(coin => coin._id === redeem._id);
      let priceAfterRedeem=0;
      let temp = currentPrice
      if(redeemedCoin){
        if(redeemedCoin.type==='Percentage'){
          const discount = (currentPrice*Number(redeemedCoin.value)/100)
          priceAfterRedeem = currentPrice-discount
          isCoins= true
        }else{
          priceAfterRedeem = (currentPrice-redeemedCoin.value)
          isCoins= true
        }
        isCoins= true
      }
      if(priceAfterRedeem > 5){
        isCoins= true
        currentPrice =priceAfterRedeem;
      }else{
        throw new Error('Coin redeem failed...')
      }
    }
    if (currentPrice) {
      const newPaymentIntent = new paymentIntentSchema({
        orderId:orderId,
        updatedCartItems,
        shipping_fee,
        total:(currentPrice/100),
        user,
        checkoutData: checkoutData,
        paymentData: 'Cash on delivery',
        couponData:isRedeem?redeem:'none',
        coinsData:isCoins?redeem:'none',
        GoogleLocation:GoogleMap?GoogleMap:'none'
      });


      let userData = await User.findById(updatedCartItems[0].userId);
      if (!userData) {
          userData = await GoogleUser.findById(updatedCartItems[0].userId);
      }
      if (!userData) {
          throw new Error('User not found');
      }
      
      if (isRedeem) {
          const redeemCouponId = redeem._id;
          userData.redeemCoupon.push({ couponId: redeem._id, orderId: orderId, redeemedAt: new Date() });
      }

      let isRedeemedCoins = false;
      if (redeem && redeem.coins) {
          // Sort the coins based on lastAddedAt in descending order
          userData.coins.sort((a, b) => new Date(a.lastAddedAt) - new Date(b.lastAddedAt));
      
          let tempCoins = redeem.code;
      
          for (const coin of userData.coins) {
              if (coin.valid && tempCoins > 0) {
                  if (tempCoins >= coin.coins) {
                      // Deduct the entire coin value
                      tempCoins -= coin.coins;
                      coin.coins = 0;
                      if (coin.coins === 0) {
                          coin.valid = false; // Set the coin as invalid
                      }
                  } else {
                      // Deduct part of the coin value
                      coin.coins -= tempCoins;
                      tempCoins = 0;
                  }
      
                  // Update the User document with the modified userData
                  try {
                      await User.updateOne(
                          { _id: userData._id, 'coins._id': coin._id },
                          { $set: { 'coins.$': coin } }
                      );
                  } catch (error) {
                      console.error('Error updating user:', error);
                  }
              }
          }
      
          isRedeemedCoins = true;
      }
      
      
      if(!isRedeemedCoins){
        const coins = Math.round(currentPrice/100);
        userData.coins.push({coins: coins, orderId: orderId, redeemedAt: new Date()});
      }
      
      await userData.save();

      await newPaymentIntent.save();
    }
    res.status(200).json('Order placed successfully...');
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error.message });
  }
});

// router.get('/get-payment-intents', authenticateToken, async (req, res) => {
//   try {
//     let paymentIntents;
//     const { startDate, endDate, Orderstatus, paymentData } = req.query;

//     let filter = {};

//     if (startDate && endDate) {
//       filter.createdAt = { $gte: new Date(startDate), $lte: new Date(endDate) };
//     } else if (startDate) {
//       filter.createdAt = { $gte: new Date(startDate) };
//     } else if (endDate) {
//       filter.createdAt = { $lte: new Date(endDate) };
//     }

//     if (Orderstatus) {
//       // Remove additional encoding and use the value directly
//       const orderStatusRegex = new RegExp(Orderstatus, 'i');
//       filter.Orderstatus = { $regex: orderStatusRegex };
//     }

//     if (paymentData) {
//       const paymentDataRegex = new RegExp(paymentData, 'i');
//       filter.paymentData = { $regex: paymentDataRegex };
//     }

//     // Include PayStatus as Failed in the filter
//     filter.PayStatus = 'success';

//     paymentIntents = await paymentIntentSchema.find(filter);

//     res.status(200).json(paymentIntents);
//   } catch (error) {
//     res.status(500).json({ error: error.message });
//   }
// });



// Backend route for getting payment intents
// router.get('/get-payment-intents',authenticateToken, async (req, res) => {
//   try {
//     let paymentIntents;
//     const { startDate, endDate, Orderstatus,paymentData } = req.query;

//     let filter = {};

//     if (startDate && endDate) {
//       filter.createdAt = { $gte: new Date(startDate), $lte: new Date(endDate) };
//     } else if (startDate) {
//       filter.createdAt = { $gte: new Date(startDate) };
//     } else if (endDate) {
//       filter.createdAt = { $lte: new Date(endDate) };
//     }

//     if (Orderstatus) {
//       // Remove additional encoding and use the value directly
//       const orderStatusRegex = new RegExp(Orderstatus, 'i');
//       filter.Orderstatus = { $regex: orderStatusRegex };
//     }
    

//     if(paymentData){
//       const paymentDataRegex = new RegExp(paymentData, 'i');
//       filter.paymentData = { $regex: paymentDataRegex };
//     }

//     paymentIntents = await paymentIntentSchema.find(filter);

  
//     res.status(200).json(paymentIntents);
//   } catch (error) {

//     res.status(500).json({ error: error.message });
//   }
// });
// const PaymentStatus = require('./PaymentStatus');

// router.get('/get-payment-intents', async (req, res) => {
//   try {
//     // let paymentIntents;
//     const { startDate, endDate, Orderstatus } = req.query;

//     let filter = {};

//  let filters = {};
//     if (startDate && endDate) {
//       filter.createdAt = { $gte: new Date(startDate), $lte: new Date(endDate) };
//       filters.createdAt = { $gte: new Date(startDate), $lte: new Date(endDate) };
//     } else if (startDate) {
//       filter.createdAt = { $gte: new Date(startDate) };
//       filters.createdAt = { $gte: new Date(startDate) };

//     } else if (endDate) {
//       filter.createdAt = { $lte: new Date(endDate) };
//       filters.createdAt = { $lte: new Date(endDate) };
//     }

//     if (Orderstatus) {
//       const orderStatusRegex = new RegExp(Orderstatus, 'i');
//       filter.Orderstatus = { $regex: orderStatusRegex };
//       filters.Orderstatus = { $regex: orderStatusRegex };
//     }

//     // Include filter for paymentData being "Cash on delivery"
//     // filter['paymentData'] = "Cash on delivery";

//     const paymentStatuses = await PaymentStatus.find({}, 'clientSecret');

//     const clientSecrets = paymentStatuses.map(status => status.clientSecret);



//     const clie= await paymentIntentSchema.find({},'paymentData.client_secret');
//     const clieSecrets = clie.map(item => item?.paymentData?.client_secret).filter(secret => secret);
//     console.log("clientSecrets:", clientSecrets);
//     console.log("clieSecrets:", clieSecrets);

// // Check if both arrays are empty
//    console.log("clientSecrets Length:", clientSecrets.length);
//    console.log("clieSecrets Length:", clieSecrets.length);

// // Find secret keys present in clientSecrets but not in clieSecrets
//     const uniqueSecrets = clieSecrets.filter(secret => !clientSecrets.includes(secret));
//    filters['paymentData.client_secret'] = { $in: uniqueSecrets };
//    filter['paymentData'] = "Cash on delivery";
//     const paymentIntents1 = await paymentIntentSchema.find(filter);
//     const paymentIntents2=await paymentIntentSchema.find(filters);
//     const paymentIntents = { paymentIntents1, paymentIntents2 };

//     // Respond with the retrieved payment intents
//     res.status(200).json(paymentIntents);
//   } catch (error) {
//     // If an error occurs, respond with an error message
//     res.status(500).json({ error: error.message });
//   }
// });

router.get('/get-payment-intents', authenticateToken, async (req, res) => {
  try {
    let paymentIntents;
    const { startDate, endDate, Orderstatus, paymentData } = req.query;

    let filter = {};

    if (startDate && endDate) {
      filter.createdAt = { $gte: new Date(startDate), $lte: new Date(endDate) };
    } else if (startDate) {
      filter.createdAt = { $gte: new Date(startDate) };
    } else if (endDate) {
      filter.createdAt = { $lte: new Date(endDate) };
    }

    if (Orderstatus) {
      // Remove additional encoding and use the value directly
      const orderStatusRegex = new RegExp(Orderstatus, 'i');
      filter.Orderstatus = { $regex: orderStatusRegex };
    }

    if (paymentData) {
      const paymentDataRegex = new RegExp(paymentData, 'i');
      filter.paymentData = { $regex: paymentDataRegex };
    }

    // Include PayStatus as Failed in the filter
    filter.PayStatus = 'success';

    // Sort by createdAt in descending order (-1 indicates descending order)
    const sortCriteria = { createdAt: -1 };

    paymentIntents = await paymentIntentSchema.find(filter).sort(sortCriteria);

    res.status(200).json(paymentIntents);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});



router.get('/get-payment-intent-by-id/:orderId',authenticateToken, async (req, res) => {
  try {
    const { orderId } = req.params;

    const paymentIntent = await paymentIntentSchema.findOne({ orderId });

    if (!paymentIntent) {
      return res.status(404).json({ error: 'Payment intent not found' });
    }

    res.status(200).json(paymentIntent);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.get('/get-payment-intent/:orderId', async (req, res) => {
  try {
    const { orderId } = req.params;

    const paymentIntent = await paymentIntentSchema.findOne({ orderId });

    if (!paymentIntent) {
      return res.status(404).json({ error: 'Payment intent not found' });
    }

    res.status(200).json(paymentIntent);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// router.get('/get-payment-intent-by-id/:paymentIntentId', async (req, res) => {
//   try {
//     const { paymentIntentId } = req.params;
    

//     const paymentIntent = await paymentIntentSchema.findById(paymentIntentId);

//     if (!paymentIntent) {
//       return res.status(404).json({ error: 'Payment intent not found' });
//     }

//     res.status(200).json(paymentIntent);
//   } catch (error) {
//     res.status(500).json({ error: error.message });
//   }
// });



router.post('/refund-form', async (req, res) => {
  try {
    const data = req.body;
    // Create a new instance of RefundData with the data from the request body
    const newRefund = new RefundData({
      paymentIntentId: data._id,
      name: data.name,
      transactionId: data.paymentId,
      country: data.country,
      state: data.state,
      city: data.city,
      houseNumber: data.houseNumber,
      landmark: data.landmark,
      phone: data.phone,
      phone2: data.phone2,
      reason: data.note,
      userId: data.userId,
      orderId: data.orderId,
      
      // Add other fields as needed based on your RefundData model
    });
    // Save the new refund data to the database
    const savedProduct = await newRefund.save();
    res.status(200).json(savedProduct);
  } catch (error) {

    res.status(500).json({ error: 'Something went wrong...' });
  }
});



router.get('/get-ordered-items/:userId', async (req, res) => {
  try {
    const userId = req.params.userId;
    // Query the database to find ordered items based on userId and project specific fields
    const orderedItems = await paymentIntentSchema.find(
      { 'user.id': userId },
      {
        'updatedCartItems': 1,
        'total':1,
        'Orderstatus': 1,
        'paymentData.amount': 1,
        'couponData':1,
        '_id':1,
        'createdAt':1,
        'orderId':1,
      }
    );

    return res.status(200).json(orderedItems);
  } catch (error) {
    
    res.status(500).json({ error: 'Internal Server Error' });
  }
});


router.put('/update-status/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { Orderstatus } = req.body;

    const updatedPaymentIntent = await paymentIntentSchema.findByIdAndUpdate(
      id,
      { Orderstatus },
      { new: true }
    );

    res.status(200).json(updatedPaymentIntent);
  } catch (error) {
    console.error('Error updating payment intent status:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});



router.get('/allRefundData', async (req, res) => {
  try {
    const { status, orderId } = req.query;

    let query = {};

    if (status) {
      query.status = status;
    }

    if (orderId) {
      query.orderId = orderId;
    }

    const filteredRefundData = await RefundData.find(query);

    res.json(filteredRefundData);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// router.get('/allRefundForm/:orderId', async (req, res) => {
//   try {
  
//     const { orderId } = req.params;

//     let query = { orderId };

    

//     const filteredRefundData = await RefundData.find(query);

//     res.json(filteredRefundData);
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ error: 'Internal Server Error' });
//   }
// });


router.get('/allRefundForm/:orderId', async (req, res) => {
  try {
    const { orderId } = req.params;

    const paymentIntent = await RefundData.findOne({ orderId });

    if (!paymentIntent) {
      return res.status(404).json({ error: 'Not found' });
    }

    res.status(200).json(paymentIntent);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});


router.put('/update-Refundstatus/:orderId', async (req, res) => {
  try {
    const { orderId } = req.params;
    const { status } = req.body;

    // Validate if status is provided
    if (!status) {
      return res.status(400).json({ error: 'Status is required for update' });
    }

    // Find the refund data based on orderId
    const refundData = await RefundData.findOne({ orderId });

    // Check if refund data with the provided orderId exists
    if (!refundData) {
      return res.status(404).json({ error: 'Refund data not found' });
    }

    // Update the status
    refundData.status = status;

    // Save the updated refund data
    await refundData.save();

    res.json({ message: 'Status updated successfully', refundData });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});




// const PaymentIntent = require('../models/Payment/Payment');

// router.get('/ordersByProductId/:productId', async (req, res) => {
//   try {
//     const { productId } = req.params;

//     // Aggregate to find orders containing the specified productId
//     const orders = await PaymentIntent.aggregate([
//       // Unwind the updatedCartItems array
//       { $unwind: '$updatedCartItems' },
//       // Match documents containing the specified productId
//       { $match: { 'updatedCartItems.productId': productId } },
//       // Group by orderId to get unique orderIds
//       { $group: { _id: '$orderId' } }
//     ]);

//     if (!orders || orders.length === 0) {
//       return res.status(404).json({ message: 'No orders found for the specified productId' });
//     }

//     // Extract orderId from the aggregation result
//     const orderIds = orders.map(order => order._id);

//     // Return the list of orderIds
//     res.json({ orderIds });
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ message: 'Server Error' });
//   }
// });

const PaymentIntent = require('../models/Payment/Payment');

router.get('/ordersByProductId/:productId', async (req, res) => {
  try {
    const { productId } = req.params;
    const { startDate, endDate } = req.query; // Get startDate and endDate from query parameters

    // Initialize the match object with the productId
    let match = { 'updatedCartItems.productId': productId };

    // If startDate and endDate are provided, add date filtering to the match object
    if (startDate && endDate) {
      // Convert startDate and endDate strings to Date objects
      const start = new Date(startDate);
      const end = new Date(endDate);

      // Ensure both startDate and endDate are valid dates
      if (isNaN(start.getTime()) || isNaN(end.getTime())) {
        return res.status(400).json({ message: 'Invalid date format' });
      }

      // Add date range filtering to the match object
      match.createdAt = { $gte: start, $lte: end };
    }

    // Aggregate to find orders containing the specified productId and within the date range (if provided)
    const orders = await PaymentIntent.aggregate([
      // Match documents containing the specified productId and createdAt within the date range (if provided)
      { $match: match },
      // Unwind the updatedCartItems array
      { $unwind: '$updatedCartItems' },
      // Match documents containing the specified productId again (in case there are multiple products in an order)
      { $match: { 'updatedCartItems.productId': productId } },
      // Group by orderId to get unique orderIds
      { $group: { _id: '$orderId' } }
    ]);

    if (!orders || orders.length === 0) {
      return res.status(404).json({ message: 'No orders found for the specified productId and date range' });
    }

    // Extract orderId from the aggregation result
    const orderIds = orders.map(order => order._id);

    // Return the list of orderIds
    res.json({ orderIds });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server Error' });
  }
});




module.exports = router;