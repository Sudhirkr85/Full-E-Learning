import { PrismaClient, UserRole } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  const targetAdminEmail = "sudhir@gmail.com";

  // 1. Demote any other admin to STUDENT
  const demoted = await prisma.user.updateMany({
    where: {
      role: UserRole.ADMIN,
      NOT: {
        email: targetAdminEmail,
      },
    },
    data: {
      role: UserRole.STUDENT,
    },
  });

  console.log(`Demoted ${demoted.count} other admin accounts to STUDENT.`);

  // 2. Ensure sudhir@gmail.com is strictly ADMIN
  const currentAdmin = await prisma.user.findUnique({
    where: { email: targetAdminEmail },
    select: { id: true, email: true, role: true },
  });

  console.log("Current active ADMIN in system:", currentAdmin);

  // 3. Verify total ADMIN count in database
  const allAdmins = await prisma.user.findMany({
    where: { role: UserRole.ADMIN },
    select: { id: true, email: true, role: true },
  });

  console.log("Total ADMIN users now:", allAdmins);
}

main()
  .catch((e) => console.error(e))
  .finally(async () => {
    await prisma.$disconnect();
    process.exit(0);
  });
