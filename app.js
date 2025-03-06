const http = require('http');
const fs = require('fs');
const url = require('url');
const logger = require('./util/logger').logger;

const PORT = 3000;
const GROCERY_LIST_FILE = 'groceryList.json';

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

const server = http.createServer((req, res) => {
    let body = "";

    req.on('data', (chunk) => {
        body += chunk;
    }).on("end", () => {
        body = body.length > 0 ? JSON.parse(body) : {};

        const contentType = { "Content-Type": "application/json" };

        if (req.url.startsWith("/items")) {
            const index = parseInt(req.url.split("/")[2]);
            logger.info(`${req.method} request received for ${req.url} at port ${PORT}`)
            switch (req.method) {
                case "POST":
                    handlePostRequest(req, res, body);
                    break;
                case "GET":
                    handleGetRequest(req, res);
                    break;
                case "PUT":
                    handlePutRequest(req, res, body);
                    break;
                case "DELETE":
                    handleDeleteRequest(req, res, index);
                    break;
            }
        }else{
            sendResponse(res, 404, `Resource not found at URL ${req.url}`);
        }
    });
});


function sendResponse(res, statusCode, message, data = null) {
    const contentType = { "Content-Type": "application/json" };
    res.writeHead(statusCode, contentType);
    const responseBody = data ? { data } : { message };
    res.end(JSON.stringify(responseBody));

    const statusCodeStr = statusCode.toString();
    if (statusCodeStr.startsWith("4")) {
        logger.warn(`Status Code: ${statusCode} | ${message}`);
    } else if (statusCodeStr.startsWith("5")) {
        logger.error(`Status Code: ${statusCode} | ${message}`);
    } else {
        logger.info(`Status Code: ${statusCode} | ${message}`);
    }
}

function handleGetRequest(_req, res) {
    readFile((err, groceryList) => {
        if (err) {
            sendResponse(res, 500, "Internal Server Error");
        } else {
            sendResponse(res, 200, "Grocery List successfully retrieved", { groceryList });
        }
    });
}

function handlePostRequest(_req, res, body) {
    const { name, quantity = 1, price, bought = false } = body;
    if (!name || !price ) {
        sendResponse(res, 400, "Please provide a valid name and price");
    } else {
        readFile((err, groceryList) => {
            if (err) {
                sendResponse(res, 500, "Internal Server Error");
            } else {
                groceryList.push({ name, quantity, price, bought });
                writeFile(groceryList, (err) => {
                    if (err) {
                        sendResponse(res, 500, "Internal Server Error");
                    } else {
                        sendResponse(res, 201, `${name} added to list`);
                    }
                });
            }
        });
    }
}

function handlePutRequest(_req, res, body) {
    const { name, quantity = 1, price, bought = false } = body;
    if (!name || !price || !quantity) {
        sendResponse(res, 400, "Please provide a valid name and price");
    } else {
        readFile((err, groceryList) => {
            if (err) {
                sendResponse(res, 500, "Internal Server Error");
            } else {
                const itemIndex = groceryList.findIndex(item => item.name === name);
                if (itemIndex === -1) {
                    sendResponse(res, 404, "Item not found in the list");
                } else {
                    groceryList[itemIndex] = { name, quantity, price, bought };
                    writeFile(groceryList, (err) => {
                        if (err) {
                            sendResponse(res, 500, "Internal Server Error");
                        } else {
                            sendResponse(res, 200, `${name} updated successfully`);
                        }
                    });
                }
            }
        });
    }
}

function handleDeleteRequest(_req, res, index) {
    if (!index) {
        sendResponse(res, 400, "Please provide a valid index of the item to delete");
    } else {
        readFile((err, groceryList) => {
            if (err) {
                sendResponse(res, 500, "Internal Server Error");
            } else {
                if (index > groceryList.length || index < 1) {
                    sendResponse(res, 404, `Index ${index} not found`);
                } else {
                    const itemToDelete = groceryList[index - 1];
                    groceryList.splice(index - 1, 1);
                    writeFile(groceryList, (err) => {
                        if (err) {
                            sendResponse(res, 500, "Internal Server Error");
                        } else {
                            sendResponse(res, 200, `Item: ${itemToDelete.name} at index ${index} deleted successfully`);
                        }
                    });
                }
            }
        });
    }
}

server.listen(PORT, () => {
    logger.info(`Server is listening on http://localhost:${PORT}`);
});
