import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const CANONICAL_ORIGIN = "https://nurdle-hub.vercel.app";

const LEGACY_HOSTS = new Set([
  "nurdle-hub-ne.vercel.app",
  "www.nurdle-hub-ne.vercel.app",
]);

export function proxy(request: NextRequest) {
  const host = request.headers.get("host")?.split(":")[0]?.toLowerCase();
  if (!host || !LEGACY_HOSTS.has(host)) {
    return NextResponse.next();
  }

  const destination = new URL(
    `${request.nextUrl.pathname}${request.nextUrl.search}`,
    CANONICAL_ORIGIN,
  );
  return NextResponse.redirect(destination, 308);
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
};
