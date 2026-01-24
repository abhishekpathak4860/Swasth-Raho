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
  ShieldCheck,
  TrendingUp,
  TrendingDown,
  DollarSign,
  Activity,
  CreditCard,
} from "lucide-react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  Cell,
  PieChart,
  Pie,
  Legend,
} from "recharts";
import { useAuth } from "../../../../context/AuthContext";

// --- MOCK DATA FOR CHARTS ---
const revenueData = [
  { name: "Jan", revenue: 21000, expense: 15000 },
  { name: "Feb", revenue: 23000, expense: 18000 },
  { name: "Mar", revenue: 20000, expense: 12000 },
  { name: "Apr", revenue: 38000, expense: 25000 },
  { name: "May", revenue: 34000, expense: 22000 },
  { name: "Jun", revenue: 44000, expense: 28000 },
  { name: "Jul", revenue: 15000, expense: 10000 },
  { name: "Aug", revenue: 24000, expense: 16000 },
];

const specialtyData = [
  { name: "Dermatology", value: 68000, color: "#3B82F6" },
  { name: "Cardiology", value: 61000, color: "#10B981" },
  { name: "Neurology", value: 59000, color: "#F59E0B" },
  { name: "Orthopedic", value: 32000, color: "#6366F1" },
];

const profitMarginData = [
  { name: "Profit", value: 30.8, color: "#10B981" },
  { name: "Remaining", value: 69.2, color: "#E5E7EB" },
];

const recentTransactions = [
  {
    id: 1,
    procedure: "Appendectomy",
    hospital: "City Care",
    revenue: 29920,
    expense: 20590,
    margin: 31.2,
  },
  {
    id: 2,
    procedure: "Cataract Surgery",
    hospital: "Eye Vision",
    revenue: 25480,
    expense: 17830,
    margin: 30.0,
  },
  {
    id: 3,
    procedure: "Dental Cleaning",
    hospital: "Smile Dental",
    revenue: 22060,
    expense: 15480,
    margin: 29.8,
  },
  {
    id: 4,
    procedure: "MRI Scan",
    hospital: "City Care",
    revenue: 17020,
    expense: 11840,
    margin: 30.4,
  },
  {
    id: 5,
    procedure: "Knee Replacement",
    hospital: "Ortho Plus",
    revenue: 33800,
    expense: 23280,
    margin: 31.1,
  },
];

