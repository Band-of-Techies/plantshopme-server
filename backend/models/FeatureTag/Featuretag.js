const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const FeaturetagSchema = new Schema(
  {
    name: { type: String, required: true },
    level: { type: Number, default: 0 },
  },
);


const FeaturTag = mongoose.model('FeatureTag', FeaturetagSchema);

module.exports = FeaturTag;

