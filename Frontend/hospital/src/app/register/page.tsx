"use client";
import React, { useEffect, useState } from "react";
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
  Total_Revenue: number | 0;
  patient_ids: string[];
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

interface HospitalAdminFormData {
  name: string;
  email: string;
  password: string;
  hospital_name: string;
  hospital_address: string;
  hospital_type: string;
  total_rooms: number | "";
  ac_rooms: number | "";
  non_ac_rooms: number | "";
  connected_pharmacies: string[];
  hospital_duration: string;
  organisation_type: "government" | "private";
  role: string;
}

interface SuperAdminFormData {
  name: string;
  email: string;
  password: string;
  role: string;
}

export default function Register() {
  const router = useRouter();
  const [hospitalData, setHospitalData] = useState<any[]>([]);
  const [role, setRole] = useState<
    "doctor" | "patient" | "hospital_admin" | "super_admin" | ""
  >("");
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
    Total_Revenue: 0,
    patient_ids: [],
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

  const [formDataHospitalAdmin, setFormDataHospitalAdmin] =
    useState<HospitalAdminFormData>({
      name: "",
      email: "",
      password: "",
      hospital_name: "",
      hospital_address: "",
      hospital_type: "",
      total_rooms: "",
      ac_rooms: "",
      non_ac_rooms: "",
      connected_pharmacies: [],
      hospital_duration: "",
      organisation_type: "private",
      role: "hospital_admin",
    });

  const [formDataSuperAdmin, setFormDataSuperAdmin] =
    useState<SuperAdminFormData>({
      name: "",
      email: "",
      password: "",
      role: "super_admin",
    });

  // fetch hospital data for the doctors to choose their hospital during registrations
  const fetchHospitalData = async () => {
    try {
      const apiUrl = `/hospital/get-hospitalData`;
      const res = await axios.get(apiUrl);
      setHospitalData(res.data);
      console.log(res.data);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchHospitalData();
  }, []);
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const apiUrl = `/api/register`;
      let data;
      switch (role) {
        case "doctor":
          data = formDataDoctor;
          break;
        case "patient":
          data = formDataPatient;
          break;
        case "hospital_admin":
          data = formDataHospitalAdmin;
          break;
        case "super_admin":
          data = formDataSuperAdmin;
          break;
        default:
          throw new Error("Invalid role selected");
      }
      const res = await axios.post(apiUrl, data);
      router.push("/login");
    } catch (error: any) {
      alert(error.response?.data?.message || "Registration failed");
    }
  };

  return (
    <div className="min-h-screen flex justify-center items-center bg-gradient-to-br from-[#0f2027] via-[#203a43] to-[#2c5364]">
      <div className="bg-white/10 backdrop-blur-lg border border-white/20 shadow-2xl rounded-2xl p-10 w-[90%] max-w-md max-h-[85vh] overflow-y-auto scrollbar-thin scrollbar-thumb-cyan-400 scrollbar-track-white/10">
        <h2 className="text-3xl font-bold text-center mb-8 text-white tracking-wide">
          Register as{" "}
          <span className="bg-gradient-to-r from-cyan-400 to-green-400 bg-clip-text text-transparent">
            {role ? role.charAt(0).toUpperCase() + role.slice(1) : "User"}
          </span>
        </h2>

        {/* Role Selector */}
        <div className="mb-5">
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
        {!role && (
          <p className="text-center text-gray-200 text-sm mt-3">
            Already have an account?{" "}
            <Link
              href="/login"
              className="text-blue-600 font-semibold hover:underline"
            >
              Login
            </Link>
          </p>
        )}

        {/* Registration Form */}
        {role && (
          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block mb-1 text-gray-200 text-sm">
                Full Name
              </label>
              <input
                type="text"
                placeholder="Enter your full name"
                value={
                  role === "doctor"
                    ? formDataDoctor.name
                    : role === "patient"
                    ? formDataPatient.name
                    : role === "hospital_admin"
                    ? formDataHospitalAdmin.name
                    : formDataSuperAdmin.name
                }
                onChange={(e) => {
                  const value = e.target.value;
                  switch (role) {
                    case "doctor":
                      setFormDataDoctor({ ...formDataDoctor, name: value });
                      break;
                    case "patient":
                      setFormDataPatient({ ...formDataPatient, name: value });
                      break;
                    case "hospital_admin":
                      setFormDataHospitalAdmin({
                        ...formDataHospitalAdmin,
                        name: value,
                      });
                      break;
                    case "super_admin":
                      setFormDataSuperAdmin({
                        ...formDataSuperAdmin,
                        name: value,
                      });
                      break;
                  }
                }}
                className="w-full p-3 rounded-md bg-white/20 text-white placeholder-gray-300 focus:ring-2 focus:ring-cyan-400 outline-none"
                required
              />
            </div>

            <div>
              <label className="block mb-1 text-gray-200 text-sm">
                Email Address
              </label>
              <input
                type="email"
                placeholder="Enter your email"
                value={
                  role === "doctor"
                    ? formDataDoctor.email
                    : role === "patient"
                    ? formDataPatient.email
                    : role === "hospital_admin"
                    ? formDataHospitalAdmin.email
                    : formDataSuperAdmin.email
                }
                onChange={(e) => {
                  const value = e.target.value;
                  switch (role) {
                    case "doctor":
                      setFormDataDoctor({ ...formDataDoctor, email: value });
                      break;
                    case "patient":
                      setFormDataPatient({ ...formDataPatient, email: value });
                      break;
                    case "hospital_admin":
                      setFormDataHospitalAdmin({
                        ...formDataHospitalAdmin,
                        email: value,
                      });
                      break;
                    case "super_admin":
                      setFormDataSuperAdmin({
                        ...formDataSuperAdmin,
                        email: value,
                      });
                      break;
                  }
                }}
                className="w-full p-3 rounded-md bg-white/20 text-white placeholder-gray-300 focus:ring-2 focus:ring-cyan-400 outline-none"
                required
              />
            </div>

            <div>
              <label className="block mb-1 text-gray-200 text-sm">
                Password
              </label>
              <input
                type="password"
                name="password"
                placeholder="Enter your password"
                value={
                  role === "doctor"
                    ? formDataDoctor.password
                    : role === "patient"
                    ? formDataPatient.password
                    : role === "hospital_admin"
                    ? formDataHospitalAdmin.password
                    : formDataSuperAdmin.password
                }
                onChange={(e) => {
                  const value = e.target.value;
                  switch (role) {
                    case "doctor":
                      setFormDataDoctor({ ...formDataDoctor, password: value });
                      break;
                    case "patient":
                      setFormDataPatient({
                        ...formDataPatient,
                        password: value,
                      });
                      break;
                    case "hospital_admin":
                      setFormDataHospitalAdmin({
                        ...formDataHospitalAdmin,
                        password: value,
                      });
                      break;
                    case "super_admin":
                      setFormDataSuperAdmin({
                        ...formDataSuperAdmin,
                        password: value,
                      });
                      break;
                  }
                }}
                className="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-green-500 outline-none text-gray-200 text-sm"
                required
              />
            </div>

            {(role === "doctor" || role === "patient") && (
              <div>
                <label className="block text-gray-200 font-medium mb-1">
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
                  className="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-green-500 outline-none text-gray-200 text-sm"
                  required
                />
              </div>
            )}

            {role === "hospital_admin" && (
              <>
                <div>
                  <label className="block text-gray-200 font-medium mb-1">
                    Hospital Name
                  </label>
                  <input
                    type="text"
                    placeholder="Enter hospital name"
                    value={formDataHospitalAdmin.hospital_name}
                    onChange={(e) =>
                      setFormDataHospitalAdmin({
                        ...formDataHospitalAdmin,
                        hospital_name: e.target.value,
                      })
                    }
                    className="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-purple-500 outline-none text-gray-200 text-sm"
                    required
                  />
                </div>

                <div>
                  <label className="block text-gray-200 font-medium mb-1">
                    Hospital Address
                  </label>
                  <textarea
                    placeholder="Enter complete hospital address"
                    value={formDataHospitalAdmin.hospital_address}
                    onChange={(e) =>
                      setFormDataHospitalAdmin({
                        ...formDataHospitalAdmin,
                        hospital_address: e.target.value,
                      })
                    }
                    className="w-full p-3 rounded-md bg-white/20 text-white placeholder-gray-300 focus:ring-2 focus:ring-cyan-400 outline-none min-h-[80px]"
                    required
                  />
                </div>

                <div>
                  <label className="block mb-1 text-gray-200 text-sm">
                    Hospital Type
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Cardiology Center, Multi-Specialty"
                    value={formDataHospitalAdmin.hospital_type}
                    onChange={(e) =>
                      setFormDataHospitalAdmin({
                        ...formDataHospitalAdmin,
                        hospital_type: e.target.value,
                      })
                    }
                    className="w-full p-3 rounded-md bg-white/20 text-white placeholder-gray-300 focus:ring-2 focus:ring-cyan-400 outline-none"
                    required
                  />
                </div>

                <div className="space-y-4">
                  <div>
                    <label className="block mb-1 text-gray-200 text-sm">
                      Total Rooms
                    </label>
                    <input
                      type="number"
                      placeholder="Total rooms"
                      value={formDataHospitalAdmin.total_rooms}
                      onChange={(e) =>
                        setFormDataHospitalAdmin({
                          ...formDataHospitalAdmin,
                          total_rooms: Number(e.target.value),
                        })
                      }
                      className="w-full p-3 rounded-md bg-white/20 text-white placeholder-gray-300 focus:ring-2 focus:ring-cyan-400 outline-none"
                      required
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block mb-1 text-gray-200 text-sm">
                        AC Rooms
                      </label>
                      <input
                        type="number"
                        placeholder="AC rooms"
                        value={formDataHospitalAdmin.ac_rooms}
                        onChange={(e) =>
                          setFormDataHospitalAdmin({
                            ...formDataHospitalAdmin,
                            ac_rooms: Number(e.target.value),
                          })
                        }
                        className="w-full p-3 rounded-md bg-white/20 text-white placeholder-gray-300 focus:ring-2 focus:ring-cyan-400 outline-none"
                        required
                      />
                    </div>

                    <div>
                      <label className="block mb-1 text-gray-200 text-sm">
                        Non-AC Rooms
                      </label>
                      <input
                        type="number"
                        placeholder="Non-AC rooms"
                        value={formDataHospitalAdmin.non_ac_rooms}
                        onChange={(e) =>
                          setFormDataHospitalAdmin({
                            ...formDataHospitalAdmin,
                            non_ac_rooms: Number(e.target.value),
                          })
                        }
                        className="w-full p-3 rounded-md bg-white/20 text-white placeholder-gray-300 focus:ring-2 focus:ring-cyan-400 outline-none"
                        required
                      />
                    </div>
                  </div>
                </div>

                <div>
                  <label className="block text-gray-200 font-medium mb-1">
                    Hospital Duration
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. 24/7, 9 AM - 9 PM"
                    value={formDataHospitalAdmin.hospital_duration}
                    onChange={(e) =>
                      setFormDataHospitalAdmin({
                        ...formDataHospitalAdmin,
                        hospital_duration: e.target.value,
                      })
                    }
                    className="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-purple-500 outline-none text-gray-200 text-sm"
                    required
                  />
                </div>

                <div>
                  <label className="block text-gray-200 font-medium mb-1">
                    Organization Type
                  </label>
                  <select
                    value={formDataHospitalAdmin.organisation_type}
                    onChange={(e) =>
                      setFormDataHospitalAdmin({
                        ...formDataHospitalAdmin,
                        organisation_type: e.target.value as
                          | "government"
                          | "private",
                      })
                    }
                    className="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-purple-500 outline-none text-gray-200 text-sm"
                    required
                  >
                    <option value="private">Private</option>
                    <option value="government">Government</option>
                  </select>
                </div>

                <div>
                  <label className="block text-gray-200 font-medium mb-1">
                    Connected Pharmacies
                  </label>
                  <div className="space-y-2">
                    {formDataHospitalAdmin.connected_pharmacies.map(
                      (pharmacy, index) => (
                        <div
                          key={index}
                          className="flex items-center space-x-2"
                        >
                          <input
                            type="text"
                            value={pharmacy}
                            onChange={(e) => {
                              const newPharmacies = [
                                ...formDataHospitalAdmin.connected_pharmacies,
                              ];
                              newPharmacies[index] = e.target.value;
                              setFormDataHospitalAdmin({
                                ...formDataHospitalAdmin,
                                connected_pharmacies: newPharmacies,
                              });
                            }}
                            placeholder="Enter pharmacy name"
                            className="flex-1 p-3 rounded-md bg-white/20 text-white placeholder-gray-300 focus:ring-2 focus:ring-cyan-400 outline-none"
                          />
                          <button
                            type="button"
                            onClick={() => {
                              const newPharmacies =
                                formDataHospitalAdmin.connected_pharmacies.filter(
                                  (_, i) => i !== index
                                );
                              setFormDataHospitalAdmin({
                                ...formDataHospitalAdmin,
                                connected_pharmacies: newPharmacies,
                              });
                            }}
                            className="p-2 text-red-600 hover:bg-red-50 rounded"
                          >
                            ✕
                          </button>
                        </div>
                      )
                    )}
                    <button
                      type="button"
                      onClick={() =>
                        setFormDataHospitalAdmin({
                          ...formDataHospitalAdmin,
                          connected_pharmacies: [
                            ...formDataHospitalAdmin.connected_pharmacies,
                            "",
                          ],
                        })
                      }
                      className="text-purple-600 hover:text-purple-700 text-sm font-medium"
                    >
                      + Add Pharmacy
                    </button>
                  </div>
                </div>
              </>
            )}

            {role === "doctor" && (
              <div>
                <label className="block text-gray-200 font-medium mb-1">
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
                  className="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-green-500 outline-none text-gray-200 text-sm"
                  required
                />
              </div>
            )}

            {role === "patient" && (
              <div>
                <label className="block text-gray-200 font-medium mb-1">
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
                  className="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-green-500 outline-none text-gray-200 text-sm"
                  required
                />
              </div>
            )}

            {(role === "doctor" || role === "patient") && (
              <div>
                <label className="block text-gray-200 font-medium mb-1">
                  Contact Number
                </label>
                <input
                  type="text"
                  placeholder="Enter your contact number"
                  value={
                    role === "doctor"
                      ? formDataDoctor.contact
                      : role === "patient"
                      ? formDataPatient.contact
                      : ""
                  }
                  onChange={(e) => {
                    const value = e.target.value;
                    switch (role) {
                      case "doctor":
                        setFormDataDoctor({
                          ...formDataDoctor,
                          contact: value,
                        });
                        break;
                      case "patient":
                        setFormDataPatient({
                          ...formDataPatient,
                          contact: value,
                        });
                        break;
                    }
                  }}
                  className="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-green-500 outline-none text-gray-200 text-sm"
                  required
                />
              </div>
            )}

            {role == "doctor" && (
              <>
                {" "}
                <div>
                  <label className="block text-gray-200 font-medium mb-1">
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
                    className="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-green-500 outline-none text-gray-200 text-sm"
                    required
                  />
                </div>
                <div>
                  <label className="block text-gray-200 font-medium mb-1">
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
                    className="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-green-500 outline-none text-gray-200 text-sm"
                    required
                  />
                </div>
                {/* <div>
                  <label className="block text-gray-200 font-medium mb-1">
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
                    className="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-green-500 outline-none text-gray-200 text-sm"
                    required
                  />
                </div> */}
                <div>
                  <label className="block text-gray-200 font-medium mb-1">
                    Hospital Name
                  </label>

                  <select
                    value={formDataDoctor.hospital}
                    onChange={(e) =>
                      setFormDataDoctor({
                        ...formDataDoctor,
                        hospital: e.target.value,
                      })
                    }
                    className="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-green-500 outline-none text-gray-200 text-sm bg-gray-800"
                    required
                  >
                    <option value="">-- Select Hospital --</option>

                    {hospitalData.length > 0 ? (
                      hospitalData.map((hospital: any, index: number) => (
                        <option key={index} value={hospital.hospital_name}>
                          {hospital.hospital_name}
                        </option>
                      ))
                    ) : (
                      <option disabled>Loading hospitals...</option>
                    )}
                  </select>
                </div>
                <div>
                  <label className="block text-gray-200 font-medium mb-1">
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
                    className="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-green-500 outline-none text-gray-200 text-sm"
                    required
                  />
                </div>
              </>
            )}
            <button
              type="submit"
              className="w-full py-3 rounded-md text-white font-semibold bg-gradient-to-r from-cyan-500 to-green-400 hover:opacity-90 transition-all"
            >
              Register
            </button>

            <p className="text-center text-gray-300 text-sm mt-5">
              Already have an account?{" "}
              <Link
                href="/login"
                className="text-cyan-400 font-semibold hover:underline"
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
