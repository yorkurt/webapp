const mongoose = require('mongoose');
let Schema = mongoose.Schema;
let Inventory, Checkout;


var inventorySchema = new Schema({
    "name": String,
    "description": String,
    "location": String,
    "totalQuantity": Number,
    "availableQuantity": Number,
    "tags": []
});

var checkoutSchema = new Schema({
    "itemID": String,
    "status": String, //Pending/Loaned/Returned/Rejected
    "createDate": Date,
    "loanDate": Date,
    "loanTime": Number, //number of days
    "loanTo": {
        "type": String,
        "default": ""
    },//name
    "approvedBy": {
        "type": String,
        "default": ""
    }//name
});

module.exports = function (db) {
    Inventory = db.model("inventory", inventorySchema);
    Checkout = db.model("checkouts", checkoutSchema);
}


//Inventory code
module.exports.createItem = function (data) {

    return new Promise((resolve, reject) => {

        let newItem = new Inventory(data);
        newItem.save((err) => {
            reject("Error creating item :" + newItem);
        });
        resolve();
    });
}

module.exports.getInventory = function () {
    return new Promise((resolve, reject) => {
        Inventory.find().exec()
            .then((data) => {
                resolve(data);
            })
            .catch((err) => {
                reject(err);
            })
    });
}

module.exports.updateItem = function (data) {
    return new Promise((resolve, reject) => {
        Users.update({ "_id": data.checkoutID }, { $set: data }, { multi: false })
            .then(() => {
                resolve();
            })
            .catch((err) => {
                reject(err);
            });
    });
}

module.exports.removeItem = function (itemID) {
    return new Promise((resolve, reject) => {
        Users.remove({ "_id": itemID }).exec()
            .then(() => {
                resolve();
            })
            .catch((err) => {
                reject(err);
            });
    });
}


//checkout

/**
 * { 
 *  itemID: String
 *  loanTo: 
 * }
 * 
 */
module.exports.createCheckout = function (data) {

    return new Promise((resolve, reject) => {

        let newCheckout = new Checkout(data);
        newCheckout.save((err) => {
            reject("Error creating item :" + newItem);
        });
        resolve();
    });
}


module.exports.getCheckoutByStatus = function (statusString) {
    return new Promise((resolve, reject) => {
        Checkout.find({ "status": statusString }).exec()
            .then((data) => {
                resolve(data);
            })
            .catch((err) => {
                reject(err);
            })
    });
}


module.exports.getCheckout = function () {
    return new Promise((resolve, reject) => {
        Checkout.find().exec()
            .then((data) => {
                resolve(data);
            })
            .catch((err) => {
                reject(err);
            })
    });
}

module.exports.updateCheckout = function (data) {
    return new Promise((resolve, reject) => {
        Checkout.update({ "_id": data.checkoutID }, { $set: data }, { multi: false })
            .then(() => {
                resolve();
            })
            .catch((err) => {
                reject(err);
            });
    });
}

module.exports.removeCheckout = function (checkoutID) {
    return new Promise((resolve, reject) => {
        Users.remove({ "_id": checkoutID }).exec()
            .then(() => {
                resolve();
            })
            .catch((err) => {
                reject(err);
            });
    });
}














