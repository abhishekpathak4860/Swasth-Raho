// "use client";

// import React, { useState } from "react";
// import { useRouter } from "next/navigation";
// import axios from "axios";

// export default function Login() {
//   const router = useRouter();

//   const [role, setRole] = useState<
//     "doctor" | "patient" | "hospital_admin" | "super_admin" | ""
//   >("");

//   const [formData, setFormData] = useState({
//     email: "",
//     password: "",
//   });

//   const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
//     setFormData({ ...formData, [e.target.name]: e.target.value });
//   };

//   // -------------------------
//   // NORMAL LOGIN (EMAIL/PASSWORD)
//   // -------------------------
//   const handleSubmit = async (e: React.FormEvent) => {
//     e.preventDefault();

//     if (!role) {
//       alert("Please select a role before logging in");
//       return;
//     }

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

//   // -------------------------
//   // GOOGLE LOGIN HANDLER
//   // -------------------------
//   const handleGoogleLogin = () => {
//     if (!role) {
//       alert("Please select a role before continuing with Google");
//       return;
//     }

//     /**
//      * Backend ka Google auth start endpoint
//      * role ko query / state me bhej rahe hain
//      */
//     window.location.href = `${process.env.NEXT_PUBLIC_BACKEND_URL}/auth/google?role=${role}`;
//   };

//   return (
//     <div className="min-h-screen flex justify-center items-center bg-gradient-to-br from-[#0f2027] via-[#203a43] to-[#2c5364]">
//       <div className="bg-white/10 backdrop-blur-lg border border-white/20 shadow-2xl rounded-2xl p-10 w-[90%] max-w-md">
//         <h2 className="text-3xl font-bold text-center mb-8 text-white tracking-wide">
//           Login to{" "}
//           <span className="bg-gradient-to-r from-cyan-400 to-green-400 bg-clip-text text-transparent">
//             Your Account
//           </span>
//         </h2>

//         {/* ---------------- FORM ---------------- */}
//         <form onSubmit={handleSubmit} className="space-y-5">
//           {/* Role Dropdown */}
//           <div>
//             <label className="block mb-1 text-gray-200 text-sm">
//               Choose Role
//             </label>
//             <select
//               value={role}
//               onChange={(e) =>
//                 setRole(
//                   e.target.value as
//                     | "doctor"
//                     | "patient"
//                     | "hospital_admin"
//                     | "super_admin"
//                     | ""
//                 )
//               }
//               className="w-full p-3 rounded-md bg-white/20 text-white focus:ring-2 focus:ring-cyan-400 outline-none"
//               required
//             >
//               <option value="" disabled className="text-gray-400 bg-[#203a43]">
//                 Select your role
//               </option>
//               <option value="doctor" className="text-black">
//                 Doctor
//               </option>
//               <option value="patient" className="text-black">
//                 Patient
//               </option>
//               <option value="hospital_admin" className="text-black">
//                 Hospital Admin
//               </option>
//               <option value="super_admin" className="text-black">
//                 Super Admin
//               </option>
//             </select>
//           </div>

//           {/* Email */}
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

//           {/* Password */}
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

//           {/* Login Button */}
//           <button
//             type="submit"
//             className="w-full py-3 rounded-md text-white font-semibold bg-gradient-to-r from-cyan-500 to-green-400 hover:opacity-90 transition-all"
//           >
//             Login
//           </button>
//         </form>

//         {/* -------- OR DIVIDER -------- */}
//         <div className="flex items-center my-6">
//           <div className="flex-grow border-t border-white/20" />
//           <span className="mx-3 text-gray-300 text-sm">OR</span>
//           <div className="flex-grow border-t border-white/20" />
//         </div>

//         {/* -------- GOOGLE LOGIN -------- */}
//         <button
//           onClick={handleGoogleLogin}
//           className="cursor-pointer w-full flex items-center justify-center gap-3 py-3 rounded-md bg-white text-black font-semibold hover:bg-gray-100 transition-all"
//         >
//           <img
//             src="https://www.svgrepo.com/show/475656/google-color.svg"
//             alt="Google"
//             className="w-5 h-5"
//           />
//           Continue with Google
//         </button>

