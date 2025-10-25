"use client";
import React, { useState } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";

export default function Login() {
  const router = useRouter();
  const [role, setRole] = useState<"doctor" | "patient">("patient");
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  // Handle form field changes
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  // Handle submit
  // const handleSubmit = async (e: React.FormEvent) => {
  //   e.preventDefault();

  //   try {
  //     const res = await fetch(
  //       `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/login`,
  //       {
  //         method: "POST",
  //         headers: {
  //           "Content-Type": "application/json",
  //         },
  //         credentials: "include",
  //         body: JSON.stringify({ ...formData, role }),
  //       }
  //     );

  //     const data = await res.json();

  //     if (res.ok) {
  //       // Wait 50ms to ensure cookie is set
  //       setTimeout(() => {
  //         if (data.user.role === "doctor") {
  //           router.push("/admin/doctor");
  //         } else if (data.user.role === "patient") {
  //           router.push("/admin/patient");
  //         } else {
  //           router.push("/"); // fallback
  //         }
  //       }, 50);
  //     } else {
  //       alert(data.message || "Login failed");
  //     }
  //   } catch (error) {
  //     console.error(error);
  //     alert("Something went wrong!");
  //   }
  // };
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const { data } = await axios.post(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/login`,
        { ...formData, role },
        { withCredentials: true }
      );

      console.log("api data", data);

      // Use setTimeout to ensure cookie is set before redirect (optional)
      setTimeout(() => {
        if (data.user.role === "doctor") router.push("/admin/doctor");
        else if (data.user.role === "patient") router.push("/admin/patient");
      }, 50);
    } catch (error: any) {
      console.error("Login error:", error);
      const errorMessage = error.response?.data?.message || "Login failed";
      alert(errorMessage);
    }
  };
  return (
    <div className="flex justify-center items-center min-h-screen bg-gradient-to-br from-green-50 to-blue-50">
      <div className="bg-white rounded-2xl shadow-lg p-8 w-[90%] max-w-md">
        <h2 className="text-2xl font-bold text-center mb-6 text-black">
          Login as{" "}
          <span
            className={`${
              role === "doctor" ? "text-green-600" : "text-blue-600"
            }`}
          >
            {role.charAt(0).toUpperCase() + role.slice(1)}
          </span>
        </h2>

        {/* Role Switch Buttons */}
        <div className="flex justify-center mb-6 gap-3">
          <button
            type="button"
            onClick={() => setRole("doctor")}
            className={`px-4 py-2 rounded-md font-medium border ${
              role === "doctor"
                ? "bg-green-500 text-white border-green-600"
                : "border-green-500 text-green-600 hover:bg-green-100"
            }`}
          >
            Doctor
          </button>
          <button
            type="button"
            onClick={() => setRole("patient")}
            className={`px-4 py-2 rounded-md font-medium border ${
              role === "patient"
                ? "bg-blue-500 text-white border-blue-600"
                : "border-blue-500 text-blue-600 hover:bg-blue-100"
            }`}
          >
            Patient
          </button>
        </div>

        {/* Login Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block mb-1 text-gray-700">Email Address</label>
            <input
              type="email"
              name="email"
              placeholder="Enter your email"
              value={formData.email}
              onChange={handleChange}
              className="w-full p-3 border rounded-md focus:ring-2 focus:ring-blue-400 outline-none text-black"
              required
            />
          </div>

          <div>
            <label className="block mb-1 text-gray-700">Password</label>
            <input
              type="password"
              name="password"
              placeholder="Enter your password"
              value={formData.password}
              onChange={handleChange}
              className="w-full p-3 border rounded-md focus:ring-2 focus:ring-blue-400 outline-none text-black"
              required
            />
          </div>

          <button
            type="submit"
            className={`w-full py-3 rounded-md text-white font-semibold transition-all ${
              role === "doctor"
                ? "bg-green-600 hover:bg-green-700"
                : "bg-blue-600 hover:bg-blue-700"
            }`}
          >
            Login
          </button>
        </form>

        <p className="text-center text-sm text-gray-600 mt-4">
          Don’t have an account?{" "}
          <span
            onClick={() => router.push("/register")}
            className="text-blue-600 font-semibold cursor-pointer hover:underline"
          >
            Register
          </span>
        </p>
      </div>
    </div>
  );
}
