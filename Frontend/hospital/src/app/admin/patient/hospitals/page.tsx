"use client";
import React, { useEffect, useState } from "react";
import Link from "next/link";
import Footer from "../../../../components/Footer";
import axios from "axios";
import { HospitalAdminFormData } from "../../../register/page";
import {
  User,
  CalendarDays,
  Stethoscope,
  FileText,
  Hospital,
  Receipt,
  MessageCircle,
} from "lucide-react";
import { useAuth } from "../../../../../context/AuthContext";

export default function Hospitals() {
  const { user, loading } = useAuth();
  const [activeTab, setActiveTab] = useState("hospitals");
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedFilter, setSelectedFilter] = useState("all");
  const [hospitalsData, setHospitalsData] = useState<HospitalAdminFormData[]>(
    []
  );
  const handleLogout = async () => {
    try {
      const res = await axios.post(
        `/api/logout`,
        {},
        { withCredentials: true }
      );
      window.location.href = "/login";
    } catch (error) {
      console.error("Error logging out:", error);
    }
  };

  const fetchHospitalData = async () => {
    try {
      const apiUrl = `/api/hospital/get-hospitalData`;
      const res = await axios.get(apiUrl);
      setHospitalsData(res.data);
      console.log(res.data);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchHospitalData();
  }, []);
  // Dummy data for hospitals
  // const hospitalsData: HospitalAdminFormData[] = [
  //   {
  //     _id: "1",
  //     name: "Dr. Rohan Kapoor",
  //     email: "rohan.kapoor@citycarehospital.com",
  //     password: "CityCare@123",
  //     hospital_name: "CityCare Multispeciality Hospital",
  //     hospital_type: "Multispeciality",
  //     hospital_description:
  //       "CityCare Multispeciality Hospital is known for its advanced healthcare facilities, experienced doctors, and 24x7 emergency care services. It offers top-notch treatment across 12 departments with state-of-the-art medical equipment.",
  //     year_established: 2012,
  //     hospital_address:
  //       "22 Health Avenue, Gomti Nagar, Lucknow, Uttar Pradesh - 226010",
  //     contact_number: "+91-9123456789",
  //     emergency_number: "+91-9876543210",
  //     hospital_duration: "8 AM - 10 PM",
  //     organisation_type: "private",
  //     total_rooms: 80,
  //     ac_rooms: 50,
  //     non_ac_rooms: 30,
  //     icu_beds: 12,
  //     ambulances: 4,
  //     departments: [
  //       "Cardiology",
  //       "Neurology",
  //       "Orthopedics",
  //       "Pediatrics",
  //       "Dermatology",
  //       "ENT",
  //     ],
  //     lab_facilities: [
  //       "Pathology Lab",
  //       "MRI",
  //       "CT Scan",
  //       "X-Ray",
  //       "Blood Bank",
  //     ],
  //     connected_pharmacies: ["Apollo Pharmacy", "MedPlus"],
  //     payment_modes: ["Cash", "Card", "UPI", "Netbanking"],
  //     insurance_partners: [
  //       "Star Health",
  //       "ICICI Lombard",
  //       "HDFC Ergo",
  //       "Care Health",
  //     ],
  //     emergency_available: true,
  //     teleconsultation_available: true,
  //     parking_available: true,
  //     canteen_available: true,
  //     accreditation: "NABH",
  //     license_number: "UP-HSP-2025-0098",
  //     rating: 4.6,
  //     total_reviews: 312,
  //     role: "hospital_admin",
  //     Total_Revenue_Hospital: 8500000,
  //   },
  // ];

  const specializations = [
    { id: "all", name: "All Hospitals", icon: "🏥" },
    { id: "Cardiology", name: "Heart Care", icon: "❤️" },
    { id: "Neurology", name: "Brain & Nerve", icon: "🧠" },
    { id: "Orthopedic", name: "Bone & Joint", icon: "🦴" },
    { id: "Pediatric", name: "Children", icon: "👶" },
    { id: "Multi-Specialty", name: "Multi-Specialty", icon: "🏨" },
  ];

  // Filter hospitals based on search term and specialization
  const filteredHospitals = hospitalsData.filter((hospital) => {
    const matchesSearch =
      hospital.hospital_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      hospital.hospital_address
        .toLowerCase()
        .includes(searchTerm.toLowerCase());
    const matchesType =
      selectedFilter === "all" || hospital.hospital_type === selectedFilter;
    return matchesSearch && matchesType;
  });

  // Sidebar items (same as doctors page)
  const sidebarItems = [
    {
      id: "profile",
      label: "Profile",
      icon: User,
      route: "/admin/patient",
    },
    {
      id: "appointments",
      label: "Appointments",
      icon: CalendarDays,
      route: "/admin/patient/appointments",
    },
    {
      id: "doctors",
      label: "Doctors",
      icon: Stethoscope,
      route: "/admin/patient/doctors",
    },
    {
      id: "reports",
      label: "Medical Reports",
      icon: FileText,
      route: "/admin/patient/reports",
    },
    {
      id: "hospitals",
      label: "Hospitals",
      icon: Hospital,
      route: "/admin/patient/hospitals",
    },
    {
      id: "bills",
      label: "Bills",
      icon: Receipt,
      route: "/admin/patient/bills",
    },
    {
      id: "chat",
      label: "AI Assistant",
      icon: MessageCircle,
      route: "/admin/patient/chat",
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Mobile overlay */}
      {isSidebarOpen && (
        <div
          className="fixed inset-0 bg-black/40 z-40 md:hidden"
          onClick={() => setIsSidebarOpen(false)}
        ></div>
      )}

      {/* Sidebar (same structure as doctors page) */}
      <aside
        className={`fixed top-0 left-0 z-50 h-full w-64 bg-white shadow-lg transform transition-transform md:hidden ${
          isSidebarOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        {/* Sidebar content (same as doctors page) */}
        <div className="p-4 border-b border-gray-200">
          <div className="flex items-center">
            <div className="w-10 h-10 bg-gradient-to-r from-blue-600 to-green-600 rounded-full flex items-center justify-center">
              <span className="text-white font-bold text-xl">S</span>
            </div>
            <div className="ml-3">
              <h1 className="text-xl font-bold text-gray-800">Swasth-Raho</h1>
              <p className="text-sm text-gray-500">Patient Portal</p>
            </div>
          </div>
        </div>

        <nav className="mt-6 px-2">
          {sidebarItems.map((item) => (
            <Link
              key={item.id}
              href={item.route}
              className={`flex items-center px-4 py-3 rounded-lg transition-colors ${
                activeTab === item.id
                  ? "bg-blue-50 text-blue-600"
                  : "text-gray-700 hover:bg-gray-50"
              }`}
              onClick={() => {
                setActiveTab(item.id);
                setIsSidebarOpen(false);
              }}
            >
              <item.icon className="h-5 w-5" />
              <span className="ml-3 font-medium">{item.label}</span>
            </Link>
          ))}
        </nav>
      </aside>

      <div className="md:flex h-screen">
        {/* Desktop Sidebar (same as doctors page) */}
        <aside className="hidden md:flex flex-col fixed w-64 bg-white shadow-lg h-screen">
          {/* Same sidebar content as above */}
          <div className="p-4 border-b border-gray-200">
            <div className="flex items-center">
              <div className="w-10 h-10 bg-gradient-to-r from-blue-600 to-green-600 rounded-full flex items-center justify-center">
                <span className="text-white font-bold text-xl">S</span>
              </div>
              <div className="ml-3">
                <h1 className="text-xl font-bold text-gray-800">Swasth-Raho</h1>
                <p className="text-sm text-gray-500">Patient Portal</p>
              </div>
            </div>
          </div>
          <nav className="mt-6 flex-1 px-2 overflow-y-auto">
            {sidebarItems.map((item) => (
              <Link
                key={item.id}
                href={item.route}
                className={`flex items-center px-4 py-3 rounded-lg transition-colors ${
                  activeTab === item.id
                    ? "bg-blue-50 text-blue-600 border-r-4 border-blue-600"
                    : "text-gray-700 hover:bg-gray-50"
                }`}
                onClick={() => setActiveTab(item.id)}
              >
                <item.icon className="h-5 w-5" />
                <span className="ml-3 font-medium">{item.label}</span>
              </Link>
            ))}
          </nav>
          <div className="p-4 border-t border-gray-200">
            <button
              onClick={handleLogout}
              className="w-full flex items-center px-4 py-3 text-gray-700 hover:bg-red-50 hover:text-red-600 rounded-lg transition-colors"
            >
              <span className="text-2xl">🚪</span>
              <span className="ml-3 font-medium">Logout</span>
            </button>
          </div>
        </aside>

        {/* Main Content */}
        <div className="flex-1 md:ml-64 flex flex-col min-h-screen">
          {/* Header */}
          <header className="bg-white shadow-sm border-b border-gray-200 px-4 md:px-6 py-4 sticky top-0 z-30">
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <button
                  onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                  className="md:hidden p-2 rounded-md text-gray-600 hover:bg-gray-100"
                >
                  <svg
                    className="w-6 h-6"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M4 6h16M4 12h16M4 18h16"
                    />
                  </svg>
                </button>
                <h2 className="text-xl md:text-2xl font-bold text-gray-800 ml-2">
                  Find Hospitals
                </h2>
              </div>
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center overflow-hidden">
                  <img
                    src={user?.profileImg ? user.profileImg : null}
                    alt=""
                    className="w-full h-full rounded-full object-cover"
                  />
                </div>
                <div className="hidden md:block text-right">
                  <p className="text-sm font-medium text-gray-800">
                    {user?.name}
                  </p>
                  <p className="text-xs text-gray-500">{user?.email}</p>
                </div>
              </div>
            </div>
          </header>

          {/* Main Content Area */}
          <main className="flex-1 p-4 md:p-6 overflow-y-auto bg-gray-50">
            {/* Search Section */}
            <div className="bg-white text-black rounded-xl shadow-lg p-4 md:p-6 mb-6">
              <div className="max-w-4xl mx-auto">
                <div className="relative">
                  <input
                    type="text"
                    placeholder="Search hospitals by name or location..."
                    className="w-full px-4 py-3 pl-12 rounded-xl border-2 border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">
                    🔍
                  </span>
                </div>
              </div>
            </div>
            {/* Filter Section */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 md:p-6 mb-6">
              <h3 className="text-lg font-bold text-gray-800 mb-3 md:mb-4">
                Filter by Specialization
              </h3>
              <div className="flex flex-nowrap overflow-x-auto md:flex-wrap gap-2 md:gap-3 pb-2 md:pb-0 scrollbar-hide">
                {specializations.map((spec) => (
                  <button
                    key={spec.id}
                    onClick={() => setSelectedFilter(spec.id)}
                    className={`flex-none px-3 md:px-4 py-2 rounded-xl font-medium transition-all whitespace-nowrap ${
                      selectedFilter === spec.id
                        ? "bg-blue-600 text-white shadow-lg"
                        : "bg-gray-100 text-gray-700 hover:bg-blue-50 hover:text-blue-600"
                    }`}
                  >
                    {spec.name}
                  </button>
                ))}
              </div>
            </div>{" "}
            {/* Hospitals Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredHospitals.map((hospital) => (
                <div
                  key={hospital._id}
                  className="bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1"
                >
                  {/* Hospital Header with Gradient */}
                  <div className="p-4 bg-gradient-to-r from-blue-50 to-green-50 border-b border-gray-200">
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="text-xl font-bold text-gray-800">
                          {hospital.hospital_name}
                        </h3>
                        <p className="text-blue-600 font-medium mt-0.5">
                          {hospital.hospital_type}
                        </p>
                      </div>
                      <span
                        className={`px-3 py-1.5 rounded-full text-sm font-medium flex items-center ${
                          hospital.organisation_type === "private"
                            ? "bg-blue-100 text-blue-700"
                            : "bg-green-100 text-green-700"
                        }`}
                      >
                        {hospital.organisation_type === "private" ? "🏢" : "🏛️"}
                        <span className="ml-1">
                          {hospital.organisation_type.charAt(0).toUpperCase() +
                            hospital.organisation_type.slice(1)}
                        </span>
                      </span>
                    </div>
                  </div>

                  {/* Hospital Details */}
                  <div className="p-4 md:p-6">
                    <div className="space-y-4">
                      {/* Address */}
                      <div className="flex items-start space-x-3">
                        <span className="flex-shrink-0 w-8 h-8 flex items-center justify-center rounded-full bg-blue-50 text-blue-600">
                          📍
                        </span>
                        <div className="flex-1">
                          <span className="text-sm font-medium text-gray-900">
                            Location
                          </span>
                          <p className="text-sm text-gray-600 mt-0.5">
                            {hospital.hospital_address}
                          </p>
                        </div>
                      </div>

                      {/* Working Hours */}
                      <div className="flex items-start space-x-3">
                        <span className="flex-shrink-0 w-8 h-8 flex items-center justify-center rounded-full bg-green-50 text-green-600">
                          ⏰
                        </span>
                        <div className="flex-1">
                          <span className="text-sm font-medium text-gray-900">
                            Working Hours
                          </span>
                          <p className="text-sm text-gray-600 mt-0.5">
                            {hospital.hospital_duration}
                          </p>
                        </div>
                      </div>

                      {/* Rooms Info */}
                      <div className="flex items-start space-x-3">
                        <span className="flex-shrink-0 w-8 h-8 flex items-center justify-center rounded-full bg-purple-50 text-purple-600">
                          🛏️
                        </span>
                        <div className="flex-1">
                          <span className="text-sm font-medium text-gray-900">
                            Available Rooms
                          </span>
                          <div className="mt-2 flex flex-wrap gap-2">
                            <span className="inline-flex items-center px-2.5 py-1 rounded-md text-xs font-medium bg-blue-50 text-blue-700">
                              AC: {hospital.ac_rooms}
                            </span>
                            <span className="inline-flex items-center px-2.5 py-1 rounded-md text-xs font-medium bg-gray-100 text-gray-700">
                              Non-AC: {hospital.non_ac_rooms}
                            </span>
                            <span className="inline-flex items-center px-2.5 py-1 rounded-md text-xs font-medium bg-green-50 text-green-700">
                              Total: {hospital.total_rooms}
                            </span>
                          </div>
                        </div>
                      </div>

                      {/* Connected Pharmacies */}
                      <div className="flex items-start space-x-3">
                        <span className="flex-shrink-0 w-8 h-8 flex items-center justify-center rounded-full bg-pink-50 text-pink-600">
                          💊
                        </span>
                        <div className="flex-1">
                          <span className="text-sm font-medium text-gray-900">
                            Connected Pharmacies
                          </span>
                          <div className="mt-2 flex flex-wrap gap-2">
                            {hospital.connected_pharmacies.map(
                              (pharmacy, idx) => (
                                <span
                                  key={idx}
                                  className="inline-flex items-center px-2.5 py-1 rounded-md text-xs font-medium bg-gray-100 text-gray-700"
                                >
                                  {pharmacy}
                                </span>
                              )
                            )}
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center justify-between  mt-6">
                      {/* View Doctors Button */}
                      <Link href={`/admin/patient/doctors`} className="w-full">
                        <button className="w-full py-3 bg-linear-to-r from-blue-600 to-green-600 text-white rounded-xl font-semibold hover:opacity-90 transition-all flex items-center justify-center group">
                          <span>View Doctors</span>
                          <span className="ml-2 transform group-hover:translate-x-1 transition-transform">
                            →
                          </span>
                        </button>
                      </Link>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            {/* No hospitals found */}
            {filteredHospitals.length === 0 && (
              <div className="text-center py-12">
                <div className="text-6xl mb-4">🏥</div>
                <h3 className="text-xl font-semibold text-gray-800 mb-2">
                  No hospitals found
                </h3>
                <p className="text-gray-600">
                  Try adjusting your search or filters
                </p>
              </div>
            )}
          </main>
        </div>
      </div>
      {/* Mobile Footer */}
      {/* <div className="block md:hidden">
        <Footer />
      </div> */}
    </div>
  );
}
