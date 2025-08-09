const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function createTestOrders() {
  try {
    console.log('Creating test orders...');
    
    // First check for existing users
    const users = await prisma.user.findMany();
    if (users.length === 0) {
      console.log('No users found. Creating a test user first...');
      await prisma.user.create({
        data: {
          name: 'Test Customer',
          email: 'customer@example.com',
          password: 'password123',
          role: 'CUSTOMER'
        }
      });
      console.log('Test user created');
    }
    
    // Get the first user to assign orders to
    const user = await prisma.user.findFirst();
    console.log(`Using user: ${user.name} (ID: ${user.id})`);
    
    // Get some products to add to orders
    const products = await prisma.product.findMany({ take: 5 });
    if (products.length === 0) {
      console.log('No products found in database. Please add products first.');
      return;
    }
    console.log(`Found ${products.length} products to use in orders`);
    
    // Create first order with multiple items
    const order1 = await prisma.order.create({
      data: {
        userId: user.id,
        status: 'DELIVERED',
        total: 485, // Will be calculated from items
        createdAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000), // 7 days ago
        updatedAt: new Date(Date.now() - 6 * 24 * 60 * 60 * 1000), // 6 days ago
        items: {
          create: [
            {
              productId: products[0].id,
              quantity: 2,
              price: products[0].price
            },
            {
              productId: products[1].id,
              quantity: 1,
              price: products[1].price
            },
            {
              productId: products[2].id,
              quantity: 3,
              price: products[2].price
            }
          ]
        }
      }
    });
    console.log(`Created order #${order1.id} with 3 items (status: ${order1.status})`);
    
    // Create second order (pending)
    const order2 = await prisma.order.create({
      data: {
        userId: user.id,
        status: 'PENDING',
        total: 290, // Will be calculated from items
        createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000), // 2 days ago
        updatedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000), // 2 days ago
        items: {
          create: [
            {
              productId: products[3].id,
              quantity: 1,
              price: products[3].price
            },
            {
              productId: products[4].id,
              quantity: 2,
              price: products[4].price
            }
          ]
        }
      }
    });
    console.log(`Created order #${order2.id} with 2 items (status: ${order2.status})`);
    
    // Create third order (processing)
    const order3 = await prisma.order.create({
      data: {
        userId: user.id,
        status: 'PROCESSING',
        total: 350, // Will be calculated from items
        createdAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000), // 1 day ago
        updatedAt: new Date(Date.now() - 12 * 60 * 60 * 1000), // 12 hours ago
        items: {
          create: [
            {
              productId: products[0].id,
              quantity: 1,
              price: products[0].price
            },
            {
              productId: products[2].id,
              quantity: 1,
              price: products[2].price
            },
            {
              productId: products[4].id,
              quantity: 1,
              price: products[4].price
            }
          ]
        }
      }
    });
    console.log(`Created order #${order3.id} with 3 items (status: ${order3.status})`);
    
    // Verify orders were created
    const orderCount = await prisma.order.count();
    console.log(`Total orders in database: ${orderCount}`);
    
    const orderItems = await prisma.orderItem.count();
    console.log(`Total order items in database: ${orderItems}`);
    
    // Get all orders with items
    const allOrders = await prisma.order.findMany({
      include: {
        items: {
          include: {
            product: true
          }
        },
        user: true
      }
    });
    
    console.log('\nAll orders with details:');
    allOrders.forEach(order => {
      console.log(`\nOrder #${order.id} - ${order.status} (Total: ₹${order.total})`);
      console.log(`Customer: ${order.user.name} (${order.user.email})`);
      console.log(`Created: ${order.createdAt.toLocaleString()}`);
      console.log('Items:');
      
      order.items.forEach(item => {
        console.log(`- ${item.quantity}x ${item.product.name} (₹${item.price} each)`);
      });
    });
    
    console.log('\nTest orders created successfully!');
    
  } catch (error) {
    console.error('Error:', error);
  } finally {
    await prisma.$disconnect();
  }
}

createTestOrders(); 