import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { getToken } from "next-auth/jwt";

export async function proxy(req: NextRequest) {
    const token = await getToken({
        req,
        secret: process.env.NEXTAUTH_SECRET,
    });

    const isLoggedIn = !!token;
    const isAdmin = token?.role === "admin";

    const { pathname } = req.nextUrl;

    if (!isLoggedIn && pathname.startsWith("/admin")) {
        return NextResponse.redirect(new URL("/signin", req.url));
    }

    // login แล้วแต่ไม่ใช่ admin ห้ามเข้า
    if (isLoggedIn && !isAdmin && pathname.startsWith("/admin")) {
        return NextResponse.redirect(new URL("/", req.url));
    }

    if (isLoggedIn && pathname === "/signin") {
        return NextResponse.redirect(new URL("/admin", req.url));
    }
}

export const config = {
    matcher: ["/admin/:path*", "/signin"],
};