const mongoose = require('mongoose');
const crypto = require('crypto');
let Schema = mongoose.Schema;
let Accounts;

var accountSchema = new Schema({
    "username": {
        "type": String,
        "unique": true
    },
    "password": {
        "salt": String,
        "passwordHash": String
    },
    "name": String,
    "email": {
        "type": String,
        "unique": true
    },
    "teams": [],
    "title": {
        "type": String,
        "default": "User"
    },
    "power": {
        "type": Number,
        "default": 1
    },
    "emailValidated": {
        "type": Boolean,
        "default": false
    },
    "member": {
        "type": Boolean,
        "default": false
    }
});

module.exports = function (db) {
    Accounts = db.model("accounts", accountSchema);
}

module.exports.setDatabase = function (db) {
    Accounts = db.model("accounts", accountSchema);
}

module.exports.createAccount = function (data) {

    return new Promise((resolve, reject) => {
        //set password hash
        data.username = data.username.toLowerCase();
        let salt = getRandomString(16);
        let saltedPass = saltPassword(data.password, salt);
        data.password = {
            "salt": salt,
            "passwordHash": saltedPass
        };
        console.log(data);
        let newUser = new Accounts(data);
        newUser.save((err) => {
            console.log("DEBUG: " + "Error creating account" + err);
            reject("Error creating account" + err);
        });
        resolve();
    });
}

module.exports.getAccounts = function () {
    return new Promise((resolve, reject) => {
        Accounts.find().select({ 'password': 0 }).exec()
            .then((data) => {
                resolve(data);
            })
            .catch((err) => {
                reject(err);
            })
    });
}

module.exports.updateAccount = function (data) {
    return new Promise((resolve, reject) => {
        Accounts.update({ "username": data.username }, { $set: data }, { multi: false })
            .then(() => {
                resolve();
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

module.exports.removeUser = function (username) {
    return new Promise((resolve, reject) => {
        Accounts.remove({ "username": username }).exec()
            .then((data) => {
                resolve();
            })
            .catch((err) => {
                reject(err);
            });
    });
}

//resolves with user data if password is right or it returns null
module.exports.checkPassword = function (user, pass) {
    return new Promise((resolve, reject) => {
        this.getUserByUsername(user).then((accData) => {
            if (accData != null) {
                let inPass = saltPassword(pass, accData.password.salt);

                if (inPass === accData.password.passwordHash)
                    resolve(accData);
                else
                    reject("Wrong password");
            }
            else
                reject("No such user");
        });
    });
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