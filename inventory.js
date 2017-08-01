const mongoose = require('mongoose');
let Schema = mongoose.Schema;
let Inventory, Checkout;


var inventorySchema = new Schema({
    "name": String,
    "description": String,
    "location": String,
    "quantity": Number,
    "availableQuantity": Number,
    "tags": []
});

var checkoutSchema = new Schema({
    "itemID": String,
    "loanDate": Date,
    "loanTime": Number,
    "loanTo" : String,//name
    "approvedBy": String//name
});

module.exports = function (db) {
    Inventory = db.model("inventory", inventorySchema);
    Checkout = db.model("checkouts", checkoutSchema);
}






















module.exports.createUser = function (data) {

    return new Promise((resolve, reject) => {
        //set password hash
        let salt = getRandomString(16);
        let saltedPass = saltPassword(data.password, salt);
        data.password = {
            "salt": salt,
            "passwordHash": saltedPass
        };
        let newUser = new Users(data);
        newUser.save((err) => {
            reject("Error creating user");
        });
        resolve();
    });
}

module.exports.getUsers = function () {
    return new Promise((resolve, reject) => {
        Users.find().select({ 'password'}).exec()
            .then(() => {
                resolve(data);
            })
            .catch((err) => {
                reject(err);
            })
    });
}

module.exports.updateUser = function (data) {
    return new Promise((resolve, reject) => {
        Users.update({ "_id": data.userID }, { $set: data }, { multi: false })
            .then(() => {
                resolve();
            })
            .catch((err) => {
                reject(err);
            });
    });
}

module.exports.getUserByID = function (userID) {
    return new Promise((resolve, reject) => {
        Users.findOne({ "_id": userID }).exec()
            .then((data) => {
                resolve(data);
            })
            .catch((err) => {
                reject(err);
            });
    });
}

var getUserPassword = function (username) {
    return new Promise((resolve, reject) => {
        Users.findOne({ "username": username }, "password").exec()
            .then((data) => {
                resolve(data);
            })
            .catch((err) => {
                reject(err);
            });
    });
}

module.exports.removeUser = function (userID) {
    return new Promise((resolve, reject) => {
        Users.remove({ "_id": userID }).exec()
            .then((data) => {
                resolve();
            })
            .catch((err) => {
                reject(err);
            });
    });
}

module.exports.checkPassword = function (user, pass) {
    this.getUserPassword(user).then((userData) => {
        let inPass = saltPassword(pass, userData.password.salt);
        if (inPass == userData.password.passwordHash)
            return true;
        else
            return false;
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