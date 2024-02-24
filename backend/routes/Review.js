const express = require('express');
const router = express.Router();
const Review = require("../models/Review")


  
  // Get all reviews
  router.get('/reviews', async (req, res) => {
    try {
      const reviews = await Review.find();
      res.json(reviews);
    } catch (error) {
      res.status(500).json({ error: 'Unable to fetch reviews' });
    }
  });

//post all reviews
router.post('/reviews/:id', async (req, res) => {
  try {
    // Ensure that the required fields are provided in the request body
    const { userId, product_id, content, rating } = req.body;

    // Create a new Review instance
    const review = new Review({
      userId,
      product_id,
      content,
      rating,
    });

    // Save the review
    await review.save();

    // Send a success response
    res.status(201).json({ msg: 'Review successfully added'});
  } catch (error) {
    // console.log(error);
    res.status(500).json({ msg: 'Unable to create a review' });
  }
});


  // Get a specific review by ID
  router.get('/reviews/:id', async (req, res) => {
    try {
      const review = await Review.findById(req.params.id);
      if (!review) {
        return res.status(404).json({ error: 'Review not found' });
      }
      res.json(review);
    } catch (error) {
      res.status(500).json({ error: 'Unable to fetch the review' });
    }
  });
  
  // Update a specific review by ID
  router.put('/reviews/:id', async (req, res) => {
    try {
      const review = await Review.findByIdAndUpdate(req.params.id, req.body, { new: true });
      if (!review) {
        return res.status(404).json({ error: 'Review not found' });
      }
      res.json(review);
    } catch (error) {
      res.status(500).json({ error: 'Unable to update the review' });
    }
  });
  
  // Delete a specific review by ID
  router.delete('/reviews/:id', async (req, res) => {
    try {
      const review = await Review.findByIdAndRemove(req.params.id);
      if (!review) {
        return res.status(404).json({ error: 'Review not found' });
      }
      res.json({ msg: 'Review deleted' });
    } catch (error) {
      res.status(500).json({ error: 'Unable to delete the review' });
    }
  });


  module.exports = router;