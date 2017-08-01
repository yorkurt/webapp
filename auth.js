const mongoose = require('mongoose');
const crypto = require('crypto');
let Schema = mongoose.Schema;
let Accounts;

var accountSchema = new Schema({
    "username": {
        "type" : String,
        "unique" : true
    },
    "password": {
        "salt": String,
        "passwordHash": String
    },
    "fName": String,
    "lName": String,
    "email": String,
    "teams": [],
    "title": String,
    "power": Number,
    "member": Boolean
});

module.exports = function (db) {
    Accounts = db.model("accounts", accountSchema);
}

module.exports.createAccount = function (data) {

    return new Promise((resolve, reject) => {
        //set password hash
        let salt = getRandomString(16);
        let saltedPass = saltPassword(data.password, salt);
        data.password = {
            "salt": salt,
            "passwordHash": saltedPass
        };
        let newUser = new Accounts(data);
        newUser.save((err) => {
            reject("Error creating account");
        });
        resolve();
    });
}

module.exports.getAccounts = function () {
    return new Promise((resolve, reject) => {
        Accounts.find().select({'password' : 0}).exec()
            .then(() => {
                resolve(data);
            })
            .catch((err) => {
                reject(err);
            })
    });
}

module.exports.updateAccount = function (data) {
    return new Promise((resolve, reject) => {
        Accounts.update({ "_id": data.userID }, { $set: data }, { multi: false })
            .then(() => {
                resolve();
            })
            .catch((err) => {
                reject(err);
            });
    });
}

module.exports.getUserByID = function (accountID) {
    return new Promise((resolve, reject) => {
        Accounts.findOne({ "_id": accountID }).exec()
            .then((data) => {
                resolve(data);
            })
            .catch((err) => {
                reject(err);
            });
    });
}

module.exports.getUserByUsername = function (username) {
    return new Promise((resolve, reject) => {
        Accounts.findOne({ "username": username }).exec()
            .then((data) => {
                resolve(data);
            })
            .catch((err) => {
                reject(err);
            });
    });
}

var getAccountPassword = function (username) {
    return new Promise((resolve, reject) => {
        Accounts.findOne({ "username": username }, "password").exec()
            .then((data) => {
                resolve(data);
            })
            .catch((err) => {
                reject(err);
            });
    });
}

module.exports.removeUser = function (accID) {
    return new Promise((resolve, reject) => {
        Accounts.remove({ "_id": accID }).exec()
            .then((data) => {
                resolve();
            })
            .catch((err) => {
                reject(err);
            });
    });
}

module.exports.checkPassword = function (user, pass) {
    this.getAccountPassword(user).then((accData) => {
        let inPass = saltPassword(pass, accData.password.salt);
        return (inPass == accData.password.passwordHash);
    })
}

var saltPassword = function (password, salt) {
    var hash = crypto.createHmac('sha512', salt); /** Hashing algorithm sha512 */
    hash.update(password);
    return hash.digest('hex');
};

var getRandomString = function (length) {
    return crypto.randomBytes(Math.ceil(length / 2))
        .toString('hex') /** convert to hexadecimal format */
        .slice(0, length);   /** return required number of characters */
};