"use client";
import React, { useEffect, useState } from "react";
import Link from "next/link";
import axios from "axios";
import {
  LayoutDashboard,
  Building2,
  Stethoscope,
  Users,
  Settings,
  LogOut,
  Menu,
  X,
  Search,
  Filter,
  GraduationCap,
  Briefcase,
  MapPin,
  Phone,
  IndianRupee,
  MoreVertical,
  Plus,
  UserCheck,
  Star,
  Wallet,
} from "lucide-react";
import { useAuth } from "../../../../../context/AuthContext";

export default function Doctors() {
  const { user, fetchUser } = useAuth();
  const [activeTab, setActiveTab] = useState("doctors");
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [showProfileMenu, setShowProfileMenu] = useState(false);

  // Data States
  const [doctors, setDoctors] = useState<any[]>([]); // Original full list
  const [filteredDoctors, setFilteredDoctors] = useState<any[]>([]); // Displayed list
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Search & Filter States
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedSpecialty, setSelectedSpecialty] = useState("All Doctors");

  // Filter Categories
  const specialties = [
    "All Doctors",
    "Cardiologist", // Heart
    "Dermatologist", // Skin
    "Neurologist", // Brain
    "Orthopedic", // Bones
    "Pediatrician", // Children
    "Ophthalmologist", // Eyes
  ];

  // Map user-friendly labels to actual DB types if needed (optional)
  const specialtyMap: any = {
    Heart: "Cardiologist",
    Skin: "Dermatologist",
    Brain: "Neurologist",
    Bones: "Orthopedic",
    Children: "Pediatrician",
    Eyes: "Ophthalmologist",
  };

  // --- STATS CALCULATION (Use original 'doctors' array) ---
  const totalDoctors = doctors.length;
  const experiencedDoctors = doctors.filter((doc) => {
    const expString = doc.experience ? doc.experience.toString() : "0";
    const years = parseInt(expString.match(/\d+/)?.[0] || "0");
    return !isNaN(years) && years >= 8;
  }).length;
  const avgConsultationFee =
    doctors.length > 0
      ? Math.round(
          doctors.reduce(
            (sum, doc) => sum + parseInt(doc.consultationFee || 0),
            0,
          ) / doctors.length,
        )
      : 0;

  // --- FETCH DATA ---
  useEffect(() => {
    fetchUser();
    fetchDoctors();
  }, []);

  const fetchDoctors = async () => {
    try {
      setLoading(true);
      const response = await axios.get("/super-admin/doctors", {
        withCredentials: true,
      });
      if (response.data.success) {
        setDoctors(response.data.doctors);
        setFilteredDoctors(response.data.doctors); // Initialize filtered list
      }
    } catch (err) {
      console.error("Failed to fetch doctors", err);
      setError("Failed to load doctors list.");
    } finally {
      setLoading(false);
    }
  };

  // --- FILTER & SEARCH LOGIC ---
  useEffect(() => {
    let result = doctors;

    // 1. Filter by Specialty
    if (selectedSpecialty !== "All Doctors") {
      // Handle mapping if using simple names like "Heart"
      const typeToMatch = specialtyMap[selectedSpecialty] || selectedSpecialty;
      result = result.filter(
        (doc) => doc.type?.toLowerCase() === typeToMatch.toLowerCase(),
      );
    }

    // 2. Filter by Search Query (Name, Hospital, Type)
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      result = result.filter(
        (doc) =>
          doc.name?.toLowerCase().includes(query) ||
          doc.hospital?.toLowerCase().includes(query) ||
          doc.type?.toLowerCase().includes(query),
      );
    }

    setFilteredDoctors(result);
  }, [searchQuery, selectedSpecialty, doctors]);

  const sidebarItems = [
    {
      id: "profile",
      label: "Overview",
      icon: LayoutDashboard,
      route: "/admin/superAdmin",
    },
    {
      id: "hospitals",
      label: "Manage Hospitals",
      icon: Building2,
      route: "/admin/superAdmin/hospitals",
    },
    {
      id: "doctors",
      label: "Manage Doctors",
      icon: Stethoscope,
      route: "/admin/superAdmin/doctors",
    },
    {
      id: "patients",
      label: "Manage Patients",
      icon: Users,
      route: "/admin/superAdmin/patients",
    },
    {
      id: "settings",
      label: "Settings",
      icon: Settings,
      route: "/admin/superAdmin/settings",
    },
  ];

  const handleLogout = async () => {
    try {
      await axios.post(`/api/logout`, {}, { withCredentials: true });
      window.location.href = "/login";
    } catch (error) {
      console.error("Error logging out:", error);
    }
  };

  return (
    <div className="h-screen bg-gray-50 flex overflow-hidden font-sans">
      {/* Mobile Overlay */}
      {isSidebarOpen && (
        <div
          className="fixed inset-0 bg-black/40 z-40 md:hidden"
          onClick={() => setIsSidebarOpen(false)}
        ></div>
      )}

      {/* ---------------- SIDEBAR ---------------- */}
      <aside
        className={`fixed top-0 left-0 z-50 h-full w-64 bg-white shadow-xl transform transition-transform duration-300 md:relative md:translate-x-0 ${
          isSidebarOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="p-6 border-b border-gray-100 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-r from-blue-600 to-green-600 rounded-xl flex items-center justify-center shadow-lg shadow-blue-200">
              <span className="text-white font-bold text-xl">S</span>
            </div>
            <div>
              <h1 className="text-lg font-bold text-gray-800 leading-tight">
                Swasth-Raho
              </h1>
              <p className="text-[10px] uppercase tracking-wider text-gray-500 font-semibold">
                Super Admin
              </p>
            </div>
          </div>
          <button
            className="md:hidden text-gray-500"
            onClick={() => setIsSidebarOpen(false)}
          >
            <X size={20} />
          </button>
        </div>

        <nav className="mt-6 px-4 space-y-2">
          {sidebarItems.map((item) => (
            <Link
              key={item.id}
              href={item.route}
              onClick={() => setActiveTab(item.id)}
              className={`flex items-center px-4 py-3 rounded-xl transition-all duration-200 group ${
                activeTab === item.id
                  ? "bg-blue-50 text-blue-700 font-semibold border-l-4 border-blue-600"
                  : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
              }`}
            >
              <item.icon
                className={`w-5 h-5 transition-colors ${
                  activeTab === item.id ? "text-blue-600" : "text-gray-400"
                }`}
              />
              <span className="ml-3">{item.label}</span>
            </Link>
          ))}
        </nav>

        <div className="absolute bottom-0 w-full p-4 border-t border-gray-100 bg-gray-50/50">
          <button
            onClick={handleLogout}
            className="w-full flex items-center justify-center px-4 py-2.5 text-red-600 hover:bg-red-50 rounded-lg transition-colors font-medium text-sm gap-2"
          >
            <LogOut size={18} /> Sign Out
          </button>
        </div>
      </aside>

      {/* ---------------- MAIN CONTENT ---------------- */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Header */}
        <header className="bg-white border-b border-gray-200 sticky top-0 z-30">
          <div className="flex items-center justify-between px-4 sm:px-6 py-3">
            <div className="flex items-center gap-3">
              <button
                onClick={() => setIsSidebarOpen(true)}
                className="md:hidden p-2 text-gray-600 hover:bg-gray-100 rounded-lg"
              >
                <Menu size={24} />
              </button>
              <h2 className="text-xl font-bold text-gray-800">
                Manage Doctors
              </h2>
            </div>

            <div className="relative">
              <button
                onClick={() => setShowProfileMenu(!showProfileMenu)}
                className="flex items-center gap-3 p-1.5 rounded-full hover:bg-gray-50 border border-transparent hover:border-gray-200 transition-all"
              >
                <div className="text-right hidden sm:block">
                  <p className="text-sm font-semibold text-gray-800">
                    {user?.name || "Admin"}
                  </p>
                  <p className="text-xs text-gray-500">Super Admin</p>
                </div>
                <div className="w-9 h-9 rounded-full bg-gray-200 overflow-hidden border border-gray-300">
                  <img
                    src={user?.profileImg || "https://via.placeholder.com/150"}
                    alt="Profile"
                    className="w-full h-full object-cover"
                  />
                </div>
              </button>
              {showProfileMenu && (
                <div className="absolute right-0 mt-2 w-48 bg-white border border-gray-100 rounded-xl shadow-lg py-1 z-50">
                  <button
                    onClick={handleLogout}
                    className="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50"
                  >
                    Sign out
                  </button>
                </div>
              )}
            </div>
          </div>
        </header>

        {/* Content Body */}
        <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8 bg-slate-50">
          {/* STATS CARDS SECTION */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div className="bg-white p-5 rounded-2xl shadow-sm border border-slate-100 flex items-center justify-between hover:shadow-md transition-shadow">
              <div>
                <p className="text-sm font-medium text-slate-500 mb-1">
                  Total Doctors
                </p>
                <h3 className="text-3xl font-bold text-slate-800">
                  {loading ? "..." : totalDoctors}
                </h3>
              </div>
              <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-xl flex items-center justify-center">
                <UserCheck size={24} />
              </div>
            </div>

            <div className="bg-white p-5 rounded-2xl shadow-sm border border-slate-100 flex items-center justify-between hover:shadow-md transition-shadow">
              <div>
                <p className="text-sm font-medium text-slate-500 mb-1">
                  Experienced (8+ Years)
                </p>
                <h3 className="text-3xl font-bold text-slate-800">
                  {loading ? "..." : experiencedDoctors}
                </h3>
              </div>
              <div className="w-12 h-12 bg-purple-50 text-purple-600 rounded-xl flex items-center justify-center">
                <Star size={24} />
              </div>
            </div>

            <div className="bg-white p-5 rounded-2xl shadow-sm border border-slate-100 flex items-center justify-between hover:shadow-md transition-shadow">
              <div>
                <p className="text-sm font-medium text-slate-500 mb-1">
                  Avg. Consultation Fee
                </p>
                <h3 className="text-3xl font-bold text-slate-800">
                  {loading ? "..." : `₹${avgConsultationFee}`}
                </h3>
              </div>
              <div className="w-12 h-12 bg-orange-50 text-orange-600 rounded-xl flex items-center justify-center">
                <Wallet size={24} />
              </div>
            </div>
          </div>

          {/* Action Bar (SEARCH + FILTER) */}
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">All Doctors</h1>
              <p className="text-gray-500 text-sm mt-1">
                Manage verified doctors across all hospitals.
              </p>
            </div>
            <div className="flex gap-3 w-full sm:w-auto">
              <div className="relative flex-1 sm:w-64">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
                <input
                  type="text"
                  placeholder="Search by name, hospital..."
                  className="text-black w-full pl-10 pr-4 py-2 bg-white border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
              {/* <button className="px-4 py-2 bg-white border border-gray-200 text-gray-600 rounded-lg hover:bg-gray-50 flex items-center gap-2 text-sm font-medium">
                <Filter className="w-4 h-4" /> Filter
              </button> */}
              {/* <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-sm font-medium shadow-md shadow-blue-200 flex items-center gap-2">
                <Plus className="w-4 h-4" /> Add Doctor
              </button> */}
            </div>
          </div>

          {/* Specialization Filter Tags */}
          <div className="flex gap-2 overflow-x-auto pb-2 mb-6">
            {specialties.map((tag) => (
              <button
                key={tag}
                onClick={() => setSelectedSpecialty(tag)}
                className={`px-4 py-1.5 rounded-full text-sm font-medium whitespace-nowrap transition-colors ${
                  selectedSpecialty === tag
                    ? "bg-blue-600 text-white"
                    : "bg-white border border-gray-200 text-gray-600 hover:bg-gray-50"
                }`}
              >
                {/* Display simplified name if available in map, else tag itself */}
                {Object.keys(specialtyMap).find(
                  (key) => specialtyMap[key] === tag,
                ) || tag}
              </button>
            ))}
          </div>

          {/* Error Message */}
          {error && (
            <div className="w-full p-4 mb-6 bg-red-50 text-red-600 rounded-xl border border-red-200 text-center">
              {error}
            </div>
          )}

          {/* Loading & Grid */}
          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
              {[1, 2, 3].map((i) => (
                <div
                  key={i}
                  className="h-64 bg-gray-200 rounded-2xl animate-pulse"
                ></div>
              ))}
            </div>
          ) : filteredDoctors.length === 0 ? (
            <div className="text-center py-20 text-gray-500 bg-white rounded-2xl border border-gray-100">
              <p>No doctors found matching your criteria.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
              {filteredDoctors.map((doctor) => (
                <div
                  key={doctor._id}
                  className="bg-white rounded-2xl shadow-sm hover:shadow-md border border-gray-100 transition-all duration-300 p-6 flex flex-col relative group"
                >
                  <button className="absolute top-4 right-4 text-gray-400 hover:text-gray-600">
                    <MoreVertical size={20} />
                  </button>

                  <div className="mb-4">
                    <h3 className="text-xl font-bold text-gray-900 leading-tight">
                      {doctor.name}
                    </h3>
                    <p className="text-blue-600 font-medium text-sm mt-1">
                      {doctor.type}
                    </p>
                  </div>

                  <div className="flex-1 space-y-3 mb-6">
                    <div className="flex items-center gap-3 text-gray-600">
                      <GraduationCap size={18} className="text-blue-500" />
                      <span className="text-sm">{doctor.education}</span>
                    </div>
                    <div className="flex items-center gap-3 text-gray-600">
                      <Briefcase size={18} className="text-purple-500" />
                      <span className="text-sm">{doctor.experience}</span>
                    </div>
                    {/* Hospital Name (Dynamically Attached) */}
                    <div className="flex items-center gap-3 text-gray-600">
                      <Building2 size={18} className="text-green-500" />
                      <span className="text-sm font-medium text-gray-800 line-clamp-1">
                        {doctor.hospital || "Independent"}
                      </span>
                    </div>
                    <div className="flex items-center gap-3 text-gray-600">
                      <IndianRupee size={18} className="text-orange-500" />
                      <span className="text-sm">
                        Consultation:{" "}
                        <span className="font-semibold text-gray-800">
                          ₹{doctor.consultationFee}
                        </span>
                      </span>
                    </div>
                  </div>

                  <div className="flex gap-3 mt-auto">
                    <button className="flex-1 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium text-sm transition-all shadow-sm">
                      View Profile
                    </button>
                    <button className="px-4 py-2.5 bg-green-500 hover:bg-green-600 text-white rounded-lg transition-all shadow-sm flex items-center justify-center">
                      <Phone size={18} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
