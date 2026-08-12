const dotenv = require("dotenv"); // require package
dotenv.config(); // Loads the environment variables from .env file
// Here is where we import modules
// We begin by loading Express

const express = require('express');
const mongoose = require("mongoose"); // require package
const app = express();
const morgan=require('morgan');
// middleware
app.use(express.urlencoded({extended:false}));
app.use(morgan("dev"));

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
app.listen(3000, () => {
  console.log('Listening on port 3000');
});