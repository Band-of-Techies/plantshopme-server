const mongoose = require('mongoose');
const { User} = require("../../models/user");

const {Schema,model} =mongoose;

const PhotoSchema = new mongoose.Schema({  
    url:String,
    filename:String
  })
  
const PostSchema = new Schema({
    title:{
      type:String,
      required:true
    },
    summary:{
      type:String,
      required:true
    },
    content:{
      type:String,
      required:true
    },
    photo: PhotoSchema,
    author: {
      type: String,
    },
    tags: {
      type: [String],
      default: [],
      
  },
},{

timestamps:true,
});

const PostModel =model('post',PostSchema);
module.exports=PostModel;