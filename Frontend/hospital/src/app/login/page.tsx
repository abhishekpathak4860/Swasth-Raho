// "use client";

// import React, { useState } from "react";
// import { useRouter } from "next/navigation";
// import axios from "axios";

// export default function Login() {
//   const router = useRouter();

//   // ------------------------------------------
//   // LOGIN STATES
//   // ------------------------------------------
//   const [loading, setLoading] = useState(false);
//   // Track which button is loading (normal vs google)
//   const [loadingType, setLoadingType] = useState<"normal" | "google" | null>(
//     null
//   );

//   const [role, setRole] = useState<
//     "doctor" | "patient" | "hospital_admin" | "super_admin" | ""
//   >("");

//   const [formData, setFormData] = useState({
//     email: "",
//     password: "",
//   });

//   // ------------------------------------------
//   // FORGOT PASSWORD STATES
//   // ------------------------------------------
//   const [showForgotModal, setShowForgotModal] = useState(false);
//   const [forgotStep, setForgotStep] = useState(1); // 1: Email, 2: OTP, 3: New Password
//   const [forgotLoading, setForgotLoading] = useState(false);
//   const [forgotData, setForgotData] = useState({
//     role: "",
//     email: "",
//     otp: "",
//     newPassword: "",
//     confirmPassword: "",
//   });

//   // ----------------------------------
//   // HANDLERS (INPUT CHANGES)
//   // ----------------------------------
//   const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
//     setFormData({ ...formData, [e.target.name]: e.target.value });
//   };

//   const handleForgotChange = (
//     e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
//   ) => {
//     setForgotData({ ...forgotData, [e.target.name]: e.target.value });
//   };

//   // ------------------------------------------
//   // NORMAL LOGIN SUBMIT
//   // ------------------------------------------
//   const handleSubmit = async (e: React.FormEvent) => {
//     e.preventDefault();

//     if (!role) {
//       alert("Please select a role before logging in");
//       return;
//     }

//     setLoading(true);
//     setLoadingType("normal");

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
//       // Note: loading stays true during redirect
//     } catch (err: any) {
//       alert(err.response?.data?.message || "Login failed");
//       setLoading(false);
//       setLoadingType(null);
//     }
//   };

//   // ------------------------------------------
//   // GOOGLE LOGIN HANDLER
//   // ------------------------------------------
//   const handleGoogleLogin = () => {
//     if (!role) {
//       alert("Please select a role before continuing with Google");
//       return;
//     }

//     setLoading(true);
//     setLoadingType("google");

//     // Proxy Call (Goes through Next.js Rewrite -> Backend)
//     window.location.href = `/auth/google?role=${role}`;
//   };

//   // ------------------------------------------
//   // FORGOT PASSWORD LOGIC
//   // ------------------------------------------

//   // Step 1: Send OTP
//   const handleSendOtp = async (e: React.FormEvent) => {
//     e.preventDefault();
//     if (!forgotData.role || !forgotData.email) {
//       alert("Please select role and enter email");
//       return;
//     }

//     setForgotLoading(true);
//     try {
//       await axios.post("/api/forgot-password", {
//         email: forgotData.email,
//         role: forgotData.role,
//       });
//       alert("OTP sent to your email!");
//       setForgotStep(2);
//     } catch (err: any) {
//       alert(err.response?.data?.message || "Failed to send OTP");
//     } finally {
//       setForgotLoading(false);
//     }
//   };

//   // Step 2: Verify OTP
//   const handleVerifyOtp = async (e: React.FormEvent) => {
//     e.preventDefault();
//     setForgotLoading(true);
//     try {
//       await axios.post("/api/verify-otp", {
//         email: forgotData.email,
//         role: forgotData.role,
//         otp: forgotData.otp,
//       });
//       alert("OTP Verified Successfully!");
//       setForgotStep(3);
//     } catch (err: any) {
//       alert(err.response?.data?.message || "Invalid or Expired OTP");
//     } finally {
//       setForgotLoading(false);
//     }
//   };

//   // Step 3: Reset Password
//   const handleResetPassword = async (e: React.FormEvent) => {
//     e.preventDefault();
//     if (forgotData.newPassword !== forgotData.confirmPassword) {
//       alert("Passwords do not match");
//       return;
//     }

