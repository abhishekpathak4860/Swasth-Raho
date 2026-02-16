"use client";
import React, { useState, useEffect } from "react";
import Link from "next/link";
import axios from "axios";
import { usePathname } from "next/navigation";
import {
  User,
  CalendarDays,
  Stethoscope,
  FileText,
  Hospital,
  Receipt,
  MessageCircle,
  MessageSquare,
  LogOut,
  Menu,
  X,
  ChevronDown,
} from "lucide-react";
import { useAuth } from "../../../../context/AuthContext";

export default function PatientLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user, fetchUser } = useAuth();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [showProfileMenu, setShowProfileMenu] = useState(false);

  // Get current path for active tab highlighting
  const pathname = usePathname();

  useEffect(() => {
    fetchUser();
  }, []);

  const handleLogout = async () => {
    try {
      await axios.post("/api/logout", {}, { withCredentials: true });
      window.location.href = "/login";
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

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
      label: "Swasth Bot",
      icon: MessageCircle,
      route: "/admin/patient/chat",
    },
    {
      id: "messages",
      label: "Messages",
      icon: MessageSquare,
      route: "/admin/patient/messages",
    },
  ];

  // Helper to check if a tab is active
  const isActive = (route: string) => {
    // Exact match for dashboard home (Profile)
    if (route === "/admin/patient" && pathname !== "/admin/patient")
      return false;
    return pathname?.startsWith(route);
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
        {/* Sidebar Header */}
        <div className="p-6 border-b border-gray-100 flex items-center justify-between">
          <div className="flex items-center gap-3">
            {/* Blue-Green Gradient Logo */}
            <div className="w-10 h-10 bg-gradient-to-r from-blue-600 to-green-600 rounded-full flex items-center justify-center shadow-lg shadow-blue-200">
              <span className="text-white font-bold text-xl">S</span>
            </div>
            <div>
              <h1 className="text-lg font-bold text-gray-800 leading-tight">
                Swasth-Raho
              </h1>
              <p className="text-[10px] uppercase tracking-wider text-gray-500 font-semibold">
                Patient Portal
              </p>
            </div>
          </div>
          <button
            className="md:hidden text-gray-500 hover:bg-gray-100 p-1 rounded-md"
            onClick={() => setIsSidebarOpen(false)}
          >
            <X size={20} />
          </button>
        </div>

        {/* Navigation Links */}
        <nav className="mt-6 px-4 space-y-2 overflow-y-auto max-h-[calc(100vh-160px)] custom-scrollbar">
          {sidebarItems.map((item) => {
            const active = isActive(item.route);
            return (
              <Link
                key={item.id}
                href={item.route}
                onClick={() => setIsSidebarOpen(false)}
                className={`flex items-center px-4 py-3 rounded-xl transition-all duration-200 group ${
                  active
                    ? "bg-blue-50 text-blue-600 font-semibold border-l-4 border-blue-600"
                    : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                }`}
              >
                <item.icon
                  className={`w-5 h-5 transition-colors ${
                    active ? "text-blue-600" : "text-gray-400"
                  }`}
                />
                <span className="ml-3">{item.label}</span>
              </Link>
            );
          })}
        </nav>

        {/* Logout Button */}
        <div className="absolute bottom-0 w-full p-4 border-t border-gray-100 bg-gray-50/50">
          <button
            onClick={handleLogout}
            className="w-full flex items-center justify-center px-4 py-2.5 text-red-600 hover:bg-red-50 rounded-lg transition-colors font-medium text-sm gap-2"
          >
            <LogOut size={18} /> Logout
          </button>
        </div>
      </aside>

      {/* ---------------- MAIN CONTENT WRAPPER ---------------- */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* TOP HEADER */}
        <header className="bg-white border-b border-gray-200 sticky top-0 z-30">
          <div className="flex items-center justify-between px-4 sm:px-6 py-3">
            {/* Left: Menu Toggle & Title */}
            <div className="flex items-center gap-3">
              <button
                onClick={() => setIsSidebarOpen(true)}
                className="md:hidden p-2 text-gray-600 hover:bg-gray-100 rounded-lg"
              >
                <Menu size={24} />
              </button>
              <h2 className="text-xl font-bold text-gray-800 hidden sm:block">
                Patient Dashboard
              </h2>
            </div>

            {/* Right: Profile */}
            <div className="relative">
              <button
                onClick={() => setShowProfileMenu(!showProfileMenu)}
                className="flex items-center gap-3 p-1.5 rounded-full hover:bg-gray-50 border border-transparent hover:border-gray-200 transition-all"
              >
                <div className="text-right hidden sm:block">
                  <p className="text-sm font-semibold text-gray-800">
                    {user?.name || "Patient"}
                  </p>
                  <p className="text-xs text-gray-500">
                    {user?.email || "patient@example.com"}
                  </p>
                </div>
                {/* Avatar with Blue-Green Gradient Border */}
                <div className="w-9 h-9 rounded-full bg-gradient-to-r from-blue-100 to-green-100 p-[2px] overflow-hidden">
                  <img
                    src={user?.profileImg || "https://via.placeholder.com/150"}
                    alt="Profile"
                    className="w-full h-full object-cover rounded-full bg-white"
                  />
                </div>
                <ChevronDown size={16} className="text-gray-400" />
              </button>

              {/* Dropdown Menu */}
              {showProfileMenu && (
                <div className="absolute right-0 mt-2 w-48 bg-white border border-gray-100 rounded-xl shadow-lg py-1 z-50 animate-in fade-in zoom-in duration-200">
                  <div className="px-4 py-3 border-b border-gray-50">
                    <p className="text-sm font-medium text-gray-900 truncate">
                      {user?.name}
                    </p>
                    <p className="text-xs text-gray-500 truncate">
                      {user?.email}
                    </p>
                  </div>
                  <div className="p-1">
                    <Link
                      href="/admin/patient"
                      className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 rounded-lg"
                      onClick={() => setShowProfileMenu(false)}
                    >
                      My Profile
                    </Link>
                    <button
                      onClick={handleLogout}
                      className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 rounded-lg"
                    >
                      Sign out
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </header>

        {/* PAGE CONTENT */}
        <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8 bg-slate-50 relative">
          {children}

          {/* Floating AI Chat Button */}
          <Link
            href="/admin/patient/chat"
            className="fixed bottom-6 right-6 w-14 h-14 bg-gradient-to-r from-blue-600 to-green-600 text-white rounded-full shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-300 flex items-center justify-center z-40"
          >
            <MessageCircle className="w-7 h-7" />
          </Link>
        </main>
      </div>
    </div>
  );
}
