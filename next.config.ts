import type { NextConfig } from "next";
import createNextIntlPlugin from "next-intl/plugin";

const withNextIntl = createNextIntlPlugin("./src/i18n/request.ts");

// The deployed backend URL (e.g. https://my-api.up.railway.app)
// Falls back to localhost for local development
const backendUrl =
  process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:3001";

// Parse hostname from the backend URL for image remotePatterns
function getBackendHostname(url: string): { protocol: string; hostname: string; port?: string } {
  try {
    const parsed = new URL(url);
    return {
      protocol: parsed.protocol.replace(":", "") as "http" | "https",
      hostname: parsed.hostname,
      ...(parsed.port ? { port: parsed.port } : {}),
    };
  } catch {
    return { protocol: "http", hostname: "localhost", port: "3001" };
  }
}

const backendPattern = getBackendHostname(backendUrl);

const nextConfig: NextConfig = {
  experimental: {
    optimizePackageImports: ["lucide-react"],
  },
  turbopack: {
    root: process.cwd(),
  },
  async rewrites() {
    return [
      {
        source: "/api/:path*",
        destination: `${backendUrl}/:path*`,
      },
      {
        source: "/uploads/:path*",
        destination: `${backendUrl}/uploads/:path*`,
      },
    ];
  },
  async redirects() {
    return [
      {
        source: "/",
        destination: "/ar",
        permanent: true,
      },
    ];
  },

  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "images.unsplash.com",
      },
      {
        protocol: "https",
        hostname: "cdn.salla.sa",
      },
      {
        protocol: "https",
        hostname: "i.pravatar.cc",
      },
      {
        protocol: "https",
        hostname: "media.istockphoto.com",
      },
      {
        protocol: "https",
        hostname: "img.magnific.com",
      },
      {
        protocol: "https",
        hostname: "organic-food.bold-themes.com",
      },
      {
        protocol: "https",
        hostname: "cdn.vectorstock.com",
      },
      {
        protocol: "https",
        hostname: "pngimg.com",
      },
      // Local development backend
      {
        protocol: "http",
        hostname: "localhost",
        port: "3001",
      },
      {
        protocol: "http",
        hostname: "192.168.0.195",
        port: "3001",
      },
      // Production backend (Railway) — derived from NEXT_PUBLIC_BACKEND_URL
      {
        protocol: backendPattern.protocol as "http" | "https",
        hostname: backendPattern.hostname,
        ...(backendPattern.port ? { port: backendPattern.port } : {}),
      },
    ],
  },
};

export default withNextIntl(nextConfig);