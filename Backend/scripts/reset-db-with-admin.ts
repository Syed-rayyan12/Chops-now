import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function resetDatabaseWithAdmin() {
  try {
    console.log('🚨 WARNING: This will delete ALL data from the database!');
    console.log('Starting database reset in 5 seconds...');
    
    // Give time to cancel if needed
    await new Promise(resolve => setTimeout(resolve, 5000));

    console.log('\n🗑️  Deleting all data...');

    // Delete in correct order to respect foreign key constraints
    await prisma.notification.deleteMany({});
    console.log('✓ Deleted notifications');

    await prisma.restaurantTransaction.deleteMany({});
    console.log('✓ Deleted restaurant transactions');

    await prisma.cartItem.deleteMany({});
    console.log('✓ Deleted cart items');

    await prisma.rating.deleteMany({});
    console.log('✓ Deleted ratings');

    await prisma.earning.deleteMany({});
    console.log('✓ Deleted earnings');

    await prisma.orderItem.deleteMany({});
    console.log('✓ Deleted order items');

    await prisma.order.deleteMany({});
    console.log('✓ Deleted orders');

    await prisma.riderOnlineSession.deleteMany({});
    console.log('✓ Deleted rider online sessions');

    await prisma.address.deleteMany({});
    console.log('✓ Deleted addresses');

    await prisma.menuItem.deleteMany({});
    console.log('✓ Deleted menu items');

    await prisma.menuCategory.deleteMany({});
    console.log('✓ Deleted menu categories');

    await prisma.restaurant.deleteMany({});
    console.log('✓ Deleted restaurants');

    await prisma.rider.deleteMany({});
    console.log('✓ Deleted riders');

    await prisma.user.deleteMany({});
    console.log('✓ Deleted users');

    console.log('\n✅ All data deleted successfully!');

    // Create super admin
    console.log('\n👤 Creating super admin...');

    const adminEmail = process.env.ADMIN_EMAIL || 'admin@chops.com';
    const adminPassword = process.env.ADMIN_PASSWORD;
    if (!adminPassword) {
      throw new Error(
        'ADMIN_PASSWORD env var is required to seed the super admin. ' +
        'Set it before running this script (do not hardcode credentials).'
      );
    }

    const hashedPassword = await bcrypt.hash(adminPassword, 10);

    const admin = await prisma.user.create({
      data: {
        firstName: 'Super',
        lastName: 'Admin',
        email: adminEmail,
        password: hashedPassword,
        phone: '+447700900000',
        role: 'ADMIN',
      },
    });

    console.log('✅ Super admin created successfully!');
    console.log('\n📋 Admin Account:');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log(`Email:    ${admin.email}`);
    console.log(`Password: (the ADMIN_PASSWORD you supplied)`);
    console.log(`Role:     ${admin.role}`);
    console.log(`ID:       ${admin.id}`);
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('\n🔐 IMPORTANT: Change the password after first login!');

  } catch (error) {
    console.error('\n❌ Error during database reset:', error);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}

// Run the script
resetDatabaseWithAdmin()
  .then(() => {
    console.log('\n✨ Database reset completed successfully!');
    process.exit(0);
  })
  .catch((error) => {
    console.error('\n💥 Database reset failed:', error);
    process.exit(1);
  });
