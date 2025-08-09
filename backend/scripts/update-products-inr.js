const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function updateProductsWithINR() {
  try {
    console.log('Starting product update with INR currency...');
    
    // Delete all existing products
    console.log('Deleting existing products...');
    await prisma.product.deleteMany();
    console.log('All products deleted');
    
    // Delete all existing categories
    console.log('Deleting existing categories...');
    await prisma.category.deleteMany();
    console.log('All categories deleted');
    
    // Create categories
    console.log('Creating categories...');
    const fruits = await prisma.category.create({
      data: { name: 'Fruits' }
    });
    
    const vegetables = await prisma.category.create({
      data: { name: 'Vegetables' }
    });
    
    const dairy = await prisma.category.create({
      data: { name: 'Dairy' }
    });
    
    const bakery = await prisma.category.create({
      data: { name: 'Bakery' }
    });
    
    const spices = await prisma.category.create({
      data: { name: 'Spices' }
    });
    
    const grains = await prisma.category.create({
      data: { name: 'Grains & Pulses' }
    });
    
    console.log('Categories created:', {
      fruits: fruits.id,
      vegetables: vegetables.id,
      dairy: dairy.id,
      bakery: bakery.id,
      spices: spices.id,
      grains: grains.id
    });
    
    // Create products with INR prices
    console.log('Creating products with INR currency...');
    const products = await Promise.all([
      // Fruits
      prisma.product.create({
        data: {
          name: 'Fresh Apples',
          description: 'Sweet and juicy red apples from Kashmir',
          price: 160,
          stock: 100,
          image: 'https://images.unsplash.com/photo-1560806887-1e4cd0b6cbd6',
          categoryId: fruits.id
        }
      }),
      prisma.product.create({
        data: {
          name: 'Bananas',
          description: 'Ripe yellow bananas, perfect for smoothies',
          price: 60,
          stock: 150,
          image: 'https://images.unsplash.com/photo-1543218024-57a70143c369',
          categoryId: fruits.id
        }
      }),
      prisma.product.create({
        data: {
          name: 'Mango',
          description: 'Sweet Alphonso mangoes, king of fruits',
          price: 220,
          stock: 80,
          image: 'https://images.unsplash.com/photo-1601493700631-2b16ec4b4716',
          categoryId: fruits.id
        }
      }),
      
      // Vegetables
      prisma.product.create({
        data: {
          name: 'Fresh Carrots',
          description: 'Organic carrots, freshly harvested',
          price: 70,
          stock: 120,
          image: 'https://images.unsplash.com/photo-1447175008436-054170c2e979',
          categoryId: vegetables.id
        }
      }),
      prisma.product.create({
        data: {
          name: 'Tomatoes',
          description: 'Ripe red tomatoes, locally grown',
          price: 80,
          stock: 100,
          image: 'https://images.unsplash.com/photo-1561136594-7f68413baa99',
          categoryId: vegetables.id
        }
      }),
      prisma.product.create({
        data: {
          name: 'Onions',
          description: 'Fresh red onions, essential for Indian cooking',
          price: 40,
          stock: 150,
          image: 'https://images.unsplash.com/photo-1618512496248-a07fe83aa8cb',
          categoryId: vegetables.id
        }
      }),
      
      // Dairy
      prisma.product.create({
        data: {
          name: 'Full Cream Milk',
          description: 'Farm fresh full cream milk, 1 liter',
          price: 65,
          stock: 45,
          image: 'https://images.unsplash.com/photo-1563636619-e9143da7973b',
          categoryId: dairy.id
        }
      }),
      prisma.product.create({
        data: {
          name: 'Paneer',
          description: 'Fresh homemade paneer, 250g',
          price: 85,
          stock: 50,
          image: 'https://images.unsplash.com/photo-1631452180519-c014fe946bc7',
          categoryId: dairy.id
        }
      }),
      
      // Bakery
      prisma.product.create({
        data: {
          name: 'Whole Wheat Bread',
          description: 'Freshly baked whole wheat bread, 400g',
          price: 45,
          stock: 30,
          image: 'https://images.unsplash.com/photo-1585478259715-1c093a7b89d3',
          categoryId: bakery.id
        }
      }),
      prisma.product.create({
        data: {
          name: 'Butter Cookies',
          description: 'Homemade butter cookies, pack of 10',
          price: 120,
          stock: 40,
          image: 'https://images.unsplash.com/photo-1590080875515-8a3a8dc5735e',
          categoryId: bakery.id
        }
      }),
      
      // Spices
      prisma.product.create({
        data: {
          name: 'Turmeric Powder',
          description: 'Pure organic turmeric powder, 100g',
          price: 50,
          stock: 60,
          image: 'https://images.unsplash.com/photo-1615485500707-8ca2f446b51f',
          categoryId: spices.id
        }
      }),
      prisma.product.create({
        data: {
          name: 'Garam Masala',
          description: 'Aromatic blend of ground spices, 50g',
          price: 75,
          stock: 55,
          image: 'https://images.unsplash.com/photo-1596040033229-a9821ebd058d',
          categoryId: spices.id
        }
      }),
      
      // Grains & Pulses
      prisma.product.create({
        data: {
          name: 'Basmati Rice',
          description: 'Premium long grain basmati rice, 1kg',
          price: 150,
          stock: 70,
          image: 'https://images.unsplash.com/photo-1536304993881-ff6e9eefa2a6',
          categoryId: grains.id
        }
      }),
      prisma.product.create({
        data: {
          name: 'Toor Dal',
          description: 'Split pigeon peas, 500g',
          price: 90,
          stock: 65,
          image: 'https://images.unsplash.com/photo-1612257999762-e11edc5835ca',
          categoryId: grains.id
        }
      })
    ]);
    
    console.log(`Created ${products.length} products with INR currency`);
    
    // Verify products were created
    console.log('\nVerifying products...');
    const allProducts = await prisma.product.findMany({
      include: {
        category: true
      }
    });
    
    allProducts.forEach(product => {
      console.log(`- ${product.name} (₹${product.price}) - Category: ${product.category.name}`);
    });
    
    console.log(`\nVerified ${allProducts.length} products in database`);
    console.log('Product update with INR currency completed successfully!');
    
  } catch (error) {
    console.error('Error:', error);
  } finally {
    await prisma.$disconnect();
  }
}

updateProductsWithINR(); 