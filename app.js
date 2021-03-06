
//jshint esversion:6
require('dotenv').config();
const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const mongoose = require('mongoose');

const app = express();

console.log(process.env.API_KEY);

const encrypt = require("mongoose-encryption");

app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({
  extended: true
}));

app.use(express.static("public"));

mongoose.connect("mongodb://localhost:27017/userDB", { useNewUrlParser: true,  useUnifiedTopology: true });

const userSchema =new mongoose.Schema({
  email : String,
  password : String
});


userSchema.plugin(encrypt, {secret: process.env.SECRET, encryptedFields: ["password"]});

const User = mongoose.model("User", userSchema);

app.get("/", function(req, res){
  res.render("home");
});

app.get("/login", function(req, res){
  res.render("login");
});

app.get("/register", function(req, res){
  res.render("register");
});

app.post("/register", function(req, res){
  const newUser = new User({
    email : req.body.username,
    password: req.body.password
  });
  newUser.save(function(err){
    if(err){
      ser.send(err);
    }else{
      res.render("secrets");
    }
  });
});

app.post("/login", function(req, res){
  const userName = req.body.username;
  const pass = req.body.password;
  User.findOne({email: userName}, function(err, foundUser){
    if(!err){
      if(foundUser){
        if(foundUser.password===pass){
          res.render("secrets");
        }else{res.send("Not match! Please register!");}
      }
    }
  });
});



app.listen(3000, function(){
  console.log("Server is listening at port 3000");
});
