const express = require('express');
const { body } = require('express-validator');

const feedController = require('../controllers/feed')

const router = express.Router();

// GET /feed/posts
router.get('/posts', feedController.getPosts);

// POST /feed/post
router.post('/post', [
  // middleware provided by express-validator to validate the post passed as body in the request
  body('title').trim().isLength({ min: 5 }),
  body('content').trim().isLength({ min: 5 }),
], feedController.postPost);

// GET /feed/post/postId
router.get('/post/:postId', feedController.getPost);

// PUT /feed/post/postId
router.put('/post/:postId', feedController.updatePost);

module.exports = router