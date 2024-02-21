const mongoose = require('mongoose');

const InvoiceSchema = new mongoose.Schema({
    path: String, 
    filename: String,
  });

InvoiceSchema.virtual('thumbnail').get(function () {
  return this.url.replace('/upload', '/upload/w_250');
});

const MainCategorySchema = new mongoose.Schema({
  OrderId: {
    type: String,
    
  },
  Invoice: InvoiceSchema,
});

module.exports = mongoose.model('InvoiceDB', MainCategorySchema);
