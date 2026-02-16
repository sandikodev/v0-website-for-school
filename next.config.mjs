/** @type {import('next').NextConfig} */
const nextConfig = {
  output: "standalone",
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    unoptimized: true,
  },
  // Enable compression
  compress: true,
  // Allow cross-origin requests from subdomains in development
  allowedDevOrigins: [
    'aksesekolah.local',
    '*.aksesekolah.local',
    'dashboard.aksesekolah.local',
    'www.aksesekolah.local',
  ],
  // Headers for security
  async headers() {
    return [
      {
        source: "/:path*",
        headers: [
          {
            key: "X-DNS-Prefetch-Control",
            value: "on",
          },
          {
            key: "X-Frame-Options",
            value: "SAMEORIGIN",
          },
        ],
      },
    ];
  },
};

export default nextConfig;
