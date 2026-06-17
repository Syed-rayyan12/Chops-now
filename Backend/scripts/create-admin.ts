// Non-destructive admin bootstrap.
// Creates a new ADMIN user, or promotes/updates the password of an existing
// user with the given email. Credentials come from env vars so nothing is
// hardcoded.
//
// Usage (PowerShell):
//   $env:ADMIN_EMAIL="you@example.com"; $env:ADMIN_PASSWORD="a-strong-password"; npx ts-node Backend/scripts/create-admin.ts
//
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function createAdmin() {
  const email = process.env.ADMIN_EMAIL;
  const password = process.env.ADMIN_PASSWORD;

  if (!email || !password) {
    throw new Error(
      'ADMIN_EMAIL and ADMIN_PASSWORD env vars are required. ' +
      'Set them before running this script.'
    );
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  const existing = await prisma.user.findUnique({ where: { email } });

  if (existing) {
    const admin = await prisma.user.update({
      where: { email },
      data: { role: 'ADMIN', password: hashedPassword, isEmailVerified: true },
    });
    console.log(`✅ Existing user promoted to ADMIN and password reset: ${admin.email} (id ${admin.id})`);
  } else {
    const admin = await prisma.user.create({
      data: {
        firstName: 'Super',
        lastName: 'Admin',
        email,
        password: hashedPassword,
        phone: '+447700900000',
        role: 'ADMIN',
        isEmailVerified: true,
      },
    });
    console.log(`✅ Admin created: ${admin.email} (id ${admin.id})`);
  }

  console.log('🔐 Use the ADMIN_PASSWORD you supplied to log in, then change it.');
}

createAdmin()
  .catch((e) => {
    console.error('❌ Failed to create admin:', e);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
