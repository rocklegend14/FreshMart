const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function checkOrderTable() {
  try {
    console.log('Checking order table using Prisma...');
    
    // First check using Prisma's model
    try {
      const orderCount = await prisma.order.count();
      console.log(`Prisma: Order model exists with ${orderCount} records`);
    } catch (error) {
      console.error('Error with Prisma count:', error.message);
    }

    // Check tables using Prisma's raw query
    console.log('\nChecking database tables with Prisma raw query...');
    try {
      const tables = await prisma.$queryRaw`SHOW TABLES`;
      console.log('Available tables in database:');
      tables.forEach(row => {
        const tableName = Object.values(row)[0];
        console.log(`- ${tableName}`);
      });
      
      // Check if orders table exists
      const ordersTableName = 'orders';
      const ordersTableExists = tables.some(row => 
        Object.values(row)[0].toLowerCase() === ordersTableName.toLowerCase()
      );
      
      if (ordersTableExists) {
        console.log('\nTable named "orders" exists in the database');
        
        // Using normal name since it's not a reserved keyword anymore
        const columns = await prisma.$queryRaw`DESCRIBE orders`;
        console.log('Orders table structure:');
        columns.forEach(col => console.log(`- ${col.Field}: ${col.Type} (${col.Null === 'YES' ? 'nullable' : 'not nullable'})`));
        
        // Check data in orders table
        const orders = await prisma.$queryRaw`SELECT * FROM orders LIMIT 5`;
        console.log(`\nSample orders (${orders.length} found):`);
        if (orders.length > 0) {
          orders.forEach(order => console.log(order));
        } else {
          console.log('No orders found in the table');
        }
      } else {
        console.log('\nNo table named "orders" exists in the database');
      }
    } catch (error) {
      console.error('Error with raw query:', error.message);
    }
    
    console.log('\nYou can now query the orders table directly in MySQL without backticks:');
    console.log('SELECT * FROM orders;');
    
  } catch (error) {
    console.error('Error:', error);
  } finally {
    await prisma.$disconnect();
  }
}

checkOrderTable(); 