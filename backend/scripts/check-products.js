const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function checkAndCreateProducts() {
  try {
    console.log('Connecting to database...');
    await prisma.$connect();
    console.log('Connection successful!');
    
    // Check for existing products
    const productCount = await prisma.product.count();
    console.log(`Current product count: ${productCount}`);
    
    // Show all products
    const products = await prisma.product.findMany();
    console.log('Current products:', products);
    
    // Check if categories exist
    const categories = await prisma.category.findMany();
    console.log('Current categories:', categories);
    
    // Create categories if none exist
    if (categories.length === 0) {
      console.log('Creating categories...');
      const categoryData = [
        { name: 'Fruits' },
        { name: 'Vegetables' },
        { name: 'Dairy' },
        { name: 'Bakery' },
        { name: 'Meat' }
      ];
      
      for (const category of categoryData) {
        await prisma.category.create({
          data: category
        });
      }
      
      console.log('Categories created successfully!');
    }
    
    // Get the updated categories
    const updatedCategories = await prisma.category.findMany();
    
    // Create products if none exist
    if (productCount === 0) {
      console.log('Creating sample products...');
      
      const productData = [
        {
          name: 'Red Apple',
          description: 'Fresh and juicy red apples',
          price: 1.99,
          stock: 100,
          image: 'https://images.unsplash.com/photo-1560806887-1e4cd0b6cbd6',
          categoryId: updatedCategories.find(c => c.name === 'Fruits').id
        },
        {
          name: 'Banana',
          description: 'Ripe yellow bananas',
          price: 0.99,
          stock: 150,
          image: 'https://images.unsplash.com/photo-1543218024-57a70143c369',
          categoryId: updatedCategories.find(c => c.name === 'Fruits').id
        },
        {
          name: 'Carrot',
          description: 'Fresh organic carrots',
          price: 1.29,
          stock: 80,
          image: 'https://images.unsplash.com/photo-1447175008436-054170c2e979',
          categoryId: updatedCategories.find(c => c.name === 'Vegetables').id
        },
        {
          name: 'Whole Milk',
          description: 'Fresh whole milk, 1 gallon',
          price: 3.49,
          stock: 45,
          image: 'https://images.unsplash.com/photo-1563636619-e9143da7973b',
          categoryId: updatedCategories.find(c => c.name === 'Dairy').id
        },
        {
          name: 'Sourdough Bread',
          description: 'Freshly baked sourdough bread',
          price: 4.99,
          stock: 30,
          image: 'https://images.unsplash.com/photo-1585478259715-1c093a7b89d3',
          categoryId: updatedCategories.find(c => c.name === 'Bakery').id
        }
      ];
      
      for (const product of productData) {
        await prisma.product.create({
          data: product
        });
      }
      
      console.log('Products created successfully!');
    }
    
    // Get the updated products
    const updatedProducts = await prisma.product.findMany({
      include: {
        category: true
      }
    });
    
    console.log('Products in database:');
    console.table(updatedProducts.map(p => ({
      id: p.id,
      name: p.name,
      price: p.price,
      stock: p.stock,
      category: p.category.name
    })));
    
  } catch (error) {
    console.error('Error:', error);
  } finally {
    await prisma.$disconnect();
  }
}

checkAndCreateProducts(); 