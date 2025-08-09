const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const prisma = new PrismaClient();

/**
 * Authentication service to handle user registration, login, and token verification
 */
class AuthService {
  /**
   * Register a new user
   * @param {Object} userData - User data containing email, password, and name
   * @returns {Object} - User data and token
   */
  async register(userData) {
    const { email, password, name } = userData;
    
    // Validate required fields
    if (!email || !password || !name) {
      throw new Error('All fields are required');
    }

    // Check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: { email },
    });
    
    if (existingUser) {
      throw new Error('User already exists');
    }
    
    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);
    
    // Create user
    const user = await prisma.user.create({
      data: {
        email,
        password: hashedPassword,
        name,
        role: 'CUSTOMER',
      },
    });
    
    // Generate JWT token
    const token = this.generateToken(user);
    
    return {
      token,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
      },
    };
  }

  /**
   * Login a user
   * @param {Object} credentials - User credentials containing email and password
   * @returns {Object} - User data and token
   */
  async login(credentials) {
    const { email, password } = credentials;
    
    // Find user
    const user = await prisma.user.findUnique({
      where: { email },
    });
    
    if (!user) {
      throw new Error('Invalid credentials');
    }
    
    // Verify password
    const validPassword = await bcrypt.compare(password, user.password);
    if (!validPassword) {
      throw new Error('Invalid credentials');
    }
    
    // Generate JWT token
    const token = this.generateToken(user);
    
    return {
      token,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
      },
    };
  }

  /**
   * Verify token and get user data
   * @param {string} token - JWT token
   * @returns {Object} - User data
   */
  async verifyToken(token) {
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      
      const user = await prisma.user.findUnique({
        where: { id: decoded.userId },
        select: {
          id: true,
          email: true,
          name: true,
          role: true,
          createdAt: true,
        },
      });
      
      if (!user) {
        throw new Error('User not found');
      }
      
      return user;
    } catch (error) {
      throw new Error('Invalid token');
    }
  }

  /**
   * Generate JWT token for a user
   * @param {Object} user - User object
   * @returns {string} - JWT token
   */
  generateToken(user) {
    return jwt.sign(
      { userId: user.id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: '24h' }
    );
  }
}

module.exports = new AuthService(); 