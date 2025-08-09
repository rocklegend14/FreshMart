const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function checkTables() {
  try {
    console.log('Connecting to database...');
    await prisma.$connect();
    console.log('Connection successful!');

    // Try to query each table
    try {
      const userCount = await prisma.user.count();
      console.log(`User table exists and contains ${userCount} records`);
    } catch (error) {
      console.error('Error accessing User table:', error.message);
    }

    try {
      const productCount = await prisma.product.count();
      console.log(`Product table exists and contains ${productCount} records`);
    } catch (error) {
      console.error('Error accessing Product table:', error.message);
    }

    try {
      const categoryCount = await prisma.category.count();
      console.log(`Category table exists and contains ${categoryCount} records`);
    } catch (error) {
      console.error('Error accessing Category table:', error.message);
    }

    try {
      const orderCount = await prisma.order.count();
      console.log(`Order table exists and contains ${orderCount} records`);
    } catch (error) {
      console.error('Error accessing Order table:', error.message);
    }

    // Show database metadata
    const tables = await prisma.$queryRaw`SHOW TABLES`;
    console.log('Database tables:', tables);

  } catch (error) {
    console.error('Database connection error:', error);
  } finally {
    await prisma.$disconnect();
  }
}

checkTables(); 