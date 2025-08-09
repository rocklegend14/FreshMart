const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function updateCategoryNames() {
  try {
    console.log('Starting category name update...');
    
    // Define the new category names that match the frontend
    const categoryUpdates = [
      { current: 'Fruits', updated: 'Fruits & Vegetables' },
      { current: 'Vegetables', updated: 'Fresh Produce' },
      { current: 'Dairy', updated: 'Dairy & Eggs' },
      { current: 'Bakery', updated: 'Bread & Bakery' },
      { current: 'Spices', updated: 'Spices & Seasonings' },
      { current: 'Grains & Pulses', updated: 'Grains & Pasta' }
    ];
    
    // Get current categories
    const currentCategories = await prisma.category.findMany();
    console.log('Current categories:');
    currentCategories.forEach(cat => {
      console.log(`- ID: ${cat.id}, Name: ${cat.name}`);
    });
    
    // Update each category
    console.log('\nUpdating category names...');
    for (const update of categoryUpdates) {
      const category = currentCategories.find(cat => cat.name === update.current);
      
      if (category) {
        await prisma.category.update({
          where: { id: category.id },
          data: { name: update.updated }
        });
        console.log(`- Updated: ${update.current} -> ${update.updated}`);
      } else {
        console.log(`- Category not found: ${update.current}`);
      }
    }
    
    // Verify updates
    const updatedCategories = await prisma.category.findMany({
      include: {
        products: true
      }
    });
    
    console.log('\nUpdated categories:');
    updatedCategories.forEach(category => {
      console.log(`- ${category.name}: ${category.products.length} products`);
    });
    
    console.log('\nCategory names updated successfully!');
    
  } catch (error) {
    console.error('Error:', error);
  } finally {
    await prisma.$disconnect();
  }
}

updateCategoryNames(); 