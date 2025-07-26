import { withAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";

export default withAuth(
  function middleware(req) {
    // Check if the request is for API routes that modify data
    const { pathname } = req.nextUrl;

    if (
      pathname.startsWith("/api/") &&
      ["POST", "PUT", "DELETE", "PATCH"].includes(req.method)
    ) {
      // Only allow admin users to modify data
      if (!req.nextauth.token?.isAdmin) {
        return new NextResponse(JSON.stringify({ error: "Unauthorized" }), {
          status: 401,
          headers: { "content-type": "application/json" },
        });
      }
    }

    return NextResponse.next();
  },
  {
    callbacks: {
      authorized: ({ token, req }) => {
        const { pathname } = req.nextUrl;

        // Allow access to read-only pages for everyone
        if (pathname === "/" || pathname.startsWith("/analytics")) {
          return true;
        }

        // For API routes, let the middleware function handle authorization
        if (pathname.startsWith("/api/")) {
          return true;
        }

        // For other protected routes, require admin
        return token?.isAdmin === true;
      },
    },
  }
);

export const config = {
  matcher: ["/api/:path*", "/admin/:path*"],
};
