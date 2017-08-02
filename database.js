const mongoose = require('mongoose');
var fs = require('fs');
const path = require('path');
let username = "";
let password = "";
let url = "";

var db;
var fileName = "dbacc.json";

module.exports.initialize = function () {
    return new Promise(function (resolve, reject) {
        var accData = fs.readFileSync(fileName);

        let dbAccount = JSON.parse(accData);
        setAll(dbAccount.username, dbAccount.password, dbAccount.url);
        db = mongoose.createConnection(("mongodb://" + username + ":" + password + "@" + url));

        db.on('error', (err) => {
            reject(err); // reject the promise with the provided error
        });
        db.once('open', () => {
            resolve();
        });
    });
};

module.exports.getDatabase = function () {
    return db;
}

function setAll(user, pass, inUrl) {
    username = user;
    password = pass;
    url = inUrl;
}