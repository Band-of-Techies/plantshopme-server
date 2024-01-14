const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const FeaturetagSchema = new Schema(
  {
    name: { type: String, required: true },
    level: { type: Number, default: 0 },
  }
);

// Middleware to increment the level before saving
FeaturetagSchema.pre('save', async function (next) {
  try {
    // Check if the document is newly created
    if (this.isNew) {
      // Find the highest level and increment it by 1
      const highestLevel = await this.constructor.findOne({}).sort({ level: -1 }).exec();
      this.level = highestLevel ? highestLevel.level + 1 : 1;
    }

    next();
  } catch (error) {
    next(error);
  }
});

const FeaturTag = mongoose.model('FeatureTag', FeaturetagSchema);

module.exports = FeaturTag;