//     setForgotLoading(true);
//     try {
//       await axios.post("/api/reset-password", {
//         email: forgotData.email,
//         role: forgotData.role,
//         newPassword: forgotData.newPassword,
//       });
//       alert("Password updated successfully! You can now login.");
//       setShowForgotModal(false);
//       setForgotStep(1); // Reset modal state
//       // Optional: Clear forgotData here if needed
//     } catch (err: any) {
//       alert(err.response?.data?.message || "Failed to reset password");
//     } finally {
//       setForgotLoading(false);
//     }
//   };

//   // ------------------------------------------
//   // HELPER COMPONENT: SPINNER
//   // ------------------------------------------
//   const Spinner = () => (
//     <svg
//       className="animate-spin -ml-1 mr-3 h-5 w-5 text-current"
//       xmlns="http://www.w3.org/2000/svg"
//       fill="none"
//       viewBox="0 0 24 24"
//     >
//       <circle
//         className="opacity-25"
//         cx="12"
//         cy="12"
//         r="10"
//         stroke="currentColor"
//         strokeWidth="4"
//       ></circle>
//       <path
//         className="opacity-75"
//         fill="currentColor"
//         d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
//       ></path>
//     </svg>
//   );

//   return (
//     <div className="min-h-screen flex justify-center items-center bg-gradient-to-br from-[#0f2027] via-[#203a43] to-[#2c5364]">
//       <div className="bg-white/10 backdrop-blur-lg border border-white/20 shadow-2xl rounded-2xl p-10 w-[90%] max-w-md relative">
//         <h2 className="text-3xl font-bold text-center mb-8 text-white tracking-wide">
//           Login to{" "}
//           <span className="bg-gradient-to-r from-cyan-400 to-green-400 bg-clip-text text-transparent">
//             Your Account
//           </span>
//         </h2>

//         {/* ---------------- LOGIN FORM ---------------- */}
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
//               disabled={loading}
//               className="w-full p-3 rounded-md bg-white/20 text-white focus:ring-2 focus:ring-cyan-400 outline-none disabled:opacity-50 disabled:cursor-not-allowed"
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
//               disabled={loading}
//               placeholder="Enter your email"
//               className="w-full p-3 rounded-md bg-white/20 text-white placeholder-gray-300 focus:ring-2 focus:ring-cyan-400 outline-none disabled:opacity-50 disabled:cursor-not-allowed"
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
//               disabled={loading}
//               placeholder="Enter your password"
//               className="w-full p-3 rounded-md bg-white/20 text-white placeholder-gray-300 focus:ring-2 focus:ring-green-400 outline-none disabled:opacity-50 disabled:cursor-not-allowed"
//               required
//             />
//           </div>

//           {/* Forgot Password Link */}
//           <div className="text-right">
//             <button
//               type="button"
//               onClick={() => setShowForgotModal(true)}
//               className="text-sm text-cyan-400 hover:text-cyan-300 hover:underline transition-colors"
//               disabled={loading}
//             >
//               Forgot Password?
//             </button>
//           </div>

//           {/* Login Button */}
//           <button
//             type="submit"
//             disabled={loading}
//             className={`w-full py-3 rounded-md text-white font-semibold flex justify-center items-center transition-all ${
//               loading
//                 ? "bg-gray-500 cursor-not-allowed opacity-70"
//                 : "bg-gradient-to-r from-cyan-500 to-green-400 hover:opacity-90"
//             }`}
//           >
//             {loading && loadingType === "normal" ? (
//               <>
//                 <Spinner /> Processing...
//               </>
//             ) : (
//               "Login"
//             )}
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
//           disabled={loading}
//           className={`w-full flex items-center justify-center gap-3 py-3 rounded-md font-semibold transition-all ${
//             loading
//               ? "bg-gray-300 text-gray-600 cursor-not-allowed"
//               : "bg-white text-black hover:bg-gray-100 cursor-pointer"
//           }`}
//         >
//           {loading && loadingType === "google" ? (
//             <>
//               <Spinner /> Connecting...
//             </>
//           ) : (
//             <>
//               <img
//                 src="https://www.svgrepo.com/show/475656/google-color.svg"
//                 alt="Google"
//                 className="w-5 h-5"
//               />
//               Continue with Google
//             </>
//           )}
//         </button>

