import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

// Paths that require authentication
const authRequiredPaths = [
  "/account",
  "/account/orders",
  "/account/saved-devotionals",
  "/account/event-registrations",
  "/account/settings",
]

// Paths that require admin access
const adminRequiredPaths = [
  "/admin",
  "/admin/devotionals",
  "/admin/shop",
  "/admin/events",
  "/admin/users",
  "/admin/prayer",
  "/admin/settings",
]

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  // Check for Firebase auth session cookie
  const authSession = request.cookies.get("firebase-auth-token")?.value
  const hasAuthCookie = !!authSession || !!request.cookies.get("auth-session")?.value

  // Check if the path requires authentication
  const isAuthRequired = authRequiredPaths.some((path) => pathname === path || pathname.startsWith(`${path}/`))

  // Check if the path requires admin access
  const isAdminRequired = adminRequiredPaths.some((path) => pathname === path || pathname.startsWith(`${path}/`))

  // If no auth session and auth is required, redirect to login
  if (!hasAuthCookie && isAuthRequired) {
    const url = new URL("/login", request.url)
    url.searchParams.set("callbackUrl", pathname)
    return NextResponse.redirect(url)
  }

  // For admin routes, we'll check the session on the client side
  // since we need to verify the admin role from Firestore

  return NextResponse.next()
}

export const config = {
  matcher: ["/account/:path*", "/admin/:path*"],
}

