const express = require('express');
const router = express.Router();
const MainCategory = require('../../models/Invoice/invoice');
const multer = require('multer');
const path = require('path');

// Set up multer to use disk storage
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'InvoiceFolder'); // Destination directory
    },
    filename: function (req, file, cb) {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname)); // Unique filename
    }
});
const upload = multer({ storage: storage });

router.post('/addInvoice', upload.single('Invoice'), async (req, res) => {
    try {
        const { OrderId } = req.body;

        // Check if the invoice file is present in the request
        if (!req.file) {
            return res.status(400).json({ error: "Invoice file is required" });
        }

        // Check if the OrderId already exists in the database
        const existingOrder = await MainCategory.findOne({ OrderId });

        if (existingOrder) {
            return res.status(400).json({ error: "Order with the same OrderId already exists" });
        }
       
            // Get the file path of the uploaded invoice
            const invoicePath = req.file.path;
        


        // Create a new MainCategory with the OrderId and invoice file details
        const mainCategory = new MainCategory({
            OrderId: OrderId,
            Invoice: {
                path: invoicePath,
                filename: req.file.filename
            }
        });

        // Save the MainCategory to the database
        await mainCategory.save();
    
        res.status(201).json(mainCategory);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

module.exports = router;