//         {/* Register Link */}
//         <div className="text-center text-gray-300 text-sm mt-6">
//           Don’t have an account?{" "}
//           <span
//             onClick={() => !loading && router.push("/register")}
//             className={`text-cyan-400 font-semibold cursor-pointer hover:underline ${
//               loading ? "pointer-events-none opacity-50" : ""
//             }`}
//           >
//             Register
//           </span>
//         </div>
//       </div>

//       {/* ==========================================================
//           FORGOT PASSWORD MODAL
//       ========================================================== */}
//       {showForgotModal && (
//         <div className="fixed inset-0 bg-black/80 flex justify-center items-center z-50 backdrop-blur-sm">
//           <div className="bg-[#203a43] p-8 rounded-xl w-[90%] max-w-md border border-white/20 shadow-2xl text-white relative animate-fade-in-up">
//             {/* Close Button */}
//             <button
//               onClick={() => {
//                 setShowForgotModal(false);
//                 setForgotStep(1);
//               }}
//               className="absolute top-4 right-4 text-gray-400 hover:text-white transition-colors"
//             >
//               ✕
//             </button>

//             <h3 className="text-2xl font-bold mb-6 text-center tracking-wide">
//               Reset Password
//             </h3>

//             {/* ----- STEP 1: SEND OTP ----- */}
//             {forgotStep === 1 && (
//               <form onSubmit={handleSendOtp} className="space-y-4">
//                 <p className="text-sm text-gray-300 mb-4 text-center">
//                   Select your role and enter your registered email to receive an
//                   OTP.
//                 </p>

//                 <select
//                   name="role"
//                   value={forgotData.role}
//                   onChange={handleForgotChange}
//                   className="w-full p-3 rounded bg-white/10 focus:ring-2 focus:ring-cyan-400 outline-none border border-white/10"
//                   required
//                 >
//                   <option
//                     value=""
//                     disabled
//                     className="text-gray-400 bg-gray-800"
//                   >
//                     Select Role
//                   </option>
//                   <option value="doctor">Doctor</option>
//                   <option value="patient">Patient</option>
//                   <option value="hospital_admin">Hospital Admin</option>
//                   <option value="super_admin">Super Admin</option>
//                 </select>

//                 <input
//                   type="email"
//                   name="email"
//                   value={forgotData.email}
//                   onChange={handleForgotChange}
//                   placeholder="Enter your email"
//                   className="w-full p-3 rounded bg-white/10 focus:ring-2 focus:ring-cyan-400 outline-none border border-white/10"
//                   required
//                 />

//                 <button
//                   type="submit"
//                   disabled={forgotLoading}
//                   className="w-full py-3 bg-cyan-600 rounded font-bold hover:bg-cyan-500 transition-colors flex justify-center items-center"
//                 >
//                   {forgotLoading ? (
//                     <>
//                       <Spinner /> Sending...
//                     </>
//                   ) : (
//                     "Send OTP"
//                   )}
//                 </button>
//               </form>
//             )}

//             {/* ----- STEP 2: VERIFY OTP ----- */}
//             {forgotStep === 2 && (
//               <form onSubmit={handleVerifyOtp} className="space-y-4">
//                 <p className="text-sm text-green-400 mb-4 text-center">
//                   OTP sent to <strong>{forgotData.email}</strong>. Check your
//                   inbox.
//                 </p>

//                 <input
//                   type="text"
//                   name="otp"
//                   value={forgotData.otp}
//                   onChange={handleForgotChange}
//                   placeholder="Enter 6-digit OTP"
//                   className="w-full p-3 rounded bg-white/10 focus:ring-2 focus:ring-cyan-400 outline-none text-center text-xl tracking-widest border border-white/10"
//                   required
//                 />

//                 <button
//                   type="submit"
//                   disabled={forgotLoading}
//                   className="w-full py-3 bg-green-600 rounded font-bold hover:bg-green-500 transition-colors flex justify-center items-center"
//                 >
//                   {forgotLoading ? (
//                     <>
//                       <Spinner /> Verifying...
//                     </>
//                   ) : (
//                     "Verify OTP"
//                   )}
//                 </button>

