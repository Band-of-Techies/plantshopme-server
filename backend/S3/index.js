
const { S3Storage } = require('multer-s3');

const { S3Client, PutObjectCommand } = require('@aws-sdk/client-s3');

// Create an S3 client
const s3Client = new S3Client({
    region: process.env.AWS_REGION,
    credentials: {
        accessKeyId: process.env.AWS_ACCESS_KEY_ID,
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY
    }
});

// Function to upload file to S3
const uploadToS3 = async (file) => {
    const uploadParams = {
        Bucket: process.env.AWS_S3_BUCKET_NAME,
        Key: file.originalname, // Use the original file name as the key
        Body: file.buffer, // Use the file content as the body
        ACL: 'public-read' // Or set it according to your needs
    };

    try {
        const result = await s3Client.send(new PutObjectCommand(uploadParams));
        return result;
    } catch (error) {
        throw error;
    }
};

module.exports = {
    uploadToS3
};
