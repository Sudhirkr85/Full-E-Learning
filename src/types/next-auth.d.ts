import type { DefaultSession } from "next-auth";
import type { UserRole } from "@prisma/client";

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      role: UserRole;
      firstName?: string | null;
      lastName?: string | null;
      bio?: string | null;
      locale?: string | null;
      timezone?: string | null;
    } & DefaultSession["user"];
  }

  interface User {
    role: UserRole;
    firstName?: string | null;
    lastName?: string | null;
    bio?: string | null;
    locale?: string | null;
    timezone?: string | null;
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    role?: UserRole;
    firstName?: string | null;
    lastName?: string | null;
    bio?: string | null;
    locale?: string | null;
    timezone?: string | null;
  }
}