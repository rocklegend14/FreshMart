const express = require('express');
const { PrismaClient } = require('@prisma/client');
const router = express.Router();
const prisma = new PrismaClient();

// Get all products
router.get('/', async (req, res) => {
  try {
    const { categoryId } = req.query;
    
    let products;
    
    if (categoryId) {
      products = await prisma.product.findMany({
        where: {
          categoryId: Number(categoryId),
        },
        include: {
          category: true,
        },
      });
    } else {
      products = await prisma.product.findMany({
        include: {
          category: true,
        },
      });
    }
    
    res.json(products);
  } catch (error) {
    console.error('Error fetching products:', error);
    res.status(500).json({ message: 'Failed to fetch products', error: error.message });
  }
});

// Get product by ID
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    
    const product = await prisma.product.findUnique({
      where: {
        id: Number(id),
      },
      include: {
        category: true,
      },
    });
    
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }
    
    res.json(product);
  } catch (error) {
    console.error(`Error fetching product with ID ${req.params.id}:`, error);
    res.status(500).json({ message: 'Failed to fetch product', error: error.message });
  }
});

// Create a new product
router.post('/', async (req, res) => {
  try {
    const { name, description, price, stock, image, categoryId } = req.body;
    
    const product = await prisma.product.create({
      data: {
        name,
        description,
        price: Number(price),
        stock: Number(stock),
        image,
        categoryId: Number(categoryId),
      },
    });
    
    res.status(201).json(product);
  } catch (error) {
    console.error('Error creating product:', error);
    res.status(500).json({ message: 'Failed to create product', error: error.message });
  }
});

// Update a product
router.put('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { name, description, price, stock, image, categoryId } = req.body;
    
    const product = await prisma.product.update({
      where: {
        id: Number(id),
      },
      data: {
        name,
        description,
        price: Number(price),
        stock: Number(stock),
        image,
        categoryId: Number(categoryId),
      },
    });
    
    res.json(product);
  } catch (error) {
    console.error(`Error updating product with ID ${req.params.id}:`, error);
    res.status(500).json({ message: 'Failed to update product', error: error.message });
  }
});

// Delete a product
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    
    await prisma.product.delete({
      where: {
        id: Number(id),
      },
    });
    
    res.json({ message: 'Product deleted successfully' });
  } catch (error) {
    console.error(`Error deleting product with ID ${req.params.id}:`, error);
    res.status(500).json({ message: 'Failed to delete product', error: error.message });
  }
});

module.exports = router; 