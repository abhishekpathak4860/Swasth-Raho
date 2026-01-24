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
  MapPin,
  Phone,
  Calendar,
  Mail,
  MoreVertical,
  UserPlus,
  FileText,
} from "lucide-react";
import { useAuth } from "../../../../../context/AuthContext";

export default function Patients() {
  const { user, fetchUser } = useAuth();
  const [activeTab, setActiveTab] = useState("patients");
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [showProfileMenu, setShowProfileMenu] = useState(false);

  // Real Data State
  const [patients, setPatients] = useState<any[]>([]);
  const [filteredPatients, setFilteredPatients] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [searchQuery, setSearchQuery] = useState("");

  // --- STATS LOGIC ---
  const totalPatients = patients.length;

  // --- FETCH DATA ---
  useEffect(() => {
    fetchUser();
    fetchPatients();
  }, []);

  const fetchPatients = async () => {
    try {
      setLoading(true);
      const response = await axios.get("/super-admin/patients", {
        withCredentials: true,
      });
      if (response.data.success) {
        setPatients(response.data.patients);
        setFilteredPatients(response.data.patients);
      }
    } catch (err) {
      console.error("Failed to fetch patients", err);
      setError("Failed to load patients list.");
    } finally {
      setLoading(false);
    }
  };

  // --- SEARCH LOGIC ---
  useEffect(() => {
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      const result = patients.filter(
        (p) =>
          p.name?.toLowerCase().includes(query) ||
          p.email?.toLowerCase().includes(query) ||
          p.location?.toLowerCase().includes(query),
      );
      setFilteredPatients(result);
    } else {
      setFilteredPatients(patients);
    }
  }, [searchQuery, patients]);

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
                Manage Patients
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
          {/* STATS CARDS SECTION (Only Total Patients as requested) */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div className="bg-white p-5 rounded-2xl shadow-sm border border-slate-100 flex items-center justify-between hover:shadow-md transition-shadow">
              <div>
                <p className="text-sm font-medium text-slate-500 mb-1">
                  Total Patients
                </p>
                <h3 className="text-3xl font-bold text-slate-800">
                  {loading ? "..." : totalPatients}
                </h3>
              </div>
              <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-xl flex items-center justify-center">
                <Users size={24} />
              </div>
            </div>
            {/* You can add more generic stats here if you want later */}
          </div>

          {/* Action Bar */}
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">
                Patient Directory
              </h1>
              <p className="text-gray-500 text-sm mt-1">
                Search and view patient records.
              </p>
            </div>
            <div className="flex gap-3 w-full sm:w-auto">
              <div className="relative flex-1 sm:w-64">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
                <input
                  type="text"
                  placeholder="Search patients..."
                  className="text-black w-full pl-10 pr-4 py-2 bg-white border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
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
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
              {[1, 2, 3].map((i) => (
                <div
                  key={i}
                  className="h-64 bg-gray-200 rounded-2xl animate-pulse"
                ></div>
              ))}
            </div>
          ) : filteredPatients.length === 0 ? (
            <div className="text-center py-20 text-gray-500 bg-white rounded-2xl border border-gray-100">
              <p>No patients found matching your search.</p>
            </div>
          ) : (
            // PATIENTS CARDS GRID
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
              {filteredPatients.map((patient) => (
                <div
                  key={patient._id}
                  className="bg-white rounded-2xl shadow-sm hover:shadow-md border border-gray-100 transition-all duration-300 overflow-hidden group"
                >
                  {/* Card Header with Profile Pic */}
                  <div className="p-6 pb-4 flex items-start justify-between">
                    <div className="flex items-center gap-4">
                      <div className="w-14 h-14 rounded-full bg-gray-100 overflow-hidden border-2 border-white shadow-sm">
                        <img
                          src={
                            patient.profileImg ||
                            "https://via.placeholder.com/150"
                          }
                          alt={patient.name}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div>
                        <h3 className="text-lg font-bold text-gray-900 leading-tight">
                          {patient.name}
                        </h3>
                        <p className="text-gray-500 text-sm mt-0.5">
                          {patient.age} Years Old
                        </p>
                      </div>
                    </div>
                    <button className="text-gray-400 hover:text-gray-600">
                      <MoreVertical size={20} />
                    </button>
                  </div>

                  {/* Body Content */}
                  <div className="px-6 py-2 space-y-3">
                    <div className="flex items-center gap-3 text-gray-600 text-sm">
                      <Mail size={16} className="text-blue-500" />
                      <span className="truncate">{patient.email}</span>
                    </div>
                    <div className="flex items-center gap-3 text-gray-600 text-sm">
                      <Phone size={16} className="text-green-500" />
                      <span>{patient.contact}</span>
                    </div>
                    <div className="flex items-center gap-3 text-gray-600 text-sm">
                      <MapPin size={16} className="text-red-500" />
                      <span className="truncate">{patient.location}</span>
                    </div>
                    <div className="flex items-center gap-3 text-gray-600 text-sm">
                      <Calendar size={16} className="text-purple-500" />
                      <span>
                        Registered:{" "}
                        <span className="font-medium text-gray-800">
                          {new Date(
                            patient.createdAt || Date.now(),
                          ).toLocaleDateString()}
                        </span>
                      </span>
                    </div>
                  </div>

                  {/* Footer Actions */}
                  {/* <div className="p-4 border-t border-gray-100 bg-gray-50/50 mt-4 flex gap-3">
                    <button className="flex-1 py-2 bg-white border border-gray-200 hover:bg-gray-50 text-gray-700 rounded-lg text-sm font-medium transition-all shadow-sm">
                      View History
                    </button>
                    <button className="flex-1 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm font-medium transition-all shadow-sm flex items-center justify-center gap-2">
                      <FileText size={16} /> Details
                    </button>
                  </div> */}
                </div>
              ))}
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
