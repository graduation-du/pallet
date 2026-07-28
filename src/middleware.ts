import NextAuth from "next-auth";
import { NextResponse } from "next/server";
import { authConfig } from "@/auth.config";
import { canAccessPath, homePathForRole } from "@/lib/roles";
import type { Role } from "@prisma/client";

const { auth } = NextAuth(authConfig);

const rateLimitMap = new Map<string, { count: number; resetAt: number }>();

function rateLimit(ip: string, max: number, windowMs: number): boolean {
  const now = Date.now();
  const entry = rateLimitMap.get(ip);
  if (!entry || now > entry.resetAt) {
    rateLimitMap.set(ip, { count: 1, resetAt: now + windowMs });
    return true;
  }
  if (entry.count >= max) return false;
  entry.count++;
  return true;
}

export default auth((req) => {
  const { pathname } = req.nextUrl;

  // Rate limit login page requests
  if (pathname.startsWith("/login")) {
    const ip = req.headers.get("x-forwarded-for") || req.headers.get("x-real-ip") || "unknown";
    if (!rateLimit(ip, 20, 60000)) {
      return new NextResponse("Too many requests", { status: 429 });
    }
  }

  const isLoggedIn = !!req.auth?.user;
  const role = req.auth?.user?.role as Role | undefined;

  const isAuthPage = pathname.startsWith("/login");
  const isProtected = pathname.startsWith("/admin");

  // If logged in and hitting login page, redirect to home
  if (isAuthPage && isLoggedIn && role) {
    return NextResponse.redirect(new URL(homePathForRole(role), req.url));
  }

  // If not logged in and hitting protected page, redirect to login
  if (isProtected && !isLoggedIn) {
    const url = new URL("/login", req.url);
    url.searchParams.set("callbackUrl", pathname);
    return NextResponse.redirect(url);
  }

  // If logged in but role can't access this path, redirect to unauthorized
  if (isProtected && role && !canAccessPath(role, pathname)) {
    return NextResponse.redirect(new URL("/unauthorized", req.url));
  }

  return NextResponse.next();
});

export const config = {
  matcher: ["/admin/:path*", "/login"],
};
