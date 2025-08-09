const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  // Create categories
  const categories = await Promise.all([
    prisma.category.create({
      data: {
        name: 'Fruits',
      },
    }),
    prisma.category.create({
      data: {
        name: 'Vegetables',
      },
    }),
    prisma.category.create({
      data: {
        name: 'Dairy',
      },
    }),
    prisma.category.create({
      data: {
        name: 'Bakery',
      },
    }),
  ]);

  // Create products
  await Promise.all([
    prisma.product.create({
      data: {
        name: 'Apple',
        description: 'Fresh red apple',
        price: 1.99,
        stock: 100,
        categoryId: categories[0].id,
      },
    }),
    prisma.product.create({
      data: {
        name: 'Banana',
        description: 'Fresh yellow banana',
        price: 0.99,
        stock: 200,
        categoryId: categories[0].id,
      },
    }),
    prisma.product.create({
      data: {
        name: 'Carrot',
        description: 'Fresh orange carrot',
        price: 0.79,
        stock: 150,
        categoryId: categories[1].id,
      },
    }),
    prisma.product.create({
      data: {
        name: 'Milk',
        description: 'Fresh whole milk',
        price: 2.99,
        stock: 50,
        categoryId: categories[2].id,
      },
    }),
    prisma.product.create({
      data: {
        name: 'Bread',
        description: 'Fresh white bread',
        price: 2.49,
        stock: 30,
        categoryId: categories[3].id,
      },
    }),
  ]);

  // Create admin user
  const hashedPassword = await bcrypt.hash('admin123', 10);
  await prisma.user.create({
    data: {
      email: 'admin@example.com',
      password: hashedPassword,
      name: 'Admin User',
      role: 'ADMIN',
    },
  });

  console.log('Database initialized successfully!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  }); 