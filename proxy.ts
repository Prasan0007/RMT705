import { NextResponse } from "next/server";
import { auth } from "@/auth";

const PROTECTED_PREFIXES = ["/vault", "/rip", "/perfect-cut"];
const ADMIN_PREFIX = "/admin";

export default auth((req) => {
  const { pathname } = req.nextUrl;
  const isLoggedIn = !!req.auth;

  if (pathname.startsWith(ADMIN_PREFIX)) {
    if (!isLoggedIn || req.auth?.user.role !== "ADMIN") {
      return NextResponse.redirect(new URL("/login", req.nextUrl));
    }
    return NextResponse.next();
  }

  if (PROTECTED_PREFIXES.some((p) => pathname.startsWith(p)) && !isLoggedIn) {
    const url = new URL("/login", req.nextUrl);
    url.searchParams.set("from", pathname);
    return NextResponse.redirect(url);
  }

  return NextResponse.next();
});

export const config = {
  matcher: ["/vault/:path*", "/rip/:path*", "/perfect-cut/:path*", "/admin/:path*"],
};
