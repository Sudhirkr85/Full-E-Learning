import { PrismaClient } from "@prisma/client";

const globalForPrisma = globalThis as unknown as {
  prisma: ReturnType<typeof buildPrismaClient> | undefined;
};

function buildPrismaClient() {
  const base = new PrismaClient({
    log: process.env.NODE_ENV === "development" ? ["error", "warn"] : ["error"],
  });

  // Prisma v5/v6 replacement for the removed $use() middleware.
  // Block deletion of ADMIN accounts at the database layer.
  return base.$extends({
    query: {
      user: {
        async delete({ args, query }) {
          const user = await base.user.findUnique({
            where: args.where,
            select: { role: true },
          });
          if (user?.role === "ADMIN") {
            throw new Error("Super admin account cannot be deleted.");
          }
          return query(args);
        },
        async deleteMany({ args, query }) {
          const adminCount = await base.user.count({
            where: {
              AND: [args.where ?? {}, { role: "ADMIN" }],
            },
          });
          if (adminCount > 0) {
            throw new Error("Cannot delete admin accounts.");
          }
          return query(args);
        },
      },
    },
  });
}

export const prisma = globalForPrisma.prisma ?? buildPrismaClient();

if (process.env.NODE_ENV !== "production") {
  globalForPrisma.prisma = prisma;
}
