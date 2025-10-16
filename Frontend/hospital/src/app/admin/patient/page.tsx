"use client";
import React, { useState } from "react";
import Link from "next/link";

export default function PatientDashboard() {
  const [activeTab, setActiveTab] = useState("profile");
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

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
      id: "chat",
      label: "AI Assistant",
      icon: "💬",
      route: "/admin/patient/chat",
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Sidebar */}
      <div
        className={`bg-white shadow-lg transition-all duration-300 ${
          isSidebarOpen ? "w-64" : "w-20"
        } md:w-64 flex-shrink-0`}
      >
        <div className="p-4 border-b border-gray-200">
          <div className="flex items-center">
            <div className="w-10 h-10 bg-gradient-to-r from-blue-600 to-green-600 rounded-full flex items-center justify-center">
              <span className="text-white font-bold text-xl">S</span>
            </div>
            <div
              className={`ml-3 ${isSidebarOpen ? "block" : "hidden"} md:block`}
            >
              <h1 className="text-xl font-bold text-gray-800">Swasth-Raho</h1>
              <p className="text-sm text-gray-500">Patient Portal</p>
            </div>
          </div>
        </div>

        {/* Navigation Menu */}
        <nav className="mt-8">
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
              <span
                className={`ml-3 font-medium ${
                  isSidebarOpen ? "block" : "hidden"
                } md:block`}
              >
                {item.label}
              </span>
            </Link>
          ))}
        </nav>

        {/* Logout Button */}
        <div className="absolute bottom-4 left-4 right-4">
          <button className="w-full flex items-center px-4 py-3 text-gray-700 hover:bg-red-50 hover:text-red-600 rounded-lg transition-colors">
            <span className="text-2xl">🚪</span>
            <span
              className={`ml-3 font-medium ${
                isSidebarOpen ? "block" : "hidden"
              } md:block`}
            >
              Logout
            </span>
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {/* Header */}
        <header className="bg-white shadow-sm border-b border-gray-200 px-6 py-4">
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
              <h2 className="text-2xl font-bold text-gray-800 ml-2">
                Patient Dashboard
              </h2>
            </div>

            <div className="flex items-center space-x-4">
              {/* Notifications */}
              <button className="relative p-2 text-gray-600 hover:bg-gray-100 rounded-full">
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
                    d="M15 17h5l-3.405-3.405A9.037 9.037 0 0118 9c0-4.418-3.582-8-8-8S2 4.582 2 9c0 1.847.56 3.564 1.521 4.992L6 17h4m0 0v1a3 3 0 106 0v-1m-6 0h6"
                  />
                </svg>
                <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">
                  3
                </span>
              </button>

              {/* Profile Dropdown */}
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center">
                  <span className="text-white font-semibold">JD</span>
                </div>
                <div className="hidden md:block">
                  <p className="text-sm font-medium text-gray-800">John Doe</p>
                  <p className="text-xs text-gray-500">Patient ID: P001</p>
                </div>
              </div>
            </div>
          </div>
        </header>

        {/* Main Content Area */}
        <main className="flex-1 p-6">
          {/* Profile Content (Default) */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-2xl font-bold text-gray-800">
                👤 Profile Information
              </h3>
              <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition">
                Edit Profile
              </button>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              {/* Personal Information */}
              <div className="space-y-4">
                <h4 className="text-lg font-semibold text-gray-700 border-b pb-2">
                  Personal Details
                </h4>

                <div className="space-y-3">
                  <div>
                    <label className="block text-sm font-medium text-gray-600">
                      Full Name
                    </label>
                    <p className="text-gray-800 font-medium">John Doe</p>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-600">
                      Age
                    </label>
                    <p className="text-gray-800 font-medium">32 years</p>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-600">
                      Gender
                    </label>
                    <p className="text-gray-800 font-medium">Male</p>
                  </div>

                  {/* <div>
                    <label className="block text-sm font-medium text-gray-600">
                      Blood Group
                    </label>
                    <p className="text-gray-800 font-medium">O+</p>
                  </div> */}
                </div>
              </div>

              {/* Contact Information */}
              <div className="space-y-4">
                <h4 className="text-lg font-semibold text-gray-700 border-b pb-2">
                  Contact Details
                </h4>

                <div className="space-y-3">
                  <div>
                    <label className="block text-sm font-medium text-gray-600">
                      Email
                    </label>
                    <p className="text-gray-800 font-medium">
                      john.doe@email.com
                    </p>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-600">
                      Phone
                    </label>
                    <p className="text-gray-800 font-medium">+91 98765 43210</p>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-600">
                      Location
                    </label>
                    <p className="text-gray-800 font-medium">
                      123 Health Street, Medical City, MC 12345
                    </p>
                  </div>

                  {/* <div>
                    <label className="block text-sm font-medium text-gray-600">
                      Emergency Contact
                    </label>
                    <p className="text-gray-800 font-medium">
                      Jane Doe - +91 87654 32109
                    </p>
                  </div> */}
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="mt-8 flex flex-wrap gap-4">
              <button className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition">
                📝 Edit Information
              </button>
              <button className="px-6 py-2 bg-yellow-600 text-white rounded-lg hover:bg-yellow-700 transition">
                🔒 Change Password
              </button>
              {/* <button className="px-6 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition">
                🗑️ Delete Account
              </button> */}
            </div>
          </div>

          {/* Quick Stats */}
          <div className="grid md:grid-cols-4 gap-4 mt-6">
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <div className="flex items-center">
                <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center">
                  <span className="text-white text-xl">📅</span>
                </div>
                <div className="ml-3">
                  <p className="text-sm text-blue-600 font-medium">Upcoming</p>
                  <p className="text-2xl font-bold text-blue-800">3</p>
                </div>
              </div>
            </div>

            <div className="bg-green-50 border border-green-200 rounded-lg p-4">
              <div className="flex items-center">
                <div className="w-10 h-10 bg-green-600 rounded-full flex items-center justify-center">
                  <span className="text-white text-xl">✅</span>
                </div>
                <div className="ml-3">
                  <p className="text-sm text-green-600 font-medium">
                    Completed
                  </p>
                  <p className="text-2xl font-bold text-green-800">12</p>
                </div>
              </div>
            </div>

            <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
              <div className="flex items-center">
                <div className="w-10 h-10 bg-purple-600 rounded-full flex items-center justify-center">
                  <span className="text-white text-xl">📄</span>
                </div>
                <div className="ml-3">
                  <p className="text-sm text-purple-600 font-medium">Reports</p>
                  <p className="text-2xl font-bold text-purple-800">8</p>
                </div>
              </div>
            </div>

            <div className="bg-orange-50 border border-orange-200 rounded-lg p-4">
              <div className="flex items-center">
                <div className="w-10 h-10 bg-orange-600 rounded-full flex items-center justify-center">
                  <span className="text-white text-xl">👨‍⚕️</span>
                </div>
                <div className="ml-3">
                  <p className="text-sm text-orange-600 font-medium">Doctors</p>
                  <p className="text-2xl font-bold text-orange-800">5</p>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>

      {/* Floating AI Chat Button */}
      <button className="fixed bottom-6 right-6 w-14 h-14 bg-gradient-to-r from-blue-600 to-green-600 text-white rounded-full shadow-lg hover:shadow-xl transition-all duration-300 flex items-center justify-center z-50">
        <span className="text-2xl">💬</span>
      </button>
    </div>
  );
}
