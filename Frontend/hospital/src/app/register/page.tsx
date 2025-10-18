"use client";
import React, { useState } from "react";
import axios from "axios";
import Link from "next/link";
import { useRouter } from "next/navigation";

interface DoctorFormData {
  name: string;
  email: string;
  password: string;
  age: number | "";
  type: string;
  contact: string;
  role: string;
  experience: string;
  education: string;
  hospital: string;
  consultationFee: string;
}

interface PatientFormData {
  name: string;
  email: string;
  password: string;
  age: number | "";
  location: string;
  contact: string;
  role: string;
}

export default function Register() {
  const router = useRouter();
  const [role, setRole] = useState<"doctor" | "patient" | "">("");
  const [formDataDoctor, setFormDataDoctor] = useState<DoctorFormData>({
    name: "",
    email: "",
    password: "",
    age: "",
    type: "",
    contact: "",
    role: "doctor",
    experience: "",
    education: "",
    hospital: "",
    consultationFee: "",
  });

  const [formDataPatient, setFormDataPatient] = useState<PatientFormData>({
    name: "",
    email: "",
    password: "",
    age: "",
    location: "",
    contact: "",
    role: "patient",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const apiUrl = "http://localhost:5000/api/register";
      const data = role === "doctor" ? formDataDoctor : formDataPatient;
      const res = await axios.post(apiUrl, data);
      // alert(res.data.message);
      router.push("/login");
    } catch (error: any) {
      alert(error.response?.data?.message || "Registration failed");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 flex items-center justify-center px-4 py-6">
      <div className="bg-white shadow-2xl rounded-2xl p-6 sm:p-8 w-full max-w-md sm:max-w-lg max-h-[90vh] overflow-y-auto">
        <h2 className="text-2xl sm:text-3xl font-bold text-center text-gray-800 mb-5">
          Register as{" "}
          <span className="bg-gradient-to-r from-green-600 to-blue-600 bg-clip-text text-transparent">
            {role ? role.charAt(0).toUpperCase() + role.slice(1) : "User"}
          </span>
        </h2>

        {/* Role Selector */}
        <div className="flex justify-center mb-5 gap-4">
          <button
            onClick={() => setRole("doctor")}
            className={`px-5 py-2 rounded-lg font-semibold text-sm sm:text-base transition ${
              role === "doctor"
                ? "bg-green-600 text-white"
                : "border border-green-600 text-green-600 hover:bg-green-50"
            }`}
          >
            Doctor
          </button>
          <button
            onClick={() => setRole("patient")}
            className={`px-5 py-2 rounded-lg font-semibold text-sm sm:text-base transition ${
              role === "patient"
                ? "bg-blue-600 text-white"
                : "border border-blue-600 text-blue-600 hover:bg-blue-50"
            }`}
          >
            Patient
          </button>
        </div>
        <p className="text-center text-gray-700 text-sm mt-3">
          Already have an account?{" "}
          <Link
            href="/login"
            className="text-blue-600 font-semibold hover:underline"
          >
            Login
          </Link>
        </p>

        {/* Registration Form */}
        {role && (
          <form onSubmit={handleSubmit} className="space-y-3">
            <div>
              <label className="block text-gray-700 font-medium mb-1">
                Full Name
              </label>
              <input
                type="text"
                placeholder="Enter your full name"
                value={
                  role === "doctor" ? formDataDoctor.name : formDataPatient.name
                }
                onChange={(e) =>
                  role === "doctor"
                    ? setFormDataDoctor({
                        ...formDataDoctor,
                        name: e.target.value,
                      })
                    : setFormDataPatient({
                        ...formDataPatient,
                        name: e.target.value,
                      })
                }
                className="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-green-500 outline-none text-black text-sm"
                required
              />
            </div>

            <div>
              <label className="block text-gray-700 font-medium mb-1">
                Email Address
              </label>
              <input
                type="email"
                placeholder="Enter your email"
                value={
                  role === "doctor"
                    ? formDataDoctor.email
                    : formDataPatient.email
                }
                onChange={(e) =>
                  role === "doctor"
                    ? setFormDataDoctor({
                        ...formDataDoctor,
                        email: e.target.value,
                      })
                    : setFormDataPatient({
                        ...formDataPatient,
                        email: e.target.value,
                      })
                }
                className="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-green-500 outline-none text-black text-sm"
                required
              />
            </div>

            <div>
              <label className="block text-gray-700 font-medium mb-1">
                Password
              </label>
              <input
                type="password"
                placeholder="Enter your password"
                value={
                  role === "doctor"
                    ? formDataDoctor.password
                    : formDataPatient.password
                }
                onChange={(e) =>
                  role === "doctor"
                    ? setFormDataDoctor({
                        ...formDataDoctor,
                        password: e.target.value,
                      })
                    : setFormDataPatient({
                        ...formDataPatient,
                        password: e.target.value,
                      })
                }
                className="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-green-500 outline-none text-black text-sm"
                required
              />
            </div>

            <div>
              <label className="block text-gray-700 font-medium mb-1">
                Age
              </label>
              <input
                type="number"
                placeholder="Enter your age"
                value={
                  role === "doctor" ? formDataDoctor.age : formDataPatient.age
                }
                onChange={(e) =>
                  role === "doctor"
                    ? setFormDataDoctor({
                        ...formDataDoctor,
                        age: Number(e.target.value),
                      })
                    : setFormDataPatient({
                        ...formDataPatient,
                        age: Number(e.target.value),
                      })
                }
                className="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-green-500 outline-none text-black text-sm"
                required
              />
            </div>

            {role === "doctor" ? (
              <div>
                <label className="block text-gray-700 font-medium mb-1">
                  Specialization Type
                </label>
                <input
                  type="text"
                  placeholder="e.g. Eye Specialist"
                  value={formDataDoctor.type}
                  onChange={(e) =>
                    setFormDataDoctor({
                      ...formDataDoctor,
                      type: e.target.value,
                    })
                  }
                  className="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-green-500 outline-none text-black text-sm"
                  required
                />
              </div>
            ) : (
              <div>
                <label className="block text-gray-700 font-medium mb-1">
                  Location
                </label>
                <input
                  type="text"
                  placeholder="Enter your location"
                  value={formDataPatient.location}
                  onChange={(e) =>
                    setFormDataPatient({
                      ...formDataPatient,
                      location: e.target.value,
                    })
                  }
                  className="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-green-500 outline-none text-black text-sm"
                  required
                />
              </div>
            )}

            <div>
              <label className="block text-gray-700 font-medium mb-1">
                Contact Number
              </label>
              <input
                type="text"
                placeholder="Enter your contact number"
                value={
                  role === "doctor"
                    ? formDataDoctor.contact
                    : formDataPatient.contact
                }
                onChange={(e) =>
                  role === "doctor"
                    ? setFormDataDoctor({
                        ...formDataDoctor,
                        contact: e.target.value,
                      })
                    : setFormDataPatient({
                        ...formDataPatient,
                        contact: e.target.value,
                      })
                }
                className="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-green-500 outline-none text-black text-sm"
                required
              />
            </div>

            {role == "doctor" && (
              <>
                {" "}
                <div>
                  <label className="block text-gray-700 font-medium mb-1">
                    Experience
                  </label>
                  <input
                    type="text"
                    placeholder="e.g.15 years"
                    value={formDataDoctor.experience}
                    onChange={(e) =>
                      setFormDataDoctor({
                        ...formDataDoctor,
                        experience: e.target.value,
                      })
                    }
                    className="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-green-500 outline-none text-black text-sm"
                    required
                  />
                </div>
                <div>
                  <label className="block text-gray-700 font-medium mb-1">
                    Education
                  </label>
                  <input
                    type="text"
                    placeholder="e.g.MBBS, MD Cardiology"
                    value={formDataDoctor.education}
                    onChange={(e) =>
                      setFormDataDoctor({
                        ...formDataDoctor,
                        education: e.target.value,
                      })
                    }
                    className="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-green-500 outline-none text-black text-sm"
                    required
                  />
                </div>
                <div>
                  <label className="block text-gray-700 font-medium mb-1">
                    Hospital Name
                  </label>
                  <input
                    type="text"
                    placeholder="e.g.Heart Care Centre"
                    value={formDataDoctor.hospital}
                    onChange={(e) =>
                      setFormDataDoctor({
                        ...formDataDoctor,
                        hospital: e.target.value,
                      })
                    }
                    className="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-green-500 outline-none text-black text-sm"
                    required
                  />
                </div>
                <div>
                  <label className="block text-gray-700 font-medium mb-1">
                    Consultation Fee
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. 1500"
                    value={formDataDoctor.consultationFee}
                    onChange={(e) =>
                      setFormDataDoctor({
                        ...formDataDoctor,
                        consultationFee: e.target.value,
                      })
                    }
                    className="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-green-500 outline-none text-black text-sm"
                    required
                  />
                </div>
              </>
            )}
            <button
              type="submit"
              className="w-full bg-gradient-to-r from-green-600 to-blue-600 text-white py-2 rounded-lg font-semibold text-sm hover:opacity-90 transition"
            >
              Register
            </button>

            <p className="text-center text-gray-700 text-sm mt-3">
              Already have an account?{" "}
              <Link
                href="/login"
                className="text-blue-600 font-semibold hover:underline"
              >
                Login
              </Link>
            </p>
          </form>
        )}
      </div>
    </div>
  );
}
