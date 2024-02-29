const express = require('express');
const router = express.Router();
const Order = require('../../models/Notification/Notification'); // Import the schema

// POST route to insert or update an order
router.post('/Notification', async (req, res) => {
  try {
    // Extract orderId and status from the request body
    const { orderId, status } = req.body;

    // Validate request body
    if (!orderId) {
      return res.status(400).json({ error: 'Order ID is required' });
    }

    // Check if an order with the same orderId exists
    let existingOrder = await Order.findOne({ orderId });

    
    if (existingOrder) {
      existingOrder.status = existingOrder.status; // Update status if provided
      await existingOrder.save();
      return res.status(200).json(existingOrder); // Respond with the updated order document
    }

    // Create a new order document
    const newOrder = new Order({
      orderId,
      status: status || 'not' 
    });

    // Save the new order document to the database
    const savedOrder = await newOrder.save();

    res.status(201).json(savedOrder); // Respond with the saved order document
  } catch (error) {
    console.error('Error inserting/updating order:', error);
    res.status(500).json({ error: 'Failed to insert/update order' });
  }
});



router.get('/Notification', async (req, res) => {
    try {
      // Find orders with status not equal to 'not'
      const orders = await Order.find({ status: { $ne: 'seen' } });
      // Extract orderId from the retrieved orders
      
      const orderIds = orders.map(order => order.orderId);
      
      res.status(200).json(orderIds); // Respond with the array of order IDs
    } catch (error) {
      console.error('Error fetching orders with status not "not":', error);
      res.status(500).json({ error: 'Failed to fetch orders' });
    }
  });

  router.put('/Notification/:orderId', async (req, res) => {
  try {
    const orderId = req.params.orderId;

    // Find the order by orderId and update its status to 'seen'
    const updatedOrder = await Order.findOneAndUpdate(
      { orderId },
      { $set: { status: 'seen' } },
      { new: true }
    );

    if (!updatedOrder) {
      return res.status(404).json({ error: 'Order not found' });
    }

    res.status(200).json(updatedOrder); // Respond with the updated order
  } catch (error) {
    console.error('Error updating order status to "seen":', error);
    res.status(500).json({ error: 'Failed to update order status' });
  }
});

module.exports = router;
