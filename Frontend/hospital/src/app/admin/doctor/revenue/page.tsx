"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import axios from "axios";

export default function Revenue() {
  const [activeTab, setActiveTab] = useState("revenue");
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [doctor, setDoctor] = useState<any>(null);

  // Dummy stats and revenue rows
  const stats = {
    totalRevenue: 45200,
    totalPatients: 128,
    totalTreatments: 76,
    totalReports: 42,
  };

  const [rows] = useState<any[]>([
    {
      date: "2025-10-20",
      patient: "Ravi Sharma",
      disease: "Heart Checkup",
      consultationFee: 1500,
      amountReceived: 1500,
      paymentStatus: "paid",
    },
    {
      date: "2025-11-01",
      patient: "Priya Singh",
      disease: "Dermatology",
      consultationFee: 1200,
      amountReceived: 0,
      paymentStatus: "pending",
    },
    {
      date: "2025-11-03",
      patient: "Aman N",
      disease: "Foot Problem",
      consultationFee: 1000,
      amountReceived: 1000,
      paymentStatus: "paid",
    },
    {
      date: "2025-11-05",
      patient: "Kiran B",
      disease: "Consultation",
      consultationFee: 900,
      amountReceived: 0,
      paymentStatus: "failed",
    },
  ]);

  // Filters
  const [searchQuery, setSearchQuery] = useState("");
  const [paymentFilter, setPaymentFilter] = useState("all"); // all | paid | pending | failed

  const filteredRows = rows.filter((r) => {
    const matchesName = r.patient
      .toLowerCase()
      .includes(searchQuery.trim().toLowerCase());
    const matchesStatus =
      paymentFilter === "all" ? true : r.paymentStatus === paymentFilter;
    return matchesName && matchesStatus;
  });

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
        // ignore and keep null
      }
    };
    fetchProfile();
  }, []);

  const handleLogout = async () => {
    try {
      await axios.post(`/api/logout`, {}, { withCredentials: true });
      window.location.href = "/login";
    } catch (error) {
      console.error("Error logging out:", error);
    }
  };

  const getStatusClasses = (s: string) => {
    switch (s) {
      case "paid":
        return "bg-emerald-100 text-emerald-800";
      case "pending":
        return "bg-yellow-100 text-yellow-800";
      case "failed":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
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
              onClick={() => setIsSidebarOpen(false)}
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
                  Revenue
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
            {/* Stats cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
              <div className="bg-white rounded-lg border border-gray-200 p-4 shadow-sm">
                <p className="text-sm text-gray-500">Total Revenue</p>
                <p className="text-2xl font-bold text-gray-800">
                  ₹ {stats.totalRevenue.toLocaleString()}
                </p>
              </div>
              <div className="bg-white rounded-lg border border-gray-200 p-4 shadow-sm">
                <p className="text-sm text-gray-500">Total Patients</p>
                <p className="text-2xl font-bold text-gray-800">
                  {stats.totalPatients}
                </p>
              </div>
              <div className="bg-white rounded-lg border border-gray-200 p-4 shadow-sm">
                <p className="text-sm text-gray-500">Total Treatments</p>
                <p className="text-2xl font-bold text-gray-800">
                  {stats.totalTreatments}
                </p>
              </div>
              <div className="bg-white rounded-lg border border-gray-200 p-4 shadow-sm">
                <p className="text-sm text-gray-500">Total Reports</p>
                <p className="text-2xl font-bold text-gray-800">
                  {stats.totalReports}
                </p>
              </div>
            </div>

            {/* Filter controls */}
            <div className="bg-white rounded-lg border border-gray-200 p-4 shadow-sm mb-6">
              <h4 className="text-lg font-semibold text-gray-800 mb-4">
                Filter Transactions
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="text-sm text-gray-600 mb-1 block">
                    Search by Patient
                  </label>
                  <input
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Type patient name..."
                    className="w-full px-4 py-2 border-2 border-gray-200 rounded-xl text-black focus:outline-none"
                  />
                </div>
                <div>
                  <label className="text-sm text-gray-600 mb-1 block">
                    Payment Status
                  </label>
                  <select
                    value={paymentFilter}
                    onChange={(e) => setPaymentFilter(e.target.value)}
                    className="w-full px-4 py-2 border-2 border-gray-200 text-black rounded-xl"
                  >
                    <option value="all">All</option>
                    <option value="paid">Paid</option>
                    <option value="pending">Pending</option>
                    <option value="failed">Failed</option>
                  </select>
                </div>
                <div className="flex items-end">
                  <button
                    onClick={() => {
                      setSearchQuery("");
                      setPaymentFilter("all");
                    }}
                    className="px-4 py-2 bg-gray-100 rounded-lg text-black"
                  >
                    Clear
                  </button>
                </div>
              </div>
            </div>

            {/* Table */}
            <div className="bg-white rounded-lg border border-gray-200 p-4 shadow-sm overflow-x-auto">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">
                Revenue Transactions
              </h3>
              <table className="w-full text-left table-auto">
                <thead>
                  <tr className="text-sm text-gray-500 border-b">
                    <th className="py-3 px-3">Date</th>
                    <th className="py-3 px-3">Patient</th>
                    <th className="py-3 px-3">Disease</th>
                    <th className="py-3 px-3">Consultation Fee</th>
                    <th className="py-3 px-3">Amount Received</th>
                    <th className="py-3 px-3">Payment Status</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredRows.map((r, i) => (
                    <tr key={i} className="odd:bg-white even:bg-gray-50">
                      <td className="py-4 px-3 text-sm text-gray-700">
                        {r.date}
                      </td>
                      <td className="py-4 px-3 text-sm text-gray-700">
                        {r.patient}
                      </td>
                      <td className="py-4 px-3 text-sm text-gray-700">
                        {r.disease}
                      </td>
                      <td className="py-4 px-3 text-sm text-gray-700">
                        ₹ {r.consultationFee}
                      </td>
                      <td className="py-4 px-3 text-sm text-gray-700">
                        ₹ {r.amountReceived}
                      </td>
                      <td className="py-4 px-3 text-sm">
                        <span
                          className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${getStatusClasses(
                            r.paymentStatus
                          )}`}
                        >
                          {r.paymentStatus.toUpperCase()}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
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
