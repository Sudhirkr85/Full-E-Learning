import { PrismaClient, UserRole } from "@prisma/client";
import { hashPassword } from "../src/lib/password";

const prisma = new PrismaClient();

async function main() {
  const email = "sudhir@gmail.com";
  const pass = "Sonam@123";
  const hash = await hashPassword(pass);

  const user = await prisma.user.upsert({
    where: { email },
    update: {
      role: UserRole.ADMIN,
      passwordHash: hash,
    },
    create: {
      email,
      name: "Sudhir (Admin)",
      role: UserRole.ADMIN,
      passwordHash: hash,
    },
  });

  console.log(`✅ User ${user.email} is set to ADMIN with password '${pass}'`);
}

main()
  .catch((e) => console.error(e))
  .finally(async () => {
    await prisma.$disconnect();
    process.exit(0);
  });
