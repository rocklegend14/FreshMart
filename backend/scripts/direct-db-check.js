const mysql = require('mysql2/promise');
require('dotenv').config();

async function checkDatabase() {
  // Parse the DATABASE_URL
  const dbUrlRegex = /mysql:\/\/([^:]+):([^@]+)@([^:]+):(\d+)\/(.+)/;
  const match = process.env.DATABASE_URL.match(dbUrlRegex);
  
  if (!match) {
    console.error('Invalid DATABASE_URL format');
    return;
  }
  
  const [, user, password, host, port, database] = match;
  
  try {
    // Create the connection
    const connection = await mysql.createConnection({
      host,
      user,
      password: decodeURIComponent(password),
      database,
      port: parseInt(port)
    });
    
    console.log(`Connected to MySQL database: ${database}`);
    
    // Check users
    console.log('\n--- USERS ---');
    const [users] = await connection.execute('SELECT * FROM user');
    console.log(`Found ${users.length} users:`);
    users.forEach(user => {
      console.log(`ID: ${user.id}, Name: ${user.name}, Email: ${user.email}, Role: ${user.role}`);
    });
    
    // Check categories
    console.log('\n--- CATEGORIES ---');
    const [categories] = await connection.execute('SELECT * FROM category');
    console.log(`Found ${categories.length} categories:`);
    categories.forEach(category => {
      console.log(`ID: ${category.id}, Name: ${category.name}`);
    });
    
    // Check products
    console.log('\n--- PRODUCTS ---');
    const [products] = await connection.execute('SELECT * FROM product');
    console.log(`Found ${products.length} products:`);
    products.forEach(product => {
      console.log(`ID: ${product.id}, Name: ${product.name}, Price: $${product.price}, Stock: ${product.stock}, Category ID: ${product.categoryId}`);
    });
    
    // Check product-category relationships
    console.log('\n--- PRODUCTS WITH CATEGORIES ---');
    const [productsWithCategories] = await connection.execute(
      'SELECT p.id, p.name, p.price, c.name as category_name FROM product p JOIN category c ON p.categoryId = c.id'
    );
    console.log(`Found ${productsWithCategories.length} product-category relationships:`);
    productsWithCategories.forEach(product => {
      console.log(`ID: ${product.id}, Name: ${product.name}, Price: $${product.price}, Category: ${product.category_name}`);
    });
    
    // Close the connection
    await connection.end();
  } catch (error) {
    console.error('Database error:', error);
  }
}

checkDatabase(); 