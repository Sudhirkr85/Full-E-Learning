import type { UserRole } from "@prisma/client";
import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import Google from "next-auth/providers/google";
import GitHub from "next-auth/providers/github";
import { prisma } from "@/lib/prisma";
import { verifyPassword } from "@/lib/password";
import { loginSchema } from "@/lib/auth-schemas";

export const { handlers, auth, signIn, signOut } = NextAuth({
  trustHost: true,
  secret: process.env.AUTH_SECRET,
  pages: {
    signIn: "/login"
  },
  session: {
    strategy: "jwt"
  },
  providers: [
    Google({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      allowDangerousEmailAccountLinking: true
    }),
    GitHub({
      clientId: process.env.GITHUB_CLIENT_ID,
      clientSecret: process.env.GITHUB_CLIENT_SECRET,
      allowDangerousEmailAccountLinking: true
    }),
    Credentials({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials) {
        const parsed = loginSchema.safeParse(credentials);

        if (!parsed.success) {
          return null;
        }

        const user = await prisma.user.findUnique({
          where: {
            email: parsed.data.email.toLowerCase()
          },
          select: {
            id: true,
            name: true,
            email: true,
            image: true,
            passwordHash: true,
            role: true,
            isActive: true,
            firstName: true,
            lastName: true,
            locale: true,
            timezone: true
          }
        });

        if (!user || !user.isActive) {
          return null;
        }

        const passwordMatches = await verifyPassword(parsed.data.password, user.passwordHash);

        if (!passwordMatches) {
          return null;
        }

        await prisma.user.update({
          where: { id: user.id },
          data: { lastLoginAt: new Date() }
        });

        return {
          id: user.id,
          name: user.name,
          email: user.email,
          image: user.image,
          role: user.role
        };
      }
    })
  ],
  callbacks: {
    async signIn({ user, account }) {
      if (account?.provider === "credentials") {
        return true;
      }
      if (user.email) {
        const emailLower = user.email.toLowerCase();
        const dbUser = await prisma.user.findUnique({
          where: { email: emailLower }
        });

        if (!dbUser) {
          const newUser = await prisma.user.create({
            data: {
              email: emailLower,
              name: user.name || emailLower.split("@")[0],
              image: user.image,
              passwordHash: "", // OAuth accounts have no password hash
              role: "STUDENT",
              isActive: true,
              lastLoginAt: new Date()
            }
          });
          user.id = newUser.id;
          user.role = newUser.role;
        } else {
          if (!dbUser.isActive) {
            return false; // Deactivated account
          }
          user.id = dbUser.id;
          user.role = dbUser.role;
          await prisma.user.update({
            where: { id: dbUser.id },
            data: { lastLoginAt: new Date() }
          });
        }
        return true;
      }
      return false;
    },
    async jwt({ token, user }) {
      if (user) {
        token.sub = user.id;
        token.role = user.role;
      }

      if (token.sub) {
        const dbUser = await prisma.user.findUnique({
          where: { id: token.sub },
          select: {
            role: true,
            name: true,
            email: true,
            image: true,
            firstName: true,
            lastName: true,
            locale: true,
            timezone: true
          }
        });

        if (dbUser) {
          token.role = dbUser.role;
          token.name = dbUser.name;
          token.email = dbUser.email;
          token.picture = dbUser.image;
          token.firstName = dbUser.firstName;
          token.lastName = dbUser.lastName;
          token.locale = dbUser.locale;
          token.timezone = dbUser.timezone;
        }
      }

      return token;
    },
    async session({ session, token }) {
      if (session.user && token.sub) {
        session.user.id = token.sub;
        session.user.role = (token.role as UserRole | undefined) ?? session.user.role;
        session.user.firstName = (token.firstName as string | null | undefined) ?? undefined;
        session.user.lastName = (token.lastName as string | null | undefined) ?? undefined;
        session.user.locale = (token.locale as string | null | undefined) ?? undefined;
        session.user.timezone = (token.timezone as string | null | undefined) ?? undefined;
      }

      if (session.user) {
        session.user.name = (token.name as string | null | undefined) ?? undefined;
        if (typeof token.email === "string") {
          session.user.email = token.email;
        }

        session.user.image = (token.picture as string | null | undefined) ?? undefined;
      }

      return session;
    }
  }
});