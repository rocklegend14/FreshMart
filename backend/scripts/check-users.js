const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function checkUsers() {
  try {
    console.log('Connecting to database...');
    await prisma.$connect();
    console.log('Connection successful!');
    
    // Query the user table directly using raw SQL
    const users = await prisma.$queryRaw`SELECT * FROM user`;
    console.log('Users in database:', users);
    
  } catch (error) {
    console.error('Database error:', error);
  } finally {
    await prisma.$disconnect();
  }
}

checkUsers(); 