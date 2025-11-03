"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import axios from "axios";

export default function Patients() {
  const [activeTab, setActiveTab] = useState("patients");
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [doctor, setDoctor] = useState<any>(null);
  const [query, setQuery] = useState("");

  // Dummy patients array (belongs to the doctor)
  const [patients, setPatients] = useState<any[]>([
    // {
    //   name: "Ravi Sharma",
    //   email: "ravi@example.com",
    //   password: "$2b$10$bVxawoMPJbYCnvtwnN5G8uKyeKHWUrS6JEM81e5QEZtxshcsBJi3i",
    //   role: "patient",
    //   age: 28,
    //   location: "Lucknow",
    //   contact: "9123456789",
    //   __v: 0,
    // },
  ]);
  const fetchPatients = async () => {
    try {
      const res = await axios.get("/doctor/fetchPatients", {
        withCredentials: true,
      });
      setPatients(res.data.patients);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchPatients();
  }, []);
  const sidebarItems = [
    { id: "profile", label: "Profile", icon: "👤", route: "/admin/doctor" },
    {
      id: "appointments",
      label: "Appointments",
      icon: "📅",
      route: "/admin/doctor/appointments",
    },
    {
      id: "patients",
      label: "Patients",
      icon: "🧑‍🤝‍🧑",
      route: "/admin/doctor/patients",
    },
    {
      id: "revenue",
      label: "Revenue",
      icon: "💰",
      route: "/admin/doctor/revenue",
    },
  ];

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await axios.get(`/doctor/profile`, {
          withCredentials: true,
        });
        setDoctor(res.data.doctor);
      } catch (err) {
        // keep doctor null if fetch fails; UI will use dummy header
        console.warn("Could not fetch doctor profile, using placeholder", err);
      }
    };

    fetchProfile();
  }, []);

  const filtered = patients.filter((p) =>
    p.name.toLowerCase().includes(query.trim().toLowerCase())
  );

  const handleLogout = async () => {
    try {
      await axios.post(`/api/logout`, {}, { withCredentials: true });
      window.location.href = "/login";
    } catch (error) {
      console.error("Error logging out:", error);
    }
  };

  return (
    <div className={`min-h-screen bg-gray-50`}>
      {/* Mobile overlay */}
      {isSidebarOpen && (
        <div
          className="fixed inset-0 bg-black/40 z-40 md:hidden"
          onClick={() => setIsSidebarOpen(false)}
        ></div>
      )}

      {/* Mobile Drawer */}
      <aside
        className={`fixed top-0 left-0 z-50 h-full w-64 bg-white shadow-lg transform transition-transform md:hidden ${
          isSidebarOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="p-4 border-b border-gray-200 flex items-center justify-between">
          <div className="flex items-center">
            <div className="w-10 h-10 bg-linear-to-r from-blue-600 to-green-600 rounded-full flex items-center justify-center">
              <span className="text-white font-bold text-xl">D</span>
            </div>
            <div className="ml-3">
              <h1 className="text-xl font-bold text-gray-800">Swasth-Raho</h1>
              <p className="text-sm text-gray-500">Doctor Portal</p>
            </div>
          </div>
          <button
            className="p-2 rounded-md hover:bg-gray-100"
            onClick={() => setIsSidebarOpen(false)}
          >
            ✕
          </button>
        </div>
        <nav className="mt-6 px-2">
          {sidebarItems.map((item) => (
            <Link
              key={item.id}
              href={item.route}
              className={`flex items-center px-3 py-3 rounded-lg transition-colors ${
                activeTab === item.id
                  ? "bg-blue-50 text-blue-600"
                  : "text-gray-700 hover:bg-gray-50"
              }`}
              onClick={() => {
                setActiveTab(item.id);
                setIsSidebarOpen(false);
              }}
            >
              <span className="ml-3 font-medium">{item.label}</span>
            </Link>
          ))}
        </nav>
        <div className="absolute bottom-4 left-4 right-4">
          <button
            className="w-full flex items-center px-4 py-3 text-gray-700 hover:bg-red-50 hover:text-red-600 rounded-lg transition-colors"
            onClick={handleLogout}
          >
            <span className="ml-3 font-medium">Logout</span>
          </button>
        </div>
      </aside>

      <div className="md:flex min-h-screen">
        {/* Desktop fixed sidebar */}
        <aside className="hidden md:flex flex-col w-64 bg-white shadow-lg flex-shrink-0 h-screen fixed left-0 top-0">
          <div className="p-4 border-b border-gray-200">
            <div className="flex items-center">
              <div className="w-10 h-10 bg-linear-to-r from-blue-600 to-green-600 rounded-full flex items-center justify-center">
                <span className="text-white font-bold text-xl">D</span>
              </div>
              <div className="ml-3">
                <h1 className="text-xl font-bold text-gray-800">Swasth-Raho</h1>
                <p className="text-sm text-gray-500">Doctor Portal</p>
              </div>
            </div>
          </div>
          <nav className="mt-6 flex-1 px-2 overflow-y-auto">
            {sidebarItems.map((item) => (
              <Link
                key={item.id}
                href={item.route}
                className={`flex items-center px-4 py-3 mx-2 rounded-lg transition-colors ${
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
          <div className="p-4">
            <button
              className="w-full flex items-center px-4 py-3 text-gray-700 hover:bg-red-50 hover:text-red-600 rounded-lg transition-colors"
              onClick={handleLogout}
            >
              <span className="text-2xl">🚪</span>
              <span className="ml-3 font-medium">Logout</span>
            </button>
          </div>
        </aside>

        {/* Main area; add left margin on md+ to account for fixed sidebar */}
        <div className="flex-1 md:ml-64 flex flex-col">
          {/* Header */}
          <header className="bg-white shadow-sm border-b border-gray-200 px-4 md:px-6 py-3 sticky top-0 z-30">
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
                <h2 className="text-lg md:text-2xl font-bold text-gray-800 ml-2">
                  Patients
                </h2>
              </div>

              <div className="flex items-center space-x-3">
                <div className="relative">
                  <button
                    onClick={() => setShowProfileMenu(!showProfileMenu)}
                    className="flex items-center space-x-3 p-1 rounded-md hover:bg-gray-100"
                  >
                    <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center">
                      <span className="text-white font-semibold">
                        {doctor?.name
                          ?.split(" ")
                          .map((n: any) => n[0])
                          .join("")
                          .slice(0, 2)}
                      </span>
                    </div>
                    <div className="hidden md:block text-left">
                      <p className="text-sm font-medium text-gray-800">
                        {doctor?.name || "Dr. Meera Sharma"}
                      </p>
                      <p className="text-xs text-gray-500">
                        {doctor?.email || "doctor@example.com"}
                      </p>
                    </div>
                  </button>

                  {showProfileMenu && (
                    <div className="absolute right-0 mt-2 w-48 bg-white border border-gray-200 rounded-lg shadow-lg py-1 z-50">
                      <button
                        onClick={() => setShowProfileMenu(false)}
                        className="w-full text-left px-4 py-2 text-sm hover:bg-gray-50"
                      >
                        Close
                      </button>
                      <button
                        onClick={handleLogout}
                        className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-50"
                      >
                        Logout
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </header>

          {/* Main Content */}
          <main className="flex-1 p-4 md:p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-2xl font-bold text-gray-800">My Patients</h3>
              <div className="w-full max-w-sm ml-4">
                <input
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Search by patient name"
                  className="w-full px-4 py-2 border-2 border-gray-200 text-black rounded-xl focus:outline-none"
                />
              </div>
            </div>
            <hr className="text-black" />

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-4">
              {filtered.map((p: any, idx: number) => (
                <div
                  key={idx}
                  className="rounded-xl p-6 bg-gradient-to-br from-slate-50 to-white shadow-md hover:shadow-lg border border-transparent hover:border-gray-100 transition transform hover:-translate-y-1"
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <h4 className="text-xl font-semibold text-gray-800">
                        {p.name}
                      </h4>
                      <p className="text-sm text-gray-500">{p.role}</p>
                    </div>
                    <div className="w-12 h-12 bg-linear-to-r from-purple-600 to-pink-500 rounded-full flex items-center justify-center text-white font-semibold">
                      {p.name
                        .split(" ")
                        .map((n: string) => n[0])
                        .slice(0, 2)
                        .join("")}
                    </div>
                  </div>

                  <div className="mt-4 text-gray-700 space-y-2">
                    <p>
                      <span className="font-medium">Age:</span> {p.age}
                    </p>
                    <p>
                      <span className="font-medium">Location:</span>{" "}
                      {p.location}
                    </p>
                    <p>
                      <span className="font-medium">Mobile:</span> {p.contact}
                    </p>
                    <p>
                      <span className="font-medium">Email:</span> {p.email}
                    </p>
                  </div>

                  <div className="mt-6">
                    {/* <Link
                      href={`#/patient/${p.email}`}
                      className="px-4 py-2 bg-blue-600 text-white rounded-lg"
                    >
                      View
                    </Link> */}
                    <button className="px-4 py-2 border border-gray-200 rounded-lg text-gray-700">
                      Message
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {filtered.length === 0 && (
              <div className="mt-10 text-center text-gray-500">
                No patients found.
              </div>
            )}
          </main>
        </div>
      </div>

      {/* Floating chat button */}
      <button className="fixed bottom-6 right-6 w-14 h-14 bg-linear-to-r from-blue-600 to-green-600 text-white rounded-full shadow-lg hover:shadow-xl transition-all duration-300 flex items-center justify-center z-50">
        💬
      </button>
    </div>
  );
}
