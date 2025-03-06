const logger = require('./util/logger').logger;

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

module.exports = sendResponse;