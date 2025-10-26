"use client";
import React, { useEffect, useState } from "react";
import Link from "next/link";
import axios from "axios";

export default function PatientDashboard() {
  const [activeTab, setActiveTab] = useState("profile");
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [user, setUser] = useState<any>(null);
  const [editUserDetails, setEditUserDetails] = useState<any>(null);
  const [showEditModal, setShowEditModal] = useState(false);

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

  const handleEditUserDetails = async () => {
    setEditUserDetails({ ...user });
    setShowEditModal(true);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setEditUserDetails((prev: any) => ({
      ...prev,
      [name]: value,
    }));
  };
  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await axios.patch(
        `/patient/update-profile`,
        editUserDetails,
        { withCredentials: true }
      );

      // Update the user state with new data
      setUser(editUserDetails);
      setShowEditModal(false);
      // alert("Profile updated successfully!");
    } catch (error) {
      console.error("Error updating profile:", error);
      alert("Failed to update profile. Please try again.");
    }
  };
  const handleCloseModal = () => {
    setShowEditModal(false);
    setEditUserDetails(null);
  };

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await axios.get(`/patient/profile`, {
          withCredentials: true, // send cookies
        });
        setUser(res.data.patient);
      } catch (error) {
        console.error("Error fetching profile:", error);
      }
    };

    fetchProfile();
  }, []);

  const handleLogout = async () => {
    try {
      const res = await axios.post(
        `/api/logout`,
        {},
        { withCredentials: true }
      );

      // Clear user state and redirect
      setUser(null);
      window.location.href = "/login";
    } catch (error) {
      console.error("Error logging out:", error);
    }
  };

  return (
    <div
      className={`h-full bg-gray-50 ${showEditModal ? "overflow-hidden" : ""}`}
    >
      {/* Mobile overlay sidebar */}
      {isSidebarOpen && (
        <div
          className="fixed inset-0 bg-black/40 z-40 md:hidden"
          onClick={() => setIsSidebarOpen(false)}
        ></div>
      )}

      {/* Mobile Sidebar Drawer */}
      <aside
        className={`fixed top-0 left-0 z-50 h-full w-64 bg-white shadow-lg transform transition-transform md:hidden ${
          isSidebarOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="p-4 border-b border-gray-200 flex items-center justify-between">
          <div className="flex items-center">
            <div className="w-10 h-10 bg-gradient-to-r from-blue-600 to-green-600 rounded-full flex items-center justify-center">
              <span className="text-white font-bold text-xl">S</span>
            </div>
            <div className="ml-3">
              <h1 className="text-xl font-bold text-gray-800">Swasth-Raho</h1>
              <p className="text-sm text-gray-500">Patient Portal</p>
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
              {/* <span className="text-lg">{item.icon}</span> */}
              <span className="ml-3 font-medium">{item.label}</span>
            </Link>
          ))}
        </nav>
        <div className="absolute bottom-4 left-4 right-4">
          <button
            className="w-full flex items-center px-4 py-3 text-gray-700 hover:bg-red-50 hover:text-red-600 rounded-lg transition-colors"
            onClick={handleLogout}
          >
            {/* <span className="text-2xl">🚪</span> */}
            <span className="ml-3 font-medium">Logout</span>
          </button>
        </div>
      </aside>

      <div className="md:flex">
        {/* Desktop Sidebar */}
        <aside
          className={`hidden md:flex flex-col w-64 bg-white shadow-lg transition-all duration-300 flex-shrink-0 min-h-screen overflow-y-auto ${
            showEditModal ? "blur-sm" : ""
          }`}
          style={{ top: 0 }}
        >
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
          <nav className="mt-8 flex-1 px-2">
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
                <span className={`ml-3 font-medium`}>{item.label}</span>
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

        {/* Main Content */}
        <div className="flex-1 flex flex-col">
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
                  Patient Dashboard
                </h2>
              </div>

              <div className="flex items-center space-x-3">
                {/* Profile area with dropdown */}
                <div className="relative">
                  <button
                    onClick={() => setShowProfileMenu(!showProfileMenu)}
                    className="flex items-center space-x-3 p-1 rounded-md hover:bg-gray-100"
                  >
                    <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center">
                      <span className="text-white font-semibold">
                        {user?.name
                          ?.split(" ")
                          .map((ch: any) => ch[0]?.toUpperCase())
                          .join("")
                          .slice(0, 2)}
                      </span>
                    </div>
                    <div className="hidden md:block text-left">
                      <p className="text-sm font-medium text-gray-800">
                        {user?.name}
                      </p>
                      <p className="text-xs text-gray-500">{user?.email}</p>
                    </div>
                  </button>

                  {showProfileMenu && (
                    <div className="absolute right-0 mt-2 w-48 bg-white border border-gray-200 rounded-lg shadow-lg py-1 z-50">
                      <button
                        onClick={() => {
                          handleEditUserDetails();
                          setShowProfileMenu(false);
                        }}
                        className="w-full text-left px-4 py-2 text-sm hover:bg-gray-50"
                      >
                        Edit Profile
                      </button>
                      <button
                        onClick={() => {
                          handleLogout();
                          setShowProfileMenu(false);
                        }}
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

          {/* Main Content Area */}
          <main className="flex-1 p-4 md:p-6">
            {/* Profile Content (Default) */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-2xl font-bold text-gray-800">
                  Profile Information
                </h3>
                <button
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
                  onClick={handleEditUserDetails}
                >
                  Edit Profile
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
                      <p className="text-gray-800 font-medium">{user?.name}</p>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-600">
                        Age
                      </label>
                      <p className="text-gray-800 font-medium">
                        {user?.age} years
                      </p>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-600">
                        Role
                      </label>
                      <p className="text-gray-800 font-medium">{user?.role}</p>
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
                      <p className="text-gray-800 font-medium">{user?.email}</p>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-600">
                        Phone
                      </label>
                      <p className="text-gray-800 font-medium">
                        {user?.contact}
                      </p>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-600">
                        Location
                      </label>
                      <p className="text-gray-800 font-medium">
                        {user?.location}
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
              {/* <div className="mt-8 flex flex-wrap gap-4">
              <button className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition">
                📝 Edit Information
              </button>
              <button className="px-6 py-2 bg-yellow-600 text-white rounded-lg hover:bg-yellow-700 transition">
                🔒 Change Password
              </button>
        
            </div> */}
            </div>

            {/* Edit Profile Modal */}
            {showEditModal && (
              <>
                {/* Overlay */}
                <div
                  className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50"
                  onClick={handleCloseModal}
                ></div>

                {/* Modal Content */}
                <div className="fixed inset-0 flex items-center justify-center z-50 p-4 pointer-events-none">
                  <div className="bg-gradient-to-br from-blue-50 to-white rounded-2xl shadow-2xl w-full max-w-2xl pointer-events-auto border border-blue-200 overflow-hidden">
                    <div className="p-6">
                      {/* Header */}
                      <div className="flex items-center justify-between mb-6 -m-6 p-6 bg-gradient-to-r from-blue-600 to-green-600 text-white">
                        <div className="flex items-center space-x-3">
                          <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center">
                            <span className="text-2xl">👤</span>
                          </div>
                          <div>
                            <h3 className="text-2xl font-bold">Edit Profile</h3>
                            <p className="text-blue-100">
                              Update your personal information
                            </p>
                          </div>
                        </div>
                        <button
                          onClick={handleCloseModal}
                          className="text-white/80 hover:text-white text-2xl hover:bg-white/20 rounded-full w-8 h-8 flex items-center justify-center transition-all"
                        >
                          ✕
                        </button>
                      </div>

                      {/* Form */}
                      <form
                        onSubmit={handleUpdateProfile}
                        className="space-y-6 max-h-[60vh] overflow-y-auto pr-2"
                      >
                        <style jsx>{`
                          form::-webkit-scrollbar {
                            display: none;
                          }
                        `}</style>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          {/* Personal Information */}
                          <div className="space-y-4">
                            <h4 className="text-lg font-semibold text-gray-700 border-b pb-2">
                              Personal Details
                            </h4>

                            <div>
                              <label className="block text-sm font-semibold text-gray-700 mb-2">
                                Full Name
                              </label>
                              <input
                                type="text"
                                name="name"
                                value={editUserDetails?.name || ""}
                                onChange={handleInputChange}
                                className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-800 bg-white shadow-sm transition-all"
                                placeholder="Enter your full name"
                                required
                              />
                            </div>

                            <div>
                              <label className="block text-sm font-semibold text-gray-700 mb-2">
                                Age
                              </label>
                              <input
                                type="number"
                                name="age"
                                value={editUserDetails?.age || ""}
                                onChange={handleInputChange}
                                className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-800 bg-white shadow-sm transition-all"
                                placeholder="Enter your age"
                                min="1"
                                max="120"
                                required
                              />
                            </div>

                            <div>
                              <label className="block text-sm font-semibold text-gray-700 mb-2">
                                Role
                              </label>
                              <input
                                type="text"
                                name="role"
                                value={editUserDetails?.role || ""}
                                className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl bg-gray-100 text-gray-600"
                                readOnly
                              />
                            </div>
                          </div>

                          {/* Contact Information */}
                          <div className="space-y-4">
                            <h4 className="text-lg font-semibold text-gray-700 border-b pb-2">
                              Contact Details
                            </h4>

                            <div>
                              <label className="block text-sm font-semibold text-gray-700 mb-2">
                                Email Address
                              </label>
                              <input
                                type="email"
                                name="email"
                                value={editUserDetails?.email || ""}
                                onChange={handleInputChange}
                                className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-800 bg-white shadow-sm transition-all"
                                placeholder="your.email@example.com"
                                required
                              />
                            </div>

                            <div>
                              <label className="block text-sm font-semibold text-gray-700 mb-2">
                                Phone Number
                              </label>
                              <input
                                type="tel"
                                name="contact"
                                value={editUserDetails?.contact || ""}
                                onChange={handleInputChange}
                                className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-800 bg-white shadow-sm transition-all"
                                placeholder="+91 98765 43210"
                                required
                              />
                            </div>

                            <div>
                              <label className="block text-sm font-semibold text-gray-700 mb-2">
                                Location
                              </label>
                              <input
                                type="text"
                                name="location"
                                value={editUserDetails?.location || ""}
                                onChange={handleInputChange}
                                className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-800 bg-white shadow-sm transition-all"
                                placeholder="Enter your location"
                                required
                              />
                            </div>
                          </div>
                        </div>

                        {/* Action Buttons */}
                        <div className="flex space-x-4 pt-6 border-t border-gray-200">
                          <button
                            type="submit"
                            className="flex-1 px-6 py-3 bg-gradient-to-r from-blue-600 to-green-600 text-white rounded-xl hover:from-blue-700 hover:to-green-700 transition-all font-semibold shadow-lg hover:shadow-xl transform hover:scale-105"
                          >
                            Update Profile
                          </button>
                          <button
                            type="button"
                            onClick={handleCloseModal}
                            className="flex-1 px-6 py-3 bg-gray-500 text-white rounded-xl hover:bg-gray-600 transition-all font-semibold shadow-lg"
                          >
                            Cancel
                          </button>
                        </div>
                      </form>
                    </div>
                  </div>
                </div>
              </>
            )}
            {/* Quick Stats */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 mt-6">
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <div className="flex items-center">
                  <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center">
                    <span className="text-white text-xl">📅</span>
                  </div>
                  <div className="ml-3">
                    <p className="text-sm text-blue-600 font-medium">
                      Upcoming
                    </p>
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
                    <p className="text-sm text-purple-600 font-medium">
                      Reports
                    </p>
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
                    <p className="text-sm text-orange-600 font-medium">
                      Doctors
                    </p>
                    <p className="text-2xl font-bold text-orange-800">5</p>
                  </div>
                </div>
              </div>
            </div>
          </main>
        </div>
      </div>

      {/* Floating AI Chat Button */}
      <button className="fixed bottom-6 right-6 w-14 h-14 bg-gradient-to-r from-blue-600 to-green-600 text-white rounded-full shadow-lg hover:shadow-xl transition-all duration-300 flex items-center justify-center z-50">
        <span className="text-2xl">💬</span>
      </button>
    </div>
  );
}
