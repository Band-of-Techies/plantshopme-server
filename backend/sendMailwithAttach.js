const express = require('express');
const router = express.Router();
const nodemailer = require('nodemailer');
const MainCategory = require('./models/Invoice/invoice');

router.post('/send-email-with-attachment', async (req, res) => {
    try {
        const { OrderId, to, name } = req.body;

        // Validate inputs
        if (!OrderId || !to) {
            return res.status(400).json({ error: "Missing required fields" });
        }

        // Find the MainCategory with the provided OrderId
        const mainCategory = await MainCategory.findOne({ OrderId });

        // If MainCategory with the provided OrderId does not exist, return an error
        if (!mainCategory) {
            return res.status(404).json({ error: "Order with the specified OrderId does not exist" });
        }

        // Set up nodemailer transporter
        const transporter = nodemailer.createTransport({
            host: process.env.HOST,
            service: process.env.SERVICE,
            port: Number(process.env.EMAIL_PORT),
            secure: Boolean(process.env.SECURE),
            auth: {
                user: process.env.USER,
                pass: process.env.PASS,
            },
        });
// Set email options
const mailOptions = {
    from: process.env.USER,
    to: to,
    subject: `Order Placed successfully.`,
    text: `Hi ${name},
    Your order Id ${OrderId} has been successfully placed. Below, you'll find your invoice containing all the essential information. 
    You can track the status of your order on our website.
    Thank you for choosing us!`,
    attachments: [
      {
        filename: mainCategory.Invoice.filename,
        path: './InvoiceFolder/' + mainCategory.Invoice.filename,
      },
    ],
  };
  
          

        // Send email
        await transporter.sendMail(mailOptions);
        console.log('Email sent successfully');
        res.status(200).send('Email sent successfully');
    } catch (error) {
        console.error('Error sending email:', error);
        res.status(500).send('Failed to send email');
    }
});

module.exports = router;
