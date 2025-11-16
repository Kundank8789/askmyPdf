// src/proxy.ts
import { clerkMiddleware } from "@clerk/nextjs/server";

export default clerkMiddleware({
  // Public routes (allowed without login)
  publicRoutes: [
    "/", 
    "/sign-in",
    "/sign-up",
    "/api/uploadthing"
  ],
});

export const config = {
  matcher: [
    "/((?!.+\\.[\\w]+$|_next).*)",
    "/",
    "/(api|trpc)(.*)",
  ],
};
