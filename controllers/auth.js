const User = require('../models/user');
const { validationResult } = require('express-validator');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

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

exports.logIn = (req, res, next) => {
  const email = req.body.email;
  const password = req.body.password;
  User.findOne({ email: email })
    .then(user => {
      if (!user) {
        const error = new Error('A user with this email could not be found');
        error.stausCode = 401;
        throw error;
      }
      loadedUser = user;
      // Compares the password the user entered with the password stored in the db
      // returns a promise with true or false
      return bcrypt.compare(password, user.password);
    })
    .then(isEqual => {
      if (!isEqual) {
        const error = new Error('Wrong password');
        error.stausCode = 401;
        throw error;
      }
      // generates a new token with the password 
      const token = jwt.sign({
        email: loadedUser.email,
        userId: loadedUser._id.toString()
      },
        'secret',
        { expiresIn: '1h' }
      );
      res.status(200).json({ token: token, userId: loadedUser._id.toString() })
    })
    .catch(err => {
      if (!err.stausCode) {
        err.stausCode = 500;
      }
      // Will throw the app.js error middleware
      next(err);
    })

};