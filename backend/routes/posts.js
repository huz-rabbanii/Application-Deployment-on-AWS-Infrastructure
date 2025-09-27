const express = require('express');
const jwt = require('jsonwebtoken');
const Post = require('../models/post');
const AWS = require('aws-sdk');
const router = express.Router();

const JWT_SECRET = process.env.JWT_SECRET;
if (!JWT_SECRET) {
  throw new Error('JWT_SECRET is not set. Copy backend/.env.example to backend/.env and fill it in.');
}

const authMiddleware = (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) return res.status(401).json({ error: 'No token provided' });
  jwt.verify(token, JWT_SECRET, (err, decoded) => {
    if (err) return res.status(401).json({ error: 'Invalid token' });
    req.userId = decoded.id;
    next();
  });
};

router.get('/posts', authMiddleware, async (req, res) => {
  const posts = await Post.findAll({ where: { UserId: req.userId } });
  res.json(posts);
});

router.post('/posts', authMiddleware, async (req, res) => {
  const { title, content, imageKey } = req.body;
  const post = await Post.create({ title, content, imageKey, UserId: req.userId });
  res.status(201).json(post);
});

router.get('/generate-upload-url', authMiddleware, (req, res) => {
  const s3 = new AWS.S3();
  const key = `${req.userId}/${Date.now()}.jpg`; // Unique key for the file
  const params = {
    Bucket: 'your-s3-bucket-name', // Replace with your bucket name later
    Key: key,
    Expires: 60, // URL expires in 60 seconds
    ContentType: 'image/jpeg',
  };
  s3.getSignedUrl('putObject', params, (err, url) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ url, key });
  });
});

module.exports = router;