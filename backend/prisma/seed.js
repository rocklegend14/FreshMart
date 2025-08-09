const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();


// Product ID mapping (same as in orderRoutes.js)
const productIdMap = {
  // Fruits & Vegetables
  'f1': 1,
  'f2': 2,
  'f3': 3,
  'f4': 4,
  // Dairy & Eggs
  'd1': 5,
  'd2': 6,
  'd3': 7,
  'd4': 8,
  // Bakery
  'b1': 9,
  'b2': 10,
  'b3': 11,
  'b4': 12,
  // Snacks
  's1': 13,
  's2': 14,
  's3': 15,
  's4': 16,
  // Beverages
  'bv1': 17,
  'bv2': 18,
  'bv3': 19,
  'bv4': 20,
  // Household
  'h1': 21,
  'h2': 22,
  'h3': 23,
  'h4': 24
};

// Products data from frontend
const productsData = [
  // Fruits & Vegetables
  {
    id: "f1",
    name: "Organic Bananas",
    description: "Sweet and nutritious organic bananas",
    price: 149,
    image: "/placeholder.svg?height=200&width=200",
    category: "fruits-vegetables",
    stock: 100,
  },
  {
    id: "f2",
    name: "Fresh Strawberries",
    description: "Juicy, ripe strawberries picked at peak freshness",
    price: 379,
    image: "/placeholder.svg?height=200&width=200",
    category: "fruits-vegetables",
    stock: 50,
  },
  {
    id: "f3",
    name: "Avocados",
    description: "Perfectly ripe Hass avocados",
    price: 189,
    image: "/placeholder.svg?height=200&width=200",
    category: "fruits-vegetables",
    stock: 75,
  },
  {
    id: "f4",
    name: "Organic Spinach",
    description: "Fresh organic spinach leaves",
    price: 259,
    image: "/placeholder.svg?height=200&width=200",
    category: "fruits-vegetables",
    stock: 60,
  },

  // Dairy & Eggs
  {
    id: "d1",
    name: "Organic Whole Milk",
    description: "Fresh organic whole milk from grass-fed cows",
    price: 379,
    image: "/placeholder.svg?height=200&width=200",
    category: "dairy-eggs",
    stock: 80,
  },
  {
    id: "d2",
    name: "Large Brown Eggs",
    description: "Farm-fresh large brown eggs from free-range chickens",
    price: 419,
    image: "/placeholder.svg?height=200&width=200",
    category: "dairy-eggs",
    stock: 90,
  },
  {
    id: "d3",
    name: "Sharp Cheddar Cheese",
    description: "Aged sharp cheddar cheese",
    price: 529,
    image: "/placeholder.svg?height=200&width=200",
    category: "dairy-eggs",
    stock: 70,
  },
  {
    id: "d4",
    name: "Greek Yogurt",
    description: "Plain Greek yogurt, high in protein",
    price: 299,
    image: "/placeholder.svg?height=200&width=200",
    category: "dairy-eggs",
    stock: 60,
  },

  // Bakery
  {
    id: "b1",
    name: "Artisan Sourdough Bread",
    description: "Freshly baked artisan sourdough bread",
    price: 459,
    image: "/placeholder.svg?height=200&width=200",
    category: "bakery",
    stock: 40,
  },
  {
    id: "b2",
    name: "Chocolate Chip Cookies",
    description: "Freshly baked chocolate chip cookies",
    price: 349,
    image: "/placeholder.svg?height=200&width=200",
    category: "bakery",
    stock: 80,
  },
  {
    id: "b3",
    name: "Blueberry Muffins",
    description: "Moist blueberry muffins baked daily",
    price: 459,
    image: "/placeholder.svg?height=200&width=200",
    category: "bakery",
    stock: 60,
  },
  {
    id: "b4",
    name: "Whole Wheat Bagels",
    description: "Hearty whole wheat bagels",
    price: 379,
    image: "/placeholder.svg?height=200&width=200",
    category: "bakery",
    stock: 70,
  },

  // Snacks
  {
    id: "s1",
    name: "Mixed Nuts",
    description: "Premium blend of roasted nuts",
    price: 599,
    image: "/placeholder.svg?height=200&width=200",
    category: "snacks",
    stock: 85,
  },
  {
    id: "s2",
    name: "Potato Chips",
    description: "Crispy kettle-cooked potato chips",
    price: 259,
    image: "/placeholder.svg?height=200&width=200",
    category: "snacks",
    stock: 100,
  },
  {
    id: "s3",
    name: "Dark Chocolate Bar",
    description: "72% cacao dark chocolate bar",
    price: 299,
    image: "/placeholder.svg?height=200&width=200",
    category: "snacks",
    stock: 120,
  },
  {
    id: "s4",
    name: "Trail Mix",
    description: "Energy-boosting trail mix with dried fruits and nuts",
    price: 419,
    image: "/placeholder.svg?height=200&width=200",
    category: "snacks",
    stock: 90,
  },

  // Beverages
  {
    id: "bv1",
    name: "Orange Juice",
    description: "100% pure squeezed orange juice, not from concentrate",
    price: 379,
    image: "/placeholder.svg?height=200&width=200",
    category: "beverages",
    stock: 75,
  },
  {
    id: "bv2",
    name: "Cold Brew Coffee",
    description: "Smooth cold brew coffee",
    price: 349,
    image: "/placeholder.svg?height=200&width=200",
    category: "beverages",
    stock: 60,
  },
  {
    id: "bv3",
    name: "Sparkling Water",
    description: "Refreshing sparkling water with natural flavors",
    price: 459,
    image: "/placeholder.svg?height=200&width=200",
    category: "beverages",
    stock: 80,
  },
  {
    id: "bv4",
    name: "Green Tea",
    description: "Organic green tea bags",
    price: 329,
    image: "/placeholder.svg?height=200&width=200",
    category: "beverages",
    stock: 70,
  },

  // Household Items
  {
    id: "h1",
    name: "Paper Towels",
    description: "Absorbent and durable paper towels",
    price: 679,
    image: "/placeholder.svg?height=200&width=200",
    category: "household",
    stock: 50,
  },
  {
    id: "h2",
    name: "Dish Soap",
    description: "Plant-based dish soap, gentle on hands",
    price: 299,
    image: "/placeholder.svg?height=200&width=200",
    category: "household",
    stock: 80,
  },
  {
    id: "h3",
    name: "Laundry Detergent",
    description: "Eco-friendly laundry detergent",
    price: 979,
    image: "/placeholder.svg?height=200&width=200",
    category: "household",
    stock: 65,
  },
  {
    id: "h4",
    name: "Trash Bags",
    description: "Durable kitchen trash bags",
    price: 569,
    image: "/placeholder.svg?height=200&width=200",
    category: "household",
    stock: 75,
  },
];

