// export default nextConfig;
/** @type {import('next').NextConfig} */

const BASE_URL = process.env.NEXT_PUBLIC_BACKEND_URL;

const nextConfig = {
  eslint: { ignoreDuringBuilds: true },
  async rewrites() {
    return [
      {
        source: "/api/:path*",
        destination: `${BASE_URL}/api/:path*`,
      },
      {
        source: "/api/chat/:path*",
        destination: `${BASE_URL}/api/chat/:path*`,
      },
      {
        source: "/patient/:path*",
        destination: `${BASE_URL}/patient/:path*`,
      },
      {
        source: "/doctor/:path*",
        destination: `${BASE_URL}/doctor/:path*`,
      },
      {
        source: "/api/hospital/:path*",
        destination: `${BASE_URL}/api/hospital/:path*`,
      },
      {
        source: "/auth/:path*",
        destination: `${BASE_URL}/auth/:path*`,
      },
      {
        source: "/user/auth/:path*",
        destination: `${BASE_URL}/user/auth/:path*`,
      },
      {
        source: "/super-admin/:path*",
        destination: `${BASE_URL}/super-admin/:path*`,
      },
      {
        source: "/ai/:path*",
        destination: `${BASE_URL}/ai/:path*`,
      },
    ];

    return [
      {
        source: "/api/:path*",
        destination: "https://swasth-hospital.onrender.com/api/:path*",
      },
      {
        source: "/api/chat/:path*",
        destination: "https://swasth-hospital.onrender.com/api/chat/:path*",
      },
      {
        source: "/patient/:path*",
        destination: "https://swasth-hospital.onrender.com/patient/:path*",
      },
      {
        source: "/doctor/:path*",
        destination: "https://swasth-hospital.onrender.com/doctor/:path*",
      },
      {
        source: "/api/hospital/:path*",
        destination: "https://swasth-hospital.onrender.com/api/hospital/:path*",
      },
      {
        source: "/auth/:path*",
        destination: "https://swasth-hospital.onrender.com/auth/:path*",
      },
      {
        source: "/user/auth/:path*",
        destination: "https://swasth-hospital.onrender.com/user/auth/:path*",
      },
      {
        source: "/super-admin/:path*",
        destination: "https://swasth-hospital.onrender.com/super-admin/:path*",
      },
      {
        source: "/ai/:path*",
        destination: "https://swasth-hospital.onrender.com/ai/:path*",
      },
    ];
  },
};
// /hospital
export default nextConfig;
