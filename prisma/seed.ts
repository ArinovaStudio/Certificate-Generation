import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log(`🌱 Seeding admin...`);

  const user = await prisma.user.findFirst({ where: { name: "Admin" } });

  if (!user) {
    const hashedPassword = await bcrypt.hash('admin123', 12);

    await prisma.user.create({
      data: {
        name: 'Admin',
        password: hashedPassword,
        role: 'ADMIN',
      },
    });

  }

}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });