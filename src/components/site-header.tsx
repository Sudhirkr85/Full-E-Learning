import type { Session } from "next-auth";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { SiteHeaderClient } from "./navbar/site-header-client";

export async function SiteHeader() {
  // Wrap auth() in try/catch: Auth.js throws JWTSessionError when the browser
  // holds a stale or corrupt JWT cookie (e.g. after secret rotation or a schema
  // change). This is expected in production — treat it as "not logged in" so the
  // page renders normally instead of crashing with a 500.
  let session: Session | null = null;
  try {
    session = await auth();
  } catch {
    // JWTSessionError or similar — render as unauthenticated
  }
  
  // Construct user object safely matching expected layout type
  const user = session?.user ? {
    name: session.user.name,
    email: session.user.email,
    image: session.user.image,
    role: session.user.role as "STUDENT" | "TEACHER" | "ADMIN",
  } : null;

  let unreadCount = 0;
  
  // If user is logged in, query actual database for live unread count
  if (session?.user?.id) {
    try {
      unreadCount = await prisma.notification.count({
        where: {
          userId: session.user.id,
          isRead: false,
        },
      });
    } catch (error) {
      console.error("Error fetching unread notification count for header:", error);
    }
  }

  return <SiteHeaderClient user={user} unreadCount={unreadCount} />;
}
