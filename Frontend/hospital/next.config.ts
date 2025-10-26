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
      return [  {
        source: "/api/:path*",
        destination: "http://localhost:5000/api/:path*",
      },
       {
        source: "/patient/:path*",
        destination: "http://localhost:5000/patient/:path*",
      },
        {
        source: "/doctor/:path*",
        destination: "http://localhost:5000/doctor/:path*",
      },];

}

    return [
      {
        source: "/api/:path*",
        destination: "https://swasth-raho-qd56.vercel.app/api/:path*",
      },
      {
        source: "/patient/:path*",
        destination: "https://swasth-raho-qd56.vercel.app/patient/:path*",
      },
      {
        source: "/doctor/:path*",
        destination: "https://swasth-raho-qd56.vercel.app/doctor/:path*",
      },
    ];
  },
};

export default nextConfig;
