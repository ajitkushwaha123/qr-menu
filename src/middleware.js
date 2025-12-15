// middleware.ts
import { NextResponse } from "next/server";
import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";

// Root app/dashboard domain
const ROOT_DOMAIN =
  process.env.NEXT_PUBLIC_ROOT_DOMAIN || "kravy-qr-menu.vercel.app";

const isPublicRoute = createRouteMatcher([
  "/login(.*)",
  "/register(.*)",
  "/pricing(.*)",
]);

function getSubdomain(hostname) {
  if (!hostname) return null;
  const host = hostname.split(":")[0];
  const parts = host.split(".");

  // "qr.foodsnap.in" -> no subdomain
  if (parts.length <= 2) return null;

  // "demo.qr.foodsnap.in" -> "demo"
  return parts[0];
}

export default clerkMiddleware(async (auth, req) => {
  const url = req.nextUrl;
  const hostname = req.headers.get("host") || "";
  const subdomain = getSubdomain(hostname);

  // ----- ROOT DOMAIN: qr.foodsnap.in -----
  if (!subdomain && hostname === ROOT_DOMAIN) {
    // Protect non‑public routes with Clerk
    if (!isPublicRoute(req)) {
      await auth.protect();
    }
    return NextResponse.next();
  }

  // ----- TENANT SUBDOMAINS: slug.qr.foodsnap.in -----
  if (subdomain) {
    // Public customer-facing site (no auth)
    const path = url.pathname === "/" ? "" : url.pathname;
    url.pathname = `/tenant/${subdomain}${path}`;
    return NextResponse.rewrite(url);
  }

  // Fallback (e.g. localhost, previews)
  return NextResponse.next();
});

export const config = {
  matcher: ["/((?!.+\\.[\\w]+$|_next).*)", "/", "/(api|trpc)(.*)"],
};
