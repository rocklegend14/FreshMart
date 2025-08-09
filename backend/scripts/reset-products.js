const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function resetAndCreateProducts() {
  try {
    console.log('Starting reset and create process...');
    
    // Delete all existing products
    console.log('Deleting existing products...');
    await prisma.product.deleteMany();
    console.log('All products deleted');
    
    // Delete all existing categories
    console.log('Deleting existing categories...');
    await prisma.category.deleteMany();
    console.log('All categories deleted');
    
    // Create categories
    console.log('Creating categories...');
    const fruits = await prisma.category.create({
      data: { name: 'Fruits' }
    });
    
    const vegetables = await prisma.category.create({
      data: { name: 'Vegetables' }
    });
    
    const dairy = await prisma.category.create({
      data: { name: 'Dairy' }
    });
    
    const bakery = await prisma.category.create({
      data: { name: 'Bakery' }
    });
    
    const meat = await prisma.category.create({
      data: { name: 'Meat' }
    });
    
    console.log('Categories created:', {
      fruits: fruits.id,
      vegetables: vegetables.id,
      dairy: dairy.id,
      bakery: bakery.id,
      meat: meat.id
    });
    
    // Create products
    console.log('Creating products...');
    const products = await Promise.all([
      prisma.product.create({
        data: {
          name: 'Red Apple',
          description: 'Fresh and juicy red apples',
          price: 1.99,
          stock: 100,
          image: 'https://images.unsplash.com/photo-1560806887-1e4cd0b6cbd6',
          categoryId: fruits.id
        }
      }),
      prisma.product.create({
        data: {
          name: 'Banana',
          description: 'Ripe yellow bananas',
          price: 0.99,
          stock: 150,
          image: 'https://images.unsplash.com/photo-1543218024-57a70143c369',
          categoryId: fruits.id
        }
      }),
      prisma.product.create({
        data: {
          name: 'Carrot',
          description: 'Fresh organic carrots',
          price: 1.29,
          stock: 80,
          image: 'https://images.unsplash.com/photo-1447175008436-054170c2e979',
          categoryId: vegetables.id
        }
      }),
      prisma.product.create({
        data: {
          name: 'Whole Milk',
          description: 'Fresh whole milk, 1 gallon',
          price: 3.49,
          stock: 45,
          image: 'https://images.unsplash.com/photo-1563636619-e9143da7973b',
          categoryId: dairy.id
        }
      }),
      prisma.product.create({
        data: {
          name: 'Sourdough Bread',
          description: 'Freshly baked sourdough bread',
          price: 4.99,
          stock: 30,
          image: 'https://images.unsplash.com/photo-1585478259715-1c093a7b89d3',
          categoryId: bakery.id
        }
      }),
      prisma.product.create({
        data: {
          name: 'Chicken Breast',
          description: 'Fresh boneless chicken breast',
          price: 5.99,
          stock: 25,
          image: 'https://images.unsplash.com/photo-1604503468506-a8da13d82791',
          categoryId: meat.id
        }
      })
    ]);
    
    console.log(`Created ${products.length} products`);
    
    // Verify products were created
    console.log('\nVerifying products...');
    const allProducts = await prisma.product.findMany({
      include: {
        category: true
      }
    });
    
    allProducts.forEach(product => {
      console.log(`- ${product.name} ($${product.price}) - Category: ${product.category.name}`);
    });
    
    console.log(`\nVerified ${allProducts.length} products in database`);
    console.log('Process completed successfully!');
    
  } catch (error) {
    console.error('Error:', error);
  } finally {
    await prisma.$disconnect();
  }
}

resetAndCreateProducts(); 