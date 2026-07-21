import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Prisma's client is generated to a custom location (node_modules/.prisma/generated).
  // Next.js only auto-traces the default Prisma path, so we must explicitly include the
  // generated client + query engine binaries (e.g. libquery_engine-rhel-openssl-3.0.x.so.node)
  // in the serverless output bundle. Otherwise the engine is missing at runtime on Vercel.
  outputFileTracingIncludes: {
    "*": ["./node_modules/.prisma/generated/**/*"],
  },
};

export default nextConfig;
