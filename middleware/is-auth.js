const jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {
  const authHeader = req.get('Authorization');
  if(!authHeader){
    const error = new Error('Not autehticated');
    error.statusCode = 401;
    throw error;
  }
  // Extracts the token from the header's request
  // Bearer token_value
  const token = req.get('Authorization').split(' ')[1];
  // checks if the token is correct and matches the set secret
  let decodedToken
  try {
    decodedToken = jwt.verify(token, 'secret');
  } catch (err) {
    err.statusCode = 500;
    throw err;
  }
  if(!decodedToken){
    const error = new Error('Not autehticated');
    error.statusCode = 401;
    throw error;
  }
  // Valid and decoded token at this point
  req.userId = decodedToken.userId;
  // Goes to the next request
  next();
}