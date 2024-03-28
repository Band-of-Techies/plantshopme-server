const mongoose = require('mongoose');

const EditableTopSchema = new mongoose.Schema({
    Content: {
        type: String,
        default: "Best quality plants delivered to your doorstep"
    }
});

const EditableTop = mongoose.model('EditableTop', EditableTopSchema);

module.exports = EditableTop;
