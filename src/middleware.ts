import { NextRequest, NextResponse } from "next/server";
import { verifySessionCookieFromRequest } from "@/app/lib/session";

const publicRoutes = [
  '/login',
  '/',
];

export default async function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname;

  // Skip middleware for public routes
  if (publicRoutes.includes(pathname)) {
    return NextResponse.next();
  }

  const sessionCookie = await verifySessionCookieFromRequest(request);

  if (!sessionCookie) {
    // Store the requested URL for redirecting after login
    const loginUrl = new URL('/login', request.url);
    return NextResponse.redirect(loginUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    '/((?!api|_next/static|_next/image|favicon.ico|sitemap.xml|robots.txt).*)',
  ],
};