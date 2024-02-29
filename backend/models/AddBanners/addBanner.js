const mongoose = require('mongoose');

const PhotoSchema = new mongoose.Schema({  
  url:String,
  filename:String,
  
})

PhotoSchema.virtual('thumbnail').get(function(){
return this.url.replace('/upload', '/upload/w_250');
})


const bannerSchema = new mongoose.Schema(
  {
    typeName: {
      type: String,
      required:true
    },
    navigate :{
      type:String
    },
    photos : [PhotoSchema],
  },
  {
    timestamps: true,
  }
);


module.exports = mongoose.model('AddBanner', bannerSchema);
