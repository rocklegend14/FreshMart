const express = require('express');
const router = express.Router();
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const authService = require('../services/authService');
const { authenticateUser, authorizeAdmin } = require('../services/authMiddleware');

// Test database connection
async function testDatabaseConnection() {
  try {
    await prisma.$connect();
    console.log('Database connection successful');
    return true;
  } catch (error) {
    console.error('Database connection error:', error);
    return false;
  }
}

// Register new user
router.post('/register', async (req, res) => {
  console.log('==========================================');
  console.log('==== REGISTER ENDPOINT CALLED ============');
  console.log('==========================================');
  console.log('Request body:', req.body);
  
  try {
    const result = await authService.register(req.body);
    res.status(201).json(result);
    console.log('Registration response sent successfully');
  } catch (error) {
    console.error('Registration error details:', error);
    res.status(error.status || 500).json({ 
      message: error.message || 'Error creating user'
    });
  }
});

// Login user
router.post('/login', async (req, res) => {
  try {
    const result = await authService.login(req.body);
    res.json(result);
  } catch (error) {
    res.status(error.status || 401).json({ message: error.message || 'Invalid credentials' });
  }
});

// Get user profile
router.get('/profile', authenticateUser, async (req, res) => {
  try {
    // User is already attached to req by the authenticateUser middleware
    const user = {
      id: req.user.id,
      email: req.user.email,
      name: req.user.name,
      role: req.user.role,
      createdAt: req.user.createdAt
    };
    
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching profile' });
  }
});

// Admin-only route to get all users
router.get('/all', authenticateUser, authorizeAdmin, async (req, res) => {
  try {
    const users = await prisma.user.findMany({
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        createdAt: true,
      }
    });
    
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching users' });
  }
});

module.exports = router; 