const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function viewDatabase() {
  try {
    console.log('Connecting to database...');
    await prisma.$connect();
    console.log('Connected successfully!\n');
    
    // Check users
    console.log('USERS IN DATABASE:');
    const users = await prisma.$queryRaw`SELECT * FROM user`;
    users.forEach(user => {
      console.log(`ID: ${user.id}, Name: ${user.name}, Email: ${user.email}`);
    });
    console.log(`Total users: ${users.length}\n`);
    
    // Check categories
    console.log('CATEGORIES IN DATABASE:');
    const categories = await prisma.$queryRaw`SELECT * FROM category`;
    categories.forEach(category => {
      console.log(`ID: ${category.id}, Name: ${category.name}`);
    });
    console.log(`Total categories: ${categories.length}\n`);
    
    // Check products
    console.log('PRODUCTS IN DATABASE:');
    const products = await prisma.$queryRaw`SELECT * FROM product`;
    products.forEach(product => {
      console.log(`ID: ${product.id}, Name: ${product.name}, Price: $${product.price}, Stock: ${product.stock}, Category ID: ${product.categoryId}`);
    });
    console.log(`Total products: ${products.length}\n`);
    
    // Check product-category relationships
    console.log('PRODUCTS WITH CATEGORIES:');
    const productsWithCategories = await prisma.$queryRaw`
      SELECT p.id, p.name, p.price, c.name as category_name
      FROM product p
      JOIN category c ON p.categoryId = c.id
    `;
    productsWithCategories.forEach(product => {
      console.log(`ID: ${product.id}, Name: ${product.name}, Price: $${product.price}, Category: ${product.category_name}`);
    });
    
  } catch (error) {
    console.error('Error:', error);
  } finally {
    await prisma.$disconnect();
  }
}

viewDatabase(); 