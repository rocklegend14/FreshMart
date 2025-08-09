const express = require('express');
const router = express.Router();
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const jwt = require('jsonwebtoken');

// Product ID mapping for string IDs to numeric IDs
// This is a temporary solution until the database schema is updated
const productIdMap = {
  // Fruits & Vegetables
  'f1': 1,
  'f2': 2,
  'f3': 3,
  'f4': 4,
  // Dairy & Eggs
  'd1': 5,
  'd2': 6,
  'd3': 7,
  'd4': 8,
  // Bakery
  'b1': 9,
  'b2': 10,
  'b3': 11,
  'b4': 12,
  // Snacks
  's1': 13,
  's2': 14,
  's3': 15,
  's4': 16,
  // Beverages
  'bv1': 17,
  'bv2': 18,
  'bv3': 19,
  'bv4': 20,
  // Household
  'h1': 21,
  'h2': 22,
  'h3': 23,
  'h4': 24
};

// Helper function to convert string IDs to numeric IDs
function getNumericProductId(id) {
  // If it's already a number, use it
  if (typeof id === 'number') {
    return id;
  }
  
  // Convert numeric strings to numbers
  if (typeof id === 'string' && /^\d+$/.test(id)) {
    return Number(id);
  }
  
  // Look up string IDs in our mapping
  if (productIdMap[id] !== undefined) {
    return productIdMap[id];
  }
  
  // If we can't map it, return null
  console.error(`No mapping found for product ID: ${id}`);
  return null;
}

