import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log(`🌱 Seeding admin...`);

  const user = await prisma.user.findFirst({ where: { email: "admin@example.com" } });

  if (!user) {
    const adminPassword = await bcrypt.hash('admin123', 12);

    await prisma.user.create({
      data: {
        name: 'Admin',
        email: 'admin@example.com',
        password: adminPassword,
        role: 'ADMIN',
      },
    });

  }

  const interns = [
    { name: "Aayush Kukreja", empId: "emp-101", email: "aayush@example.com" },
    { name: "Rohan Das",      empId: "emp-102", email: "rohan@example.com" },
    { name: "Sarah Smith",    empId: "emp-103", email: "sarah@example.com" },
  ];

  for (const intern of interns) {
    const commonPassword = await bcrypt.hash('user123', 12);

    await prisma.user.upsert({
      where: { employeeId: intern.empId },
      update: {},
      create: {
        name: intern.name,
        employeeId: intern.empId,
        email: intern.email,
        password: commonPassword,
        role: "EMPLOYEE"
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