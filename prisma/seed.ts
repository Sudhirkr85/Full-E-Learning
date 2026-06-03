import { PrismaClient } from "@prisma/client";
import { hashPassword } from "../src/lib/password";

const prisma = new PrismaClient();

async function main() {
  console.log("Seeding super admin account...");

  const email = "admin@yourapp.com";
  const password = "Admin@123456";

  const adminPassword = await hashPassword(password);

  await prisma.user.upsert({
    where: { email },
    update: {}, // never overwrite existing admin data on re-seed
    create: {
      email,
      name: "Super Admin",
      role: "ADMIN",
      passwordHash: adminPassword,
    },
  });

  console.log(`✅ Super admin ensured: ${email}`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
