exports.getPosts = ((req, res, next) => {
  res.status(200).json({
    posts: [{ title: 'First Post', content: 'This is the first post' }]
  });
});


exports.postPost = ((req, res, next) => {
  const title = req.body.title;
  const content = req.body.content;
  // Create a post in the db

  // 201: Created successfully in the db
  res.status(201).json({
    message: 'Post Created successfully',
    post: { title: title, content: content }
  })
});