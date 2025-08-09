const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function addMoreProducts() {
  try {
    console.log('Starting add more products script...');
    
    // Get existing categories
    const categories = await prisma.category.findMany();
    const categoryMap = {};
    
    categories.forEach(cat => {
      categoryMap[cat.name.toLowerCase()] = cat.id;
    });
    
    console.log('Retrieved categories:', categoryMap);
    
    // Create 10 more products
    console.log('Creating additional products...');
    const products = await Promise.all([
      // More Fruits
      prisma.product.create({
        data: {
          name: 'Oranges',
          description: 'Sweet and juicy oranges, rich in Vitamin C',
          price: 120,
          stock: 90,
          image: 'https://images.unsplash.com/photo-1611080626919-7cf5a9dbab12',
          categoryId: categoryMap['fruits']
        }
      }),
      prisma.product.create({
        data: {
          name: 'Grapes',
          description: 'Fresh seedless green grapes',
          price: 140,
          stock: 85,
          image: 'https://images.unsplash.com/photo-1596363505729-4170e1df4afe',
          categoryId: categoryMap['fruits']
        }
      }),
      
      // More Vegetables
      prisma.product.create({
        data: {
          name: 'Potatoes',
          description: 'Fresh potatoes, perfect for curries and fries',
          price: 50,
          stock: 200,
          image: 'https://images.unsplash.com/photo-1518977676601-b53f82aba655',
          categoryId: categoryMap['vegetables']
        }
      }),
      prisma.product.create({
        data: {
          name: 'Cucumber',
          description: 'Crisp green cucumbers, great for salads',
          price: 30,
          stock: 100,
          image: 'https://images.unsplash.com/photo-1604977042946-1eecc30f269e',
          categoryId: categoryMap['vegetables']
        }
      }),
      
      // More Dairy
      prisma.product.create({
        data: {
          name: 'Yogurt',
          description: 'Creamy natural yogurt, 500g',
          price: 75,
          stock: 60,
          image: 'https://images.unsplash.com/photo-1488477181946-6428a0291777',
          categoryId: categoryMap['dairy']
        }
      }),
      prisma.product.create({
        data: {
          name: 'Cheese Slices',
          description: 'Processed cheese slices, pack of 10',
          price: 110,
          stock: 40,
          image: 'https://images.unsplash.com/photo-1618164436241-4473940d1f5c',
          categoryId: categoryMap['dairy']
        }
      }),
      
      // More Bakery
      prisma.product.create({
        data: {
          name: 'Dinner Rolls',
          description: 'Soft dinner rolls, pack of 6',
          price: 60,
          stock: 35,
          image: 'https://images.unsplash.com/photo-1589451359791-f9c33204b0d9',
          categoryId: categoryMap['bakery']
        }
      }),
      
      // More Spices
      prisma.product.create({
        data: {
          name: 'Cumin Seeds',
          description: 'Aromatic cumin seeds, 100g',
          price: 65,
          stock: 70,
          image: 'https://images.unsplash.com/photo-1590301157890-4810ed352733',
          categoryId: categoryMap['spices']
        }
      }),
      
      // More Grains
      prisma.product.create({
        data: {
          name: 'Chickpeas',
          description: 'Dried chickpeas, 500g',
          price: 80,
          stock: 75,
          image: 'https://images.unsplash.com/photo-1515543904379-3d757afe72e1',
          categoryId: categoryMap['grains & pulses']
        }
      }),
      prisma.product.create({
        data: {
          name: 'Wheat Flour',
          description: 'Whole wheat flour (atta), 1kg',
          price: 95,
          stock: 85,
          image: 'https://images.unsplash.com/photo-1574323347407-f5e1c5a1ec21',
          categoryId: categoryMap['grains & pulses']
        }
      })
    ]);
    
    console.log(`Added ${products.length} more products`);
    
    // Verify products count
    const totalProducts = await prisma.product.count();
    console.log(`Total products in database now: ${totalProducts}`);
    
    console.log('Additional products added successfully!');
    
  } catch (error) {
    console.error('Error:', error);
  } finally {
    await prisma.$disconnect();
  }
}

addMoreProducts(); 