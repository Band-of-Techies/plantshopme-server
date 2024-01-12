const { User} = require("../../models/Token/customer");
const express = require('express');
const router = express.Router();
const { storage } = require('../../cloudinary/index')
const multer = require('multer');
const Post = require('../../models/Blogs/post')


const upload = multer({ storage: storage });


router.get('/post', async (req,res) => {
    res.json(
      await Post.find()
        .populate('author', 'name')
        .sort({createdAt: -1})
        .limit(20)
    );
  });

router.post('/post', upload.single('image'), async (req, res) => {
    const image = req.file ? req.file.path : null;

    // Assume you have a user ID stored in a cookie
    // const userId = 'jdhjghjghsgsh'

    // You may want to add additional validation for userId

    const { title, summary, content , author, tags} = req.body;
    const parsedTags = JSON.parse(tags);
    try {
        const postDoc = await Post.create({
            title,
            summary,
            content,
            photo: image,
            author,
            tags: parsedTags,
        });
        res.json({ postDoc });
    } catch (error) {
        console.error('File upload error:', error);
        res.status(500).json({ message: 'Internal Server Error' })
    }
});
router.put('/post', upload.single('image'), async (req, res) => {
    const image = req.file ? req.file.path : null;
    // const userId = req.cookies.userId;
    const { id, title, summary, content,author } = req.body;
  
    try {
        const postDoc = await Post.findById(id);
  
        if (postDoc.author.toString() !== author) {
            return res.status(400).json('You are not the author');
        }
  
        await Post.updateOne(
            { _id: id, author:  author }, 
            {
                $set: {
                    title,
                    summary,
                    content,
                    photo: image,
                },
            }
        );
  
        res.json(postDoc);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
  });
  router.get('/post/:id', async (req, res) => {
    const { id } = req.params;
  
    try {
      const postDoc = await Post.findById(id).populate('author', 'name');
      res.json(postDoc);
    } catch (error) {
      res.status(500).json({ message: 'Internal Server Error' });
    }
  });
  router.delete('/post/:id', async (req, res) => {
    const { id } = req.params;
    try {
        const deletedPost = await Post.findByIdAndDelete(id);

        if (!deletedPost) {
            return res.status(404).json({ message: 'Post not found' });
        }

        res.status(200).json({ message: 'Post deleted successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
});

  
  module.exports = router;