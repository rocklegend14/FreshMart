const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function listAllProducts() {
  try {
    console.log('Connecting to database...');
    
    // Get product count
    const count = await prisma.product.count();
    console.log(`\nTotal products in database: ${count}`);
    
    // Get all products with categories
    const products = await prisma.product.findMany({
      include: {
        category: true
      }
    });
    
    console.log('\nAll products:');
    products.forEach(product => {
      console.log(`- ${product.name} (₹${product.price}) - Category: ${product.category.name}`);
    });
    
    console.log(`\nVerified ${products.length} products in database`);
    
  } catch (error) {
    console.error('Error:', error);
  } finally {
    await prisma.$disconnect();
  }
}

listAllProducts(); 