// Categories data
const categoriesData = [
  { id: 1, name: "fruits-vegetables" },
  { id: 2, name: "dairy-eggs" },
  { id: 3, name: "bakery" },
  { id: 4, name: "snacks" },
  { id: 5, name: "beverages" },
  { id: 6, name: "household" },
];

// Category name to ID mapping
const categoryMap = {
  "fruits-vegetables": 1,
  "dairy-eggs": 2,
  "bakery": 3,
  "snacks": 4,
  "beverages": 5,
  "household": 6,
};

async function main() {
  console.log('==================================================');
  console.log('STARTING DATABASE SEED PROCESS');
  console.log('==================================================');
  
  try {
    // Check database connection
    console.log('Checking database connection...');
    await prisma.$connect();
    console.log('Database connection successful');
    
    // Create categories
    console.log('\nCreating categories...');
    for (const category of categoriesData) {
      console.log(`  - Creating/updating category: ${category.name} (ID: ${category.id})`);
      await prisma.category.upsert({
        where: { id: category.id },
        update: { name: category.name },
        create: {
          id: category.id,
          name: category.name,
        },
      });
    }
    console.log('✓ Categories created successfully');
    
    // Create products
    console.log('\nCreating products...');
    let createdCount = 0;
    
    for (const product of productsData) {
      const numericId = productIdMap[product.id];
      const categoryId = categoryMap[product.category];
      
      if (!numericId) {
        console.warn(`  ✗ No mapping found for product ID: ${product.id}, skipping`);
        continue;
      }
      
      if (!categoryId) {
        console.warn(`  ✗ No mapping found for category: ${product.category}, skipping`);
        continue;
      }
      
      console.log(`  - Creating/updating product: ${product.name} (ID: ${product.id} -> ${numericId})`);
      
      try {
        await prisma.product.upsert({
          where: { id: numericId },
          update: {
            name: product.name,
            description: product.description,
            price: product.price / 100, // Convert from cents to dollars/rupees
            image: product.image,
            stock: product.stock,
            categoryId: categoryId,
          },
          create: {
            id: numericId,
            name: product.name,
            description: product.description,
            price: product.price / 100, // Convert from cents to dollars/rupees
            image: product.image,
            stock: product.stock,
            categoryId: categoryId,
          },
        });
        
        createdCount++;
        console.log(`    ✓ Success`);
      } catch (error) {
        console.error(`    ✗ Error creating/updating product ${product.id}:`, error.message);
      }
    }
    
    console.log(`\n✓ Created/updated ${createdCount} products`);
    
    // Verify products exist
    console.log('\nVerifying products in database...');
    
    // Check if the specific product f2 exists
    const f2Product = await prisma.product.findUnique({
      where: { id: productIdMap['f2'] },
    });
    
    if (f2Product) {
      console.log(`  ✓ Product f2 (${f2Product.name}) exists with ID ${f2Product.id}`);
    } else {
      console.error(`  ✗ Product f2 not found in database!`);
    }
    
    console.log('\n==================================================');
    console.log('SEED COMPLETED SUCCESSFULLY');
    console.log('==================================================');
  } catch (error) {
    console.error('\n==================================================');
    console.error('ERROR SEEDING DATABASE:', error);
    console.error('==================================================');
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

main(); 