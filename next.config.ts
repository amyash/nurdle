import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactCompiler: true,
  images: {
    formats: ["image/avif", "image/webp"],
    deviceSizes: [640, 750, 828, 1080, 1200],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
  },
  async redirects() {
    return [
      {
        source: "/announcements",
        destination: "/news",
        permanent: true,
      },
      {
        source: "/updates",
        destination: "/news",
        permanent: true,
      },
      {
        source: "/beach-cleanup",
        destination: "/how-to-clean",
        permanent: true,
      },
      {
        source: "/beach-groups",
        destination: "/beaches",
        permanent: true,
      },
      {
        source: "/volunteer-check-in",
        destination: "/beaches",
        permanent: true,
      },
      {
        source: "/collection-points",
        destination: "/beaches",
        permanent: true,
      },
      {
        source: "/drop-off-points",
        destination: "/beaches",
        permanent: true,
      },
      {
        source: "/community-images",
        destination: "/photos",
        permanent: true,
      },
    ];
  },
};

export default nextConfig;
