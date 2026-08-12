/* eslint-disable no-console */

require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const morgan = require('morgan');
const path = require("path");
const methodOverride = require('method-override');

// Models
const Fruit = require('./models/fruit');

const app = express();

// MIDDLEWARE
app.use(express.urlencoded({ extended: false }));
app.use(methodOverride('_method'));
app.use(morgan('dev'));
app.use(express.static(path.join(__dirname, "public")));
// MONGO DB CONNECTION
mongoose.connect(process.env.MONGODB_URI);
mongoose.connection.on('connected', () => {
  console.log(`Connected to MongoDB ${mongoose.connection.name}.`);
});

app.get('/', (req, res) => {
  res.render('index.ejs');
});

// Fruits
app.get('/fruits/new', (req, res) => {
  res.render('fruits/new.ejs');
});

app.post('/fruits', async (req, res) => {
  try {
    if (req.body.isReadyToEat === 'on') {
      req.body.isReadyToEat = true;
    } else {
      req.body.isReadyToEat = false;
    }

    await Fruit.create(req.body);

    res.redirect('/fruits');
  } catch (err) {
    console.log(err);
    res.send('failed to create');
  }
});

app.get('/fruits', async (req, res) => {
  try {
    const fruits = await Fruit.find();
    res.render('fruits/index.ejs', { fruits });
  } catch (err) {
    console.log(err);
    res.send('failed to get all fruits');
  }
});

app.get('/fruits/:id', async (req, res) => {
  try {
    const fruit = await Fruit.findById(req.params.id);

    res.render('fruits/show.ejs', { fruit });
  } catch (err) {
    console.log(err);
    res.send('failed to fetch the fruit');
  }
});

app.delete('/fruits/:id', async (req, res) => {
  try {
    await Fruit.findByIdAndDelete(req.params.id);
    res.redirect('/fruits');
  } catch (err) {
    console.log(err);
    res.send('unable to delete fruit');
  }
});

app.get('/fruits/:id/edit', async (req, res) => {
  try {
    const fruit = await Fruit.findById(req.params.id);
    res.render('fruits/edit.ejs', { fruit });
  } catch (err) {
    console.log(err);
    res.send('unable to update the fruit');
  }
});

app.put('/fruits/:id', async (req, res) => {
  try {
    if (req.body.isReadyToEat === 'on') {
      req.body.isReadyToEat = true;
    } else {
      req.body.isReadyToEat = false;
    }

    await Fruit.findByIdAndUpdate(req.params.id, req.body);
    res.redirect(`/fruits/${req.params.id}`);
  } catch (err) {
    console.log(err);
    res.send('unable to update the fruit');
  }
});

app.listen(3000, () => {
  console.log('server is running!!!!');
});
