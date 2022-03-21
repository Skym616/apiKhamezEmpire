const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const cors = require('cors');
const mongoose = require('mongoose');
const path = require('path');
const RouterProduct = require('./router/ProductRouter');

mongoose
  .connect(
    'mongodb+srv://skym:mandelae@skym.m0yjx.mongodb.net/skym?retryWrites=true&w=majority',
    { useNewUrlParser: true, useUnifiedTopology: true }
  ).then(() => console.log('Connexion à MongoDB réussie !'))
  .catch((r) => console.log('Connexion à MongoDB échouée !'));

app.use(cors());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use('/images', express.static(path.join(__dirname, 'images')));
app.use('/', RouterProduct);
module.exports = app;