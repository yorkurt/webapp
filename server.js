var HTTP_PORT = process.env.PORT || 8080

var express = require("express");
var auth = require("./auth.js");
var inventory = require("./inventory.js");
var database = require("./database.js");
const exphbs = require('express-handlebars');
const bodyParser = require('body-parser');

var app = express();
app.use(bodyParser.urlencoded({ extended: true }));

app.post("/register", (req, res) =>{
    data = req.body;

    //check if containing empty fields
});

app.post("/createAccount", (req, res) =>{
    data = req.body;

    //check if containing empty fields
});