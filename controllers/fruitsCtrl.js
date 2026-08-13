// controllers/fruits.js

const Fruit = require('../models/fruit');

const home = (req, res) => {
  res.render('index Homepage.ejs');
};

const showNewForm = (req, res) => {
  res.render('fruits/new.ejs');
};

const create = async (req, res) => {
  try {
    req.body.isReadyToEat = req.body.isReadyToEat === 'on';
    await Fruit.create(req.body);
    res.redirect('/fruits');
  } catch (err) {
    console.log(err);
    res.send('failed to create');
  }
};

const index = async (req, res) => {
  try {
    const foundFruits = await Fruit.find();
    res.render('fruits/index.ejs', { fruits: foundFruits });
  } catch (err) {
    console.log(err);
    res.send('failed to get all fruits');
  }
};

const show = async (req, res) => {
  try {
    const fruit = await Fruit.findById(req.params.id);
    res.render('fruits/show.ejs', { fruit });
  } catch (err) {
    console.log(err);
    res.send('failed to fetch the fruit');
  }
};

const deleteFruit = async (req, res) => {
  try {
    await Fruit.findByIdAndDelete(req.params.id);
    res.redirect('/fruits');
  } catch (err) {
    console.log(err);
    res.send('unable to delete fruit');
  }
};

const editForm = async (req, res) => {
  try {
    const fruit = await Fruit.findById(req.params.id);
    res.render('fruits/edit.ejs', { fruit });
  } catch (err) {
    console.log(err);
    res.send('unable to load edit form');
  }
};

const update = async (req, res) => {
  try {
    req.body.isReadyToEat = req.body.isReadyToEat === 'on';
    await Fruit.findByIdAndUpdate(req.params.id, req.body);
    res.redirect(`/fruits/${req.params.id}`);
  } catch (err) {
    console.log(err);
    res.send('unable to update the fruit');
  }
};

module.exports = {
  home,
  showNewForm,
  create,
  index,
  show,
  deleteFruit,
  editForm,
  update,
};