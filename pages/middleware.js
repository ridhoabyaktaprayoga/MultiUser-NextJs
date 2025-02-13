import { getToken } from "next-auth/jwt";
import { NextResponse } from "next/server";

export async function middleware(req) {
  const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });
  const { pathname } = req.nextUrl;

  // Biarkan akses ke halaman login dan register
  if (pathname.startsWith("/login") || pathname.startsWith("/register")) {
    return NextResponse.next();
  }

  // Jika tidak ada token, redirect ke login
  if (!token) {
    return NextResponse.redirect(new URL("/login", req.url));
  }

  // Admin hanya boleh masuk ke halaman /admin
  if (pathname.startsWith("/admin") && token.role !== "ADMIN") {
    return NextResponse.redirect(new URL("/user", req.url));
  }

  // User tidak boleh masuk ke halaman admin
  if (pathname.startsWith("/user") && token.role === "ADMIN") {
    return NextResponse.redirect(new URL("/admin", req.url));
  }

  return NextResponse.next();
}
