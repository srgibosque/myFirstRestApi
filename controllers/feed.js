const { validationResult } = require('express-validator');
const Post = require('../models/post');
const { request } = require('express');

exports.getPosts = ((req, res, next) => {
  Post
  .find()
  .then(posts => {
    res.status(200).json({posts: posts});
  })
  .catch(err => {
    if (!err.stausCode) {
      err.stausCode = 500;
    }
    next(err);
  })
});


exports.postPost = ((req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const error = new Error('Validation failed');
    error.statusCode = 422;
    // Will throw the error and jump to the catch block
    throw error;
  }

  if(!req.file){
    const error = new Error('No image provided');
    error.statusCode = 422;
    throw error;
  }

  const title = req.body.title;
  const content = req.body.content;
  const imageUrl = req.file.path;

  const post = new Post({
    title: title,
    imageUrl: imageUrl,
    content: content,
    creator: { name: 'Sergi' }
  });
  // Saves the object to the db
  post
    .save()
    .then(result => {
      console.log(result);
      // 201: Created successfully in the db
      res.status(201).json({
        message: 'Post Created successfully',
        post: result
      });
    })
    .catch(err => {
      if (!err.stausCode) {
        err.stausCode = 500;
      }
      next(err);
    });
});

exports.getPost = ((req, res, next) => {
  const postId = req.params.postId;
  Post
    .findById(postId)
    .then((post) => {
      if (!post) {
        const error = new Error('Could not find a post with this id');
        error.statusCode = 404;
        // Will throw the error and jump to the catch block
        throw error;
      }
      res.status(200).json({
        message: 'post successfully fetched',
        post: post
      });
    })
    .catch((err) => {
      if (!err.stausCode) {
        err.stausCode = 500;
      }
      // Will throw the app.js error middleware
      next(err);
    })
});