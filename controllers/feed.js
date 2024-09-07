const { validationResult } = require('express-validator');

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
  // Create a post in the db

  // 201: Created successfully in the db
  res.status(201).json({
    message: 'Post Created successfully',
    post: {
      title: title,
      content: content,
    }
  })
});