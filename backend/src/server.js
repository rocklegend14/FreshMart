const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const path = require('path');
const { PrismaClient } = require('@prisma/client');

// Import routes
const productRoutes = require('./routes/productRoutes');
const userRoutes = require('./routes/userRoutes');
const orderRoutes = require('./routes/orderRoutes');
const categoryRoutes = require('./routes/categoryRoutes');

// Load environment variables
dotenv.config();

// Initialize Express app
const app = express();
const prisma = new PrismaClient();

// Test database connection
async function testDatabaseConnection() {
  try {
    console.log('Testing database connection...');
    await prisma.$connect();
    console.log('Database connected successfully!');
    
    // Log database URL (with password masked)
    const dbUrl = process.env.DATABASE_URL.replace(/(mysql:\/\/\w+:)([^@]+)(@.+)/, '$1****$3');
    console.log('Using database:', dbUrl);
    
    return true;
  } catch (error) {
    console.error('Database connection error:', error);
    return false;
  }
}

// Middleware
app.use(cors());
app.use(express.json());

// Serve static files
app.use(express.static(path.join(__dirname, '../public')));

// Routes
app.use('/api/products', productRoutes);
app.use('/api/users', userRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/categories', categoryRoutes);

// Basic route
app.get('/', (req, res) => {
  res.json({ message: 'Welcome to the Grocery Store API' });
});

// Static test form
app.get('/test', (req, res) => {
  res.sendFile(path.join(__dirname, '../public/test-form.html'));
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: 'Something went wrong!' });
});

// Start server
const PORT = process.env.PORT || 5000;

// Connect to the database, then start the server
testDatabaseConnection().then(isConnected => {
  if (isConnected) {
    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
      console.log(`Test form available at: http://localhost:${PORT}/test`);
    });
  } else {
    console.error('Failed to connect to the database. Server not started.');
    process.exit(1);
  }
}); 