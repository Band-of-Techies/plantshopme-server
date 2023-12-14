
const express = require('express');
const router = express.Router();
const Coupon = require('../../models/Coupons/Coupons');
const CouponUsage = require('../../models/Coupons/Usages');

router.use(express.json());


router.post('/Addcoupons', async (req, res) => {
  try {
    const existingCoupon = await Coupon.findOne({ code: req.body.code });
    if (existingCoupon) {
      return res.status(400).send({ error: 'Coupon code must be unique.' });
    }

   
    if (req.body.code.length < 5) {
      return res.status(400).send({
        error: 'Coupon code must be at least 5 characters long.',
      });
    }

    const coupon = new Coupon(req.body);
    await coupon.save();
    res.status(201).send(coupon);
  } catch (error) {
    console.error(error);
    res.status(400).send({ error: 'Invalid data. Please check your input.' });
  }
});


router.get('/GetCoupon/:id', async (req, res) => {
    try {
      const coupon = await Coupon.findById(req.params.id);
      if (!coupon) {
        return res.status(404).send({ error: 'Coupon not found.' });
      }
  
      res.status(200).send(coupon);
    } catch (error) {
      console.error(error);
      res.status(500).send({ error: 'Internal Server Error.' });
    }
  });
  


router.get('/GetAllCoupons', async (req, res) => {
    try {
      // Extract filter parameters from the request query
      const { startDate, endDate } = req.query;
  
      // Implement your filtering logic based on startDate and endDate
      // For example, use mongoose queries to filter coupons based on date range
      let filter = {};
      if (startDate && endDate) {
        filter = {
          startDate: { $gte: startDate },
          endDate: { $lte: endDate },
        };
      }
  
      const coupons = await Coupon.find(filter);
  
      res.status(200).send(coupons);
    } catch (error) {
      console.error(error);
      res.status(500).send({ error: 'Internal Server Error.' });
    }
  });
  

  router.get('/GetAllValidCoupons', async (req, res) => {
    try {
      const coupons = await Coupon.find();

      const currentDate = new Date();

      const validCoupons = coupons.filter(coupon => {
          const startDate = new Date(coupon.startDate);
          const endDate = new Date(coupon.endDate);
      
          return startDate <= currentDate && currentDate <= endDate;
      });
      
      res.status(200).send(validCoupons);
    } catch (error) {
      console.error(error);
      res.status(500).send({ error: 'Internal Server Error.' });
    }
});
  

router.put('/UpdateCoupon/:id', async (req, res) => {
    try {
      const existingCoupon = await Coupon.findById(req.params.id);
      if (!existingCoupon) {
        return res.status(404).send({ error: 'Coupon not found.' });
      }
  
      // Update the coupon data
      existingCoupon.set(req.body);
      await existingCoupon.save();
  
      res.status(200).send(existingCoupon);
    } catch (error) {
      console.error(error);
      res.status(500).send({ error: 'Internal Server Error.' });
    }
  });
  
  // Delete a coupon by ID
  router.delete('/DeleteCoupon/:id', async (req, res) => {
    try {
      const coupon = await Coupon.findByIdAndDelete(req.params.id);
      if (!coupon) {
        return res.status(404).send({ error: 'Coupon not found.' });
      }
  
      res.status(200).send({ message: 'Coupon deleted successfully.' });
    } catch (error) {
      console.error(error);
      res.status(500).send({ error: 'Internal Server Error.' });
    }
  });
  



  // router.post('/useCoupon', async (req, res) => {
  //   try {
  //     const { customerId, name, couponId, couponCode, value, date, finalProductPrice } = req.body;
  
      
  //     const isValidCoupon = await Coupon.find(couponId);
  //     if (!isValidCoupon) {
  //       return res.status(400).send({ error: 'Invalid coupon.' });
  //     }
  
     
  //     const couponUsage = new CouponUsage({
  //       customerId,
  //       name,
  //       couponId,
  //       couponCode,
  //       value,
  //       date,
  //       finalProductPrice,
  //     });
  
  //     await couponUsage.save();
  //     res.status(201).send(couponUsage);
  //   } catch (error) {
  //     console.error(error);
  //     res.status(500).send({ error: 'Internal Server Error.' });
  //   }
  // });
  

  
  
// router.post('/useCoupon', async (req, res) => {
//     try {
//       const { couponCode, customerId, finalProductPrice } = req.body;
  
