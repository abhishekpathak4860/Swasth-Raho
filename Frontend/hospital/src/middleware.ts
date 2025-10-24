// middleware.ts
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { jwtVerify } from "jose";

const secret = new TextEncoder().encode(process.env.JWT_SECRET);

export async function middleware(req: NextRequest) {
  const path = req.nextUrl.pathname;

  // Middleware should only run for /admin routes
  if (!path.startsWith("/admin")) {
    return NextResponse.next();
  }

  const token = req.cookies.get("token")?.value;
  console.log("value",token)

  // If no token, redirect to login
  if (!token) {
    return NextResponse.redirect(new URL("/login", req.url));
  }

  try {
    // Verify and decode token
    const { payload } = await jwtVerify(token, secret);
    const {id,role } = payload as any;

    // Check role and redirect accordingly
    if (role === "patient") {
      // if user is on /admin or invalid section, redirect to /admin/patient
      if (path === "/admin") {
        return NextResponse.redirect(new URL("/admin/patient", req.url));
      }
      return NextResponse.next();
    }

    if (role === "doctor") {
      // if user is on /admin or invalid section, redirect to /admin/doctor
      if (path === "/admin") {
        return NextResponse.redirect(new URL("/admin/doctor", req.url));
      }
      return NextResponse.next();
    }

    // if role is invalid or not matched
    return NextResponse.redirect(new URL("/login", req.url));

  } catch (err) {
    console.error("JWT Verification Failed:", err);
    return NextResponse.redirect(new URL("/login", req.url));
  }
}

//Only apply middleware to admin routes
export const config = {
  matcher: ["/admin/:path*"],
};
