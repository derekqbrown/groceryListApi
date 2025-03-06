const http = require('http');
const logger = require('./util/logger').logger;
const { handleGetRequest, handlePostRequest, handlePutRequest, handleDeleteRequest } = require('./handlers');

const PORT = 3000;

const server = http.createServer((req, res) => {
    let body = "";

    req.on('data', (chunk) => {
        body += chunk;
    }).on("end", () => {
        body = body.length > 0 ? JSON.parse(body) : {};
        const contentType = { "Content-Type": "application/json" };

        if (req.url.startsWith("/items")) {
            const index = parseInt(req.url.split("/")[2])-1; // indices are 1-based in URL, 0-based for arrays here.
            logger.info(`${req.method} request received at port ${PORT}`);

            switch (req.method) {
                case "POST":
                    handlePostRequest(req, res, body);
                    break;
                case "GET":
                    handleGetRequest(req, res);
                    break;
                case "PUT":
                    handlePutRequest(req, res, body, index);
                    break;
                case "DELETE":
                    handleDeleteRequest(req, res, index);
                    break;
                default:
                    sendResponse(res, 405, `Unauthorized Method: ${req.method}. \nAllowed methods: GET, POST, PUT, DELETE`);
            }
        } else {
            sendResponse(res, 404, `Resource not found at URL ${req.url}`);
        }
    });
});

server.listen(PORT, () => {
    logger.info(`Server is listening on http://localhost:${PORT}`);
});

module.exports = server;