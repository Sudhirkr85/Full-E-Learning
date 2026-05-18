import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { getDashboardPath } from "@/lib/auth";

const protectedPrefixes = ["/dashboard", "/profile", "/student", "/teacher", "/admin"];
const authPages = ["/login", "/register"];

export default auth((request) => {
  const { nextUrl } = request;
  const isLoggedIn = Boolean(request.auth);
  const pathname = nextUrl.pathname;

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

  const role = request.auth?.user?.role;

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
});

export const config = {
  matcher: ["/dashboard/:path*", "/profile/:path*", "/student/:path*", "/teacher/:path*", "/admin/:path*", "/login", "/register"]
};