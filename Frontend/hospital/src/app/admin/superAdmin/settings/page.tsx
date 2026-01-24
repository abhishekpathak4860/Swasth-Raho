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
  User,
  Lock,
  Camera,
  Save,
  Loader2,
  ShieldAlert,
  Edit2,
} from "lucide-react";
import { useAuth } from "../../../../../context/AuthContext";

export default function AdminSettings() {
  const { user, fetchUser } = useAuth();
  const [activeTab, setActiveTab] = useState("settings");
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [showProfileMenu, setShowProfileMenu] = useState(false);

  // Settings State
  const [section, setSection] = useState<"general" | "security">("general");
  const [loading, setLoading] = useState(false);
  const [isEditing, setIsEditing] = useState(false); // Controls Read-Only Mode
  const [message, setMessage] = useState({ type: "", text: "" });

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    profileImg: "",
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  // Load user data
  useEffect(() => {
    fetchUser();
  }, []);

  useEffect(() => {
    if (user) {
      setFormData((prev) => ({
        ...prev,
        name: user.name || "",
        email: user.email || "",
        profileImg: user.profileImg || "",
      }));
    }
  }, [user]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleEditToggle = () => {
    // If cancelling edit, revert to original user data
    if (isEditing && user) {
      setFormData((prev) => ({
        ...prev,
        name: user.name || "",
        email: user.email || "",
        profileImg: user.profileImg || "",
      }));
    }
    setIsEditing(!isEditing);
    setMessage({ type: "", text: "" });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage({ type: "", text: "" });
    setLoading(true);

    try {
      if (section === "security") {
        if (formData.newPassword !== formData.confirmPassword) {
          throw new Error("New passwords do not match.");
        }
        if (!formData.currentPassword) {
          throw new Error("Please enter current password to save changes.");
        }
      }

      const res = await axios.patch(
        "/super-admin/update-profile",
        { ...formData, section },
        { withCredentials: true },
      );

      setMessage({ type: "success", text: res.data.message });

      if (section === "security") {
        setFormData((prev) => ({
          ...prev,
          currentPassword: "",
          newPassword: "",
          confirmPassword: "",
        }));
      }

      setIsEditing(false); // Lock fields after success
      fetchUser(); // Refresh data
    } catch (err: any) {
      setMessage({
        type: "error",
        text: err.response?.data?.message || err.message || "Update failed",
      });
    } finally {
      setLoading(false);
    }
  };

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
                Account Settings
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

        {/* Settings Content */}
        <main className="flex-1 overflow-y-auto p-4 sm:p-8 bg-slate-50">
          <div className="max-w-4xl mx-auto">
            {/* Tabs */}
            <div className="flex gap-6 border-b border-gray-200 mb-8">
              <button
                onClick={() => {
                  setSection("general");
                  setIsEditing(false);
                }}
                className={`pb-4 px-2 text-sm font-medium transition-all relative ${section === "general" ? "text-blue-600" : "text-gray-500 hover:text-gray-700"}`}
              >
                <span className="flex items-center gap-2">
                  <User size={18} /> General Profile
                </span>
                {section === "general" && (
                  <div className="absolute bottom-0 left-0 w-full h-0.5 bg-blue-600 rounded-t-full"></div>
                )}
              </button>
              <button
                onClick={() => {
                  setSection("security");
                  setIsEditing(false);
                }} // Reset edit mode when switching tabs
                className={`pb-4 px-2 text-sm font-medium transition-all relative ${section === "security" ? "text-blue-600" : "text-gray-500 hover:text-gray-700"}`}
              >
                <span className="flex items-center gap-2">
                  <Lock size={18} /> Security & Password
                </span>
                {section === "security" && (
                  <div className="absolute bottom-0 left-0 w-full h-0.5 bg-blue-600 rounded-t-full"></div>
                )}
              </button>
            </div>

            {/* Notification Message */}
            {message.text && (
              <div
                className={`p-4 mb-6 rounded-lg text-sm flex items-center gap-2 ${message.type === "success" ? "bg-green-50 text-green-700 border border-green-200" : "bg-red-50 text-red-700 border border-red-200"}`}
              >
                {message.type === "success" ? (
                  <User size={16} />
                ) : (
                  <ShieldAlert size={16} />
                )}
                {message.text}
              </div>
            )}

            {/* Form Section */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 sm:p-8 relative">
              {/* Edit Button (Top Right) */}
              {section === "general" && (
                <button
                  onClick={handleEditToggle}
                  type="button"
                  className={`absolute top-8 right-8 flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                    isEditing
                      ? "bg-red-50 text-red-600 hover:bg-red-100"
                      : "bg-blue-50 text-blue-600 hover:bg-blue-100"
                  }`}
                >
                  {isEditing ? <X size={16} /> : <Edit2 size={16} />}
                  {isEditing ? "Cancel" : "Edit Profile"}
                </button>
              )}

              <form onSubmit={handleSubmit}>
                {/* --- GENERAL SECTION --- */}
                {section === "general" && (
                  <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-300">
                    <div className="flex items-center gap-6 mb-8">
                      <div className="relative group">
                        <div
                          className={`w-24 h-24 rounded-full bg-gray-100 border-4 border-white shadow-md overflow-hidden ${isEditing ? "ring-4 ring-blue-100" : ""}`}
                        >
                          <img
                            src={
                              formData.profileImg ||
                              "https://via.placeholder.com/150"
                            }
                            alt="Avatar"
                            className="w-full h-full object-cover"
                          />
                        </div>
                        {isEditing && (
                          <div className="absolute inset-0 bg-black/40 rounded-full flex items-center justify-center cursor-pointer">
                            <Camera className="text-white w-6 h-6" />
                          </div>
                        )}
                      </div>
                      <div>
                        <h3 className="text-lg font-bold text-gray-900">
                          Profile Photo
                        </h3>
                        <p className="text-sm text-gray-500">
                          {isEditing
                            ? "Paste a valid image URL below to update."
                            : "This will be displayed on your profile."}
                        </p>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Full Name
                        </label>
                        <input
                          type="text"
                          name="name"
                          value={formData.name}
                          onChange={handleChange}
                          disabled={!isEditing}
                          className={`w-full px-4 py-2.5 rounded-lg border focus:ring-2 outline-none transition-all ${
                            isEditing
                              ? "border-gray-300 focus:ring-blue-100 focus:border-blue-500 bg-white"
                              : "border-transparent bg-gray-50 text-gray-600 cursor-not-allowed"
                          }`}
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Email Address
                        </label>
                        <input
                          type="email"
                          name="email"
                          value={formData.email}
                          onChange={handleChange}
                          disabled={!isEditing}
                          className={`w-full px-4 py-2.5 rounded-lg border focus:ring-2 outline-none transition-all ${
                            isEditing
                              ? "border-gray-300 focus:ring-blue-100 focus:border-blue-500 bg-white"
                              : "border-transparent bg-gray-50 text-gray-600 cursor-not-allowed"
                          }`}
                        />
                      </div>
                      <div className="col-span-1 md:col-span-2">
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Profile Image URL
                        </label>
                        <input
                          type="text"
                          name="profileImg"
                          value={formData.profileImg}
                          onChange={handleChange}
                          disabled={!isEditing}
                          placeholder={isEditing ? "https://..." : ""}
                          className={`w-full px-4 py-2.5 rounded-lg border focus:ring-2 outline-none transition-all ${
                            isEditing
                              ? "border-gray-300 focus:ring-blue-100 focus:border-blue-500 bg-white"
                              : "border-transparent bg-gray-50 text-gray-600 cursor-not-allowed"
                          }`}
                        />
                      </div>
                    </div>
                  </div>
                )}

                {/* --- SECURITY SECTION (Always Editable) --- */}
                {section === "security" && (
                  <div className="space-y-6 max-w-lg animate-in fade-in slide-in-from-bottom-2 duration-300">
                    <div>
                      <h3 className="text-lg font-bold text-gray-900 mb-1">
                        Change Password
                      </h3>
                      <p className="text-sm text-gray-500 mb-6">
                        Ensure your account is using a long, random password to
                        stay secure.
                      </p>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Current Password
                      </label>
                      <input
                        type="password"
                        name="currentPassword"
                        value={formData.currentPassword}
                        onChange={handleChange}
                        className="w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-100 focus:border-blue-500 outline-none transition-all"
                        placeholder="••••••••"
                      />
                    </div>

                    <div className="pt-4 border-t border-gray-100">
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        New Password
                      </label>
                      <input
                        type="password"
                        name="newPassword"
                        value={formData.newPassword}
                        onChange={handleChange}
                        className="w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-100 focus:border-blue-500 outline-none transition-all"
                        placeholder="••••••••"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Confirm New Password
                      </label>
                      <input
                        type="password"
                        name="confirmPassword"
                        value={formData.confirmPassword}
                        onChange={handleChange}
                        className="w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-100 focus:border-blue-500 outline-none transition-all"
                        placeholder="••••••••"
                      />
                    </div>
                  </div>
                )}

                {/* Footer Buttons (Only show when Editing or in Security tab) */}
                {(isEditing || section === "security") && (
                  <div className="mt-8 pt-6 border-t border-gray-100 flex items-center justify-end gap-3">
                    <button
                      type="button"
                      className="px-6 py-2.5 rounded-lg border border-gray-200 text-gray-600 font-medium hover:bg-gray-50 transition-colors"
                      onClick={() =>
                        section === "general"
                          ? handleEditToggle()
                          : window.location.reload()
                      }
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      disabled={loading}
                      className="px-6 py-2.5 rounded-lg bg-blue-600 text-white font-medium hover:bg-blue-700 transition-all shadow-lg shadow-blue-200 flex items-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
                    >
                      {loading ? (
                        <Loader2 className="animate-spin w-4 h-4" />
                      ) : (
                        <Save className="w-4 h-4" />
                      )}
                      Save Changes
                    </button>
                  </div>
                )}
              </form>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
