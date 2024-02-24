const express = require('express');
const bodyParser = require('body-parser');
const twilio = require('twilio');

const router = express.Router(); // Define a router

const accountSid = 'AC3a55416d47f04cfb8f8de12a33da91b1';
const authToken = '1c06943788680e2fe15c47490df7398d';
const client = twilio(accountSid, authToken);

router.use(bodyParser.json()); // Use bodyParser.json() with the router

router.post('/send-sms', (req, res) => {
    const { to } = req.body;
    const from = '+16592773845'; // Replace with your Twilio phone number
    const body='Thank you for your order! Your purchase has been successfully placed. We will notify you once your items are on their way'
    client.messages.create({
        body: body,
        to: to,
        from: from
    })
    .then(() => {
        res.send('SMS sent successfully');
    })
    .catch((err) => {
        console.error(err);
        res.status(500).send('Error sending SMS');
    });
});

module.exports = router; // Export the router
