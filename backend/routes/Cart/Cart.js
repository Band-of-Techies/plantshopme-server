const express = require('express');
const router = express.Router();
const Cart = require('../../models/Cart/Cart'); // Assuming your model file is named cartModel.js
const { DateTime } = require('luxon');
const Pot = require('../../models/Pot/Pot')
const Length = require('../../models/PlantLength/Length');
const Product = require('../../models/AddProduct/AddProduct');
const FlashSale =  require("../../models/FlashSale/FlashSales")  

// POST request to add a new item to the cart
// router.post('/cart', async (req, res) => {
//   try {
//     const { userId, productId } = req.body;

//     // Check if a cart item with the same userId and _id already exists
//     const existingCartItem = await Cart.findOne({ userId, productId ,totalPrice});

//     if (existingCartItem) {
//       // If it exists, update the existing cart item
//       await Cart.findByIdAndUpdate(existingCartItem._id, req.body, { new: true });
//       res.status(200).json({ message: 'Cart item updated...' });
//     } else {
//       // If it doesn't exist, create a new cart item
//       const cartItem = await Cart.create(req.body);
//       res.status(201).json({ message: 'added successfully...' });
//     }
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ error: 'Internal Server Error' });
//   }
// });
router.post('/cart', async (req, res) => {

  try {
    const { userId, productId, dimension } = req.body;
    console.log(userId, productId,dimension);

      // Check if a cart item with the same userId, productId, potName._id, and size._id already exists
    const existingCartItem = await Cart.findOne({ userId, productId, dimension });

    if (existingCartItem) {
      // If it exists, update the existing cart item
      await Cart.findByIdAndUpdate(existingCartItem._id, req.body, { new: true });
      res.status(200).json({ message: 'Cart item updated...' });
    } else {
      // If it doesn't exist, create a new cart item
      const cartItem = await Cart.create(req.body);
      res.status(201).json({ message: 'Added successfully...' });
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});



// GET request to retrieve all cart items
router.get('/cart', async (req, res) => {
  try {
    const cartItems = await Cart.find();

    let isFlashSaleActive = false;
    if (cartItems) {
      if (cartItems.Status && cartItems.Status === 'Unlimited') {
        const cartProduct = await FlashSale.findById({ ProductId: cartItems.productId });
        isFlashSaleActive = cartProduct && cartProduct.Status === 'Unlimited';
      }
      else{
        const flashSaleStartTime = new Date(cartItems.StartDate);
        const flashSaleEndTime = new Date(flashSaleStartTime);
        flashSaleEndTime.setHours(flashSaleEndTime.getHours() + cartItems.TimeInHours);
        const startTimeParts = cartItems.StartTime.split(':');
        flashSaleEndTime.setHours(parseInt(startTimeParts[0], 10));
        flashSaleEndTime.setMinutes(parseInt(startTimeParts[1], 10));
  
        const currentTime = new Date();
        isFlashSaleActive = currentTime >= flashSaleStartTime && currentTime <= flashSaleEndTime;
      }
      
    }

    if (!isFlashSaleActive) {
      // Remove specific properties from cartItems
      cartItems.forEach((item) => {
        delete item.flashSalePrice;
        delete item.flashSaleStartDate;
        delete item.flashSaleStartTime;
        delete item.flashSaleDiscount;
        delete item.Status;
      });
    }
    
    res.status(200).json(cartItems);
  } catch (error) {
    res.status(500).json({ error: 'Internal Server Error' });
  }
});


// router.get('/cart/:userId', async (req, res) => {
//   try {
//     let cartItems = await Cart.find({ userId: req.params.userId });

//     for (let i = 0; i < cartItems.length; i++) {
     
//       // validating flash sale info and price if there is a flash sale

//       if (cartItems[i].flashSaleStartDate &&
//         cartItems[i].flashSaleStartTime&&
//         cartItems[i].flashSaleEndTime &&
//         cartItems[i].flashSaleDiscount) {

//         const { flashSaleStartDate, flashSaleStartTime, flashSaleEndTime } = cartItems[i];
//         // Create a Luxon DateTime for flashSaleStartDate and set the timezone to UAE
//         const startDate = DateTime.fromJSDate(flashSaleStartDate, { zone: 'Asia/Dubai' });

//         // Split flashSaleStartTime into hours and minutes
//         const [hours, minutes] = flashSaleStartTime.split(':').map(Number);

      
//         const startTime = startDate.set({ hour: hours, minute: minutes });

//         // Calculate the end time by adding flashSaleEndTime hours
//         const endTime = startTime.plus({ hours: flashSaleEndTime });

//         // Get the current DateTime in the same timezone
//         const now = DateTime.now().setZone('Asia/Dubai');

//         if (now > endTime) {

//           // Update cart item in the database
//           let result = await Cart.updateOne({ _id: cartItems[i]._id }, {
//             $unset: {
//               flashSalePrice: "",
//               flashSaleStartDate: "",
//               flashSaleStartTime: "",
//               flashSaleEndTime: "",
//               flashSaleDiscount: ""
//             }
//           });
//         }
//       }
//     }

//     // Get updated cart items
//     cartItems = await Cart.find({ userId: req.params.userId });

//     res.status(200).json(cartItems);
//   } catch (error) {

//     res.status(500).json({ error: 'Internal Server Error' });
//   }
// });

router.get('/cart/:userId', async (req, res) => {
  try {
    let cartItems = await Cart.find({ userId: req.params.userId });

    for (let i = 0; i < cartItems.length; i++) {
      // Fetch the product from the Product table
      const product = await Product.findById(cartItems[i].productId);

      if (product) {
        // Add a new entry as stock in the cart item
        cartItems[i].price = product.price
        cartItems[i].stock = product.stock; // replace 'stock' with the actual field name in the Product model

        // Save the updated cart item
        await cartItems[i].save();
      }

      if (cartItems[i].Status && cartItems[i].Status === 'Unlimited') {
        const flashSaleInfo = await FlashSale.findOne({ ProductId: cartItems[i].productId });
        // const cartProduct = await FlashSale.findById({ ProductId: cartItems.productId });
       const isFlashSaleActive = flashSaleInfo && flashSaleInfo.Status === 'Unlimited';
       if(!isFlashSaleActive){
        let result = await Cart.updateOne({ _id: cartItems[i]._id }, {
          $unset: {
            flashSalePrice: "",
            flashSaleDiscount: "",
            Status:"",
          }
        });
       }
      }

      // validating flash sale info and price if there is a flash sale
      if (cartItems[i].flashSaleStartDate &&
        cartItems[i].flashSaleStartTime &&
        cartItems[i].flashSaleEndTime &&
        cartItems[i].flashSaleDiscount) {

        const { flashSaleStartDate, flashSaleStartTime, flashSaleEndTime } = cartItems[i];
        // Create a Luxon DateTime for flashSaleStartDate and set the timezone to UAE
        const startDate = DateTime.fromJSDate(flashSaleStartDate, { zone: 'Asia/Dubai' });

        // Split flashSaleStartTime into hours and minutes
        const [hours, minutes] = flashSaleStartTime.split(':').map(Number);

        const startTime = startDate.set({ hour: hours, minute: minutes });

        // Calculate the end time by adding flashSaleEndTime hours
        const endTime = startTime.plus({ hours: flashSaleEndTime });

        // Get the current DateTime in the same timezone
        const now = DateTime.now().setZone('Asia/Dubai');

        if (now > endTime) {
          // Update cart item in the database
          let result = await Cart.updateOne({ _id: cartItems[i]._id }, {
            $unset: {
              flashSalePrice: "",
              flashSaleStartDate: "",
              flashSaleStartTime: "",
              flashSaleEndTime: "",
              flashSaleDiscount: ""
            }
          });
        }
      }
    }

    // Get updated cart items
    cartItems = await Cart.find({ userId: req.params.userId });

    res.status(200).json(cartItems);
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});
router.delete('/cart/:userId/:itemId', async (req, res) => {
  try {
    // Find the cart item by user ID and item ID and remove it
    const deletedCartItem = await Cart.findOneAndRemove({
      userId: req.params.userId,
      productId: req.params.itemId,
    });
    if (!deletedCartItem) {
      return res.status(404).json({ error: 'Cart item not found' });
    }

    // Respond with a success message or any other relevant response
    res.status(200).json({ message: 'Cart item removed successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

module.exports = router;
