// // // import type { NextConfig } from "next";

// // // const nextConfig: NextConfig = {
// // //   /* config options here */
// // // };

// // // export default nextConfig;
// // /** @type {import('next').NextConfig} */
// // const nextConfig = {
// //   eslint: {
// //     ignoreDuringBuilds: true, // Ignore ESLint issues during production build
// //   },
// //     async rewrites() {
// //     return [
// //       {
// //         source: "/api/:path*",
// //         destination: "https://swasth-hospital.onrender.com/api/:path*",
// //       },
// //     ];
// //   },
// // };

// // export default nextConfig;
// /** @type {import('next').NextConfig} */
// const nextConfig = {
//   eslint: {
//     ignoreDuringBuilds: true,
//   },

//   async rewrites() {
//     // Check environment — if local, don't rewrite
//     if (process.env.NODE_ENV === "development") {
//       return [  {
//         source: "/api/:path*",
//         destination: "http://localhost:5000/api/:path*",
//       },]; // no proxy needed for local
//     }

//     // On Vercel (production)
//     return [
//       {
//         source: "/api/:path*",
//         destination: "https://swasth-raho-qd56.vercel.app/api/:path*",
//       },
//     ];
//   },
// };

// export default nextConfig;
/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: { ignoreDuringBuilds: true },
  async rewrites() {
    if (process.env.NODE_ENV === "development") {
      return [
        {
          source: "/api/:path*",
          destination: "http://localhost:5000/api/:path*",
        },
        {
          source: "/api/chat/:path*",
          destination: "http://localhost:5000/api/chat/:path*",
        },
        {
          source: "/patient/:path*",
          destination: "http://localhost:5000/patient/:path*",
        },
        {
          source: "/doctor/:path*",
          destination: "http://localhost:5000/doctor/:path*",
        },
        {
          source: "/api/hospital/:path*",
          destination: "http://localhost:5000/api/hospital/:path*",
        },
        {
          source: "/auth/:path*",
          destination: "http://localhost:5000/auth/:path*",
        },
        {
          source: "/user/auth/:path*",
          destination: "http://localhost:5000/user/auth/:path*",
        },
        {
          source: "/super-admin/:path*",
          destination: "http://localhost:5000/super-admin/:path*",
        },
        {
          source: "/ai/:path*",
          destination: "http://localhost:5000/ai/:path*",
        },
      ];
    }

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
