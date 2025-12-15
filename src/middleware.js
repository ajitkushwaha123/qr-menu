// middleware.ts
import { NextResponse } from "next/server";
import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";

const isPublicRoute = createRouteMatcher([
  "/login(.*)",
  "/register(.*)",
  "/", // marketing homepage on root domain
]);

const ROOT_DOMAIN = process.env.NEXT_PUBLIC_ROOT_DOMAIN;

function getSubdomain(hostname) {
  // handle localhost and production separately if needed
  if (!hostname) return null;

  // example hostnames:
  // - "qr-menu.in"              -> no subdomain
  // - "demo.qr-menu.in"         -> "demo"
  // - "demo.preview.vercel.app" -> handle differently if you want
  const parts = hostname.split(":")[0].split(".");

  // "qr-menu.in" => ["qr-menu","in"] -> no subdomain
  if (parts.length <= 2) return null;

  // "demo.qr-menu.in" => ["demo","qr-menu","in"] -> "demo"
  return parts[0];
}

export default clerkMiddleware(async (auth, req) => {
  const url = req.nextUrl;
  const hostname = req.headers.get("host") || "";
  const subdomain = getSubdomain(hostname);

  // 1) Auth
  if (!isPublicRoute(req)) {
    await auth.protect();
  }

  // 2) If no subdomain => root app (dashboard/marketing)
  if (!subdomain) {
    return NextResponse.next();
  }

  // 3) Subdomain => tenant website
  // Rewrite demo.qr-menu.in/menu -> /tenant/demo/menu
  const path = url.pathname === "/" ? "" : url.pathname;
  url.pathname = `/tenant/${subdomain}${path}`;

  return NextResponse.rewrite(url);
});

export const config = {
  matcher: ["/((?!.+\\.[\\w]+$|_next).*)", "/", "/(api|trpc)(.*)"],
};
