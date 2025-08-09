const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function checkAndFixUserTable() {
  try {
    console.log('Connecting to database...');
    await prisma.$connect();
    console.log('Connection successful!');
    
    // Check if there are any existing users
    const users = await prisma.$queryRaw`SELECT * FROM user`;
    console.log('Current users in database:', users);
    
    // Check table schema
    const schema = await prisma.$queryRaw`DESCRIBE user`;
    console.log('User table schema:', schema);
    
    // Check for unique constraints/indexes
    const indexes = await prisma.$queryRaw`SHOW INDEXES FROM user`;
    console.log('User table indexes:', indexes);
    
    // Check if user table exists with correct schema
    console.log('\nChecking for potential issues...');
    
    // Try creating a user with Prisma (safe test)
    try {
      console.log('Testing Prisma user creation...');
      const testUser = await prisma.user.create({
        data: {
          email: 'test2@example.com',
          password: 'test-password-hash',
          name: 'Test User 2',
        },
      });
      console.log('Successfully created user with Prisma:', testUser);
    } catch (error) {
      console.error('Error creating user with Prisma:', error);
      
      // If there's an error, try fixing the schema
      console.log('\nAttempting to fix schema issues...');
      try {
        // You might need to modify this based on the error
        console.log('Looking for missing columns or constraints...');
        
        // Check if role column exists and has the correct type
        const hasRoleColumn = schema.some(col => col.Field === 'role');
        if (!hasRoleColumn) {
          console.log('Role column missing, adding it...');
          await prisma.$executeRaw`ALTER TABLE user ADD COLUMN role ENUM('ADMIN', 'CUSTOMER') DEFAULT 'CUSTOMER'`;
        }
        
        // Check if email has a unique constraint
        const hasEmailUnique = indexes.some(idx => idx.Column_name === 'email' && idx.Non_unique === 0);
        if (!hasEmailUnique) {
          console.log('Email unique constraint missing, adding it...');
          await prisma.$executeRaw`ALTER TABLE user ADD UNIQUE (email)`;
        }
        
        console.log('Schema fixes applied!');
      } catch (fixError) {
        console.error('Error fixing schema:', fixError);
      }
    }
    
  } catch (error) {
    console.error('Database error:', error);
  } finally {
    await prisma.$disconnect();
  }
}

checkAndFixUserTable(); 