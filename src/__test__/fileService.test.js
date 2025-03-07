const fs = require('fs');
const {readFile, writeFile} = require('../fileService');

jest.mock('fs');
describe('readFile', () => {
    it('should call callback with data when file is read successfully', (done) => {
      const data = '[{"name":"item 1", "quantity":2, "price":1.55, "bought":false}]';
      
      fs.readFile.mockImplementation((file, callback) => {
        callback(null, data); 
      });
  
      readFile((err, result) => {
        expect(err).toBeNull(); 
        expect(result).toEqual(JSON.parse(data)); 
        done(); 
      });
    });

    it('should call callback with error when the file read fails', (done) => {
        const error = new Error('File not found'); 
        fs.readFile.mockImplementation((file, callback) => {
          callback(error, null); 
        });
    
        readFile((err, data) => {
          expect(err).toBe(error); 
          expect(data).toBeUndefined(); 
          done(); 
        });
    });

});
describe('writeFile', () => {
    it('should call callback with null when the file is written successfully', (done) => {
      fs.writeFile.mockImplementation((file, data, callback) => {
        callback(null); 
      });
      const groceryList = { item1: 'apple', item2: 'banana' };
      writeFile(groceryList, (err) => {
        expect(err).toBeNull();
        done();
      });
    });
  
    it('should call callback with an error when the file write fails', (done) => {
      const error = new Error('Permission denied');
      fs.writeFile.mockImplementation((file, data, callback) => {
        callback(error); 
      });
      const groceryList = { item1: 'apple', item2: 'banana' };
      writeFile(groceryList, (err) => {
        expect(err).toBe(error);
        done();
      });
    });
});