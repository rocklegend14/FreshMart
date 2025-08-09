const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function listCategories() {
  try {
    // Get all categories with product count
    const categories = await prisma.category.findMany({
      include: {
        products: true
      }
    });
    
    console.log('Categories and product counts:');
    categories.forEach(category => {
      console.log(`- ${category.name}: ${category.products.length} products`);
    });
    
    console.log(`\nTotal categories: ${categories.length}`);
    
  } catch (error) {
    console.error('Error:', error);
  } finally {
    await prisma.$disconnect();
  }
}

listCategories(); 