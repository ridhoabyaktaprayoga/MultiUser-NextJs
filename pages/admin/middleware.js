import { getToken } from "next-auth/jwt";
import { NextResponse } from "next/server";

export async function middleware(req) {
  const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });

  // Jika tidak login, redirect ke /login
  if (!token) {
    return NextResponse.redirect(new URL("/login", req.url));
  }

  // Redirect sesuai role
  if (token.role === "ADMIN") {
    return NextResponse.redirect(new URL("/admin", req.url));
  } else if (token.role === "USER") {
    return NextResponse.redirect(new URL("/user", req.url));
  }

  // Jika role tidak dikenali, redirect ke home
  return NextResponse.redirect(new URL("/", req.url));
}
