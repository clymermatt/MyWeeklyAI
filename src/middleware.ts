import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { getToken } from "next-auth/jwt";
import { rateLimit } from "@/lib/rate-limit";

// Routes that should be rate-limited and their config [limit, windowMs]
const RATE_LIMITED_ROUTES: Record<string, [number, number]> = {
  "/api/auth": [10, 60_000],           // 10 auth requests per minute per IP
  "/api/user/unsubscribe": [10, 60_000], // 10 unsubscribe attempts per minute per IP
};

function getClientIp(req: NextRequest): string {
  return (
    req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
    req.headers.get("x-real-ip") ||
    "unknown"
  );
}

export async function middleware(req: NextRequest) {
  // 301 redirect .vercel.app to custom domain
  const host = req.headers.get("host") || "";
  if (host.endsWith(".vercel.app")) {
    const url = new URL(req.url);
    url.host = "www.myweekly.ai";
    url.port = "";
    return NextResponse.redirect(url, 301);
  }

  const { pathname } = req.nextUrl;

  // Rate limiting for public-facing routes
  for (const [route, [limit, windowMs]] of Object.entries(RATE_LIMITED_ROUTES)) {
    if (pathname.startsWith(route)) {
      const ip = getClientIp(req);
      const { limited } = rateLimit(`${ip}:${route}`, limit, windowMs);
      if (limited) {
        return NextResponse.json(
          { error: "Too many requests. Please try again later." },
          { status: 429 },
        );
      }
      break;
    }
  }

  const token = await getToken({
    req,
    secret: process.env.NEXTAUTH_SECRET,
    secureCookie: req.nextUrl.protocol === "https:",
  });

  const isProtected =
    pathname.startsWith("/dashboard") || pathname.startsWith("/admin");

  if (isProtected && !token) {
    const signInUrl = new URL("/auth/signin", req.nextUrl.origin);
    signInUrl.searchParams.set("callbackUrl", pathname);
    return NextResponse.redirect(signInUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all paths except static files and Next.js internals
     */
    "/((?!_next/static|_next/image|favicon.ico|icon.svg|logos/).*)",
  ],
};
