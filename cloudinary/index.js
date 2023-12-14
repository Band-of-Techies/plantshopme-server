const cloudinary = require('cloudinary').v2;
const { CloudinaryStorage } = require('multer-storage-cloudinary');

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key : process.env.CLOUDINARY_KEY,
    api_secret : process.env.CLOUDINARY_SECRET
});

const storage = new CloudinaryStorage({
    cloudinary,
    params:{
    folder: 'myPlantShop',
    allowedFormats: ['jpeg','png','jpg']
    },
    transformation: [
        { width: 500, height: 500, crop: "limit" },
        { quality: "auto:best" },
        { fetch_format: "auto" },
        { aspect_ratio: "3:4", crop: "fill" }
    ]
      
});

module.exports = {
    cloudinary,
    storage
}