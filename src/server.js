const express = require('express');
const cors = require('cors');
const logger = require('./util/logger').logger;
const { handleGetRequest, handlePostRequest, handlePutRequest, handleDeleteRequest } = require('./handlers');

const app = express();
const PORT = 3001;

app.use(cors()); // Enable CORS for all routes
app.use(express.json()); // Parse JSON request bodies

// Middleware for logging requests
app.use('/items/:id?', (req, res, next) => {
    logger.info(`${req.method} request received at port ${PORT}`);
    next();
});

app.get('/items', (req, res) => {
    handleGetRequest(req, res);
});

app.post('/items', (req, res) => {
    handlePostRequest(req, res, req.body);
});

app.put('/items/:id', (req, res) => {
    const index = parseInt(req.params.id) - 1;
    handlePutRequest(req, res, req.body, index);
});

app.delete('/items/:id', (req, res) => {
    const index = parseInt(req.params.id) - 1;
    handleDeleteRequest(req, res, index);
});

// Error handling for 404 (Not Found)
app.use((req, res) => {
    res.status(404).send(`Resource not found at URL ${req.url}`);
});

// Error handling for other errors (500 Internal Server Error)
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send('Something broke!');
});

app.listen(PORT, () => {
    logger.info(`Server is listening on http://localhost:${PORT}`);
});

module.exports = app;