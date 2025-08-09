const express = require('express');
const { PrismaClient } = require('@prisma/client');
const router = express.Router();
const prisma = new PrismaClient();

// Get all categories
router.get('/', async (req, res) => {
  try {
    const categories = await prisma.category.findMany({
      include: {
        products: true,
      },
    });
    
    res.json(categories);
  } catch (error) {
    console.error('Error fetching categories:', error);
    res.status(500).json({ message: 'Failed to fetch categories', error: error.message });
  }
});

// Get category by ID
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    
    const category = await prisma.category.findUnique({
      where: {
        id: Number(id),
      },
      include: {
        products: true,
      },
    });
    
    if (!category) {
      return res.status(404).json({ message: 'Category not found' });
    }
    
    res.json(category);
  } catch (error) {
    console.error(`Error fetching category with ID ${req.params.id}:`, error);
    res.status(500).json({ message: 'Failed to fetch category', error: error.message });
  }
});

// Create a new category
router.post('/', async (req, res) => {
  try {
    const { name } = req.body;
    
    const category = await prisma.category.create({
      data: {
        name,
      },
    });
    
    res.status(201).json(category);
  } catch (error) {
    console.error('Error creating category:', error);
    res.status(500).json({ message: 'Failed to create category', error: error.message });
  }
});

// Update a category
router.put('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { name } = req.body;
    
    const category = await prisma.category.update({
      where: {
        id: Number(id),
      },
      data: {
        name,
      },
    });
    
    res.json(category);
  } catch (error) {
    console.error(`Error updating category with ID ${req.params.id}:`, error);
    res.status(500).json({ message: 'Failed to update category', error: error.message });
  }
});

// Delete a category
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    
    await prisma.category.delete({
      where: {
        id: Number(id),
      },
    });
    
    res.json({ message: 'Category deleted successfully' });
  } catch (error) {
    console.error(`Error deleting category with ID ${req.params.id}:`, error);
    res.status(500).json({ message: 'Failed to delete category', error: error.message });
  }
});

module.exports = router; 