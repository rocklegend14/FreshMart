const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function updateToFrontendCategories() {
  try {
    console.log('Starting category update to match frontend navigation...');
    
    // Get current categories
    const currentCategories = await prisma.category.findMany();
    console.log('Current categories:');
    currentCategories.forEach(cat => {
      console.log(`- ID: ${cat.id}, Name: ${cat.name}`);
    });
    
    // Delete products first to avoid foreign key constraint issues
    console.log('\nDeleting existing products...');
    await prisma.product.deleteMany();
    
    // Then delete categories
    console.log('Deleting existing categories...');
    await prisma.category.deleteMany();
    
    // Create new categories matching the frontend
    console.log('\nCreating new categories matching frontend navigation...');
    const newCategories = await Promise.all([
      prisma.category.create({ data: { name: 'All' } }),
      prisma.category.create({ data: { name: 'Fruits & Veg' } }),
      prisma.category.create({ data: { name: 'Dairy & Eggs' } }),
      prisma.category.create({ data: { name: 'Bakery' } }),
      prisma.category.create({ data: { name: 'Snacks' } }),
      prisma.category.create({ data: { name: 'Beverages' } }),
      prisma.category.create({ data: { name: 'Household' } })
    ]);
    
    const categoryMap = {};
    newCategories.forEach(cat => {
      categoryMap[cat.name] = cat.id;
      console.log(`- Created: ${cat.name} (ID: ${cat.id})`);
    });
    
    // Add products to categories
    console.log('\nAdding products to new categories...');
    
    // Fruits & Veg products
    await Promise.all([
      prisma.product.create({
        data: {
          name: 'Fresh Apples',
          description: 'Sweet and juicy red apples',
          price: 160,
          stock: 100,
          image: 'https://images.unsplash.com/photo-1560806887-1e4cd0b6cbd6',
          categoryId: categoryMap['Fruits & Veg']
        }
      }),
      prisma.product.create({
        data: {
          name: 'Bananas',
          description: 'Ripe yellow bananas',
          price: 60,
          stock: 150,
          image: 'https://images.unsplash.com/photo-1543218024-57a70143c369',
          categoryId: categoryMap['Fruits & Veg']
        }
      }),
      prisma.product.create({
        data: {
          name: 'Oranges',
          description: 'Sweet and juicy oranges',
          price: 120,
          stock: 90,
          image: 'https://images.unsplash.com/photo-1611080626919-7cf5a9dbab12',
          categoryId: categoryMap['Fruits & Veg']
        }
      }),
      prisma.product.create({
        data: {
          name: 'Tomatoes',
          description: 'Ripe red tomatoes',
          price: 80,
          stock: 100,
          image: 'https://images.unsplash.com/photo-1561136594-7f68413baa99',
          categoryId: categoryMap['Fruits & Veg']
        }
      })
    ]);
    
    // Dairy & Eggs products
    await Promise.all([
      prisma.product.create({
        data: {
          name: 'Full Cream Milk',
          description: 'Farm fresh full cream milk, 1 liter',
          price: 65,
          stock: 45,
          image: 'https://images.unsplash.com/photo-1563636619-e9143da7973b',
          categoryId: categoryMap['Dairy & Eggs']
        }
      }),
      prisma.product.create({
        data: {
          name: 'Paneer',
          description: 'Fresh homemade paneer, 250g',
          price: 85,
          stock: 50,
          image: 'https://images.unsplash.com/photo-1631452180519-c014fe946bc7',
          categoryId: categoryMap['Dairy & Eggs']
        }
      }),
      prisma.product.create({
        data: {
          name: 'Yogurt',
          description: 'Creamy natural yogurt, 500g',
          price: 75,
          stock: 60,
          image: 'https://images.unsplash.com/photo-1488477181946-6428a0291777',
          categoryId: categoryMap['Dairy & Eggs']
        }
      }),
      prisma.product.create({
        data: {
          name: 'Cheese Slices',
          description: 'Processed cheese slices, pack of 10',
          price: 110,
          stock: 40,
          image: 'https://images.unsplash.com/photo-1618164436241-4473940d1f5c',
          categoryId: categoryMap['Dairy & Eggs']
        }
      })
    ]);
    
    // Bakery products
    await Promise.all([
      prisma.product.create({
        data: {
          name: 'Whole Wheat Bread',
          description: 'Freshly baked whole wheat bread, 400g',
          price: 45,
          stock: 30,
          image: 'https://images.unsplash.com/photo-1585478259715-1c093a7b89d3',
          categoryId: categoryMap['Bakery']
        }
      }),
      prisma.product.create({
        data: {
          name: 'Butter Cookies',
          description: 'Homemade butter cookies, pack of 10',
          price: 120,
          stock: 40,
          image: 'https://images.unsplash.com/photo-1590080875515-8a3a8dc5735e',
          categoryId: categoryMap['Bakery']
        }
      }),
      prisma.product.create({
        data: {
          name: 'Dinner Rolls',
          description: 'Soft dinner rolls, pack of 6',
          price: 60,
          stock: 35,
          image: 'https://images.unsplash.com/photo-1589451359791-f9c33204b0d9',
          categoryId: categoryMap['Bakery']
        }
      })
    ]);
    
    // Snacks products
    await Promise.all([
      prisma.product.create({
        data: {
          name: 'Potato Chips',
          description: 'Crispy salted potato chips, 100g',
          price: 40,
          stock: 80,
          image: 'https://images.unsplash.com/photo-1566478989037-eec170784d0b',
          categoryId: categoryMap['Snacks']
        }
      }),
      prisma.product.create({
        data: {
          name: 'Mixed Nuts',
          description: 'Assorted nuts, 200g',
          price: 180,
          stock: 50,
          image: 'https://images.unsplash.com/photo-1606923829579-0cb981a83e2b',
          categoryId: categoryMap['Snacks']
        }
      }),
      prisma.product.create({
        data: {
          name: 'Chocolate Bar',
          description: 'Dark chocolate bar, 100g',
          price: 95,
          stock: 60,
          image: 'https://images.unsplash.com/photo-1581455975077-9895ca284de7',
          categoryId: categoryMap['Snacks']
        }
      })
    ]);
    
    // Beverages products
    await Promise.all([
      prisma.product.create({
        data: {
          name: 'Orange Juice',
          description: 'Fresh orange juice, 1 liter',
          price: 110,
          stock: 40,
          image: 'https://images.unsplash.com/photo-1621506289937-a8e4df240d0b',
          categoryId: categoryMap['Beverages']
        }
      }),
      prisma.product.create({
        data: {
          name: 'Green Tea',
          description: 'Organic green tea bags, pack of 25',
          price: 140,
          stock: 45,
          image: 'https://images.unsplash.com/photo-1627435601361-ec25f5b1d0e5',
          categoryId: categoryMap['Beverages']
        }
      }),
      prisma.product.create({
        data: {
          name: 'Mineral Water',
          description: 'Natural mineral water, 1 liter',
          price: 30,
          stock: 100,
          image: 'https://images.unsplash.com/photo-1603824255848-bb27ac1520b9',
          categoryId: categoryMap['Beverages']
        }
      })
    ]);
    
    // Household products
    await Promise.all([
      prisma.product.create({
        data: {
          name: 'Dish Soap',
          description: 'Concentrated dish washing liquid, 500ml',
          price: 85,
          stock: 55,
          image: 'https://images.unsplash.com/photo-1583947215259-38e31be8751f',
          categoryId: categoryMap['Household']
        }
      }),
      prisma.product.create({
        data: {
          name: 'Laundry Detergent',
          description: 'High-efficiency laundry detergent, 1kg',
          price: 160,
          stock: 40,
          image: 'https://images.unsplash.com/photo-1626806787461-102c1a6f2c0d',
          categoryId: categoryMap['Household']
        }
      }),
      prisma.product.create({
        data: {
          name: 'Paper Towels',
          description: 'Absorbent paper towels, 3 rolls',
          price: 95,
          stock: 70,
          image: 'https://images.unsplash.com/photo-1583908701673-900f3d9f3089',
          categoryId: categoryMap['Household']
        }
      }),
      prisma.product.create({
        data: {
          name: 'Toilet Paper',
          description: 'Soft toilet paper, 6 rolls',
          price: 110,
          stock: 85,
          image: 'https://images.unsplash.com/photo-1585689395883-0a0986d50c34',
          categoryId: categoryMap['Household']
        }
      })
    ]);
    
    // Verify updated categories and products
    const allCategories = await prisma.category.findMany({
      include: { _count: { select: { products: true } } }
    });
    
    console.log('\nUpdated categories with product counts:');
    allCategories.forEach(cat => {
      console.log(`- ${cat.name}: ${cat._count.products} products`);
    });
    
    const totalProducts = await prisma.product.count();
    console.log(`\nTotal products in database: ${totalProducts}`);
    
    console.log('\nCategories updated successfully to match frontend navigation!');
    
  } catch (error) {
    console.error('Error:', error);
  } finally {
    await prisma.$disconnect();
  }
}

updateToFrontendCategories(); 