//       // Find the coupon by code
//       const coupon = await Coupon.findOne({ code: couponCode });
//       if (!coupon) {
//         return res.status(400).send({ error: 'Invalid coupon code.' });
//       }
  
//       // Check coupon validity, start date, end date, and usage type
//       const currentDate = new Date();
//       if (currentDate < coupon.startDate || currentDate > coupon.endDate) {
//         return res.status(400).send({ error: 'Coupon is not valid during this period.' });
//       }
  
//       // Check if the coupon has already been used by the customer for single-use coupons
//       if (coupon.usage === 'Single') {
//         const usedCoupon = await CouponUsage.findOne({ couponCode });
//         if (usedCoupon) {
//           return res.status(400).send({ error: 'Coupon has already been used.' });
//         }
//       }
// else{
//       if (coupon.usage === 'Multiple') {
//         const usedCoupon = await CouponUsage.findOne({ couponCode, customerId });
//         if (usedCoupon) {
//           return res.status(400).send({ error: 'Coupon has already been used by this customer.' });
//         }
//       }
//     }
//       // Calculate the final product price based on the coupon type
//       let discountedPrice;
//       if (coupon.type === 'Percentage') {
//         discountedPrice = finalProductPrice - (finalProductPrice * coupon.value) / 100;
//       } else if (coupon.type === 'Flat') {
//         discountedPrice = finalProductPrice - coupon.value;
//       } else {
//         return res.status(400).send({ error: 'Invalid coupon type.' });
//       }
  
//       // Create a CouponUsage record
//       const couponUsage = new CouponUsage({
//         customerId,
//         name: 'Customer Name', // You may fetch customer name from the database
//         couponId: coupon._id,
//         couponCode,
//         value: coupon.value,
//         date: currentDate,
//         finalProductPrice: discountedPrice,
//       });
  
//       await couponUsage.save();
//       res.status(201).send({ message: 'Coupon used successfully.', discountedPrice });
//     } catch (error) {
//       console.error(error);
//       res.status(500).send({ error: 'Internal Server Error.' });
//     }
//   });
  

router.post('/useCoupon', async (req, res) => {
  try {
    const { couponCode, customerId, finalProductPrice } = req.body;

    // Find the coupon by code
    const coupon = await Coupon.findOne({ code: couponCode });
    if (!coupon) {
      return res.status(400).send({ error: 'Invalid coupon code.' });
    }

    // Check coupon validity, start date, end date, and usage type
    const currentDate = new Date();
    if (currentDate < coupon.startDate || currentDate > coupon.endDate) {
      return res.status(400).send({ error: 'Coupon is not valid during this period.' });
    }

    // Check if the coupon has already been used by the customer for single-use coupons
    if (coupon.usage === 'Single') {
      const usedCoupon = await CouponUsage.findOne({ couponCode });
      if (usedCoupon) {
        return res.status(400).send({ error: 'Coupon has already been used.' });
      }
    } else if (coupon.usage === 'Multiple') {
      // Check if the coupon has already been used by this customer
      const usedCoupon = await CouponUsage.findOne({ couponCode, customerId });
      if (usedCoupon) {
        return res.status(400).send({ error: 'Coupon has already been used by this customer.' });
      }
    }

    // Calculate the final product price based on the coupon type
    let discountedPrice;
    if (coupon.type === 'Percentage') {
      discountedPrice = finalProductPrice - (finalProductPrice * coupon.value) / 100;
    } else if (coupon.type === 'Flat') {
      discountedPrice = finalProductPrice - coupon.value;
    } else {
      return res.status(400).send({ error: 'Invalid coupon type.' });
    }

    // Check if the discounted price is greater than or equal to minvalue
    if (coupon.minvalue && discountedPrice < coupon.minvalue) {
      return res.status(400).send({ error: 'Discounted price is below minvalue.' });
    }

    // Create a CouponUsage record
    const couponUsage = new CouponUsage({
      customerId,
      name: 'Customer Name', // You may fetch customer name from the database
      couponId: coupon._id,
      couponCode,
      value: coupon.value,
      date: currentDate,
      finalProductPrice: discountedPrice,
    });

    await couponUsage.save();
    res.status(201).send({ message: 'Coupon used successfully.', discountedPrice });
  } catch (error) {
    console.error(error);
    res.status(500).send({ error: 'Internal Server Error.' });
  }
});



module.exports = router;
