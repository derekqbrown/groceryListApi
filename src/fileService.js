const fs = require('fs');
const GROCERY_LIST_FILE = './data/groceryList.json';

function readFile(callback) {
    fs.readFile(GROCERY_LIST_FILE, (err, data) => {
        if (err) {
            callback(err);
        } else {
            callback(null, JSON.parse(data));
        }
    });
}

function writeFile(groceryList, callback) {
    fs.writeFile(GROCERY_LIST_FILE, JSON.stringify(groceryList), (err) => {
        callback(err);
    });
}

module.exports = { readFile, writeFile };