const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function countProducts() {
  try {
    const count = await prisma.product.count();
    console.log(`Total products in database: ${count}`);
  } catch (error) {
    console.error('Error:', error);
  } finally {
    await prisma.$disconnect();
  }
}

countProducts(); 