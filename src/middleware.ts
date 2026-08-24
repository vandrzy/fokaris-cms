import { NextRequest, NextResponse } from "next/server";
import { jwtVerify } from "jose";
import { getJwtSecret } from "@/lib/env";

async function isTokenValid(token: string | undefined): Promise<boolean> {
  if (!token) return false;
  try {
    const secret = new TextEncoder().encode(getJwtSecret());
    await jwtVerify(token, secret);
    return true;
  } catch {
    return false;
  }
}

export async function middleware(request: NextRequest) {
  const token = request.cookies.get("token")?.value;
  const valid = await isTokenValid(token);
  const { pathname } = request.nextUrl;

  if (pathname.startsWith("/dashboard") && !valid) {
    return NextResponse.redirect(new URL("/login", request.url));
  }
  if (pathname === "/login" && valid) {
    return NextResponse.redirect(new URL("/dashboard", request.url));
  }
  return NextResponse.next();
}

export const config = {
  matcher: ["/dashboard/:path*", "/login"],
};
