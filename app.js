const path = require('path');

const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

const feedRoutes = require('./routes/feed');

const MONGODB_URI = 'mongodb+srv://srgibosque:NNQ3XHX3%40!8Nyrn@cluster0.oyxb5.mongodb.net/messages?w=majority&appName=Cluster0'

const app = express();

// Middleware that parses JSON data from the client
app.use(bodyParser.json()); // application/json
app.use('/images', express.static(path.join(__dirname, 'images')));


// We need to set the following headers to allow the communication between to diferent ports
app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, PATCH, DELETE');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  next();
});

app.use('/feed', feedRoutes);

// Middleware error. Executes every time an error is thrown
app.use((error, req, res, next) => {
  console.log(error);
  const status = error.statusCode || 500;
  const message = error.message; // Exists by default. The message you pass to the constructor
  res.status(status).json({ message: message });
});

mongoose
  .connect(MONGODB_URI)
  .then(result => {
    console.log('Connected');
    app.listen(8080);
  })
  .catch(err => console.error(err));