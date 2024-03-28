const express = require('express');
const router = express.Router();
const paymentIntentSchema = require('../../models/Payment/Payment');
const { User: CustomerNorm } = require('../../models/Token/customer'); // Adjust the path accordingly
const { User: Cutomer } = require('../../passport'); // Adjust the path accordingly
const moment = require('moment');

router.get('/total-users', async (req, res) => {
  try {
    if (!CustomerNorm || !Cutomer) {
      return res.status(500).json({ error: 'Models not defined properly' });
    }

    const { status } = req.query;

    let customerNormCount;
    let customerCount;

    let filter = {};

    // Handle date filtering
    if (status === 'today') {
      filter.createdAt = {
        $gte: new Date(new Date().setHours(00, 00, 00)),
        $lte: new Date(new Date().setHours(23, 59, 59)),
      };
    } else if (status === 'thisMonth') {
      const currentDate = new Date();
      const firstDayOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);
      const lastDayOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0, 23, 59, 59);

      filter.createdAt = {
        $gte: firstDayOfMonth,
        $lte: lastDayOfMonth,
      };
    } else if (status !== 'total') {
      return res.status(400).json({ error: 'Invalid status parameter' });
    }

    // Count CustomerNorm
    customerNormCount = await CustomerNorm.countDocuments(filter);

    // Count Customer
    customerCount = await Cutomer.countDocuments(filter);

    const totalUsers = customerNormCount + customerCount;

    res.json({ totalUsers });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});



// router.get('/total-users', async (req, res) => {
//   try {
//     if (!CustomerNorm || !Cutomer) {
//       return res.status(500).json({ error: 'Models not defined properly' });
//     }

//     const { status } = req.query;

//     let customerNormCount;
//     let cutomerCount;

//     switch (status) {
//       case 'today':
//         customerNormCount = await CustomerNorm.countDocuments({
//           createdAt: {
//             $gte: moment().startOf('day').toDate(),
//             $lt: moment().endOf('day').toDate(),
//           },
//         });
//         cutomerCount = await Cutomer.countDocuments({
//           createdAt: {
//             $gte: moment().startOf('day').toDate(),
//             $lt: moment().endOf('day').toDate(),
//           },
//         });
//         break;

//       case 'thisMonth':
//         customerNormCount = await CustomerNorm.countDocuments({
//           createdAt: {
//             $gte: moment().startOf('month').toDate(),
//             $lt: moment().endOf('month').toDate(),
//           },
//         });
//         cutomerCount = await Cutomer.countDocuments({
//           createdAt: {
//             $gte: moment().startOf('month').toDate(),
//             $lt: moment().endOf('month').toDate(),
//           },
//         });
//         break;

//       case 'total':
//         customerNormCount = await CustomerNorm.countDocuments();
//         cutomerCount = await Cutomer.countDocuments();
//         break;

//       default:
//         return res.status(400).json({ error: 'Invalid status parameter' });
//     }

//     const totalUsers = customerNormCount + cutomerCount;

//     res.json({ totalUsers });
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ error: 'Internal Server Error' });
//   }
// });



//orders

router.get('/getorderfilter', async (req, res) => {
  try {
    let paymentIntents;
    const { dateRange, orderStatus } = req.query;

    let filter = {};

    // Handle date filtering
    if (dateRange === 'today') {
      filter.createdAt = {
        $gte: new Date(new Date().setHours(00, 00, 00)),
        $lte: new Date(new Date().setHours(23, 59, 59)),
      };
    } else if (dateRange === 'thisMonth') {
      const currentDate = new Date();
      const firstDayOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);
      const lastDayOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0, 23, 59, 59);

      filter.createdAt = {
        $gte: firstDayOfMonth,
        $lte: lastDayOfMonth,
      };
    } else if (dateRange === 'total') {
      // No specific date filtering for 'total'
    }

    // Handle order status filtering
    if (orderStatus) {
      const orderStatusRegex = new RegExp(orderStatus, 'i');
      filter.Orderstatus = { $regex: orderStatusRegex };
    }

    // Add condition for PayStatus
    filter.PayStatus = 'success';

    paymentIntents = await paymentIntentSchema.find(filter);

    res.status(200).json({ count: paymentIntents.length });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error.message });
  }
});


const Product = require('../../models/AddProduct/AddProduct'); // Adjust the path accordingly

router.get('/total-products', async (req, res) => {
  try {
    const totalProducts = await Product.countDocuments();
    res.json({ totalProducts });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});


router.get('/getamountfilter', async (req, res) => {
  try {
    let filter = {};
    const { dateRange, orderStatus } = req.query;

    if (dateRange === 'today') {
      filter.createdAt = {
        $gte: new Date(new Date().setHours(00, 00, 00)),
        $lte: new Date(new Date().setHours(23, 59, 59)),
      };
    } else if (dateRange === 'thisMonth') {
      const currentDate = new Date();
      const firstDayOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);
      const lastDayOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0, 23, 59, 59);

      filter.createdAt = {
        $gte: firstDayOfMonth,
        $lte: lastDayOfMonth,
      };
    } else if (dateRange === 'total') {
      
    }

    if (orderStatus) {
      const orderStatusRegex = new RegExp(orderStatus, 'i');
      filter.Orderstatus = { $regex: orderStatusRegex };
    }

    // Add condition for PayStatus
    filter.PayStatus = 'success';

    const result = await paymentIntentSchema.aggregate([
      { $match: filter },
      { $group: { _id: null, totalAmount: { $sum: '$total' } } },
      { $project: { _id: 0, totalAmount: 1 } },
    ]);

    const totalAmount = result.length > 0 ? result[0].totalAmount : 0;

    res.status(200).json({ totalAmount });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error.message });
  }
});





module.exports = router;
