const User = require('../models/user');
const { validationResult } = require('express-validator');
const bcrypt = require('bcryptjs');

exports.signUp = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const error = new Error('Validation failed');
    error.statusCode = 422;
    error.data = errors.array();
    // Will throw the error and jump to the catch block
    throw error;
  }
  const email = req.body.email;
  const password = req.body.password;
  const name = req.body.name;

  // encrypts the password wiht the package bcryptjs
  bcrypt.hash(password, 12)
    .then(hashedPw => {
      const user = new User({
        email: email,
        password: hashedPw,
        name: name
      });
      //save the user with the hashed password to the database
      return user.save();
    })
    .then(result => {
      res.status(201).json({ message: 'User has been created', userId: result._id });
    })
    .catch(err => {
      if (!err.stausCode) {
        err.stausCode = 500;
      }
      // Will throw the app.js error middleware
      next(err);
    })

};