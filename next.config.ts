/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    serverActions: {
      allowedOrigins: ["localhost:3000"],
    },
  },
  // Ensure Turbopack uses the project root when multiple lockfiles exist on the machine
  // This prevents Next from inferring a different workspace root where middleware may not be picked up.
  turbopack: {
    root: ".",
  },
  // 👇 Force Clerk auth cookies to propagate to API routes
  async headers() {
    return [
      {
        source: "/api/:path*",
        headers: [
          { key: "Access-Control-Allow-Credentials", value: "true" },
          { key: "Access-Control-Allow-Origin", value: "*" },
          { key: "Access-Control-Allow-Methods", value: "GET,OPTIONS,PATCH,DELETE,POST,PUT" },
          { key: "Access-Control-Allow-Headers", value: "X-CSRF-Token, X-Requested-With, Accept, Authorization, Content-Type, X-Auth-Token" },
        ],
      },
    ];
  },
};

export default nextConfig;
