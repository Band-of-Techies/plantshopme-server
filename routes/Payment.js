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
        console.error('Error calculating order amount:', error);
        throw new Error('Oops, something went wrong...');
      }
    };
    

    let priceWithRedeem

    let isRedeem =false
    let currentPrice = await calculateOrderAmount();
   console.log('currentPrice' ,currentPrice);
   
    if(redeem){
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


    const paymentIntent = await stripe.paymentIntents.create({
      amount: currentPrice,
      currency: 'AED',
    });
    
    if (paymentIntent) {
      const newPaymentIntent = new paymentIntentSchema({
        updatedCartItems,
        shipping_fee,
        total:(currentPrice/100),
        user,
        checkoutData: checkoutData,
        paymentData: paymentIntent,
        couponData:isRedeem?redeem:'none',
        GoogleLocation:GoogleMap?GoogleMap:'none'
      });
      if (isRedeem) {
        const redeemCouponId = redeem._id;

        let user = await User.findById(updatedCartItems[0].userId);
        if (!user) {
          user = await GoogleUser.findById(updatedCartItems[0].userId);
        }

        if (user) {
            user.redeemCoupon.push({ couponId: redeem._id, redeemedAt: new Date() });
            await user.save();
        } else {
            throw new Error('User not found');
        }
    }
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
        console.error('Error calculating order amount:', error);
        throw new Error('Oops, something went wrong...');
      }
    };


    let priceWithRedeem

    let isRedeem =false
    let currentPrice = await calculateOrderAmount();

    if(redeem){
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
            let priceRedeem =( redeemData.value * 1);
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

    if (currentPrice) {
      const newPaymentIntent = new paymentIntentSchema({
        updatedCartItems,
        shipping_fee,
        total:(currentPrice/100),
        user,
        checkoutData: checkoutData,
        paymentData: 'Cash on delivery',
        couponData:isRedeem?redeem:'none',
        GoogleLocation:GoogleMap?GoogleMap:'none'
      });
      if (isRedeem) {
        const redeemCouponId = redeem._id;

        let user = await User.findById(updatedCartItems[0].userId);
        if (!user) {
          user = await GoogleUser.findById(updatedCartItems[0].userId);
        }

        if (user) {
            user.redeemCoupon.push({ couponId: redeem._id, redeemedAt: new Date() });
            await user.save();
        } else {
            throw new Error('User not found');
        }
    }
      await newPaymentIntent.save();
    }
    res.status(200).json('Order placed successfully...');
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error.message });
  }
});



// Backend route for getting payment intents
router.get('/get-payment-intents', async (req, res) => {
  try {
    let paymentIntents;
    const { startDate, endDate, Orderstatus } = req.query;

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
    

    paymentIntents = await paymentIntentSchema.find(filter);

  
    res.status(200).json(paymentIntents);
  } catch (error) {

    res.status(500).json({ error: error.message });
  }
});


router.get('/get-payment-intent-by-id/:paymentIntentId', async (req, res) => {
  try {
    const { paymentIntentId } = req.params;

    
    

    const paymentIntent = await paymentIntentSchema.findById(paymentIntentId);

    if (!paymentIntent) {
      return res.status(404).json({ error: 'Payment intent not found' });
    }

    res.status(200).json(paymentIntent);
  } catch (error) {
    res.status(500).json({ error: error.message });
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
        'Orderstatus': 1,
        'paymentData.amount': 1,
        'couponData':1,
        '_id':1,
        'createdAt':1,
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


module.exports = router;