//                 <button
//                   type="button"
//                   onClick={() => setForgotStep(1)}
//                   className="w-full text-sm text-gray-400 hover:text-white underline mt-2"
//                 >
//                   Wrong Email? Go Back
//                 </button>
//               </form>
//             )}

//             {/* ----- STEP 3: NEW PASSWORD ----- */}
//             {forgotStep === 3 && (
//               <form onSubmit={handleResetPassword} className="space-y-4">
//                 <p className="text-sm text-gray-300 mb-4 text-center">
//                   Create a secure new password.
//                 </p>

//                 <input
//                   type="password"
//                   name="newPassword"
//                   value={forgotData.newPassword}
//                   onChange={handleForgotChange}
//                   placeholder="New Password"
//                   className="w-full p-3 rounded bg-white/10 focus:ring-2 focus:ring-cyan-400 outline-none border border-white/10"
//                   required
//                 />

//                 <input
//                   type="password"
//                   name="confirmPassword"
//                   value={forgotData.confirmPassword}
//                   onChange={handleForgotChange}
//                   placeholder="Confirm New Password"
//                   className="w-full p-3 rounded bg-white/10 focus:ring-2 focus:ring-cyan-400 outline-none border border-white/10"
//                   required
//                 />

//                 <button
//                   type="submit"
//                   disabled={forgotLoading}
//                   className="w-full py-3 bg-gradient-to-r from-cyan-500 to-green-400 rounded font-bold hover:opacity-90 transition-colors flex justify-center items-center"
//                 >
//                   {forgotLoading ? (
//                     <>
//                       <Spinner /> Updating...
//                     </>
//                   ) : (
//                     "Update Password"
//                   )}
//                 </button>
//               </form>
//             )}
//           </div>
//         </div>
//       )}
//     </div>
//   );
// }

"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";

// --- CUSTOM TOAST COMPONENT (To replace alerts) ---
const Toast = ({
  message,
  type,
  onClose,
}: {
  message: string;
  type: "success" | "error";
  onClose: () => void;
}) => {
  return (
    <div
      className={`fixed top-5 right-5 z-60 px-6 py-4 rounded-lg shadow-2xl flex items-center gap-3 transition-all duration-300 transform translate-y-0 animate-slide-in ${
        type === "success" ? "bg-green-600 text-white" : "bg-red-600 text-white"
      }`}
    >
      <span>{type === "success" ? "✅" : "⚠️"}</span>
      <p className="font-medium">{message}</p>
      <button
        onClick={onClose}
        className="ml-4 opacity-70 hover:opacity-100 font-bold"
      >
        ✕
      </button>
    </div>
  );
};

