const dotenv = require("dotenv"); // require package
dotenv.config(); // Loads the environment variables from .env file
// Here is where we import modules
// We begin by loading Express

const express = require('express');
const mongoose = require("mongoose"); // require package
const app = express();
const morgan=require('morgan');
const methodOverride=require("method-override");
// middleware: always app.use method, and just tell the method-override what query to use default: method
app.use(express.urlencoded({extended:false})); // change the request
app.use(morgan("dev")); //log the request
app.use(methodOverride("_method"));
// Connect to MongoDB using the connection string in the .env file
mongoose.connect(process.env.MONGODB_URI);
// log connection status to terminal on start
mongoose.connection.on("connected", () => {
  console.log(`Connected to MongoDB ${mongoose.connection.name}.`);
});
// Import the Fruit model
const Fruit = require("./models/fruit.js");

// server.js

// GET /
app.get("/", async (req, res) => {
  res.render("index.ejs");
});
app.get("/fruits/new" , (req,res) => {
res.render("fruits/new.ejs");
});
app.post("/fruits", async (req, res) => {
  try {
     if (req.body.isReadyToEat === "on") {
    req.body.isReadyToEat = true;
  } else {
    req.body.isReadyToEat = false;
  }

    await Fruit.create(req.body);
    res.redirect("/fruits/new"); //same as firing another get request in behalf of the user 
  } catch (error) {
    console.log("The error is", error);
  }
});
app.get("/fruits", async (req, res) => {
  try {
   const allFruits=await Fruit.find();
   res.render("index.ejs", { fruits: allFruits });

  } catch (error) {
    console.log("The error is", error);
  }
});
app.get("/fruits/:id" , async (req,res) => {
try {
const fruit=await Fruit.findById(req.params.id);
res.render("fruits/show.ejs", { fruit});
} catch(error) {
    console.log("The error is " , error);
}
});
app.delete("/fruits/:id" , async (req,res) => { //delete doesn't conflict with get so we will use the same URL
    try {
  await Fruit.findByIdAndDelete(req.params.id);
    res.redirect("/fruits");

} catch(error) {
    console.log("The error is " , error);
}
});

app.put("/fruits/:fruitId", async (req, res) => {
  // Handle the 'isReadyToEat' checkbox data
  if (req.body.isReadyToEat === "on") {
    req.body.isReadyToEat = true;
  } else {
    req.body.isReadyToEat = false;
  }
  
  // Update the fruit in the database
  try {
  await Fruit.findByIdAndUpdate(req.params.fruitId, req.body);

  // Redirect to the fruit's show page to see the updates
  res.redirect(`/fruits/${req.params.fruitId}`);
  } catch(err) {
    console.log("The error is " + err);
  }
});
app.listen(3000, () => {
  console.log('Listening on port 3000');
});