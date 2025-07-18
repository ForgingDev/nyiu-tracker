import { NextRequest, NextResponse } from "next/server";

export async function middleware(request: NextRequest) {
  // Define protected routes
  const protectedRoutes = ["/dashboard", "/services", "/events"];
  const authRoutes = ["/signin", "/signup"];

  const { pathname } = request.nextUrl;

  // Check if the current route is protected
  const isProtectedRoute = protectedRoutes.some((route) =>
    pathname.startsWith(route)
  );

  // Check if the current route is an auth route
  const isAuthRoute = authRoutes.some((route) => pathname.startsWith(route));

  // Try to get session from cookies
  const sessionToken = request.cookies.get("better-auth.session_token")?.value;

  if (isProtectedRoute && !sessionToken) {
    // Redirect to signin if trying to access protected route without session
    const signinUrl = new URL("/signin", request.url);
    signinUrl.searchParams.set("callbackUrl", pathname);
    return NextResponse.redirect(signinUrl);
  }

  if (isAuthRoute && sessionToken) {
    // Redirect to dashboard if logged in user tries to access auth routes
    return NextResponse.redirect(new URL("/", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    "/((?!api|_next/static|_next/image|favicon.ico).*)",
  ],
};