//         {/* Register Link */}
//         <div className="text-center text-gray-300 text-sm mt-6">
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

  // Loading state for UI feedback
  const [loading, setLoading] = useState(false);
  // Track which specific action is loading (to show spinner on correct button)
  const [loadingType, setLoadingType] = useState<"normal" | "google" | null>(
    null
  );

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

  // -------------------------
  // NORMAL LOGIN (EMAIL/PASSWORD)
  // -------------------------
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!role) {
      alert("Please select a role before logging in");
      return;
    }

    setLoading(true);
    setLoadingType("normal");

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
      // Note: We don't set loading false here because we want it to persist while redirecting
    } catch (err: any) {
      alert(err.response?.data?.message || "Login failed");
      setLoading(false);
      setLoadingType(null);
    }
  };

  // -------------------------
  // GOOGLE LOGIN HANDLER
  // -------------------------
  const handleGoogleLogin = () => {
    if (!role) {
      alert("Please select a role before continuing with Google");
      return;
    }

    setLoading(true);
    setLoadingType("google");

    /**
     * Backend ka Google auth start endpoint
     * role ko query / state me bhej rahe hain
     */
    // window.location.href = `${process.env.NEXT_PUBLIC_BACKEND_URL}/auth/google?role=${role}`;
    // Proxy Call (Goes through Next.js)
    window.location.href = `/auth/google?role=${role}`;
  };

  // Spinner Icon Component for cleaner code
  const Spinner = () => (
    <svg
      className="animate-spin -ml-1 mr-3 h-5 w-5 text-current"
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
    >
      <circle
        className="opacity-25"
        cx="12"
        cy="12"
        r="10"
        stroke="currentColor"
        strokeWidth="4"
      ></circle>
      <path
        className="opacity-75"
        fill="currentColor"
        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
      ></path>
    </svg>
  );

  return (
    <div className="min-h-screen flex justify-center items-center bg-gradient-to-br from-[#0f2027] via-[#203a43] to-[#2c5364]">
      <div className="bg-white/10 backdrop-blur-lg border border-white/20 shadow-2xl rounded-2xl p-10 w-[90%] max-w-md">
        <h2 className="text-3xl font-bold text-center mb-8 text-white tracking-wide">
          Login to{" "}
          <span className="bg-gradient-to-r from-cyan-400 to-green-400 bg-clip-text text-transparent">
            Your Account
          </span>
        </h2>

        {/* ---------------- FORM ---------------- */}
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
              disabled={loading}
              className="w-full p-3 rounded-md bg-white/20 text-white focus:ring-2 focus:ring-cyan-400 outline-none disabled:opacity-50 disabled:cursor-not-allowed"
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
              disabled={loading}
              placeholder="Enter your email"
              className="w-full p-3 rounded-md bg-white/20 text-white placeholder-gray-300 focus:ring-2 focus:ring-cyan-400 outline-none disabled:opacity-50 disabled:cursor-not-allowed"
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
              disabled={loading}
              placeholder="Enter your password"
              className="w-full p-3 rounded-md bg-white/20 text-white placeholder-gray-300 focus:ring-2 focus:ring-green-400 outline-none disabled:opacity-50 disabled:cursor-not-allowed"
              required
            />
          </div>

          {/* Login Button */}
          <button
            type="submit"
            disabled={loading}
            className={`w-full py-3 rounded-md text-white font-semibold flex justify-center items-center transition-all ${
              loading
                ? "bg-gray-500 cursor-not-allowed opacity-70"
                : "bg-gradient-to-r from-cyan-500 to-green-400 hover:opacity-90"
            }`}
          >
            {loading && loadingType === "normal" ? (
              <>
                <Spinner /> Processing...
              </>
            ) : (
              "Login"
            )}
          </button>
        </form>

        {/* -------- OR DIVIDER -------- */}
        <div className="flex items-center my-6">
          <div className="flex-grow border-t border-white/20" />
          <span className="mx-3 text-gray-300 text-sm">OR</span>
          <div className="flex-grow border-t border-white/20" />
        </div>

        {/* -------- GOOGLE LOGIN -------- */}
        <button
          onClick={handleGoogleLogin}
          disabled={loading}
          className={`w-full flex items-center justify-center gap-3 py-3 rounded-md font-semibold transition-all ${
            loading
              ? "bg-gray-300 text-gray-600 cursor-not-allowed"
              : "bg-white text-black hover:bg-gray-100 cursor-pointer"
          }`}
        >
          {loading && loadingType === "google" ? (
            <>
              <Spinner /> Connecting...
            </>
          ) : (
            <>
              <img
                src="https://www.svgrepo.com/show/475656/google-color.svg"
                alt="Google"
                className="w-5 h-5"
              />
              Continue with Google
            </>
          )}
        </button>

        {/* Register Link */}
        <div className="text-center text-gray-300 text-sm mt-6">
          Don’t have an account?{" "}
          <span
            onClick={() => !loading && router.push("/register")}
            className={`text-cyan-400 font-semibold cursor-pointer hover:underline ${
              loading ? "pointer-events-none opacity-50" : ""
            }`}
          >
            Register
          </span>
        </div>
      </div>
    </div>
  );
}
