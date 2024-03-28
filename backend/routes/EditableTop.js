const express = require('express');
const router = express.Router();
const EditableTop = require('../models/EditableTop.js');

// Route to display content
router.get('/getEditable', async (req, res) => {
    try {
        const editableTop = await EditableTop.findOne();
        if (!editableTop) {
            return res.status(404).json({ message: "Editable top not found" });
        }
        res.json({ content: editableTop.Content });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// Route to update content
router.put('/Editable', async (req, res) => {
    try {
        const editableTop = await EditableTop.findOne();
        if (!editableTop) {
            return res.status(404).json({ message: "Editable top not found" });
        }
        editableTop.Content = req.body.content; // Assuming the request body contains 'content' field
        await editableTop.save();
        res.json({ message: "Content updated successfully" });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

module.exports = router;
