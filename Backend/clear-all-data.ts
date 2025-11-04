import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function clearAllData() {
  try {
    console.log('🗑️  Starting to clear all data...');

    // Delete in order to respect foreign key constraints

    console.log('Deleting earnings...');
    await prisma.earning.deleteMany({});

    console.log('Deleting rider online sessions...');
    await prisma.riderOnlineSession.deleteMany({});

    console.log('Deleting riders...');
    await prisma.rider.deleteMany({});

    console.log('Deleting order items...');
    await prisma.orderItem.deleteMany({});

    console.log('Deleting ratings...');
    await prisma.rating.deleteMany({});

    console.log('Deleting orders...');
    await prisma.order.deleteMany({});

    console.log('Deleting menu items...');
    await prisma.menuItem.deleteMany({});

    console.log('Deleting menu categories...');
    await prisma.menuCategory.deleteMany({});

    console.log('Deleting restaurants...');
    await prisma.restaurant.deleteMany({});

    console.log('Deleting addresses...');
    await prisma.address.deleteMany({});

    console.log('Deleting users (except admin)...');
    await prisma.user.deleteMany({
      where: {
        role: {
          not: 'ADMIN'
        }
      }
    });

    console.log('✅ All restaurants, users, and riders have been deleted!');
    console.log('ℹ️  Admin users remain in the database.');
    
  } catch (error) {
    console.error('❌ Error clearing data:', error);
  } finally {
    await prisma.$disconnect();
  }
}

clearAllData();
