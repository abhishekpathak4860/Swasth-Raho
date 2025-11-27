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
  profileImg: string;
}

interface PatientFormData {
  name: string;
  email: string;
  password: string;
  age: number | "";
  location: string;
  contact: string;
  role: string;
  profileImg: string;
}

export interface HospitalAdminFormData {
  _id: string;
  name: string;
  email: string;
  password: string;
  hospital_name: string;
  hospital_type: string;
  hospital_description: string;
  year_established: number | "";
  hospital_address: string;
  contact_number: string;
  emergency_number: string;
  hospital_duration: string;
  organisation_type: "government" | "private";
  total_rooms: number | "";
  ac_rooms: number | "";
  non_ac_rooms: number | "";
  icu_beds: number | "";
  ambulances: number | "";
  departments: string[];
  lab_facilities: string[];
  connected_pharmacies: string[];
  payment_modes: string[];
  insurance_partners: string[];
  emergency_available: boolean;
  teleconsultation_available: boolean;
  parking_available: boolean;
  canteen_available: boolean;
  accreditation: string;
  license_number: string;
  rating: number | "";
  total_reviews: number | "";
  role: string;
  Total_Revenue_Hospital: number;
  profileImg: string;
}

interface SuperAdminFormData {
  name: string;
  email: string;
  password: string;
  role: string;
  profileImg: string;
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
    profileImg: "",
  });

  const [formDataPatient, setFormDataPatient] = useState<PatientFormData>({
    name: "",
    email: "",
    password: "",
    age: "",
    location: "",
    contact: "",
    role: "patient",
    profileImg: "",
  });

  const [formDataHospitalAdmin, setFormDataHospitalAdmin] =
    useState<HospitalAdminFormData>({
      _id: "",
      name: "",
      email: "",
      password: "",
      hospital_name: "",
      hospital_type: "",
      hospital_description: "",
      year_established: "",
      hospital_address: "",
      contact_number: "",
      emergency_number: "",
      hospital_duration: "",
      organisation_type: "private",
      total_rooms: 0,
      ac_rooms: 0,
      non_ac_rooms: 0,
      icu_beds: 0,
      ambulances: 0,
      departments: [],
      lab_facilities: [],
      connected_pharmacies: [],
      payment_modes: [],
      insurance_partners: [],
      emergency_available: false,
      teleconsultation_available: false,
      parking_available: false,
      canteen_available: false,
      accreditation: "",
      license_number: "",
      rating: 0,
      total_reviews: 0,
      role: "hospital_admin",
      Total_Revenue_Hospital: 0,
      profileImg: "",
    });

  const [formDataSuperAdmin, setFormDataSuperAdmin] =
    useState<SuperAdminFormData>({
      name: "",
      email: "",
      password: "",
      role: "super_admin",
      profileImg: "",
    });

  // Image upload state
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string>("");
  const [uploadProgress, setUploadProgress] = useState<number>(0);
  const [isUploading, setIsUploading] = useState<boolean>(false);
  const [isUploaded, setIsUploaded] = useState<boolean>(false);
  const [uploadedImageUrl, setUploadedImageUrl] = useState<string>("");

  // Cloudinary config (fallbacks to values you provided if not set in env)

  const CLOUDINARY_CLOUD_NAME =
    process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME || "dwqf8u53j";
  const CLOUDINARY_UPLOAD_PRESET =
    process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET || "image_upload";
  const CLOUDINARY_FOLDER =
    process.env.NEXT_PUBLIC_CLOUDINARY_FOLDER || "swasthRaho_profile";

  // fetch hospital data for the doctors to choose their hospital during registrations
  const fetchHospitalData = async () => {
    try {
      const apiUrl = `/api/hospital/get-hospitalData`;
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

  // Reset image states when role changes
  useEffect(() => {
    setSelectedFile(null);
    setPreviewUrl("");
    setUploadProgress(0);
    setIsUploading(false);
    setIsUploaded(false);
    setUploadedImageUrl("");
  }, [role]);
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    // If an image is chosen but not uploaded yet, block registration
    if (selectedFile && !isUploaded) {
      alert("Please upload the selected image before registering.");
      return;
    }
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

  const handleFileSelected = (file?: File | null) => {
    if (!file) {
      setSelectedFile(null);
      if (previewUrl) URL.revokeObjectURL(previewUrl);
      setPreviewUrl("");
      setIsUploaded(false);
      setUploadedImageUrl("");
      return;
    }
    setSelectedFile(file);
    if (previewUrl) URL.revokeObjectURL(previewUrl);
    setPreviewUrl(URL.createObjectURL(file));
    setIsUploaded(false);
    setUploadedImageUrl("");
    setUploadProgress(0);
  };

  const uploadImageToCloudinary = async () => {
    if (!selectedFile) {
      alert("Please select an image to upload.");
      return;
    }

    try {
      setIsUploading(true);
      const cloudinaryUrl = `https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD_NAME}/image/upload`;
      const body = new FormData();
      body.append("file", selectedFile as File);
      body.append("upload_preset", CLOUDINARY_UPLOAD_PRESET);
      body.append("folder", CLOUDINARY_FOLDER);

      const res = await axios.post(cloudinaryUrl, body, {
        headers: { "Content-Type": "multipart/form-data" },
        onUploadProgress: (progressEvent) => {
          if (progressEvent.total)
            setUploadProgress(
              Math.round((progressEvent.loaded / progressEvent.total) * 100)
            );
        },
      });

      const secureUrl = res.data.secure_url || res.data.url;
      setUploadedImageUrl(secureUrl);
      console.log(secureUrl);
      setIsUploaded(true);
      // Attach uploaded url to the correct form data depending on role
      switch (role) {
        case "doctor":
          setFormDataDoctor({ ...formDataDoctor, profileImg: secureUrl });
          break;
        case "patient":
          setFormDataPatient({ ...formDataPatient, profileImg: secureUrl });
          break;
        case "hospital_admin":
          setFormDataHospitalAdmin({
            ...formDataHospitalAdmin,
            profileImg: secureUrl,
          });
          break;
        case "super_admin":
          setFormDataSuperAdmin({
            ...formDataSuperAdmin,
            profileImg: secureUrl,
          });
          break;
      }
    } catch (error) {
      console.error("Upload failed:", error);
      alert("Image upload failed. Please try again.");
    } finally {
      setIsUploading(false);
    }
  };
  // scrollbar-thin scrollbar-thumb-gray-400 scrollbar-track-gray-200

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

            {/* Profile Image Upload */}
            <div>
              <label className="block mb-1 text-gray-200 text-sm">
                Profile Image (optional)
              </label>
              <div className="flex items-center gap-2">
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) =>
                    handleFileSelected(
                      e.target.files ? e.target.files[0] : null
                    )
                  }
                  className="text-gray-300"
                />

                {!isUploaded ? (
                  <button
                    type="button"
                    onClick={uploadImageToCloudinary}
                    disabled={!selectedFile || isUploading}
                    className={`px-3 py-2 rounded-md text-sm font-semibold text-white bg-gradient-to-r from-cyan-500 to-green-400 hover:opacity-90 transition-all ${
                      (!selectedFile || isUploading) &&
                      "opacity-50 cursor-not-allowed"
                    }`}
                  >
                    {isUploading
                      ? `Uploading (${uploadProgress}%)`
                      : "Upload Image"}
                  </button>
                ) : (
                  <div className="flex items-center gap-2">
                    <span className="px-3 py-2 rounded-md text-sm font-semibold text-white bg-green-600/80">
                      Uploaded
                    </span>
                    <button
                      type="button"
                      onClick={() => {
                        // allow re-upload
                        if (uploadedImageUrl) {
                          // clear the stored uploaded url
                          setUploadedImageUrl("");
                        }
                        setIsUploaded(false);
                        setUploadProgress(0);
                      }}
                      className="px-3 py-2 rounded-md text-sm font-semibold text-white bg-gradient-to-r from-yellow-400 to-orange-400 hover:opacity-90 transition-all"
                    >
                      Re-upload
                    </button>
                  </div>
                )}

                {selectedFile && !isUploaded && (
                  <button
                    type="button"
                    onClick={() => handleFileSelected(null)}
                    className="px-2 py-1 rounded-md text-sm text-red-400 bg-white/10 hover:bg-white/20"
                  >
                    Remove
                  </button>
                )}
              </div>

              {isUploaded && uploadedImageUrl ? (
                <div className="mt-2">
                  <img
                    src={uploadedImageUrl}
                    alt="Uploaded"
                    className="w-24 h-24 object-cover rounded-full border border-white/20"
                  />
                </div>
              ) : previewUrl ? (
                <div className="mt-2">
                  <img
                    src={previewUrl}
                    alt="Preview"
                    className="w-24 h-24 object-cover rounded-full border border-white/20"
                  />
                </div>
              ) : null}
              <p className="text-xs text-gray-300 mt-2">
                {selectedFile
                  ? "Please upload the image before registering (required if a file is selected)."
                  : "You may register without a profile image."}
              </p>
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
              <div className="space-y-6">
                {/* Basic Information Section */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-cyan-400 mb-3 border-b border-cyan-400/30 pb-1">
                    Basic Information
                  </h3>

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
                      className="w-full p-3 rounded-md bg-white/20 text-white placeholder-gray-300 focus:ring-2 focus:ring-cyan-400 outline-none"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-gray-200 font-medium mb-1">
                      Hospital Type
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. Neurology, Multi-Specialty"
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

                  <div>
                    <label className="block text-gray-200 font-medium mb-1">
                      Hospital Description
                    </label>
                    <textarea
                      placeholder="Brief description of your hospital"
                      value={formDataHospitalAdmin.hospital_description}
                      onChange={(e) =>
                        setFormDataHospitalAdmin({
                          ...formDataHospitalAdmin,
                          hospital_description: e.target.value,
                        })
                      }
                      className="w-full p-3 rounded-md bg-white/20 text-white placeholder-gray-300 focus:ring-2 focus:ring-cyan-400 outline-none min-h-[80px]"
                      required
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-gray-200 font-medium mb-1">
                        Year Established
                      </label>
                      <input
                        type="number"
                        placeholder="e.g. 2010"
                        value={formDataHospitalAdmin.year_established}
                        onChange={(e) =>
                          setFormDataHospitalAdmin({
                            ...formDataHospitalAdmin,
                            year_established: Number(e.target.value),
                          })
                        }
                        className="w-full p-3 rounded-md bg-white/20 text-white placeholder-gray-300 focus:ring-2 focus:ring-cyan-400 outline-none"
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
                        className="w-full p-3 rounded-md bg-white/20 text-white focus:ring-2 focus:ring-cyan-400 outline-none"
                        required
                      >
                        <option value="private">Private</option>
                        <option value="government">Government</option>
                      </select>
                    </div>
                  </div>
                </div>

                {/* Contact Information Section */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-cyan-400 mb-3 border-b border-cyan-400/30 pb-1">
                    Contact Information
                  </h3>

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

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-gray-200 font-medium mb-1">
                        Contact Number
                      </label>
                      <input
                        type="text"
                        placeholder="+91-9876543210"
                        value={formDataHospitalAdmin.contact_number}
                        onChange={(e) =>
                          setFormDataHospitalAdmin({
                            ...formDataHospitalAdmin,
                            contact_number: e.target.value,
                          })
                        }
                        className="w-full p-3 rounded-md bg-white/20 text-white placeholder-gray-300 focus:ring-2 focus:ring-cyan-400 outline-none"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-gray-200 font-medium mb-1">
                        Emergency Number
                      </label>
                      <input
                        type="text"
                        placeholder="+91-9999999999"
                        value={formDataHospitalAdmin.emergency_number}
                        onChange={(e) =>
                          setFormDataHospitalAdmin({
                            ...formDataHospitalAdmin,
                            emergency_number: e.target.value,
                          })
                        }
                        className="w-full p-3 rounded-md bg-white/20 text-white placeholder-gray-300 focus:ring-2 focus:ring-cyan-400 outline-none"
                        required
                      />
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
                      className="w-full p-3 rounded-md bg-white/20 text-white placeholder-gray-300 focus:ring-2 focus:ring-cyan-400 outline-none"
                      required
                    />
                  </div>
                </div>

                {/* Facility Information Section */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-cyan-400 mb-3 border-b border-cyan-400/30 pb-1">
                    Facility Information
                  </h3>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-gray-200 font-medium mb-1">
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

                    <div>
                      <label className="block text-gray-200 font-medium mb-1">
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
                      <label className="block text-gray-200 font-medium mb-1">
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

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-gray-200 font-medium mb-1">
                        ICU Beds
                      </label>
                      <input
                        type="number"
                        placeholder="ICU beds available"
                        value={formDataHospitalAdmin.icu_beds}
                        onChange={(e) =>
                          setFormDataHospitalAdmin({
                            ...formDataHospitalAdmin,
                            icu_beds: Number(e.target.value),
                          })
                        }
                        className="w-full p-3 rounded-md bg-white/20 text-white placeholder-gray-300 focus:ring-2 focus:ring-cyan-400 outline-none"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-gray-200 font-medium mb-1">
                        Ambulances
                      </label>
                      <input
                        type="number"
                        placeholder="Number of ambulances"
                        value={formDataHospitalAdmin.ambulances}
                        onChange={(e) =>
                          setFormDataHospitalAdmin({
                            ...formDataHospitalAdmin,
                            ambulances: Number(e.target.value),
                          })
                        }
                        className="w-full p-3 rounded-md bg-white/20 text-white placeholder-gray-300 focus:ring-2 focus:ring-cyan-400 outline-none"
                        required
                      />
                    </div>
                  </div>
                </div>

                {/* Departments and Services Section */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-cyan-400 mb-3 border-b border-cyan-400/30 pb-1">
                    Departments & Services
                  </h3>

                  <div>
                    <label className="block text-gray-200 font-medium mb-1">
                      Departments
                    </label>
                    <div className="space-y-2">
                      {formDataHospitalAdmin.departments.map((dept, index) => (
                        <div
                          key={index}
                          className="flex items-center space-x-2"
                        >
                          <input
                            type="text"
                            value={dept}
                            onChange={(e) => {
                              const newDepts = [
                                ...formDataHospitalAdmin.departments,
                              ];
                              newDepts[index] = e.target.value;
                              setFormDataHospitalAdmin({
                                ...formDataHospitalAdmin,
                                departments: newDepts,
                              });
                            }}
                            placeholder="Enter department name"
                            className="flex-1 p-3 rounded-md bg-white/20 text-white placeholder-gray-300 focus:ring-2 focus:ring-cyan-400 outline-none"
                          />
                          <button
                            type="button"
                            onClick={() => {
                              const newDepts =
                                formDataHospitalAdmin.departments.filter(
                                  (_, i) => i !== index
                                );
                              setFormDataHospitalAdmin({
                                ...formDataHospitalAdmin,
                                departments: newDepts,
                              });
                            }}
                            className="p-2 text-red-400 hover:text-red-300 rounded"
                          >
                            ✕
                          </button>
                        </div>
                      ))}
                      <button
                        type="button"
                        onClick={() =>
                          setFormDataHospitalAdmin({
                            ...formDataHospitalAdmin,
                            departments: [
                              ...formDataHospitalAdmin.departments,
                              "",
                            ],
                          })
                        }
                        className="text-cyan-400 hover:text-cyan-300 text-sm font-medium"
                      >
                        + Add Department
                      </button>
                    </div>
                  </div>

                  <div>
                    <label className="block text-gray-200 font-medium mb-1">
                      Lab Facilities
                    </label>
                    <div className="space-y-2">
                      {formDataHospitalAdmin.lab_facilities.map(
                        (lab, index) => (
                          <div
                            key={index}
                            className="flex items-center space-x-2"
                          >
                            <input
                              type="text"
                              value={lab}
                              onChange={(e) => {
                                const newLabs = [
                                  ...formDataHospitalAdmin.lab_facilities,
                                ];
                                newLabs[index] = e.target.value;
                                setFormDataHospitalAdmin({
                                  ...formDataHospitalAdmin,
                                  lab_facilities: newLabs,
                                });
                              }}
                              placeholder="Enter lab facility"
                              className="flex-1 p-3 rounded-md bg-white/20 text-white placeholder-gray-300 focus:ring-2 focus:ring-cyan-400 outline-none"
                            />
                            <button
                              type="button"
                              onClick={() => {
                                const newLabs =
                                  formDataHospitalAdmin.lab_facilities.filter(
                                    (_, i) => i !== index
                                  );
                                setFormDataHospitalAdmin({
                                  ...formDataHospitalAdmin,
                                  lab_facilities: newLabs,
                                });
                              }}
                              className="p-2 text-red-400 hover:text-red-300 rounded"
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
                            lab_facilities: [
                              ...formDataHospitalAdmin.lab_facilities,
                              "",
                            ],
                          })
                        }
                        className="text-cyan-400 hover:text-cyan-300 text-sm font-medium"
                      >
                        + Add Lab Facility
                      </button>
                    </div>
                  </div>
                </div>

                {/* Connected Services Section */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-cyan-400 mb-3 border-b border-cyan-400/30 pb-1">
                    Connected Services
                  </h3>

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
                              className="p-2 text-red-400 hover:text-red-300 rounded"
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
                        className="text-cyan-400 hover:text-cyan-300 text-sm font-medium"
                      >
                        + Add Pharmacy
                      </button>
                    </div>
                  </div>

                  <div>
                    <label className="block text-gray-200 font-medium mb-1">
                      Payment Modes
                    </label>
                    <div className="space-y-2">
                      {formDataHospitalAdmin.payment_modes.map(
                        (mode, index) => (
                          <div
                            key={index}
                            className="flex items-center space-x-2"
                          >
                            <input
                              type="text"
                              value={mode}
                              onChange={(e) => {
                                const newModes = [
                                  ...formDataHospitalAdmin.payment_modes,
                                ];
                                newModes[index] = e.target.value;
                                setFormDataHospitalAdmin({
                                  ...formDataHospitalAdmin,
                                  payment_modes: newModes,
                                });
                              }}
                              placeholder="Enter payment mode"
                              className="flex-1 p-3 rounded-md bg-white/20 text-white placeholder-gray-300 focus:ring-2 focus:ring-cyan-400 outline-none"
                            />
                            <button
                              type="button"
                              onClick={() => {
                                const newModes =
                                  formDataHospitalAdmin.payment_modes.filter(
                                    (_, i) => i !== index
                                  );
                                setFormDataHospitalAdmin({
                                  ...formDataHospitalAdmin,
                                  payment_modes: newModes,
                                });
                              }}
                              className="p-2 text-red-400 hover:text-red-300 rounded"
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
                            payment_modes: [
                              ...formDataHospitalAdmin.payment_modes,
                              "",
                            ],
                          })
                        }
                        className="text-cyan-400 hover:text-cyan-300 text-sm font-medium"
                      >
                        + Add Payment Mode
                      </button>
                    </div>
                  </div>

                  <div>
                    <label className="block text-gray-200 font-medium mb-1">
                      Insurance Partners
                    </label>
                    <div className="space-y-2">
                      {formDataHospitalAdmin.insurance_partners.map(
                        (partner, index) => (
                          <div
                            key={index}
                            className="flex items-center space-x-2"
                          >
                            <input
                              type="text"
                              value={partner}
                              onChange={(e) => {
                                const newPartners = [
                                  ...formDataHospitalAdmin.insurance_partners,
                                ];
                                newPartners[index] = e.target.value;
                                setFormDataHospitalAdmin({
                                  ...formDataHospitalAdmin,
                                  insurance_partners: newPartners,
                                });
                              }}
                              placeholder="Enter insurance partner"
                              className="flex-1 p-3 rounded-md bg-white/20 text-white placeholder-gray-300 focus:ring-2 focus:ring-cyan-400 outline-none"
                            />
                            <button
                              type="button"
                              onClick={() => {
                                const newPartners =
                                  formDataHospitalAdmin.insurance_partners.filter(
                                    (_, i) => i !== index
                                  );
                                setFormDataHospitalAdmin({
                                  ...formDataHospitalAdmin,
                                  insurance_partners: newPartners,
                                });
                              }}
                              className="p-2 text-red-400 hover:text-red-300 rounded"
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
                            insurance_partners: [
                              ...formDataHospitalAdmin.insurance_partners,
                              "",
                            ],
                          })
                        }
                        className="text-cyan-400 hover:text-cyan-300 text-sm font-medium"
                      >
                        + Add Insurance Partner
                      </button>
                    </div>
                  </div>
                </div>

                {/* Available Services Section */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-cyan-400 mb-3 border-b border-cyan-400/30 pb-1">
                    Available Services
                  </h3>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <label className="flex items-center space-x-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={formDataHospitalAdmin.emergency_available}
                        onChange={(e) =>
                          setFormDataHospitalAdmin({
                            ...formDataHospitalAdmin,
                            emergency_available: e.target.checked,
                          })
                        }
                        className="w-4 h-4 text-cyan-400 bg-transparent border-gray-300 rounded focus:ring-cyan-400"
                      />
                      <span className="text-gray-200">Emergency Services</span>
                    </label>

                    <label className="flex items-center space-x-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={
                          formDataHospitalAdmin.teleconsultation_available
                        }
                        onChange={(e) =>
                          setFormDataHospitalAdmin({
                            ...formDataHospitalAdmin,
                            teleconsultation_available: e.target.checked,
                          })
                        }
                        className="w-4 h-4 text-cyan-400 bg-transparent border-gray-300 rounded focus:ring-cyan-400"
                      />
                      <span className="text-gray-200">Teleconsultation</span>
                    </label>

                    <label className="flex items-center space-x-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={formDataHospitalAdmin.parking_available}
                        onChange={(e) =>
                          setFormDataHospitalAdmin({
                            ...formDataHospitalAdmin,
                            parking_available: e.target.checked,
                          })
                        }
                        className="w-4 h-4 text-cyan-400 bg-transparent border-gray-300 rounded focus:ring-cyan-400"
                      />
                      <span className="text-gray-200">Parking Available</span>
                    </label>

                    <label className="flex items-center space-x-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={formDataHospitalAdmin.canteen_available}
                        onChange={(e) =>
                          setFormDataHospitalAdmin({
                            ...formDataHospitalAdmin,
                            canteen_available: e.target.checked,
                          })
                        }
                        className="w-4 h-4 text-cyan-400 bg-transparent border-gray-300 rounded focus:ring-cyan-400"
                      />
                      <span className="text-gray-200">Canteen Available</span>
                    </label>
                  </div>
                </div>

                {/* Additional Information Section */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-cyan-400 mb-3 border-b border-cyan-400/30 pb-1">
                    Additional Information
                  </h3>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-gray-200 font-medium mb-1">
                        Accreditation
                      </label>
                      <input
                        type="text"
                        placeholder="e.g. NABH, JCI"
                        value={formDataHospitalAdmin.accreditation}
                        onChange={(e) =>
                          setFormDataHospitalAdmin({
                            ...formDataHospitalAdmin,
                            accreditation: e.target.value,
                          })
                        }
                        className="w-full p-3 rounded-md bg-white/20 text-white placeholder-gray-300 focus:ring-2 focus:ring-cyan-400 outline-none"
                      />
                    </div>

                    <div>
                      <label className="block text-gray-200 font-medium mb-1">
                        License Number
                      </label>
                      <input
                        type="text"
                        placeholder="Hospital license number"
                        value={formDataHospitalAdmin.license_number}
                        onChange={(e) =>
                          setFormDataHospitalAdmin({
                            ...formDataHospitalAdmin,
                            license_number: e.target.value,
                          })
                        }
                        className="w-full p-3 rounded-md bg-white/20 text-white placeholder-gray-300 focus:ring-2 focus:ring-cyan-400 outline-none"
                        required
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-gray-200 font-medium mb-1">
                        Rating (out of 5)
                      </label>
                      <input
                        type="number"
                        min="0"
                        max="5"
                        step="0.1"
                        placeholder="e.g. 4.7"
                        value={formDataHospitalAdmin.rating}
                        onChange={(e) =>
                          setFormDataHospitalAdmin({
                            ...formDataHospitalAdmin,
                            rating: Number(e.target.value),
                          })
                        }
                        className="w-full p-3 rounded-md bg-white/20 text-white placeholder-gray-300 focus:ring-2 focus:ring-cyan-400 outline-none"
                      />
                    </div>

                    <div>
                      <label className="block text-gray-200 font-medium mb-1">
                        Total Reviews
                      </label>
                      <input
                        type="number"
                        placeholder="Number of reviews"
                        value={formDataHospitalAdmin.total_reviews}
                        onChange={(e) =>
                          setFormDataHospitalAdmin({
                            ...formDataHospitalAdmin,
                            total_reviews: Number(e.target.value),
                          })
                        }
                        className="w-full p-3 rounded-md bg-white/20 text-white placeholder-gray-300 focus:ring-2 focus:ring-cyan-400 outline-none"
                      />
                    </div>
                  </div>
                </div>
              </div>
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
              disabled={!!selectedFile && !isUploaded}
              className={`w-full py-3 rounded-md text-white font-semibold bg-gradient-to-r from-cyan-500 to-green-400 hover:opacity-90 transition-all ${
                selectedFile && !isUploaded
                  ? "opacity-50 cursor-not-allowed"
                  : ""
              }`}
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
