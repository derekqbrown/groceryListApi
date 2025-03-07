const http = require('http');
const { server } = require('../server'); // Your server code
jest.mock('../util/logger'); // Mock logger to avoid cluttering the test output

describe('HTTP Server (Integration Tests)', () => {
  let req, res;

  beforeEach(() => {
    req = { 
      on: jest.fn(), 
      method: '', 
      url: '', 
      body: {} 
    };
    res = { 
      statusCode: 0, 
      setHeader: jest.fn(),
      writeHead: jest.fn(),
      end: jest.fn(),
      json: jest.fn(), 
      handleGetRequest: jest.fn()
    };
  });

  it('should route GET /items to handleGetRequest and return 200', () => {
    req.url = '/items';
    req.method = 'GET';

    server(req, res); // Call the server, which routes the request to `handleGetRequest`

    expect(res.statusCode).toBe(200); // Ensure 200 OK is sent
    expect(res.json).toHaveBeenCalledWith(expect.any(Array)); // Expect an array of items
  });

  it.skip('should route POST /items to handlePostRequest and return 201', () => {
    const newItem = { name: 'item1', quantity: 2 };
    req.url = '/items';
    req.method = 'POST';
    req.body = newItem;

    req.on.mockImplementationOnce((event, callback) => {
      if (event === 'data') callback(JSON.stringify(newItem)); // Simulate receiving data
      if (event === 'end') callback();
    });

    server(req, res); // Call the server, which routes the request to `handlePostRequest`

    expect(res.statusCode).toBe(201); // Ensure 201 Created status
    expect(res.json).toHaveBeenCalledWith(expect.objectContaining(newItem)); // Ensure the response body matches the created item
  });

  it.skip('should route PUT /items/:id to handlePutRequest and return 200', () => {
    const updatedItem = { name: 'item2', quantity: 3 };
    const itemId = 1; // Assuming you're updating the item with id 1
    req.url = `/items/${itemId}`;
    req.method = 'PUT';
    req.body = updatedItem;

    req.on.mockImplementationOnce((event, callback) => {
      if (event === 'data') callback(JSON.stringify(updatedItem)); // Simulate receiving data
      if (event === 'end') callback();
    });

    server(req, res); // Call the server, which routes the request to `handlePutRequest`

    expect(res.statusCode).toBe(200); // Ensure 200 OK status
    expect(res.json).toHaveBeenCalledWith(expect.objectContaining(updatedItem)); // Ensure the updated item is returned
  });

  it.skip('should route DELETE /items/:id to handleDeleteRequest and return 200', () => {
    const itemId = 1; // ID of the item to delete
    req.url = `/items/${itemId}`;
    req.method = 'DELETE';

    server(req, res); // Call the server, which routes the request to `handleDeleteRequest`

    expect(res.statusCode).toBe(200); // Ensure 200 OK status
    expect(res.json).toHaveBeenCalledWith({ message: 'Item deleted' }); // Ensure the correct response is returned
  });

  it.skip('should return 404 for unknown routes', () => {
    req.url = '/unknown-route';
    req.method = 'GET';

    server(req, res); // Call the server

    expect(res.statusCode).toBe(404); // Ensure 404 Not Found is sent
    expect(res.writeHead).toHaveBeenCalledWith(404, expect.objectContaining({ 'Content-Type': 'application/json' }));
    expect(res.end).toHaveBeenCalledWith(expect.stringContaining('Resource not found at URL /unknown-route'));
  });

  it.skip('should return 405 for unsupported HTTP methods on /items', () => {
    req.url = '/items';
    req.method = 'PATCH'; // Unsupported method

    server(req, res); // Call the server

    expect(res.statusCode).toBe(405); // Ensure 405 Method Not Allowed is sent
    expect(res.json).toHaveBeenCalledWith({ error: 'Unauthorized Method: PATCH. Allowed methods: GET, POST, PUT, DELETE' });
  });

  it.skip('should handle server errors gracefully', () => {
    const error = new Error('Database failure');
    const req = { url: '/items', method: 'GET' };

    //handleGetRequest.mockImplementationOnce(() => { throw error });

    server(req, res); // Call the server

    expect(res.statusCode).toBe(500); // Ensure 500 Internal Server Error is sent
    expect(res.json).toHaveBeenCalledWith({ error: 'Internal Server Error' });
  });
});