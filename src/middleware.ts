import { NextRequest, NextResponse } from "next/server";

/**
 * Next.js Edge Middleware — lightweight route protection.
 *
 * Strategy: Edge middleware can't access Zustand (client state).
 * We use the HttpOnly `refreshToken` cookie as a signal:
 *   - Cookie present  → user is likely authenticated (full check happens client-side in PanelGuard)
 *   - Cookie absent   → user is definitely not authenticated
 *
 * This prevents unauthenticated users from even loading protected pages.
 * The PanelGuard in (panel)/layout.tsx does the definitive role check.
 */
export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const hasSession   = request.cookies.has("refreshToken");

  // ── Protect admin panel ────────────────────────────────────────────────────
  if (pathname.startsWith("/admin")) {
    if (!hasSession) {
      const loginUrl = new URL("/login", request.url);
      loginUrl.searchParams.set("from", pathname);
      return NextResponse.redirect(loginUrl);
    }
  }

  // ── Protect customer account pages ─────────────────────────────────────────
  if (pathname.startsWith("/account") || pathname.startsWith("/checkout")) {
    if (!hasSession) {
      const loginUrl = new URL("/login", request.url);
      loginUrl.searchParams.set("from", pathname);
      return NextResponse.redirect(loginUrl);
    }
  }

  // ── Redirect authenticated users away from /login and /register ────────────
  // (Only if cookie is present — the actual role-based redirect is done by login page)
  if ((pathname === "/login" || pathname === "/register") && hasSession) {
    return NextResponse.redirect(new URL("/", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/admin/:path*",
    "/account/:path*",
    "/checkout/:path*",
    "/login",
    "/register",
  ],
};
