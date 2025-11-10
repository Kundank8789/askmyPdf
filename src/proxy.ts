// src/proxy.ts (Next.js 16)
import { clerkMiddleware } from "@clerk/nextjs/server";

// ✅ Public routes that do NOT need auth
import type { ClerkMiddlewareOptions } from "@clerk/nextjs/server";

const middleware = clerkMiddleware({
  publicRoutes: ["/","/pricing", "/docs"],
} as ClerkMiddlewareOptions);

export default middleware;

export const config = {
  matcher: ["/((?!.+\\.[\\w]+$|_next).*)", "/", "/(api|trpc)(.*)"],
};