export default function Login() {
  const router = useRouter();

  // ------------------------------------------
  // GLOBAL UI STATES
  // ------------------------------------------
  const [loading, setLoading] = useState(false);
  const [loadingType, setLoadingType] = useState<"normal" | "google" | null>(
    null
  );

  // Toast State
  const [toast, setToast] = useState<{
    show: boolean;
    message: string;
    type: "success" | "error";
  }>({
    show: false,
    message: "",
    type: "success",
  });

  const showToast = (message: string, type: "success" | "error") => {
    setToast({ show: true, message, type });
    setTimeout(() => setToast({ ...toast, show: false }), 4000); // Auto hide after 4s
  };

  // ------------------------------------------
  // LOGIN DATA
  // ------------------------------------------
  const [role, setRole] = useState<
    "doctor" | "patient" | "hospital_admin" | "super_admin" | ""
  >("");
  const [formData, setFormData] = useState({ email: "", password: "" });

  // ------------------------------------------
  // FORGOT PASSWORD STATES
  // ------------------------------------------
  const [showForgotModal, setShowForgotModal] = useState(false);
  const [forgotStep, setForgotStep] = useState(1);
  const [forgotLoading, setForgotLoading] = useState(false);
  const [resendTimer, setResendTimer] = useState(0); // Timer for Resend OTP
  const [forgotData, setForgotData] = useState({
    role: "",
    email: "",
    otp: "",
    newPassword: "",
    confirmPassword: "",
  });

  // ------------------------------------------
  // HANDLERS
  // ------------------------------------------
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleForgotChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    setForgotData({ ...forgotData, [e.target.name]: e.target.value });
  };

  // Timer Logic for Resend OTP
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (resendTimer > 0) {
      interval = setInterval(() => {
        setResendTimer((prev) => prev - 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [resendTimer]);

  // ------------------------------------------
  // ACTIONS
  // ------------------------------------------

  // Normal Login
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!role) return showToast("Please select a role first", "error");

    setLoading(true);
    setLoadingType("normal");

    try {
      const { data } = await axios.post(
        `/api/login`,
        { ...formData, role },
        { withCredentials: true }
      );
      showToast("Login Successful!", "success");

      const roleRedirects: Record<string, string> = {
        doctor: "/admin/doctor",
        patient: "/admin/patient",
        hospital_admin: "/admin/hospitalAdmin",
        super_admin: "/admin/superAdmin",
      };

      router.push(roleRedirects[data.user.role] || "/");
    } catch (err: any) {
      showToast(err.response?.data?.message || "Login failed", "error");
      setLoading(false);
      setLoadingType(null);
    }
  };

  // Google Login
  const handleGoogleLogin = () => {
    if (!role) return showToast("Select a role for Google Login", "error");
    setLoading(true);
    setLoadingType("google");
    window.location.href = `/auth/google?role=${role}`;
  };

  // ------------------------------------------
  // FORGOT PASSWORD LOGIC
  // ------------------------------------------

  // Step 1 & Resend: Send OTP
  const handleSendOtp = async (e: React.FormEvent, isResend = false) => {
    if (e) e.preventDefault();

    if (!forgotData.role || !forgotData.email) {
      return showToast("Please enter role and email", "error");
    }

    setForgotLoading(true);
    try {
      await axios.post("/api/forgot-password", {
        email: forgotData.email,
        role: forgotData.role,
      });

      showToast(
        isResend ? "OTP Resent Successfully!" : "OTP Sent to your email!",
        "success"
      );

      if (!isResend) setForgotStep(2);
      setResendTimer(30); // Start 30s timer
    } catch (err: any) {
      showToast(err.response?.data?.message || "Failed to send OTP", "error");
    } finally {
      setForgotLoading(false);
    }
  };

  // Step 2: Verify OTP
  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setForgotLoading(true);
    try {
      await axios.post("/api/verify-otp", {
        email: forgotData.email,
        role: forgotData.role,
        otp: forgotData.otp,
      });
      showToast("OTP Verified!", "success");
      setForgotStep(3);
    } catch (err: any) {
      showToast(err.response?.data?.message || "Invalid OTP", "error");
    } finally {
      setForgotLoading(false);
    }
  };

  // Step 3: Reset Password
  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (forgotData.newPassword !== forgotData.confirmPassword) {
      return showToast("Passwords do not match", "error");
    }

    setForgotLoading(true);
    try {
      await axios.post("/api/reset-password", {
        email: forgotData.email,
        role: forgotData.role,
        newPassword: forgotData.newPassword,
      });
      showToast("Password Reset Successful! Please Login.", "success");
      setShowForgotModal(false);
      setForgotStep(1);
      setForgotData({
        role: "",
        email: "",
        otp: "",
        newPassword: "",
        confirmPassword: "",
      });
    } catch (err: any) {
      showToast(
        err.response?.data?.message || "Failed to reset password",
        "error"
      );
    } finally {
      setForgotLoading(false);
    }
  };

  // Helper: Spinner
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
      {/* Toast Notification Container */}
      {toast.show && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast({ ...toast, show: false })}
        />
      )}

      <div className="bg-white/10 backdrop-blur-lg border border-white/20 shadow-2xl rounded-2xl p-10 w-[90%] max-w-md relative">
        <h2 className="text-3xl font-bold text-center mb-8 text-white tracking-wide">
          Login to{" "}
          <span className="bg-gradient-to-r from-cyan-400 to-green-400 bg-clip-text text-transparent">
            Your Account
          </span>
        </h2>

        {/* ---------------- LOGIN FORM ---------------- */}
        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Role Dropdown */}
          <div>
            <label className="block mb-1 text-gray-200 text-sm">
              Choose Role
            </label>
            <select
              value={role}
              onChange={(e) => setRole(e.target.value as any)}
              disabled={loading}
              className="w-full p-3 rounded-md bg-white/20 text-white focus:ring-2 focus:ring-cyan-400 outline-none border border-transparent focus:border-cyan-400 transition-all"
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
              className="w-full p-3 rounded-md bg-white/20 text-white placeholder-gray-300 focus:ring-2 focus:ring-cyan-400 outline-none border border-transparent focus:border-cyan-400 transition-all"
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
              className="w-full p-3 rounded-md bg-white/20 text-white placeholder-gray-300 focus:ring-2 focus:ring-green-400 outline-none border border-transparent focus:border-green-400 transition-all"
              required
            />
          </div>

          <div className="text-right">
            <button
              type="button"
              onClick={() => setShowForgotModal(true)}
              className="cursor-pointer text-sm text-cyan-400 hover:text-cyan-300 hover:underline transition-colors"
              disabled={loading}
            >
              Forgot Password?
            </button>
          </div>

          <button
            type="submit"
            disabled={loading}
            className={`w-full py-3 rounded-md text-white font-semibold flex justify-center items-center transition-all ${
              loading
                ? "bg-gray-500 cursor-not-allowed opacity-70"
                : "bg-gradient-to-r from-cyan-500 to-green-400 hover:opacity-90 hover:shadow-lg hover:shadow-cyan-500/30"
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

        <div className="flex items-center my-6">
          <div className="flex-grow border-t border-white/20" />
          <span className="mx-3 text-gray-300 text-sm">OR</span>
          <div className="flex-grow border-t border-white/20" />
        </div>

        <button
          onClick={handleGoogleLogin}
          disabled={loading}
          className={`w-full flex items-center justify-center gap-3 py-3 rounded-md font-semibold transition-all ${
            loading
              ? "bg-gray-300 text-gray-600 cursor-not-allowed"
              : "bg-white text-black hover:bg-gray-100 cursor-pointer hover:shadow-lg"
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

        <div className="text-center text-gray-300 text-sm mt-6">
          Don’t have an account?{" "}
          <span
            onClick={() => !loading && router.push("/register")}
            className="text-cyan-400 font-semibold cursor-pointer hover:underline"
          >
            Register
          </span>
        </div>
      </div>

      {/* ==========================================================
          FORGOT PASSWORD MODAL (IMPROVED DESIGN)
      ========================================================== */}
      {showForgotModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex justify-center items-start pt-20 z-50 transition-all duration-300">
          {/* Added 'animate-slide-down' for slide effect */}
          <div className="bg-[#1a2e35] p-8 rounded-2xl w-[90%] max-w-md border border-white/10 shadow-2xl text-white relative animate-[slideDown_0.4s_ease-out_forwards]">
            <button
              onClick={() => {
                setShowForgotModal(false);
                setForgotStep(1);
              }}
              className="absolute top-4 right-4 text-gray-400 hover:text-white transition-colors bg-white/10 rounded-full w-8 h-8 flex items-center justify-center"
            >
              ✕
            </button>

            <h3 className="text-2xl font-bold mb-2 text-center tracking-wide text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-green-400">
              {forgotStep === 1
                ? "Reset Password"
                : forgotStep === 2
                ? "Verify OTP"
                : "New Password"}
            </h3>
            <p className="text-center text-gray-400 text-sm mb-6">
              {forgotStep === 1 && "We will send a code to your email."}
              {forgotStep === 2 && `Sent to ${forgotData.email}`}
              {forgotStep === 3 && "Secure your account with a new password."}
            </p>

            {/* ----- STEP 1: SEND OTP ----- */}
            {forgotStep === 1 && (
              <form
                onSubmit={(e) => handleSendOtp(e, false)}
                className="space-y-4"
              >
                <select
                  name="role"
                  value={forgotData.role}
                  onChange={handleForgotChange}
                  className="w-full p-3 rounded-lg bg-black/20 focus:ring-2 focus:ring-cyan-500 outline-none border border-white/10 transition-all"
                  required
                >
                  <option value="" disabled className="bg-gray-800">
                    Select Role
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

                <input
                  type="email"
                  name="email"
                  value={forgotData.email}
                  onChange={handleForgotChange}
                  placeholder="Enter your registered email"
                  className="w-full p-3 rounded-lg bg-black/20 focus:ring-2 focus:ring-cyan-500 outline-none border border-white/10 transition-all"
                  required
                />

                <button
                  type="submit"
                  disabled={forgotLoading}
                  className="w-full py-3 bg-gradient-to-r from-cyan-600 to-cyan-500 rounded-lg font-bold hover:from-cyan-500 hover:to-cyan-400 transition-all flex justify-center items-center shadow-lg shadow-cyan-900/50"
                >
                  {forgotLoading ? (
                    <>
                      <Spinner /> Sending...
                    </>
                  ) : (
                    "Send Verification Code"
                  )}
                </button>
              </form>
            )}

            {/* ----- STEP 2: VERIFY OTP ----- */}
            {forgotStep === 2 && (
              <form onSubmit={handleVerifyOtp} className="space-y-4">
                <div className="flex flex-col gap-2">
                  <input
                    type="text"
                    name="otp"
                    value={forgotData.otp}
                    onChange={handleForgotChange}
                    placeholder="Enter 6-digit OTP"
                    maxLength={6}
                    className="w-full p-4 rounded-lg bg-black/20 focus:ring-2 focus:ring-green-500 outline-none text-center text-2xl tracking-[0.5em] border border-white/10 font-mono transition-all"
                    required
                  />
                </div>

                <button
                  type="submit"
                  disabled={forgotLoading}
                  className="w-full py-3 bg-gradient-to-r from-green-600 to-green-500 rounded-lg font-bold hover:from-green-500 hover:to-green-400 transition-all flex justify-center items-center shadow-lg shadow-green-900/50"
                >
                  {forgotLoading ? (
                    <>
                      <Spinner /> Verifying...
                    </>
                  ) : (
                    "Verify & Proceed"
                  )}
                </button>

                {/* RESEND OTP SECTION */}
                <div className="text-center mt-4">
                  {resendTimer > 0 ? (
                    <p className="text-sm text-gray-500">
                      Resend code in{" "}
                      <span className="text-cyan-400 font-mono">
                        {resendTimer}s
                      </span>
                    </p>
                  ) : (
                    <button
                      type="button"
                      onClick={(e) => handleSendOtp(e, true)}
                      disabled={forgotLoading}
                      className="text-sm text-cyan-400 hover:text-white hover:underline transition-colors"
                    >
                      Resend OTP
                    </button>
                  )}
                </div>

                <button
                  type="button"
                  onClick={() => setForgotStep(1)}
                  className="w-full text-xs text-gray-500 hover:text-gray-300 mt-2"
                >
                  Change Email?
                </button>
              </form>
            )}

            {/* ----- STEP 3: NEW PASSWORD ----- */}
            {forgotStep === 3 && (
              <form onSubmit={handleResetPassword} className="space-y-4">
                <input
                  type="password"
                  name="newPassword"
                  value={forgotData.newPassword}
                  onChange={handleForgotChange}
                  placeholder="New Password"
                  className="w-full p-3 rounded-lg bg-black/20 focus:ring-2 focus:ring-cyan-500 outline-none border border-white/10 transition-all"
                  required
                />

                <input
                  type="password"
                  name="confirmPassword"
                  value={forgotData.confirmPassword}
                  onChange={handleForgotChange}
                  placeholder="Confirm New Password"
                  className="w-full p-3 rounded-lg bg-black/20 focus:ring-2 focus:ring-cyan-500 outline-none border border-white/10 transition-all"
                  required
                />

                <button
                  type="submit"
                  disabled={forgotLoading}
                  className="w-full py-3 bg-gradient-to-r from-cyan-500 to-green-400 rounded-lg font-bold hover:opacity-90 transition-all flex justify-center items-center shadow-lg"
                >
                  {forgotLoading ? (
                    <>
                      <Spinner /> Updating...
                    </>
                  ) : (
                    "Reset Password"
                  )}
                </button>
              </form>
            )}
          </div>
        </div>
      )}

      {/* Add Custom Keyframes for Slide Down Animation */}
      <style jsx global>{`
        @keyframes slideDown {
          from {
            opacity: 0;
            transform: translateY(-50px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        @keyframes slideIn {
          from {
            opacity: 0;
            transform: translateX(100%);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }
      `}</style>
    </div>
  );
}
