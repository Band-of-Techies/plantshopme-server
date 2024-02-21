const mongoose = require('mongoose');

const PhotoSchema = new mongoose.Schema({
  url: String,
  filename: String,
});

PhotoSchema.virtual('thumbnail').get(function () {
  return this.url.replace('/upload', '/upload/w_250');
});

const productSchema = new mongoose.Schema(
  {
    ptype: {
      type: String,
      default: 'Plant',
    },
    scienticName: {
      type: String,
    },
    Mdiscription: {
      type: String,
    },
    Mname: {
      type: String,
    },
    SKU: {
      type: String,
    },
    title: {
      type: String,
    },
    description: {
      type: String,
    },
    impdescription: {
      type: String,
    },
    maincategory: [String],
    category: [String],
    subcategory: [String],
    stock: {
      type: Number,
      default:0,
    },
    careType: {
      type: String,
    },
    careName: {
      type: String,
    },
    caredes: {
      type: String,
    },
    photos: [PhotoSchema],
    FeatureTag: [
      {
        type: String,
      },
    ],
    Pots: [
      {
        type: String,
      },
    ],
    length: [
      {
        type: String,
      },
    ],
    price: {
      type: Number,
    },
    currency: {
      type: String,
    },
    WhatsappMsg: {
      type: String,
      default:'false'
      
    },
  },
  {
    timestamps: true,
  }
);

// Pre-save hook to generate SKU before saving the document
productSchema.pre('save', async function (next) {
  if (!this.SKU) {
    // Find the highest existing SKU in the collection
    const highestSKUProduct = await this.constructor.findOne({}, { SKU: 1 }).sort({ SKU: -1 });

    // Generate the next SKU
    const nextSKU = highestSKUProduct ? incrementSKU(highestSKUProduct.SKU) : 'MPS00001';

    // Set the SKU for the current document
    this.SKU = nextSKU;
  }
  next();
});

// Function to increment the SKU with leading zeros
function incrementSKU(lastSKU) {
  const prefix = lastSKU.substring(0, 3);
  const numberPart = parseInt(lastSKU.substring(3), 10) + 1;
  const formattedNumberPart = String(numberPart).padStart(5, '0'); // Ensure 5 digits with leading zeros
  return `${prefix}${formattedNumberPart}`;
}

module.exports = mongoose.model('AddProduct', productSchema);
