// "use client";

// import React, { useState } from "react";
// import { useRouter } from "next/navigation";
// import axios from "axios";

// export default function Login() {
//   const router = useRouter();
//   const [role, setRole] = useState<
//     "doctor" | "patient" | "hospital_admin" | "super_admin"
//   >("patient");

//   const [formData, setFormData] = useState({
//     email: "",
//     password: "",
//   });

//   const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
//     setFormData({ ...formData, [e.target.name]: e.target.value });
//   };

//   const handleSubmit = async (e: React.FormEvent) => {
//     e.preventDefault();
//     try {
//       const { data } = await axios.post(
//         `/api/login`,
//         { ...formData, role },
//         { withCredentials: true }
//       );

//       const roleRedirects: Record<string, string> = {
//         doctor: "/admin/doctor",
//         patient: "/admin/patient",
//         hospital_admin: "/admin/hospitalAdmin",
//         super_admin: "/admin/superAdmin",
//       };

//       router.push(roleRedirects[data.user.role] || "/");
//     } catch (err: any) {
//       alert(err.response?.data?.message || "Login failed");
//     }
//   };

//   return (
//     <div className="min-h-screen flex justify-center items-center bg-gradient-to-br from-[#0f2027] via-[#203a43] to-[#2c5364]">
//       <div className="bg-white/10 backdrop-blur-lg border border-white/20 shadow-2xl rounded-2xl p-10 w-[90%] max-w-md">
//         <h2 className="text-3xl font-bold text-center mb-8 text-white tracking-wide">
//           Login as{" "}
//           <span className="bg-gradient-to-r from-cyan-400 to-green-400 bg-clip-text text-transparent">
//             {role
//               .split("_")
//               .map((w) => w[0].toUpperCase() + w.slice(1))
//               .join(" ")}
//           </span>
//         </h2>

//         {/* Role Tabs */}
//         <div className="flex justify-between bg-white/10 rounded-lg overflow-hidden mb-6">
//           {["doctor", "patient", "hospital_admin", "super_admin"].map((r) => (
//             <button
//               key={r}
//               type="button"
//               onClick={() => setRole(r as any)}
//               className={`flex-1 py-2 text-sm font-medium transition-all ${
//                 role === r
//                   ? "bg-gradient-to-r from-cyan-500 to-green-400 text-white shadow-md"
//                   : "text-gray-200 hover:bg-white/10"
//               }`}
//             >
//               {r
//                 .split("_")
//                 .map((w) => w[0].toUpperCase() + w.slice(1))
//                 .join(" ")}
//             </button>
//           ))}
//         </div>

//         {/* Form */}
//         <form onSubmit={handleSubmit} className="space-y-5">
//           <div>
//             <label className="block mb-1 text-gray-200 text-sm">Email</label>
//             <input
//               type="email"
//               name="email"
//               value={formData.email}
//               onChange={handleChange}
//               placeholder="Enter your email"
//               className="w-full p-3 rounded-md bg-white/20 text-white placeholder-gray-300 focus:ring-2 focus:ring-cyan-400 outline-none"
//               required
//             />
//           </div>

//           <div>
//             <label className="block mb-1 text-gray-200 text-sm">Password</label>
//             <input
//               type="password"
//               name="password"
//               value={formData.password}
//               onChange={handleChange}
//               placeholder="Enter your password"
//               className="w-full p-3 rounded-md bg-white/20 text-white placeholder-gray-300 focus:ring-2 focus:ring-green-400 outline-none"
//               required
//             />
//           </div>

//           <button
//             type="submit"
//             className="w-full py-3 rounded-md text-white font-semibold bg-gradient-to-r from-cyan-500 to-green-400 hover:opacity-90 transition-all"
//           >
//             Login
//           </button>
//         </form>

//         <div className="text-center text-gray-300 text-sm mt-5">
//           Don’t have an account?{" "}
//           <span
//             onClick={() => router.push("/register")}
//             className="text-cyan-400 font-semibold cursor-pointer hover:underline"
//           >
//             Register
//           </span>
//         </div>
//       </div>
//     </div>
//   );
// }
"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";

export default function Login() {
  const router = useRouter();
  const [role, setRole] = useState<
    "doctor" | "patient" | "hospital_admin" | "super_admin" | ""
  >("");

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!role) {
      alert("Please select a role before logging in");
      return;
    }

    try {
      const { data } = await axios.post(
        `/api/login`,
        { ...formData, role },
        { withCredentials: true }
      );

      const roleRedirects: Record<string, string> = {
        doctor: "/admin/doctor",
        patient: "/admin/patient",
        hospital_admin: "/admin/hospitalAdmin",
        super_admin: "/admin/superAdmin",
      };

      router.push(roleRedirects[data.user.role] || "/");
    } catch (err: any) {
      alert(err.response?.data?.message || "Login failed");
    }
  };

  return (
    <div className="min-h-screen flex justify-center items-center bg-gradient-to-br from-[#0f2027] via-[#203a43] to-[#2c5364]">
      <div className="bg-white/10 backdrop-blur-lg border border-white/20 shadow-2xl rounded-2xl p-10 w-[90%] max-w-md">
        <h2 className="text-3xl font-bold text-center mb-8 text-white tracking-wide">
          Login to{" "}
          <span className="bg-gradient-to-r from-cyan-400 to-green-400 bg-clip-text text-transparent">
            Your Account
          </span>
        </h2>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Role Dropdown */}
          <div>
            <label className="block mb-1 text-gray-200 text-sm">
              Choose Role
            </label>
            <select
              value={role}
              onChange={(e) =>
                setRole(
                  e.target.value as
                    | "doctor"
                    | "patient"
                    | "hospital_admin"
                    | "super_admin"
                    | ""
                )
              }
              className="w-full p-3 rounded-md bg-white/20 text-white placeholder-gray-300 focus:ring-2 focus:ring-cyan-400 outline-none"
              required
            >
              <option value="" disabled className="text-gray-400 bg-[#203a43]">
                Select your role
              </option>
              <option value="doctor" className="text-black">
                Doctor
              </option>
              <option value="patient" className="text-black">
                Patient
              </option>
              <option value="hospital_admin" className="text-black">
                Hospital Admin
              </option>
              <option value="super_admin" className="text-black">
                Super Admin
              </option>
            </select>
          </div>

          {/* Email */}
          <div>
            <label className="block mb-1 text-gray-200 text-sm">Email</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="Enter your email"
              className="w-full p-3 rounded-md bg-white/20 text-white placeholder-gray-300 focus:ring-2 focus:ring-cyan-400 outline-none"
              required
            />
          </div>

          {/* Password */}
          <div>
            <label className="block mb-1 text-gray-200 text-sm">Password</label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="Enter your password"
              className="w-full p-3 rounded-md bg-white/20 text-white placeholder-gray-300 focus:ring-2 focus:ring-green-400 outline-none"
              required
            />
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className="w-full py-3 rounded-md text-white font-semibold bg-gradient-to-r from-cyan-500 to-green-400 hover:opacity-90 transition-all"
          >
            Login
          </button>
        </form>

        {/* Register Link */}
        <div className="text-center text-gray-300 text-sm mt-5">
          Don’t have an account?{" "}
          <span
            onClick={() => router.push("/register")}
            className="text-cyan-400 font-semibold cursor-pointer hover:underline"
          >
            Register
          </span>
        </div>
      </div>
    </div>
  );
}
