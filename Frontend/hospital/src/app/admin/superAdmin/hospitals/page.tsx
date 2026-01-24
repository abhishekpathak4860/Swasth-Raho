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
  MapPin,
  Clock,
  Bed,
  Pill,
  ArrowRight,
  Search,
  Filter,
  Activity,
  ShieldCheck,
  Landmark,
  Plus,
} from "lucide-react";
import { useAuth } from "../../../../../context/AuthContext";

export default function Hospitals() {
  const { user, fetchUser } = useAuth();
  const [activeTab, setActiveTab] = useState("hospitals");
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [showProfileMenu, setShowProfileMenu] = useState(false);

  // Data States
  const [hospitals, setHospitals] = useState<any[]>([]);
  const [filteredHospitals, setFilteredHospitals] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Search & Filter States
  const [searchQuery, setSearchQuery] = useState("");
  const [filterType, setFilterType] = useState("All"); // All, Private, Government

  // Derived Stats (Calculated from original list)
  const totalHospitals = hospitals.length;
  const privateHospitals = hospitals.filter(
    (h) => h.organisation_type === "private",
  ).length;
  const governmentHospitals = hospitals.filter(
    (h) => h.organisation_type === "government",
  ).length;

  useEffect(() => {
    fetchUser();
    fetchHospitals();
  }, []);

  const fetchHospitals = async () => {
    try {
      setLoading(true);
      const response = await axios.get("/super-admin/hospitals", {
        withCredentials: true,
      });
      if (response.data.success) {
        setHospitals(response.data.hospitals);
        setFilteredHospitals(response.data.hospitals);
      }
    } catch (err) {
      console.error("Failed to fetch hospitals", err);
      setError("Failed to load hospitals.");
    } finally {
      setLoading(false);
    }
  };

  // --- FILTER & SEARCH LOGIC ---
  useEffect(() => {
    let result = hospitals;

    // 1. Filter by Type
    if (filterType !== "All") {
      result = result.filter(
        (h) => h.organisation_type?.toLowerCase() === filterType.toLowerCase(),
      );
    }

    // 2. Filter by Search Query (Name, Address)
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      result = result.filter(
        (h) =>
          h.hospital_name?.toLowerCase().includes(query) ||
          h.hospital_address?.toLowerCase().includes(query),
      );
    }

    setFilteredHospitals(result);
  }, [searchQuery, filterType, hospitals]);

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
                className={`w-5 h-5 transition-colors ${activeTab === item.id ? "text-blue-600" : "text-gray-400"}`}
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
                Manage Hospitals
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
          {/* STATS CARDS */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div className="bg-white p-5 rounded-2xl shadow-sm border border-slate-100 flex items-center justify-between hover:shadow-md transition-shadow">
              <div>
                <p className="text-sm font-medium text-slate-500 mb-1">
                  Total Hospitals
                </p>
                <h3 className="text-3xl font-bold text-slate-800">
                  {loading ? "..." : totalHospitals}
                </h3>
              </div>
              <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-xl flex items-center justify-center">
                <Activity size={24} />
              </div>
            </div>
            <div className="bg-white p-5 rounded-2xl shadow-sm border border-slate-100 flex items-center justify-between hover:shadow-md transition-shadow">
              <div>
                <p className="text-sm font-medium text-slate-500 mb-1">
                  Private Hospitals
                </p>
                <h3 className="text-3xl font-bold text-slate-800">
                  {loading ? "..." : privateHospitals}
                </h3>
              </div>
              <div className="w-12 h-12 bg-purple-50 text-purple-600 rounded-xl flex items-center justify-center">
                <ShieldCheck size={24} />
              </div>
            </div>
            <div className="bg-white p-5 rounded-2xl shadow-sm border border-slate-100 flex items-center justify-between hover:shadow-md transition-shadow">
              <div>
                <p className="text-sm font-medium text-slate-500 mb-1">
                  Government Hospitals
                </p>
                <h3 className="text-3xl font-bold text-slate-800">
                  {loading ? "..." : governmentHospitals}
                </h3>
              </div>
              <div className="w-12 h-12 bg-orange-50 text-orange-600 rounded-xl flex items-center justify-center">
                <Landmark size={24} />
              </div>
            </div>
          </div>

          {/* Action Bar (SEARCH + FILTER) */}
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">
                Registered Hospitals
              </h1>
              <p className="text-gray-500 text-sm mt-1">
                Detailed list of all medical centers.
              </p>
            </div>
            <div className="flex flex-wrap gap-3 w-full sm:w-auto">
              {/* Search Box */}
              <div className="relative flex-1 sm:w-64">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
                <input
                  type="text"
                  placeholder="Search by name or address..."
                  className="text-black w-full pl-10 pr-4 py-2 bg-white border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>

              {/* Filter Dropdown */}
              <div className="relative">
                <select
                  className="appearance-none px-4 py-2 bg-white border border-gray-200 text-gray-600 rounded-lg hover:bg-gray-50 flex items-center gap-2 text-sm font-medium pr-8 focus:outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer"
                  value={filterType}
                  onChange={(e) => setFilterType(e.target.value)}
                >
                  <option value="All">All Types</option>
                  <option value="private">Private</option>
                  <option value="government">Government</option>
                </select>
                <Filter className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4 pointer-events-none" />
              </div>
              {/* 
              <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-sm font-medium shadow-md shadow-blue-200 flex items-center gap-2">
                <Plus className="w-4 h-4" /> Add
              </button> */}
            </div>
          </div>

          {/* Error Message */}
          {error && (
            <div className="w-full p-4 mb-6 bg-red-50 text-red-600 rounded-xl border border-red-200 text-center">
              {error}
            </div>
          )}

          {/* Loading & Grid */}
          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[1, 2, 3].map((i) => (
                <div
                  key={i}
                  className="h-64 bg-gray-200 rounded-2xl animate-pulse"
                ></div>
              ))}
            </div>
          ) : filteredHospitals.length === 0 ? (
            <div className="text-center py-20 text-gray-500 bg-white rounded-2xl border border-gray-100">
              <p>No hospitals found matching your criteria.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
              {filteredHospitals.map((hospital) => (
                <div
                  key={hospital._id}
                  className="bg-white rounded-2xl shadow-sm hover:shadow-md border border-gray-100 transition-all duration-300 overflow-hidden flex flex-col"
                >
                  {/* Header */}
                  <div className="bg-gradient-to-r from-emerald-50 to-teal-50 p-5 border-b border-emerald-100">
                    <div className="flex justify-between items-start mb-2">
                      <h3 className="text-lg font-bold text-gray-900 leading-tight line-clamp-2 w-[70%]">
                        {hospital.hospital_name}
                      </h3>
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wide border ${hospital.organisation_type === "private" ? "bg-blue-100 text-blue-700 border-blue-200" : "bg-orange-100 text-orange-700 border-orange-200"}`}
                      >
                        <Building2 className="w-3 h-3 inline-block mr-1 -mt-0.5" />
                        {hospital.organisation_type}
                      </span>
                    </div>
                    <p className="text-emerald-700 text-sm font-medium">
                      {hospital.hospital_type}
                    </p>
                  </div>

                  {/* Body */}
                  <div className="p-5 flex-1 space-y-4">
                    <div className="flex items-start gap-3">
                      <div className="w-8 h-8 rounded-full bg-red-50 flex items-center justify-center flex-shrink-0 mt-0.5">
                        <MapPin className="w-4 h-4 text-red-500" />
                      </div>
                      <div>
                        <p className="text-xs text-gray-400 font-medium uppercase">
                          Location
                        </p>
                        <p className="text-sm text-gray-700 leading-snug">
                          {hospital.hospital_address}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <div className="w-8 h-8 rounded-full bg-orange-50 flex items-center justify-center flex-shrink-0 mt-0.5">
                        <Clock className="w-4 h-4 text-orange-500" />
                      </div>
                      <div>
                        <p className="text-xs text-gray-400 font-medium uppercase">
                          Working Hours
                        </p>
                        <p className="text-sm text-gray-700 font-medium">
                          {hospital.hospital_duration}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <div className="w-8 h-8 rounded-full bg-blue-50 flex items-center justify-center flex-shrink-0 mt-0.5">
                        <Bed className="w-4 h-4 text-blue-500" />
                      </div>
                      <div className="w-full">
                        <p className="text-xs text-gray-400 font-medium uppercase mb-1">
                          Available Rooms
                        </p>
                        <div className="flex flex-wrap gap-2">
                          <span className="px-2 py-1 bg-blue-50 text-blue-700 text-xs rounded border border-blue-100 font-medium">
                            AC: {hospital.ac_rooms}
                          </span>
                          <span className="px-2 py-1 bg-gray-50 text-gray-700 text-xs rounded border border-gray-200 font-medium">
                            Non-AC: {hospital.non_ac_rooms}
                          </span>
                          <span className="px-2 py-1 bg-green-50 text-green-700 text-xs rounded border border-green-100 font-medium">
                            Total: {hospital.total_rooms}
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <div className="w-8 h-8 rounded-full bg-pink-50 flex items-center justify-center flex-shrink-0 mt-0.5">
                        <Pill className="w-4 h-4 text-pink-500" />
                      </div>
                      <div>
                        <p className="text-xs text-gray-400 font-medium uppercase mb-1">
                          Connected Pharmacies
                        </p>
                        <div className="flex flex-wrap gap-2">
                          {hospital.connected_pharmacies?.length > 0 ? (
                            hospital.connected_pharmacies.map(
                              (pharmacy: string, idx: number) => (
                                <span
                                  key={idx}
                                  className="px-2 py-0.5 bg-gray-100 text-gray-600 text-xs rounded-md"
                                >
                                  {pharmacy}
                                </span>
                              ),
                            )
                          ) : (
                            <span className="text-xs text-gray-400 italic">
                              None listed
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Footer */}
                  <div className="p-4 border-t border-gray-100 bg-gray-50/50">
                    <Link
                      href={`/admin/superAdmin/doctors`}
                      className="w-full py-2.5 bg-green-600 hover:bg-green-700 text-white rounded-xl font-medium text-sm transition-all shadow-md shadow-green-200 flex items-center justify-center gap-2"
                    >
                      View Doctors <ArrowRight className="w-4 h-4" />
                    </Link>
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
