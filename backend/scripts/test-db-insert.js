const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcrypt');
const prisma = new PrismaClient();

async function insertTestUser() {
  try {
    console.log('Connecting to database...');
    await prisma.$connect();
    console.log('Connection successful!');
    
    // Create a test user with a simple hashed password
    const hashedPassword = await bcrypt.hash('test123', 10);
    console.log('Password hashed');
    
    // Try direct SQL insertion first
    console.log('Trying direct SQL insertion...');
    await prisma.$executeRaw`INSERT INTO user (email, password, name, role, createdAt, updatedAt) 
      VALUES ('test@example.com', ${hashedPassword}, 'Test User', 'CUSTOMER', NOW(), NOW())`;
    
    console.log('SQL insert successful!');
    
    // Check if the user was inserted
    const users = await prisma.$queryRaw`SELECT * FROM user`;
    console.log('Users in database after insert:', users);
    
  } catch (error) {
    console.error('Error:', error);
  } finally {
    await prisma.$disconnect();
  }
}

insertTestUser(); 