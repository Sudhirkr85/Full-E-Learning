import { PrismaClient } from "@prisma/client";
import { hashPassword } from "../src/lib/password";

const prisma = new PrismaClient();

async function main() {
  const newHash = await hashPassword("Sonam@123");
  const res = await prisma.user.updateMany({
    where: { role: "ADMIN" },
    data: { passwordHash: newHash }
  });
  console.log(`✅ Updated ${res.count} ADMIN user(s) password to 'Sonam@123'`);
}

main()
  .catch((e) => console.error(e))
  .finally(async () => {
    await prisma.$disconnect();
  });
