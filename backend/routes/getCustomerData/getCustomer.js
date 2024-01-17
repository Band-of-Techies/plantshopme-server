const express = require('express');
const router = express.Router();
const { User:GoogleUser } = require("../../models/Token/customer");
const { User } = require("../../passport");

// Assuming coinTransactionSchema and couponTransactionSchema are defined somewhere
router.get('/getCustomerData', async (req, res) => {
  try {
    const { page = 1, limit = 20, search } = req.query;

    // Define the match conditions for filtering
    const matchConditions = {};

    // Check if the search parameter is present and use it for both email and name
    if (search) {
      matchConditions.$or = [
        { email: { $regex: new RegExp(search), $options: 'i' } },
        { name: { $regex: new RegExp(search), $options: 'i' } },
      ];
    }

    // Define the aggregate pipeline with match conditions
    const pipeline = [
      {
        $match: matchConditions,
      },
      {
        $project: {
          _id: 1,
          name: 1,
          email: 1,
          coins: 1,
          redeemCoupon: 1,
        },
      },
    ];

    // Execute the aggregate pipeline for GoogleUser
    const googleUserResults = await GoogleUser.aggregate(pipeline);

    // Execute the aggregate pipeline for User
    const userResults = await User.aggregate(pipeline);

    // Combine the results from both schemas
    const combinedResults = googleUserResults.concat(userResults);

    // Apply pagination
    const startIndex = (page - 1) * limit;
    const endIndex = page * limit;
    const paginatedResults = combinedResults.slice(startIndex, endIndex);

    // Calculate the number of pages
    const totalPages = Math.ceil(combinedResults.length / limit);

    // Respond with the paginated results and total pages
    res.json({ combinedResults: paginatedResults, totalPages });
  } catch (error) {
    console.error("Error fetching and combining data:", error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});



module.exports = router