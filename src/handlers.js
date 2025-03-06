const { readFile, writeFile } = require('./fileService');
const sendResponse = require('./responseService');

function handleGetRequest(_req, res) {
    readFile((err, groceryList) => {
        if (err) {
            return sendResponse(res, 500, "Internal Server Error");
        }
        sendResponse(res, 200, "List successfully retrieved", { groceryList });
    });
}

function handlePostRequest(_req, res, body) {
    const { name, quantity = 1, price, bought = false } = body;
    if (!name || !price) {
        return sendResponse(res, 400, "Please provide a valid name and price");
    }
    readFile((err, groceryList) => {
        if (err) {
            return sendResponse(res, 500, "Internal Server Error");
        }
        groceryList.push({ name, quantity, price, bought });
        writeFile(groceryList, (err) => {
            if (err) {
                return sendResponse(res, 500, "Internal Server Error");
            }
            sendResponse(res, 201, `${name} added to list`);
        });
    });
}

function handlePutRequest(_req, res, body, index) {
    const { name, quantity, price, bought } = body;
    if (!name && !price && !quantity && !bought) {
        return sendResponse(res, 400, "At least one field is required to update.");
    }
    readFile((err, groceryList) => {
        if (err) {
            return sendResponse(res, 500, "Internal Server Error");
        }
        if (index >= groceryList.length || index < 0) {
            return sendResponse(res, 404, `Item at index ${index + 1} not found`);
        }
        groceryList[index] = { name, quantity, price, bought };
        writeFile(groceryList, (err) => {
            if (err) {
                return sendResponse(res, 500, "Internal Server Error");
            }
            sendResponse(res, 200, `${name} updated successfully`);
        });
    });
}

function handleDeleteRequest(_req, res, index) {
    if (!index) {
        return sendResponse(res, 400, "Please provide a valid index to delete \n(e.g. \'/items/1\' to delete the first item on the list)");
    }
    readFile((err, groceryList) => {
        if (err) {
            return sendResponse(res, 500, "Internal Server Error");
        }
        if (index >= groceryList.length || index < 0) {
            return sendResponse(res, 404, `Item at index ${index + 1} not found`);
        }
        const itemToDelete = groceryList[index];
        groceryList.splice(index, 1);
        writeFile(groceryList, (err) => {
            if (err) {
                return sendResponse(res, 500, "Internal Server Error");
            }
            sendResponse(res, 200, `Deletion successful for item at index ${index +1}: \n${JSON.stringify(itemToDelete)} `);
        });
    });
}

module.exports = { handleGetRequest, handlePostRequest, handlePutRequest, handleDeleteRequest };