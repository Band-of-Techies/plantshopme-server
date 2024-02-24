const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const PotSchema = new Schema(
  {
    name: { type: String },
    price:{type: Number,},
    Currency: { type: String },
    potstock: {type: Number,},
    image: [
      {
        type: String,
      },
    ],
    lengthPrice:[{
      length:{type:String},
      price:{type:String},
    }]
  },
  {
    timestamps: true,
  }
);

const Pot = mongoose.model('Pot', PotSchema);

module.exports = Pot;
