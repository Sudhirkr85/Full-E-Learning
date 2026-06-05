import { NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";
import type { NextRequest } from "next/server";

const protectedPrefixes = ["/dashboard", "/profile", "/student", "/teacher", "/admin"];
const authPages = ["/login", "/register"];

function getDashboardPath(role?: string | null) {
  switch (role) {
    case "ADMIN":
      return "/admin/dashboard";
    case "TEACHER":
      return "/teacher/dashboard";
    default:
      return "/student/dashboard";
  }
}

export default async function middleware(request: NextRequest) {
  const { nextUrl } = request;
  const pathname = nextUrl.pathname;
  
  // NextAuth v5 uses authjs.session-token cookie names.
  // We dynamically resolve secureCookie and cookieName based on HTTPS to prevent live environment desyncs.
  const secureCookie = 
    process.env.NODE_ENV === "production" ||
    request.headers.get("x-forwarded-proto") === "https" ||
    nextUrl.protocol === "https:";
  const cookieName = secureCookie ? "__Secure-authjs.session-token" : "authjs.session-token";

  const token = await getToken({ 
    req: request, 
    secret: process.env.AUTH_SECRET,
    secureCookie,
    cookieName
  });
  const isLoggedIn = Boolean(token && token.sub);
  const role = typeof token?.role === "string" ? token.role : null;

  if (authPages.some((page) => pathname.startsWith(page)) && isLoggedIn) {
    return NextResponse.redirect(new URL("/dashboard", nextUrl));
  }

  if (!protectedPrefixes.some((prefix) => pathname.startsWith(prefix))) {
    return NextResponse.next();
  }

  if (!isLoggedIn) {
    const loginUrl = new URL("/login", nextUrl);
    loginUrl.searchParams.set("callbackUrl", pathname);
    return NextResponse.redirect(loginUrl);
  }

  if (pathname.startsWith("/student") && role !== "STUDENT") {
    return NextResponse.redirect(new URL(getDashboardPath(role), nextUrl));
  }

  if (pathname.startsWith("/teacher") && role !== "TEACHER") {
    return NextResponse.redirect(new URL(getDashboardPath(role), nextUrl));
  }

  if (pathname.startsWith("/admin") && role !== "ADMIN") {
    return NextResponse.redirect(new URL(getDashboardPath(role), nextUrl));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/dashboard/:path*", "/profile/:path*", "/student/:path*", "/teacher/:path*", "/admin/:path*", "/login", "/register"]
};
