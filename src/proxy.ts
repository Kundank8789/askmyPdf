// src/proxy.ts
import { clerkMiddleware } from "@clerk/nextjs/server";

export default clerkMiddleware();

export const config = {
  matcher: [
    "/((?!.+\\.[\\w]+$|_next).*)", // pages & app routes
    "/api/:path*",                // ← crucial: run on API routes
  ],
};
