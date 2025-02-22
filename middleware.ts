import { auth } from "@/lib/auth";
import { NextResponse } from "next/server";

export default auth((req) => {
  const isLoggedIn = !!req.auth;
  const isProtectedRoute = req.nextUrl.pathname.startsWith("/dashboard");

  if (isProtectedRoute && !isLoggedIn) {
    return NextResponse.redirect(new URL("/signin", req.url));
  }

  return NextResponse.next();
});

export const config = {
  matcher: ["/dashboard/:path*", "/signin", "/signup"],
};

// import { NextResponse } from "next/server";
// import type { NextRequest } from "next/server";
// import { auth } from "./lib/auth";

// export async function middleware(request: NextRequest) {
//   const session = await auth();

//   if (!session) {
//     return NextResponse.json(
//       { error: "Authentication required" },
//       { status: 401 }
//     );
//   }

//   const requestHeaders = new Headers(request.headers);
//   requestHeaders.set("user", JSON.stringify(session.user));

//   return NextResponse.next({
//     request: {
//       headers: requestHeaders,
//     },
//   });
// }

// export const config = {
//   matcher: ["/api/protected/:path*"],
// };
