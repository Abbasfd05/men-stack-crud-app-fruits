/* eslint-disable no-console */

require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const morgan = require('morgan');
const path = require('path');
const methodOverride = require('method-override');

// Controllers
const fruitsController = require('./controllers/fruitsCtrl');

const app = express();

// MIDDLEWARE
app.use(express.urlencoded({ extended: false }));
app.use(methodOverride('_method'));
app.use(morgan('dev'));
app.use(express.static(path.join(__dirname, 'public')));

// MONGO DB CONNECTION
mongoose.connect(process.env.MONGODB_URI);
mongoose.connection.on('connected', () => {
  console.log(`Connected to MongoDB ${mongoose.connection.name}.`);
});

// ROUTES
app.get('/', fruitsController.home);

// Fruits
app.get('/fruits/new', fruitsController.showNewForm);
app.post('/fruits', fruitsController.create);
app.get('/fruits', fruitsController.index);
app.get('/fruits/:id', fruitsController.show);
app.delete('/fruits/:id', fruitsController.deleteFruit);
app.get('/fruits/:id/edit', fruitsController.editForm);
app.put('/fruits/:id', fruitsController.update);

app.listen(3000, () => {
  console.log('server is running!!!!');
});