import { auth } from "@/auth";
import { NextResponse } from "next/server";

export default auth((req) => {
  const { pathname } = req.nextUrl;
  const role = (req.auth?.user as any)?.role;

  const isLogin = pathname.endsWith("/login") || pathname.endsWith("/signup");

  if (pathname.startsWith("/trainee") && !isLogin && role !== "TRAINEE")
    return NextResponse.redirect(new URL("/trainee/login", req.url));

  if (pathname.startsWith("/trainer") && !isLogin && role !== "TRAINER")
    return NextResponse.redirect(new URL("/trainer/login", req.url));

  if (pathname.startsWith("/admin") && !isLogin && role !== "ADMIN")
    return NextResponse.redirect(new URL("/admin/login", req.url));

  return NextResponse.next();
});

export const config = {
  matcher: ["/trainee/:path*", "/trainer/:path*", "/admin/:path*"],
};
