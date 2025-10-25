// import type { NextConfig } from "next";

// const nextConfig: NextConfig = {
//   /* config options here */
// };

// export default nextConfig;
/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    ignoreDuringBuilds: true, // Ignore ESLint issues during production build
  },
    async rewrites() {
    return [
      {
        source: "/api/:path*",
        destination: "https://swasth-hospital.onrender.com/api/:path*",
      },
    ];
  },
};

export default nextConfig;