export default function SuperAdminDashboard() {
  const { user, fetchUser } = useAuth();
  const [activeTab, setActiveTab] = useState("profile");
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [showProfileMenu, setShowProfileMenu] = useState(false);

  useEffect(() => {
    fetchUser();
  }, []);

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
      {/* Mobile overlay */}
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
        {/* Top Header */}
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
                Hospital Transaction Dashboard
              </h2>
            </div>

            {/* Profile Dropdown */}
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
                  <div className="px-4 py-3 border-b border-gray-100">
                    <p className="text-sm font-medium text-gray-900 truncate">
                      {user?.name}
                    </p>
                    <p className="text-xs text-gray-500 truncate">
                      {user?.email}
                    </p>
                  </div>
                  <div className="py-1">
                    <button
                      onClick={handleLogout}
                      className="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50"
                    >
                      Sign out
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </header>

        {/* Dashboard Content */}
        <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8 bg-slate-50">
          {/* Welcome Row */}
          <div className="mb-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <h1 className="text-2xl font-bold text-slate-800">
                Financial Overview
              </h1>
              <p className="text-slate-500 text-sm">
                Real-time data across all registered hospitals.
              </p>
            </div>
            <div className="flex gap-2">
              <span className="px-3 py-1 bg-white border border-gray-200 rounded-md text-sm font-medium text-gray-600 shadow-sm">
                Year: 2026
              </span>
              <span className="px-3 py-1 bg-blue-600 text-white rounded-md text-sm font-medium shadow-md shadow-blue-200">
                Export Report
              </span>
            </div>
          </div>

          {/* 1. TOP STATS CARDS */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-8">
            {/* Revenue Card */}
            <div className="bg-white p-5 rounded-2xl shadow-[0_2px_10px_-3px_rgba(6,81,237,0.1)] border border-slate-100 relative overflow-hidden">
              <div className="absolute top-0 right-0 p-3 opacity-10">
                <DollarSign size={80} />
              </div>
              <p className="text-slate-500 font-medium text-sm">
                Total Revenue
              </p>
              <div className="flex items-end gap-2 mt-1">
                <h3 className="text-3xl font-bold text-slate-800">$274K</h3>
                <span className="flex items-center text-xs font-bold text-green-600 bg-green-50 px-1.5 py-0.5 rounded-md mb-1">
                  <TrendingUp size={12} className="mr-1" /> +12%
                </span>
              </div>
              {/* Mini Chart Decoration */}
              <div className="h-1 w-full bg-slate-100 mt-4 rounded-full overflow-hidden">
                <div className="h-full bg-blue-500 w-[70%]"></div>
              </div>
            </div>

            {/* Expense Card */}
            <div className="bg-white p-5 rounded-2xl shadow-[0_2px_10px_-3px_rgba(6,81,237,0.1)] border border-slate-100 relative overflow-hidden">
              <div className="absolute top-0 right-0 p-3 opacity-10">
                <CreditCard size={80} />
              </div>
              <p className="text-slate-500 font-medium text-sm">
                Total Expense
              </p>
              <div className="flex items-end gap-2 mt-1">
                <h3 className="text-3xl font-bold text-slate-800">$189K</h3>
                <span className="flex items-center text-xs font-bold text-red-500 bg-red-50 px-1.5 py-0.5 rounded-md mb-1">
                  <TrendingDown size={12} className="mr-1" /> +5%
                </span>
              </div>
              <div className="h-1 w-full bg-slate-100 mt-4 rounded-full overflow-hidden">
                <div className="h-full bg-orange-500 w-[45%]"></div>
              </div>
            </div>

            {/* Doctors Card */}
            <div className="bg-white p-5 rounded-2xl shadow-[0_2px_10px_-3px_rgba(6,81,237,0.1)] border border-slate-100">
              <div className="flex justify-between items-start">
                <div>
                  <p className="text-slate-500 font-medium text-sm">
                    Active Doctors
                  </p>
                  <h3 className="text-3xl font-bold text-slate-800 mt-1">81</h3>
                </div>
                <div className="p-3 bg-purple-50 text-purple-600 rounded-xl">
                  <Stethoscope size={24} />
                </div>
              </div>
              <p className="text-xs text-slate-400 mt-4">Across 12 Hospitals</p>
            </div>

            {/* Patients Card */}
            <div className="bg-white p-5 rounded-2xl shadow-[0_2px_10px_-3px_rgba(6,81,237,0.1)] border border-slate-100">
              <div className="flex justify-between items-start">
                <div>
                  <p className="text-slate-500 font-medium text-sm">
                    New Patients
                  </p>
                  <h3 className="text-3xl font-bold text-slate-800 mt-1">86</h3>
                </div>
                <div className="p-3 bg-blue-50 text-blue-600 rounded-xl">
                  <Users size={24} />
                </div>
              </div>
              <p className="text-xs text-slate-400 mt-4">This month</p>
            </div>
          </div>

          {/* 2. MIDDLE CHARTS SECTION */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 mb-8">
            {/* Revenue Trend Chart (Large) */}
            <div className="lg:col-span-8 bg-white p-6 rounded-2xl shadow-[0_2px_10px_-3px_rgba(6,81,237,0.1)] border border-slate-100">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-lg font-bold text-slate-800">
                  Trend of Revenue vs Expense
                </h3>
                <select className="bg-slate-50 border-none text-sm text-slate-600 rounded-md py-1 px-3 focus:ring-0">
                  <option>Last 8 Months</option>
                  <option>Last Year</option>
                </select>
              </div>
              <div className="h-[300px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart
                    data={revenueData}
                    margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
                  >
                    <defs>
                      <linearGradient
                        id="colorRevenue"
                        x1="0"
                        y1="0"
                        x2="0"
                        y2="1"
                      >
                        <stop
                          offset="5%"
                          stopColor="#3B82F6"
                          stopOpacity={0.3}
                        />
                        <stop
                          offset="95%"
                          stopColor="#3B82F6"
                          stopOpacity={0}
                        />
                      </linearGradient>
                      <linearGradient
                        id="colorExpense"
                        x1="0"
                        y1="0"
                        x2="0"
                        y2="1"
                      >
                        <stop
                          offset="5%"
                          stopColor="#F97316"
                          stopOpacity={0.3}
                        />
                        <stop
                          offset="95%"
                          stopColor="#F97316"
                          stopOpacity={0}
                        />
                      </linearGradient>
                    </defs>
                    <XAxis
                      dataKey="name"
                      axisLine={false}
                      tickLine={false}
                      tick={{ fill: "#94a3b8", fontSize: 12 }}
                    />
                    <YAxis
                      axisLine={false}
                      tickLine={false}
                      tick={{ fill: "#94a3b8", fontSize: 12 }}
                      tickFormatter={(value) => `$${value / 1000}k`}
                    />
                    <CartesianGrid vertical={false} stroke="#f1f5f9" />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: "#fff",
                        borderRadius: "10px",
                        border: "none",
                        boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
                      }}
                      formatter={(value: number) => [
                        `$${value.toLocaleString()}`,
                        "",
                      ]}
                    />
                    <Legend />
                    <Area
                      type="monotone"
                      dataKey="revenue"
                      stroke="#3B82F6"
                      strokeWidth={3}
                      fillOpacity={1}
                      fill="url(#colorRevenue)"
                    />
                    <Area
                      type="monotone"
                      dataKey="expense"
                      stroke="#F97316"
                      strokeWidth={3}
                      fillOpacity={1}
                      fill="url(#colorExpense)"
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Profit Margin Gauge (Small) */}
            <div className="lg:col-span-4 bg-white p-6 rounded-2xl shadow-[0_2px_10px_-3px_rgba(6,81,237,0.1)] border border-slate-100 flex flex-col items-center justify-center">
              <h3 className="text-lg font-bold text-slate-800 w-full text-left mb-2">
                Profit Margin (%)
              </h3>
              <div className="h-[200px] w-full relative">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={profitMarginData}
                      cx="50%"
                      cy="70%"
                      startAngle={180}
                      endAngle={0}
                      innerRadius={60}
                      outerRadius={85}
                      paddingAngle={0}
                      dataKey="value"
                      cornerRadius={5}
                    >
                      <Cell key="cell-0" fill="#10B981" />
                      <Cell key="cell-1" fill="#f3f4f6" />
                    </Pie>
                  </PieChart>
                </ResponsiveContainer>
                <div className="absolute top-[60%] left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-center">
                  <span className="text-4xl font-extrabold text-slate-800">
                    30.8%
                  </span>
                  <p className="text-xs text-slate-400">Net Margin</p>
                </div>
              </div>
              <div className="w-full mt-4">
                <div className="flex justify-between text-sm text-slate-600 border-b border-slate-100 pb-2">
                  <span>Target</span>
                  <span className="font-bold">35.0%</span>
                </div>
                <div className="flex justify-between text-sm text-slate-600 pt-2">
                  <span>Status</span>
                  <span className="font-bold text-orange-500">On Track</span>
                </div>
              </div>
            </div>
          </div>

          {/* 3. BOTTOM SECTION: BAR CHART & TABLE */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* Revenue By Specialty (Bar Chart) */}
            <div className="lg:col-span-5 bg-white p-6 rounded-2xl shadow-[0_2px_10px_-3px_rgba(6,81,237,0.1)] border border-slate-100">
              <h3 className="text-lg font-bold text-slate-800 mb-6">
                Revenue by Specialty
              </h3>
              <div className="h-[250px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    layout="vertical"
                    data={specialtyData}
                    margin={{ top: 0, right: 30, left: 20, bottom: 0 }}
                  >
                    <XAxis type="number" hide />
                    <YAxis
                      dataKey="name"
                      type="category"
                      width={90}
                      tick={{ fontSize: 12, fill: "#64748b" }}
                      axisLine={false}
                      tickLine={false}
                    />
                    <Tooltip
                      cursor={{ fill: "transparent" }}
                      contentStyle={{ borderRadius: "8px" }}
                    />
                    <Bar dataKey="value" barSize={20} radius={[0, 4, 4, 0]}>
                      {specialtyData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Transaction Table */}
            <div className="lg:col-span-7 bg-white p-6 rounded-2xl shadow-[0_2px_10px_-3px_rgba(6,81,237,0.1)] border border-slate-100 overflow-hidden">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-bold text-slate-800">
                  Procedure Breakdown
                </h3>
                <Link
                  href="/admin/superAdmin/reports"
                  className="text-sm text-blue-600 hover:underline"
                >
                  View All
                </Link>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="text-xs uppercase tracking-wide text-slate-400 border-b border-slate-100">
                      <th className="pb-3 pl-2">Procedure</th>
                      <th className="pb-3 text-right">Revenue</th>
                      <th className="pb-3 text-right">Expense</th>
                      <th className="pb-3 text-right">Margin</th>
                    </tr>
                  </thead>
                  <tbody className="text-sm">
                    {recentTransactions.map((tx) => (
                      <tr
                        key={tx.id}
                        className="hover:bg-slate-50 transition-colors group"
                      >
                        <td className="py-3 pl-2 border-b border-slate-50 group-last:border-none">
                          <p className="font-semibold text-slate-700">
                            {tx.procedure}
                          </p>
                          <p className="text-xs text-slate-400">
                            {tx.hospital}
                          </p>
                        </td>
                        <td className="py-3 text-right border-b border-slate-50 group-last:border-none font-medium text-slate-600">
                          ${tx.revenue.toLocaleString()}
                        </td>
                        <td className="py-3 text-right border-b border-slate-50 group-last:border-none font-medium text-slate-600">
                          ${tx.expense.toLocaleString()}
                        </td>
                        <td className="py-3 text-right border-b border-slate-50 group-last:border-none">
                          <span className="px-2 py-1 bg-blue-50 text-blue-600 rounded-md text-xs font-bold">
                            {tx.margin}%
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                  <tfoot>
                    <tr>
                      <td className="pt-4 pl-2 font-bold text-slate-800">
                        TOTAL
                      </td>
                      <td className="pt-4 text-right font-bold text-blue-600">
                        $273,560
                      </td>
                      <td className="pt-4 text-right font-bold text-orange-500">
                        $189,420
                      </td>
                      <td className="pt-4 text-right font-bold text-green-600">
                        30.8%
                      </td>
                    </tr>
                  </tfoot>
                </table>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
