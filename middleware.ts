import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { verifySessionCookieEdge } from "@/lib/admin-auth-edge";

const ADMIN_LOGIN = "/admin/login";

function isAdminAuthRoute(pathname: string): boolean {
  return pathname === "/api/admin/auth/login" || pathname === "/api/admin/auth/logout";
}

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Allow admin login page and auth API routes without session
  if (pathname === ADMIN_LOGIN || isAdminAuthRoute(pathname)) {
    return NextResponse.next();
  }

  // Protect /admin/* (UI)
  if (pathname.startsWith("/admin")) {
    const cookieHeader = request.headers.get("cookie");
    if (!(await verifySessionCookieEdge(cookieHeader))) {
      const login = new URL(ADMIN_LOGIN, request.url);
      return NextResponse.redirect(login);
    }
    return NextResponse.next();
  }

  // Protect /api/admin/* (except auth)
  if (pathname.startsWith("/api/admin")) {
    const cookieHeader = request.headers.get("cookie");
    if (!(await verifySessionCookieEdge(cookieHeader))) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    return NextResponse.next();
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*", "/api/admin/:path*"],
};
