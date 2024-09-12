const express = require('express');
const { body } = require('express-validator');

const User = require('../models/user')
const authController = require('../controllers/auth')

const router = express.Router();

router.put('/signup', [
  body('email')
    .isEmail()
    .withMessage('Please enter your email')
    // Checks if the email is already in the db
    .custom((value, { req }) => {
      return User.findOne({ email: value }).then(userDoc => {
        if (userDoc) {
          return Promise.reject('Email already exists');
        }
      });
    })
    .normalizeEmail(),

  body('password')
    .trim()
    .isLength({ min: 5 }),

  body('name')
    .trim()
    .not().isEmpty(),
],
  authController.signUp
);

router.post('/login', authController.logIn);

module.exports = router