// Middleware to verify JWT token
const verifyToken = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    console.log('Auth header:', authHeader ? `${authHeader.substring(0, 15)}...` : 'None');
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      console.log('No token or wrong format');
      return res.status(401).json({ message: 'No token provided or wrong format' });
    }
    
    const token = authHeader.split(' ')[1];
    if (!token) {
      console.log('No token after Bearer');
      return res.status(401).json({ message: 'No token provided' });
    }
    
    // Make sure we have a JWT_SECRET
    if (!process.env.JWT_SECRET) {
      console.error('JWT_SECRET not defined in environment!');
      return res.status(500).json({ message: 'Server configuration error' });
    }
    
    try {
      console.log('Verifying token with secret');
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      console.log('Token verified, user ID:', decoded.userId);
      req.userId = decoded.userId;
      next();
    } catch (jwtError) {
      console.error('JWT verification error:', jwtError.message);
      return res.status(401).json({ message: 'Invalid token' });
    }
  } catch (error) {
    console.error('Unexpected error in verifyToken middleware:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

// Create new order
router.post('/', verifyToken, async (req, res) => {
  try {
    const { items, shippingAddress, paymentMethod } = req.body;
    
    console.log('Order request received:', {
      userId: req.userId,
      itemsCount: items?.length || 0,
      shippingAddressProvided: !!shippingAddress,
      paymentMethod
    });
    
    if (!items || !Array.isArray(items) || items.length === 0) {
      return res.status(400).json({ message: 'Order must contain at least one item' });
    }
    
    console.log('Order items:', JSON.stringify(items, null, 2));
    
    // Calculate total
    let total = 0;
    for (const item of items) {
      // Early validation of product ID - prevent null values
      if (item.productId === null || item.productId === undefined) {
        console.error('Invalid product ID: null or undefined');
        return res.status(400).json({ message: 'Invalid product ID: null' });
      }

      console.log(`Looking up product with ID: ${item.productId} (${typeof item.productId})`);
      
      // Convert to numeric ID using our mapping function
      const numericProductId = getNumericProductId(item.productId);
      
      if (numericProductId === null) {
        console.error(`Invalid product ID: ${item.productId} - no mapping found`);
        return res.status(400).json({ message: `Invalid product ID: ${item.productId} - not found in product catalog` });
      }
      
      const product = await prisma.product.findUnique({
        where: { id: numericProductId },
      });
      
      if (!product) {
        console.error(`Product ${numericProductId} (from ${item.productId}) not found in database`);
        return res.status(404).json({ message: `Product ${item.productId} not found` });
      }
      
      console.log(`Found product: ${product.name}, price: ${product.price}, stock: ${product.stock}`);
      
      if (product.stock < item.quantity) {
        return res.status(400).json({ message: `Insufficient stock for product ${product.name}` });
      }
      total += product.price * item.quantity;
    }
    
    console.log(`Calculated total: ${total}`);
    
    // Create order with additional details
    try {
      console.log('Creating order with the following data:');
      console.log('- userId:', req.userId);
      console.log('- total:', total);
      console.log('- status: PENDING');
      console.log('- items:', items.length);
      
      // Prepare order items with mapped product IDs for better logging
      const orderItemsToCreate = items.map(item => {
        const numericProductId = getNumericProductId(item.productId);
        
        if (numericProductId === null) {
          throw new Error(`Invalid product ID: ${item.productId} - no mapping found`);
        }
        
        console.log(`- Item: productId ${item.productId} -> ${numericProductId}, quantity: ${item.quantity}, price: ${item.price}`);
        
        return {
          productId: numericProductId,
          quantity: item.quantity,
          price: item.price,
        };
      });
      
      // Create order with items in a single transaction
      const order = await prisma.$transaction(async (tx) => {
        // First create the order
        const newOrder = await tx.order.create({
          data: {
            userId: req.userId,
            total,
            status: 'PENDING',
            shippingAddress: shippingAddress ? JSON.stringify(shippingAddress) : null,
            paymentMethod: paymentMethod || 'CREDIT_CARD',
          },
        });
        
        console.log(`Order created with ID: ${newOrder.id}, now creating ${orderItemsToCreate.length} order items`);
        
        // Then create each order item explicitly
        for (const item of orderItemsToCreate) {
          await tx.orderItem.create({
            data: {
              orderId: newOrder.id,
              productId: item.productId,
              quantity: item.quantity,
              price: item.price,
            },
          });
          console.log(`Order item created for orderId: ${newOrder.id}, productId: ${item.productId}`);
        }
        
        // Return the order with items included
        return tx.order.findUnique({
          where: { id: newOrder.id },
          include: {
            items: {
              include: {
                product: true,
              },
            },
          },
        });
      });
      
      console.log(`Order created successfully with ID: ${order.id} and ${order.items.length} items`);
      
      // Update product stock
      for (const item of items) {
        // Convert to numeric ID using our mapping function
        const numericProductId = getNumericProductId(item.productId);
        
        if (numericProductId === null) {
          console.error(`Skipping stock update for invalid product ID: ${item.productId}`);
          continue;
        }
        
        await prisma.product.update({
          where: { id: numericProductId },
          data: {
            stock: {
              decrement: item.quantity,
            },
          },
        });
        console.log(`Updated stock for product ${item.productId} (mapped to ${numericProductId})`);
      }
      
      res.status(201).json(order);
    } catch (orderError) {
      console.error('Error creating order in database:', orderError);
      throw orderError;
    }
  } catch (error) {
    console.error('Order creation error:', error);
    res.status(400).json({ message: error.message });
  }
});

// Get user's orders
router.get('/my-orders', verifyToken, async (req, res) => {
  try {
    const orders = await prisma.order.findMany({
      where: {
        userId: req.userId,
      },
      include: {
        items: {
          include: {
            product: true,
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });
    res.json(orders);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get order by ID
router.get('/:id', verifyToken, async (req, res) => {
  try {
    const order = await prisma.order.findUnique({
      where: {
        id: parseInt(req.params.id),
      },
      include: {
        items: {
          include: {
            product: true,
          },
        },
      },
    });
    
    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }
    
    if (order.userId !== req.userId) {
      return res.status(403).json({ message: 'Not authorized to view this order' });
    }
    
    res.json(order);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Update order status (admin only)
router.put('/:id/status', verifyToken, async (req, res) => {
  try {
    const { status } = req.body;
    const user = await prisma.user.findUnique({
      where: { id: req.userId },
    });
    
    if (user.role !== 'ADMIN') {
      return res.status(403).json({ message: 'Not authorized to update order status' });
    }
    
    const order = await prisma.order.update({
      where: {
        id: parseInt(req.params.id),
      },
      data: {
        status,
      },
      include: {
        items: {
          include: {
            product: true,
          },
        },
      },
    });
    
    res.json(order);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

module.exports = router; 