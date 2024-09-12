const { validationResult } = require('express-validator');
const Post = require('../models/post');
const User = require('../models/user');

exports.getPosts = ((req, res, next) => {
  Post
    .find()
    .then(posts => {
      res.status(200).json({ posts: posts });
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

  if (!req.file) {
    // It needs to make sure the file is loaded in the frontend
    const error = new Error('No image provided');
    error.statusCode = 422;
    throw error;
  }

  const title = req.body.title;
  const content = req.body.content;
  const imageUrl = req.file.path;

  let creator;

  const post = new Post({
    title: title,
    imageUrl: imageUrl,
    content: content,
    // Available after the auth middleware
    creator: req.userId
  });
  // Saves the object to the db
  post.save()
    .then(result => {
      return User.findById(req.userId)
    })
    .then(user => {
      //we add to the logged user the created post
      creator = user;
      user.posts.push(post);
      return user.save();
    })
    .then(result => {
      res.status(201).json({
        message: 'Post Created successfully',
        post: post,
        creator: { _id: creator._id, name: creator.name }
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

exports.updatePost = ((req, res, next) => {
  const postId = req.params.postId;
  // since the put method allows a body, their properties can be extracted
  const title = req.body.title;
  const content = req.body.content;
  const imageUrl = req.body.imageUrl;

  Post
    .findById(postId)
    .then((post) => {
      if (!post) {
        const error = new Error('Could not find a post with this id');
        error.statusCode = 404;
        // Will throw the error and jump to the catch block
        throw error;
      }

      //Only continues if the post creator (id) matches the id stores in the middleware, the logged in user
      if (post.creator.toString() !== req.userId) {
        const error = new Error('Not authorized');
        error.statusCode = 403;
        // Will throw the error and jump to the catch block
        throw error;
      }

      post.title = title;
      post.content = content;
      post.imageUrl = imageUrl;
      return post.save();
    })
    .then(result => {
      res.status(200).json({ message: 'Post updated successfully', post: result });
    })
    .catch((err) => {
      if (!err.stausCode) {
        err.stausCode = 500;
      }
      // Will throw the app.js error middleware
      next(err);
    });
});

exports.deletePost = ((req, res, next) => {
  const postId = req.params.postId;

  Post
    .findById(postId)
    .then(post => {
      if (!post) {
        const error = new Error('Could not find a post with this id');
        error.statusCode = 404;
        // Will throw the error and jump to the catch block
        throw error;
      }
      if (post.creator.toString() !== req.userId) {
        const error = new Error('Not authorized');
        error.statusCode = 403;
        // Will throw the error and jump to the catch block
        throw error;
      }
      return Post.findByIdAndDelete(postId);
    })
    .then(result => {
      return User.findById(req.userId);
    }).then(user => {
      // Makes sure once the post is deleted is removed from the user model as well
      user.posts.pull(postId);
      return user.save();
    })
    .then(result => {
      res.status(200).json({ message: 'Post deleted successfully', post: result });
    })
    .catch(err => {
      if (!err.stausCode) {
        err.stausCode = 500;
      }
      // Will throw the app.js error middleware
      next(err);
    })

});