const { validationResult } = require('express-validator');
const Post = require('../models/post');

exports.getPosts = ((req, res, next) => {
  res.status(200).json({
    posts: [
      {
        _id: '1',
        title: 'First Post',
        content: 'This is the first post',
        imageUrl: 'images/wireframe.jpg',
        creator: {
          name: "Sergi"
        },
        createdAt: new Date()
      }
    ]
  });
});


exports.postPost = ((req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res
      .status(422)
      .json({
        message: 'Validation failed',
        errors: errors.array()
      });
  }
  const title = req.body.title;
  const content = req.body.content;

  const post = new Post({
    title: title,
    imageUrl: 'images/wireframe.jpg',
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
    .catch(err => console.error(err));
});