"use client";
import React, { useState } from "react";
import Link from "next/link";
import Footer from "../../../../components/Footer";
import axios from "axios";

interface HospitalType {
  _id: string;
  name: string;
  email: string;
  hospital_name: string;
  hospital_type: string;
  hospital_address: string;
  total_rooms: number;
  ac_rooms: number;
  non_ac_rooms: number;
  connected_pharmacies: string[];
  hospital_duration: string;
  organisation_type: string;
}

export default function Hospitals() {
  const [activeTab, setActiveTab] = useState("hospitals");
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedFilter, setSelectedFilter] = useState("all");

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

  // Dummy data for hospitals
  const hospitalsData: HospitalType[] = [
    {
      _id: "1",
      name: "Dr. David Anderson",
      email: "david@hospital.com",
      hospital_name: "City Heart Hospital",
      hospital_type: "Cardiology",
      hospital_address: "123 Health Avenue, Mumbai Central, Mumbai - 400008",
      total_rooms: 50,
      ac_rooms: 30,
      non_ac_rooms: 20,
      connected_pharmacies: ["MedPlus", "Apollo Pharmacy"],
      hospital_duration: "24/7",
      organisation_type: "private",
    },
    {
      _id: "2",
      name: "Dr. Sarah Miller",
      email: "sarah@hospital.com",
      hospital_name: "Mind & Brain Care Center",
      hospital_type: "Neurology",
      hospital_address: "456 Brain Street, Bandra West, Mumbai - 400050",
      total_rooms: 40,
      ac_rooms: 25,
      non_ac_rooms: 15,
      connected_pharmacies: ["NetMeds", "1mg"],
      hospital_duration: "9 AM - 9 PM",
      organisation_type: "private",
    },
    {
      _id: "3",
      name: "Dr. Rajesh Kumar",
      email: "rajesh@hospital.com",
      hospital_name: "Bone & Joint Specialty Hospital",
      hospital_type: "Orthopedic",
      hospital_address: "789 Joint Road, Andheri East, Mumbai - 400069",
      total_rooms: 35,
      ac_rooms: 20,
      non_ac_rooms: 15,
      connected_pharmacies: ["PharmEasy", "MedLife"],
      hospital_duration: "8 AM - 10 PM",
      organisation_type: "government",
    },
    {
      _id: "4",
      name: "Dr. Emily Johnson",
      email: "emily@hospital.com",
      hospital_name: "Children's Care Hospital",
      hospital_type: "Pediatric",
      hospital_address: "321 Kid's Lane, Powai, Mumbai - 400076",
      total_rooms: 45,
      ac_rooms: 30,
      non_ac_rooms: 15,
      connected_pharmacies: ["Apollo Pharmacy", "MedPlus"],
      hospital_duration: "24/7",
      organisation_type: "private",
    },
  ];

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
      icon: "👤",
      route: "/admin/patient",
    },
    {
      id: "appointments",
      label: "Appointments",
      icon: "📅",
      route: "/admin/patient/appointments",
    },
    {
      id: "doctors",
      label: "Doctors",
      icon: "👨‍⚕️",
      route: "/admin/patient/doctors",
    },
    {
      id: "reports",
      label: "Medical Reports",
      icon: "📄",
      route: "/admin/patient/reports",
    },
    {
      id: "hospitals",
      label: "Hospitals",
      icon: "🏥",
      route: "/admin/patient/hospitals",
    },
    {
      id: "chat",
      label: "AI Assistant",
      icon: "💬",
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
              <span className="text-2xl">{item.icon}</span>
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
                <span className="text-2xl">{item.icon}</span>
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
            </div>
          </header>

          {/* Main Content Area */}
          <main className="flex-1 p-4 md:p-6 overflow-y-auto bg-gray-50">
            {/* Search Section */}
            <div className="bg-white rounded-xl shadow-lg p-4 md:p-6 mb-6">
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
                    {spec.icon} {spec.name}
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

                    {/* View Doctors Button */}
                    <button className="w-full mt-6 py-3 bg-gradient-to-r from-blue-600 to-green-600 text-white rounded-xl font-semibold hover:opacity-90 transition-all flex items-center justify-center group">
                      <span>View Doctors</span>
                      <span className="ml-2 transform group-hover:translate-x-1 transition-transform">
                        →
                      </span>
                    </button>
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
