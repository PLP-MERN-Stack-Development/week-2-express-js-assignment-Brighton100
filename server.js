// server.js - Starter Express server for Week 2 assignment

// Import required modules
const express = require('express');
const bodyParser = require('body-parser');
const { v4: uuidv4 } = require('uuid');

// Initialize Express app
const app = express();
const PORT = process.env.PORT || 3000;

// Middleware setup
app.use(bodyParser.json());

// Sample in-memory products database
let products = [
  {
    id: '1',
    name: 'Laptop',
    description: 'High-performance laptop with 16GB RAM',
    price: 1200,
    category: 'electronics',
    inStock: true
  },
  {
    id: '2',
    name: 'Smartphone',
    description: 'Latest model with 128GB storage',
    price: 800,
    category: 'electronics',
    inStock: true
  },
  {
    id: '3',
    name: 'Coffee Maker',
    description: 'Programmable coffee maker with timer',
    price: 50,
    category: 'kitchen',
    inStock: false
  }
];

// Root route
app.get('/', (req, res) => {
  res.send('Welcome to the Product API! Go to /api/products to see all products.');
});

// GET /api/products - Get all products
app.get('/api/products', (req, res) => {
  res.json(products);
});

// GET /api/products/:id - Get a specific product
app.get('/api/products/:id', (req, res) => {
  const { id } = req.params;
  const product = products.find(p => p.id === id);
  if (!product) {
    return res.status(404).json({ message: 'Product not found' });
  }
  res.json(product);
});

// POST /api/products - Create a new product
app.post('/api/products', (req, res) => {
  const { name, description, price, category, inStock } = req.body;

  // Validate required fields
  if (!name || !description || !price || !category) {
    return res.status(400).json({ message: 'Missing required fields' });
  }

  // Create a new product object
  const newProduct = {
    id: uuidv4(), // Generate a unique ID
    name,
    description,
    price,
    category,
    inStock: inStock || false
  };

  products.push(newProduct);
  res.status(201).json(newProduct);
});

// PUT /api/products/:id - Update a product by ID
app.put('/api/products/:id', (req, res) => {
  const { id } = req.params;
  const { name, description, price, category, inStock } = req.body;

  let product = products.find(p => p.id === id);
  if (!product) {
    return res.status(404).json({ message: 'Product not found' });
  }

  // Update the product properties
  product.name = name || product.name;
  product.description = description || product.description;
  product.price = price || product.price;
  product.category = category || product.category;
  product.inStock = inStock !== undefined ? inStock : product.inStock;

  res.status(200).json(product);
});

// DELETE /api/products/:id - Delete a product by ID
app.delete('/api/products/:id', (req, res) => {
  const { id } = req.params;

  const productIndex = products.findIndex(p => p.id === id);
  if (productIndex === -1) {
    return res.status(404).json({ message: 'Product not found' });
  }

  // Remove the product from the array
  products.splice(productIndex, 1);
  res.status(204).send();
});

// Logging middleware
const logger = (req, res, next) => {
  console.log(`${req.method} request made to ${req.url}`);
  next();
};

app.use(logger);  // Apply logging middleware globally

// Authentication middleware (mocked)
const authenticate = (req, res, next) => {
  const token = req.header('Authorization');
  if (!token) {
    return res.status(401).json({ message: 'Access denied. No token provided.' });
  }
  // Mock token validation
  if (token !== 'secret-token') {
    return res.status(403).json({ message: 'Invalid token' });
  }
  next();  // Token is valid, proceed to the next middleware
};

// Apply authentication to routes that need it
app.use('/api/products', authenticate);

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);  // Log the error stack for debugging
  res.status(500).json({ message: 'Something went wrong!' });
});

// 404 error handling for undefined routes
app.use((req, res, next) => {
  res.status(404).json({ message: 'API endpoint not found' });
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});

// Export the app for testing purposes
module.exports = app;
