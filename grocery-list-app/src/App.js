import React, { useState, useEffect } from 'react';
import axios from 'axios';

import './App.css'; // Import the CSS file

function App() {
  const [items, setItems] = useState([]);
  const [newItem, setNewItem] = useState({ name: '', quantity: 0, price: 0, bought: false });
  const [updateIndex, setUpdateIndex] = useState('');
  const [updateItem, setUpdateItem] = useState({ name: '', quantity: 0, price: 0, bought: false });
  const [deleteIndex, setDeleteIndex] = useState('');

  useEffect(() => {
    fetchItems();
  }, []);

  const fetchItems = async () => {
    try {
      const response = await axios.get('http://localhost:3001/items');
      // console.log(response.data);
      setItems(response.data.data.groceryList);
    } catch (error) {
      console.error('Error fetching items:', error);
    }
  };

  const handleAddItem = async () => {
    try {
      await axios.post('http://localhost:3001/items', newItem);
      setNewItem({ name: '', quantity: 0, price: 0, bought: false });
      fetchItems();
    } catch (error) {
      console.error('Error adding item:', error);
    }
  };

  const handleUpdateItem = async () => {
    try {
      const index = parseInt(updateIndex);
      if (isNaN(index)) {
        alert('Invalid index');
        return;
      }
      await axios.put(`http://localhost:3001/items/${index}`, updateItem);
      setUpdateIndex('');
      setUpdateItem({ name: '', quantity: 0, price: 0, bought: false });
      fetchItems();
    } catch (error) {
      console.error('Error updating item:', error);
    }
  };

  const handleDeleteItem = async () => {
    try {
      const index = parseInt(deleteIndex);
      if (isNaN(index)) {
        alert('Invalid index.');
        return;
      }
      await axios.delete(`http://localhost:3001/items/${index}`);
      setDeleteIndex('');
      fetchItems();
    } catch (error) {
      console.error('Error deleting item:', error);
    }
  };

  return (
    <div className="app-container">
      <h1>Items</h1>
      <button onClick={fetchItems} className="refresh-button">Refresh List</button>
      <table className="items-table">
        <thead>
          <tr>
            <th>#</th>
            <th>Name</th>
            <th>Quantity</th>
            <th>Price</th>
            <th>Bought</th>
          </tr>
        </thead>
        <tbody>
          {items.map((item, index) => (
            <tr key={index}>
              <td>{index + 1}</td>
              <td>{item.name}</td>
              <td>{item.quantity}</td>
              <td>{item.price}</td>
              <td>{(item.bought === "true" || item.bought === true) ? 'Yes' : 'No'}</td>
            </tr>
          ))}
        </tbody>
      </table>

      <div className="form-container">
        <h2>Add Item</h2>
        <input type="text" value={newItem.name} onChange={(e) => setNewItem({ ...newItem, name: e.target.value })} placeholder="Name" />
        <input type="number" value={newItem.quantity} onChange={(e) => setNewItem({ ...newItem, quantity: parseInt(e.target.value) })} placeholder="Quantity" />
        <input type="number" value={newItem.price} onChange={(e) => setNewItem({ ...newItem, price: parseFloat(e.target.value) })} placeholder="Price" />
        <label>Bought: <input type="checkbox" checked={newItem.bought} onChange={(e) => setNewItem({ ...newItem, bought: e.target.checked })} /></label>
        <button onClick={handleAddItem} className="add-button">Add</button>
      </div>

      <div className="form-container">
        <h2>Update Item</h2>
        <select value={updateIndex} onChange={(e) => setUpdateIndex(e.target.value)}>
          <option value="">Select Item</option>
          {items.map((_, index) => (
            <option key={index} value={index + 1}>{index + 1}</option>
          ))}
        </select>
        <input type="text" value={updateItem.name} onChange={(e) => setUpdateItem({ ...updateItem, name: e.target.value })} placeholder="Name" />
        <input type="number" value={updateItem.quantity} onChange={(e) => setUpdateItem({ ...updateItem, quantity: parseInt(e.target.value) })} placeholder="Quantity" />
        <input type="number" value={updateItem.price} onChange={(e) => setUpdateItem({ ...updateItem, price: parseFloat(e.target.value) })} placeholder="Price" />
        <label>Bought: <input type="checkbox" checked={updateItem.bought} onChange={(e) => setUpdateItem({ ...updateItem, bought: e.target.checked })} /></label>
        <button onClick={handleUpdateItem} className="update-button">Update</button>
      </div>

      <div className="form-container">
        <h2>Delete Item</h2>
        <select value={deleteIndex} onChange={(e) => setDeleteIndex(e.target.value)}>
          <option value="">Select Item</option>
          {items.map((_, index) => (
            <option key={index} value={index + 1}>{index + 1}</option>
          ))}
        </select>
        <button onClick={handleDeleteItem} className="delete-button">Delete</button>
      </div>
    </div>
  );
}

export default App;