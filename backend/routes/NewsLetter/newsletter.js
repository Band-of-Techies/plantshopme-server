const express = require('express');
const router = express.Router();
const nodemailer = require('nodemailer');
const NewsletterModel = require('../../models/Newsletters/newsletters');


const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: 'myplantstore11@gmail.com', 
        pass: 'bxcstfyfelooauxh'
    }
});


router.post('/send-content', async (req, res) => {
    try {
        const { selectedEmails, subject, content } = req.body;

        if (!Array.isArray(selectedEmails)) {
            return res.status(400).json({ message: 'selectedEmails must be an array of email addresses.' });
        }

        
        if (!subject || !content) {
            return res.status(400).json({ message: 'Subject and content are required.' });
        }

        
        const subscribers = await NewsletterModel.find({ email: { $in: selectedEmails } });

       
        for (const subscriber of subscribers) {
            const mailOptions = {
                from: 'your-email@gmail.com',
                to: subscriber.email,
                subject: subject,
                text: content
            };

           
            await transporter.sendMail(mailOptions);
            console.log(`Content sent to ${subscriber.email}`);
        }

        res.status(200).json({ message: 'Content sent successfully!' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
});


router.post('/submit-newsletter', async (req, res) => {
    console.log('body',req.body);
    try {
        const { userName, email } = req.body;
        const username = userName || email.split('@')[0];

        const existingUser = await NewsletterModel.findOne({ email });

        if (existingUser) {
            return res.status(409).json({ message: 'Email already exists.' });
        }

        const newUser = new NewsletterModel({ userName:username, email });
        await newUser.save();

        res.status(201).json({ message: 'Subscribed successfully...!' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
});

router.get('/all-subscribers', async (req, res) => {
    try {
        let query = {};

        const { username, email } = req.query;

       
        if (username) {
            query.userName = { $regex: new RegExp(username, 'i') }; 
        }

        if (email) {
            query.email = { $regex: new RegExp(email, 'i') }; 
        }

        const subscribers = await NewsletterModel.find(query, 'userName email');
        res.status(200).json(subscribers);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
});


module.exports = router;
