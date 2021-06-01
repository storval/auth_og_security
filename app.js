//jshint esversion:6
require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const ejs = require('ejs');
const port = 3000;
const app = express();
const encrypt = require('mongoose-encryption');

const mongoose = require('mongoose');


app.use(express.static('public'));
app.set('view engine', 'ejs');
app.use(express.json());

app.use(express.urlencoded({
    extended: true
}));
mongoose.connect('mongodb://localhost:27017/userDB', {useNewUrlParser: true, useUnifiedTopology: true});    
mongoose.pluralize(null);

////////////////////////////////////////////////////////////////////////////////////H E A D//////////////////////////////////////


const userSchema = new mongoose.Schema ({
    email: String, 
    password: String
});


userSchema.plugin(encrypt, { secret: process.env.SECRET, encryptedFields: ["password"]  });

const User = new mongoose.model("User", userSchema);




app.get("/", function (re, res) {
    res.render("home");
});
app.get("/login", function (re, res) {
    res.render("login");
});
app.get("/register", function (re, res) {
    res.render("register");
});

app.post("/register", function(req, res){
    const newUser = new User ({
        email: req.body.username,
        password: req.body.password
    });
    newUser.save(function(err){
        if (err) {
            console.log(err);
        } else {
            res.render("secrets");
        }
    });
});

app.post("/login", function(req, res){
    const username = req.body.username;
    const password = req.body.password;

    User.findOne({email: username}, function(err, foundUser){
        if (err) {
            res.render(err);
        } if (foundUser) { 
            if (foundUser.password === password) {
                res.render("secrets");
            }
            
        }
    });
});




app.listen(3000, function () {
    console.log("yee");
});