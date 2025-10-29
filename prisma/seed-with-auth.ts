import { PrismaClient, UserRole } from '@prisma/client';
import { hash } from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Seeding database with Better Auth...');

  // Check if admin user already exists
  const existingAdmin = await prisma.user.findUnique({
    where: { email: 'admin@example.com' },
  });

  if (existingAdmin) {
    console.log('⚠️  Admin user already exists.');
    console.log('   Deleting and recreating with correct password hash...');

    // Delete existing admin and all related records (cascades)
    await prisma.user.delete({
      where: { id: existingAdmin.id },
    });
  }

  // Better Auth uses bcrypt internally, but we need to use their specific format
  // The password will be hashed by Better Auth's internal system
  // We need to hash it in a way that Better Auth expects

  // Better Auth expects passwords to be hashed with bcrypt rounds 10
  const hashedPassword = await hash('admin123', 10);

  const admin = await prisma.user.create({
    data: {
      email: 'admin@example.com',
      password: hashedPassword,
      firstName: 'Super',
      lastName: 'Admin',
      role: UserRole.SUPER_ADMIN,
      isActive: true,
      phone: '+1234567890',
      address: '123 Admin Street, Admin City, AC 12345',
      name: 'Super Admin', // Better Auth expects a 'name' field
      emailVerified: true,
      accounts: {
        create: {
          accountId: 'admin@example.com',
          providerId: 'credential',
          password: hashedPassword,
        },
      },
    },
  });

  console.log('✅ Super admin user created:', {
    id: admin.id,
    email: admin.email,
    role: admin.role,
  });

  console.log('\n📋 Login credentials:');
  console.log('   Email: admin@example.com');
  console.log('   Password: admin123');
  console.log('\n🎉 Database seeding completed successfully!');
}

main()
  .catch((error) => {
    console.error('❌ Error seeding database:', error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
