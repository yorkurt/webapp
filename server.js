var HTTP_PORT = process.env.PORT || 8080

var express = require("express");
var auth = require("./accountSystem.js");
var inventorySystem = require("./inventorySystem.js");
var database = require("./database.js");
var path = require("path");
var fs = require("fs");
const exphbs = require('express-handlebars');
const bodyParser = require('body-parser');
const clientSessions = require('client-sessions');

var app = express();
app.use(bodyParser.urlencoded({ extended: true }));
var inventory;


/* 
    Sessions and logins
*/
app.use(clientSessions({
    cookieName: "session", // this is the object name that will be added to 'req'
    secret: "randomlongstring", // this should be a long un-guessable string.
    duration: 60 * 60 * 1000, // milliseconds
    activeDuration: 60000 * 60 // the session will be extended by this many ms each request (1 minute)
}));

app.post("/login", (req, res) => {
    auth.checkPassword(req.body.username, req.body.password).then((data) => {

        req.session.user = {
            username: data.username,
            powerLevel: data.powerLevel

        }
        //redirect somewhere
        res.send("Welcome " + req.session.user.username);


    }).catch(() => {
        //redirect back to login page with error
        // res.status(403).send("403");
        res.send("incorrect password");
    });


});

app.get('/logout', function (req, res, next) {
    req.session.reset();
    res.redirect('/');
});

function checkLogin(accessLevel) {
    return function loginFunction(req, res, next) {
        if (!req.session.user) {
            res.redirect("/login");
        } else {
            if (req.session.user.powerLevel < accessLevel) {
                //redirect to 403 forbidden
            }
            else
                next();
        }
    }
}

function checkLoginSpecific(accessLevel) {
    return function loginFunction(req, res, next) {
        if (!req.session.user) {
            res.redirect("/login");
        } else {
            if (req.session.user.powerLevel != accessLevel || req.session.user.powerLevel != 100) {
                //redirect to 403 forbidden
            }
            else
                next();
        }
    }
}


/* 
    Accounts 
*/
//user register themselves
app.post("/register", (req, res) => {
    let data = {
        username: req.body.username,
        password: req.body.password,
        email: req.body.email,
        name: req.body.name
    };

    auth.createAccount(data).then(() => {
        res.send('Account created for' + data.name);


    }).catch((err) => {
        res.send(err);
    });
    //check if containing empty fields
});

//manually creating an account
app.post("/createAccount", checkLogin(100), (req, res) => {
    let data = req.body;

    auth.createAccount(data).then(() => {
        res.send('Account created for' + data.name);


    });
    //check if containing empty fields
});

//update account

app.post("/updateAccount", checkLogin(100), (req, res) => {
    let data = req.body;

});

//delete account
app.delete("/deleteAccount", checkLogin(100), (req, res) => {
    let data = req.body;
});

/* 
    Checkouts
*/

app.post("/requestCheckout", checkLogin(1), (req, res) => {
    let data = req.body;

});

//user requesting checkout
app.post("/checkout", checkLogin(1), (req, res) => {
    let data = req.body;

});


app.post("/updateCheckout", checkLogin(5), (req, res) => {
    let data = req.body;

});

app.get("/user/:username", checkLogin(1), (req, res) => {
    auth.getUserByUsername(req.params.username).then((data) => {
        res.send(data);
    })
});


/*
 *   Test Code
 */
app.get("/login", (req, res) => {
    res.sendFile(path.join(__dirname + "/test pages/login.html"))
});

app.get("/forbidden", checkLogin(100), (req, res) => {
    res.send("hi");
});

app.get("/createAccount", checkLogin(100), (req, res) => {
    res.sendFile(path.join(__dirname + "/test pages/createAccount.html"))
});

app.get("/", (req, res) => {
    res.send("Home Page");
});

app.get("/register", (req, res) => {
    res.sendFile(path.join(__dirname + "/test pages/register.html"))
});

app.use((req, res) => {
    res.status(404).send("Page Not Found");
});


/**
 * Starting the server
 */
database.initialize().then(() => {
    auth.setDatabase(database.getDatabase());
    inventory = inventorySystem(database.getDatabase());
    console.log("Server now listening to:" + HTTP_PORT);
    app.listen(HTTP_PORT);
}).catch((err) => {
    console.log("Database failed to start:" + err);
});


