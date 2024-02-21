const express = require('express');
const router = express.Router();
const nodemailer = require('nodemailer');

router.post('/send-email-with-attachment', async (req, res) => {
//    / Extract filename and filepath from request body

    try {
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

        const mailOptions = {
            from: process.env.USER,
            to: 'rahulcv447@gmail.com',
            subject: 'Invoice',
            text: 'InvoiceText',
            attachments: [
                {
                    filename: 'Invoice', // Use the filename provided by the user
                    path: 'https://res.cloudinary.com/dlefujycs/image/upload/v1706468917/myPlantShop/essp0cumzw4d3wke3qn1.jpg', // Use the filepath provided by the user
                },
            ],
        };

        await transporter.sendMail(mailOptions);
        console.log('Email sent successfully');
        res.status(200).send('Email sent successfully');
    } catch (error) {
        console.error('Error sending email:', error);
        res.status(500).send('Failed to send email');
    }
});

module.exports = router;
