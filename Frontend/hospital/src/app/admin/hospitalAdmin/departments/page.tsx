"use client";
import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  Plus,
  Trash2,
  Edit3,
  Search,
  Activity,
  AlertTriangle,
  Loader2,
  X,
  Save,
  Building,
} from "lucide-react";

export default function ManageDepartments() {
  const [departments, setDepartments] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  // Modal States
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState<"add" | "edit">("add");

  // Form State
  const [currentDeptName, setCurrentDeptName] = useState("");
  const [originalDeptName, setOriginalDeptName] = useState("");
  const [submitting, setSubmitting] = useState(false);

  // 1. Fetch Departments (Real API)
  useEffect(() => {
    fetchDepartments();
  }, []);

  const fetchDepartments = async () => {
    try {
      setLoading(true);
      const res = await axios.get("/api/hospital/get-profile", {
        withCredentials: true,
      });
      if (res.data.success) {
        setDepartments(res.data.admin.departments || []);
      }
    } catch (error) {
      console.error("Error fetching departments:", error);
    } finally {
      setLoading(false);
    }
  };

  // --- ACTIONS HANDLERS ---
  const openAddModal = () => {
    setModalMode("add");
    setCurrentDeptName("");
    setIsModalOpen(true);
  };

  const openEditModal = (dept: string) => {
    setModalMode("edit");
    setCurrentDeptName(dept);
    setOriginalDeptName(dept);
    setIsModalOpen(true);
  };

  const openDeleteModal = (dept: string) => {
    setOriginalDeptName(dept);
    setIsDeleteModalOpen(true);
  };

  // --- API CALLS ---

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentDeptName.trim()) return;
    setSubmitting(true);

    try {
      if (modalMode === "add") {
        // --- ADD DEPARTMENT ---
        const res = await axios.post(
          "/api/hospital/add-department",
          { department: currentDeptName },
          { withCredentials: true },
        );
        // Update local state directly from response
        if (res.data.success) {
          setDepartments(res.data.departments);
          setIsModalOpen(false);
        }
      } else {
        // --- EDIT DEPARTMENT ---
        const res = await axios.put(
          "/api/hospital/edit-department",
          { oldName: originalDeptName, newName: currentDeptName },
          { withCredentials: true },
        );
        if (res.data.success) {
          setDepartments(res.data.departments);
          setIsModalOpen(false);
        }
      }
    } catch (error: any) {
      console.error("Error saving department:", error);
      // Show error from backend (e.g., "Department already exists")
      alert(error.response?.data?.message || "Failed to save department.");
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async () => {
    setSubmitting(true);
    try {
      // --- DELETE DEPARTMENT ---
      const res = await axios.delete("/api/hospital/delete-department", {
        data: { department: originalDeptName },
        withCredentials: true,
      });

      if (res.data.success) {
        setDepartments(res.data.departments);
        setIsDeleteModalOpen(false);
      }
    } catch (error: any) {
      console.error("Error deleting department:", error);
      alert(error.response?.data?.message || "Failed to delete department.");
    } finally {
      setSubmitting(false);
    }
  };

  // Filter Logic
  const filteredDepartments = departments.filter((d) =>
    d.toLowerCase().includes(search.toLowerCase()),
  );

  return (
    <div className="space-y-8 font-sans">
      {/* 1. Header Section */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Departments</h1>
          <p className="text-gray-500 text-sm mt-1">
            Manage hospital units and medical specialties.
          </p>
        </div>
        <button
          onClick={openAddModal}
          className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-sm font-medium shadow-md shadow-blue-200 flex items-center gap-2 transition-all"
        >
          <Plus size={18} /> Add Department
        </button>
      </div>

      {/* 2. Search & Filter Bar */}
      <div className="bg-white p-4 rounded-2xl border border-gray-100 shadow-sm flex items-center gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
          <input
            type="text"
            placeholder="Search departments..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 text-black"
          />
        </div>
        <div className="text-sm text-gray-500 font-medium px-2">
          Total: {filteredDepartments.length}
        </div>
      </div>

      {/* 3. Departments Grid */}
      {loading ? (
        <div className="flex justify-center py-20">
          <Loader2 className="w-10 h-10 text-blue-600 animate-spin" />
        </div>
      ) : filteredDepartments.length === 0 ? (
        <div className="text-center py-20 bg-white rounded-2xl border border-dashed border-gray-300">
          <Building className="w-12 h-12 text-gray-300 mx-auto mb-3" />
          <p className="text-gray-500">No departments found.</p>
          {search && (
            <button
              onClick={() => setSearch("")}
              className="text-blue-600 text-sm font-medium mt-2 hover:underline"
            >
              Clear Search
            </button>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredDepartments.map((dept, index) => (
            <div
              key={index}
              className="bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-all duration-300 p-5 group relative overflow-hidden"
            >
              <Activity className="absolute -right-4 -bottom-4 w-24 h-24 text-gray-50 opacity-50 group-hover:scale-110 transition-transform" />

              <div className="relative z-10">
                <div className="flex justify-between items-start mb-3">
                  <div className="w-10 h-10 bg-blue-50 text-blue-600 rounded-lg flex items-center justify-center">
                    <Building size={20} />
                  </div>
                  <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button
                      onClick={() => openEditModal(dept)}
                      className="p-1.5 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                    >
                      <Edit3 size={16} />
                    </button>
                    <button
                      onClick={() => openDeleteModal(dept)}
                      className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>

                <h3
                  className="text-lg font-bold text-gray-800 mb-1 line-clamp-1"
                  title={dept}
                >
                  {dept}
                </h3>
                <p className="text-xs text-gray-400 font-medium uppercase tracking-wide">
                  Active Unit
                </p>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* --- ADD / EDIT MODAL --- */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden animate-in fade-in zoom-in duration-200">
            <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center bg-gray-50">
              <h2 className="text-lg font-bold text-gray-800">
                {modalMode === "add" ? "Add New Department" : "Edit Department"}
              </h2>
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-gray-400 hover:text-gray-600 p-1 rounded-full hover:bg-gray-200 transition-colors"
              >
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleSave} className="p-6">
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Department Name
                </label>
                <input
                  type="text"
                  autoFocus
                  placeholder="e.g. Cardiology"
                  value={currentDeptName}
                  onChange={(e) => setCurrentDeptName(e.target.value)}
                  className="w-full px-4 py-2.5 text-black border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                />
              </div>

              <div className="flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 rounded-lg border border-gray-300 text-gray-600 text-sm font-medium hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting || !currentDeptName.trim()}
                  className="px-4 py-2 rounded-lg bg-blue-600 text-white text-sm font-medium hover:bg-blue-700 transition-colors shadow-lg shadow-blue-200 flex items-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
                >
                  {submitting ? (
                    <Loader2 className="animate-spin w-4 h-4" />
                  ) : (
                    <Save className="w-4 h-4" />
                  )}
                  {modalMode === "add" ? "Add Department" : "Save Changes"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* --- DELETE CONFIRMATION MODAL --- */}
      {isDeleteModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-sm overflow-hidden animate-in fade-in zoom-in duration-200">
            <div className="p-6 text-center">
              <div className="w-12 h-12 bg-red-50 text-red-500 rounded-full flex items-center justify-center mx-auto mb-4">
                <AlertTriangle size={24} />
              </div>
              <h3 className="text-lg font-bold text-gray-900 mb-2">
                Delete Department?
              </h3>
              <p className="text-sm text-gray-500 mb-6">
                Are you sure you want to delete{" "}
                <strong>{originalDeptName}</strong>? This action cannot be
                undone.
              </p>

              <div className="flex gap-3 justify-center">
                <button
                  onClick={() => setIsDeleteModalOpen(false)}
                  className="px-4 py-2 rounded-lg border border-gray-300 text-gray-600 text-sm font-medium hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleDelete}
                  disabled={submitting}
                  className="px-4 py-2 rounded-lg bg-red-600 text-white text-sm font-medium hover:bg-red-700 transition-colors shadow-lg shadow-red-200 flex items-center gap-2 disabled:opacity-70"
                >
                  {submitting ? (
                    <Loader2 className="animate-spin w-4 h-4" />
                  ) : (
                    <Trash2 className="w-4 h-4" />
                  )}
                  Yes, Delete
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
