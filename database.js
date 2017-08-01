const mongoose = require('mongoose');

let username = "";
let password = "";
let url = "";

var db;


module.exports = function (user, pass, url){
    this.username = user;
    this.password = pass;
    this.url = url;
}

module.exports.initialize = function () {
    return new Promise(function (resolve, reject) {
        db = mongoose.createConnection("mongodb://" +user + ":" + password + "@" + url);
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