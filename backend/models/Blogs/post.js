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
    photo: String,
    author: {
      type: Schema.Types.ObjectId,
      // ref: 'CustomerNorm',
      // required:true
    },
    tags: {
      type: [String],
      default: [],
      required:true 
  },
},{

timestamps:true,
});

const PostModel =model('post',PostSchema);
module.exports=PostModel;