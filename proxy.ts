import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function proxy(req: NextRequest) {
    const token = req.cookies.get("next-auth.session-token");

    const isLoggedIn = !!token;
    const { pathname } = req.nextUrl;

    // protect admin
    if (!isLoggedIn && pathname.startsWith("/admin")) {
        return NextResponse.redirect(new URL("/signin", req.url));
    }

    if (isLoggedIn && pathname === "/signin") {
        return NextResponse.redirect(new URL("/admin", req.url));
    }
}

export const config = {
    matcher: ["/admin/:path*", "/signin"],
};