"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import axios from "axios";

export default function Appointments() {
  const [activeTab, setActiveTab] = useState("appointments");
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [showProfileMenu, setShowProfileMenu] = useState(false);

  // appointment lists
  const [allAppointments, setAllAppointments] = useState<any[]>([]);
  const [showReportModal, setShowReportModal] = useState(false);
  const [selectedAppointmentForReport, setSelectedAppointmentForReport] =
    useState<any>(null);

  // search / filters
  const [searchQuery, setSearchQuery] = useState("");
  const [filterCategory, setFilterCategory] = useState<
    "upcoming" | "past" | "both"
  >("upcoming");
  const [filterStatus, setFilterStatus] = useState<
    "all" | "pending" | "confirmed" | "completed" | "cancelled"
  >("all");

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

  //   // dummy dataset - replace with API call later
  //   useEffect(() => {
  //     const dummy: any[] = [
  //       {
  //         _id: "68f349e1c19f69d0c721b045",
  //         p_id: "68f10d379b642dd2abccaaa4",
  //         doc_id: "68f0939e072d7971a812d8af",
  //         p_name: "Abhishek Pathak",
  //         doc_name: "Dr. Abhishek Pathak",
  //         p_email: "abhishekpathak37733@gmail.com",
  //         disease: "fever",
  //         date: "2025-10-28",
  //         time: "10:00 AM",
  //         status: "completed",
  //         type: "Cardiologist",
  //       },
  //       {
  //         _id: "68f349e1c19f69d0c721b046",
  //         p_id: "68f10d379b642dd2abccaaa5",
  //         doc_id: "68f0939e072d7971a812d8af",
  //         p_name: "Akshat Lohni",
  //         doc_name: "Dr. Abhishek Pathak",
  //         p_email: "akshat@example.com",
  //         disease: "foot problem",
  //         date: "2025-10-28",
  //         time: "4:00 PM",
  //         status: "pending",
  //         type: "General",
  //       },
  //       {
  //         _id: "68f349e1c19f69d0c721b047",
  //         p_id: "68f10d379b642dd2abccaaa6",
  //         doc_id: "68f0939e072d7971a812d8af",
  //         p_name: "Ritu Sharma",
  //         doc_name: "Dr. Abhishek Pathak",
  //         p_email: "ritu@example.com",
  //         disease: "checkup",
  //         date: "2025-11-05",
  //         time: "2:00 PM",
  //         status: "confirmed",
  //         type: "Cardiologist",
  //       },
  //     ];

  //     setAllAppointments(dummy);
  //   }, []);

  const fetchAppointmentData = async () => {
    try {
      const res = await axios.get(`/doctor/get-appointments`, {
        withCredentials: true,
      });

      // Filter appointments based on status
      const allAppointments = res.data.appointments;

      setAllAppointments(allAppointments);
    } catch (error) {
      console.log(error);
    }
  };
  useEffect(() => {
    fetchAppointmentData();
  }, []);
  const getStatusBadge = (status: string) => {
    switch (status) {
      case "confirmed":
        return "bg-green-100 text-green-800 border-green-200";
      case "pending":
        return "bg-yellow-100 text-yellow-800 border-yellow-200";
      case "cancelled":
        return "bg-red-100 text-red-800 border-red-200";
      case "completed":
        return "bg-blue-100 text-blue-800 border-blue-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  // Derived lists
  const upcomingAppointments = allAppointments.filter(
    (a) => a.status === "pending" || a.status === "confirmed"
  );
  const pastAppointments = allAppointments.filter(
    (a) => a.status === "completed" || a.status === "cancelled"
  );

  // Filter & search helpers
  const matchesSearch = (appointment: any) => {
    if (!searchQuery) return true;
    const q = searchQuery.toLowerCase();
    return (
      (appointment.p_name || "").toLowerCase().includes(q) ||
      (appointment.p_email || "").toLowerCase().includes(q)
    );
  };

  const filteredUpcoming = upcomingAppointments.filter((appointment) => {
    if (!matchesSearch(appointment)) return false;
    if (filterCategory !== "upcoming" && filterCategory !== "both")
      return false;
    if (filterCategory === "upcoming" && filterStatus !== "all") {
      return appointment.status === filterStatus;
    }
    return true;
  });

  const filteredPast = pastAppointments.filter((appointment) => {
    if (!matchesSearch(appointment)) return false;
    if (!["past", "both"].includes(filterCategory)) return false;
    if (filterCategory === "past" && filterStatus !== "all") {
      return appointment.status === filterStatus;
    }
    return true;
  });

  // Dummy update function -> updates local state and makes a placeholder API call
  const updateAppointmentStatus = async (id: string, newStatus: string) => {
    try {
      // optimistic update
      setAllAppointments((prev) =>
        prev.map((a) => (a._id === id ? { ...a, status: newStatus } : a))
      );
      // placeholder API call (server can implement)
      await axios.patch(
        `/doctor/update-appointment/${id}`,
        { status: newStatus },
        { withCredentials: true }
      );
      fetchAppointmentData();
    } catch (err) {
      console.error(err);
    }
  };

  // Create report dummy
  const createReportForAppointment = async (
    appointment: any,
    reportData: any
  ) => {
    try {
      // placeholder API call
      await axios.post(
        `/doctor/report`,
        { ...reportData },
        { withCredentials: true }
      );

      setShowReportModal(false);
      setSelectedAppointmentForReport(null);
      alert("Report created (dummy). Later this will be persisted to backend.");
    } catch (err) {
      console.error(err);
    }
  };

  const handleOpenReportForm = (appointment: any) => {
    setSelectedAppointmentForReport(appointment);
    setShowReportModal(true);
  };

  const handleLogout = async () => {
    try {
      await axios.post(`/api/logout`, {}, { withCredentials: true });
      window.location.href = "/login";
    } catch (error) {
      console.error("Error logging out:", error);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
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
            <div className="w-10 h-10 bg-gradient-to-r from-blue-600 to-green-600 rounded-full flex items-center justify-center">
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

      <div className="md:flex">
        {/* Desktop Sidebar */}
        <aside className="hidden md:flex flex-col w-64 bg-white shadow-lg fixed left-0 top-0 min-h-screen overflow-y-auto">
          <div className="p-4 border-b border-gray-200">
            <div className="flex items-center">
              <div className="w-10 h-10 bg-gradient-to-r from-blue-600 to-green-600 rounded-full flex items-center justify-center">
                <span className="text-white font-bold text-xl">D</span>
              </div>
              <div className="ml-3">
                <h1 className="text-xl font-bold text-gray-800">Swasth-Raho</h1>
                <p className="text-sm text-gray-500">Doctor Portal</p>
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

        {/* Main Content */}
        <div className="flex-1 md:ml-64">
          <header className="bg-white shadow-sm border-b border-gray-200 px-4 sm:px-6 py-3 sm:py-4 sticky top-0 z-30">
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <button
                  onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                  className="md:hidden p-2 rounded-md text-gray-600 hover:bg-gray-100"
                  aria-label="Open menu"
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
                <h2 className="text-xl sm:text-2xl font-bold text-gray-800 ml-3">
                  Appointments
                </h2>
              </div>

              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center">
                  <span className="text-white font-semibold">DR</span>
                </div>
              </div>
            </div>
          </header>

          <main className="p-6 mt-4">
            {/* Search & Filters */}
            <div className="bg-white rounded-lg border border-gray-200 p-4 mb-6">
              <div className="flex flex-col sm:flex-row sm:items-center sm:space-x-3 space-y-3 sm:space-y-0">
                <input
                  type="search"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search patient name or email"
                  className="flex-1 px-3 py-2 border border-gray-200 rounded-lg text-black focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                />

                <select
                  value={filterCategory}
                  onChange={(e) => {
                    const val = e.target.value as any;
                    setFilterCategory(val);
                    setFilterStatus("all");
                  }}
                  className="px-3 py-2 border border-gray-200 text-black rounded-lg text-sm"
                >
                  <option value="upcoming">Upcoming</option>
                  <option value="past">Past</option>
                  <option value="both">Both</option>
                </select>

                {filterCategory === "upcoming" && (
                  <select
                    value={filterStatus}
                    onChange={(e) => setFilterStatus(e.target.value as any)}
                    className="px-3 py-2 border border-gray-200 text-black rounded-lg text-sm"
                  >
                    <option value="all">All</option>
                    <option value="confirmed">Confirmed</option>
                    <option value="pending">Pending</option>
                  </select>
                )}

                {filterCategory === "past" && (
                  <select
                    value={filterStatus}
                    onChange={(e) => setFilterStatus(e.target.value as any)}
                    className="px-3 py-2 border border-gray-200 text-black rounded-lg text-sm"
                  >
                    <option value="all">All</option>
                    <option value="completed">Completed</option>
                    <option value="cancelled">Cancelled</option>
                  </select>
                )}

                <button
                  onClick={() => {
                    setSearchQuery("");
                    setFilterCategory("upcoming");
                    setFilterStatus("all");
                  }}
                  className="px-3 py-2 bg-gray-100 rounded-lg text-black text-sm"
                >
                  Clear
                </button>
              </div>
            </div>

            {/* Upcoming Appointments */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-bold text-gray-800">
                  Upcoming Appointments
                </h3>
                <span className="px-3 py-1 bg-green-100 text-green-800 text-sm font-medium rounded-full">
                  {filteredUpcoming.length} Scheduled
                </span>
              </div>

              <div className="space-y-4">
                {filteredUpcoming.map((appointment) => (
                  <div
                    key={appointment._id}
                    className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition"
                  >
                    <div className="flex flex-col md:flex-row md:items-center justify-between">
                      <div className="flex-1">
                        <div className="flex items-center space-x-3 mb-2">
                          <h4 className="text-lg font-semibold text-gray-800">
                            {appointment.p_name}
                          </h4>
                          <span
                            className={`px-2 py-1 text-xs font-medium rounded-full border ${getStatusBadge(
                              appointment.status
                            )}`}
                          >
                            {appointment.status.toUpperCase()}
                          </span>
                        </div>

                        <p className="text-gray-600 mb-1">
                          👤 {appointment.p_name} • {appointment.p_email}
                        </p>
                        <p className="text-gray-600 mb-1">
                          💊 {appointment.disease}
                        </p>
                        <div className="flex items-center space-x-4 text-sm text-gray-500">
                          <span>📅 {appointment.date}</span>
                          <span>⏰ {appointment.time}</span>
                        </div>
                      </div>

                      <div className="flex space-x-2 mt-4 md:mt-0">
                        {appointment.status === "pending" && (
                          <>
                            <button
                              className="px-3 py-1 bg-green-600 text-white text-sm rounded hover:bg-green-700 transition"
                              onClick={() =>
                                updateAppointmentStatus(
                                  appointment._id,
                                  "confirmed"
                                )
                              }
                            >
                              Confirm
                            </button>
                            <button
                              className="px-3 py-1 bg-blue-600 text-white text-sm rounded hover:bg-blue-700 transition"
                              onClick={() =>
                                updateAppointmentStatus(
                                  appointment._id,
                                  "completed"
                                )
                              }
                            >
                              Completed
                            </button>
                            <button
                              className="px-3 py-1 bg-red-600 text-white text-sm rounded hover:bg-red-700 transition"
                              onClick={() =>
                                updateAppointmentStatus(
                                  appointment._id,
                                  "cancelled"
                                )
                              }
                            >
                              Cancel
                            </button>
                          </>
                        )}

                        {appointment.status === "confirmed" && (
                          <>
                            <button
                              className="px-3 py-1 bg-blue-600 text-white text-sm rounded hover:bg-blue-700 transition"
                              onClick={() =>
                                updateAppointmentStatus(
                                  appointment._id,
                                  "completed"
                                )
                              }
                            >
                              Mark Completed
                            </button>
                            <button
                              className="px-3 py-1 bg-red-600 text-white text-sm rounded hover:bg-red-700 transition"
                              onClick={() =>
                                updateAppointmentStatus(
                                  appointment._id,
                                  "cancelled"
                                )
                              }
                            >
                              Cancel
                            </button>
                          </>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Past Appointments */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-bold text-gray-800">
                  Past Appointments
                </h3>
                <span className="px-3 py-1 bg-blue-100 text-blue-800 text-sm font-medium rounded-full">
                  {filteredPast.length} Records
                </span>
              </div>

              <div className="space-y-4">
                {filteredPast.map((appointment) => (
                  <div
                    key={appointment._id}
                    className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition"
                  >
                    <div className="flex flex-col md:flex-row md:items-center justify-between">
                      <div className="flex-1">
                        <div className="flex items-center space-x-3 mb-2">
                          <h4 className="text-lg font-semibold text-gray-800">
                            {appointment.p_name}
                          </h4>
                          <span
                            className={`px-2 py-1 text-xs font-medium rounded-full border ${getStatusBadge(
                              appointment.status
                            )}`}
                          >
                            {appointment.status.toUpperCase()}
                          </span>
                        </div>
                        <p className="text-gray-600 mb-1">
                          👤 {appointment.p_name} • {appointment.p_email}
                        </p>
                        <p className="text-gray-600 mb-1">
                          💊 {appointment.disease}
                        </p>
                        <div className="flex items-center space-x-4 text-sm text-gray-500">
                          <span>📅 {appointment.date}</span>
                          <span>⏰ {appointment.time}</span>
                        </div>
                      </div>

                      <div className="flex space-x-2 mt-4 md:mt-0">
                        {appointment.status === "completed" && (
                          <>
                            <button
                              className="px-3 py-1 bg-indigo-600 text-white text-sm rounded hover:bg-indigo-700 transition"
                              onClick={() => handleOpenReportForm(appointment)}
                            >
                              Create Report
                            </button>
                          </>
                        )}
                        {appointment.status === "cancelled" && (
                          <button className="px-3 py-1 bg-blue-600 text-white text-sm rounded hover:bg-blue-700 transition">
                            Book Again
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </main>
        </div>
      </div>

      {/* Report creation modal */}
      {showReportModal && (
        <>
          <div
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50"
            onClick={() => {
              setShowReportModal(false);
              setSelectedAppointmentForReport(null);
            }}
          ></div>
          <div className="fixed inset-0 flex items-center justify-center z-50 p-4 pointer-events-none">
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl pointer-events-auto border border-gray-200 overflow-hidden">
              <div className="p-6">
                <div className="flex items-center justify-between mb-6 pb-4 border-b border-gray-200">
                  <div className="flex items-center space-x-3">
                    <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                      <span className="text-2xl">📄</span>
                    </div>
                    <div>
                      <h3 className="text-2xl font-bold text-gray-800">
                        Create Medical Report
                      </h3>
                      <p className="text-sm text-gray-500">
                        Patient Medical Record
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={() => {
                      setShowReportModal(false);
                      setSelectedAppointmentForReport(null);
                    }}
                    className="text-gray-400 hover:text-gray-600 text-2xl hover:bg-gray-100 rounded-full w-8 h-8 flex items-center justify-center transition-all"
                  >
                    ✕
                  </button>
                </div>

                {/* Simple form for report (add fields as needed) */}
                <ReportForm
                  appointment={selectedAppointmentForReport}
                  onCreate={createReportForAppointment}
                  onCancel={() => {
                    setShowReportModal(false);
                    setSelectedAppointmentForReport(null);
                  }}
                />
              </div>
            </div>
          </div>
        </>
      )}

      <button className="fixed bottom-6 right-6 w-14 h-14 bg-gradient-to-r from-blue-600 to-green-600 text-white rounded-full shadow-lg hover:shadow-xl transition-all duration-300 flex items-center justify-center z-50">
        💬
      </button>
    </div>
  );
}

// Small report form component (local only)
function ReportForm({ appointment, onCreate, onCancel }: any) {
  const [form, setForm] = useState<any>({
    date: "",
    department: "",
    disease: appointment?.disease || "",
    status: "completed",
    symptoms: [] as string[],
    vitals: { bloodPressure: "", temperature: "", heartRate: "", weight: "" },
    prescription: [] as any[],
    recommendations: [] as string[],
    nextAppointment: "",
  });

  // useEffect(() => {
  //   if (appointment) {
  //     setForm((f: any) => ({
  //       ...f,
  //       date: appointment.date || f.date,
  //       department: appointment.type || f.department,
  //       disease: appointment.disease || f.disease,
  //     }));
  //   }
  //   // eslint-disable-next-line react-hooks/exhaustive-deps
  // }, [appointment]);

  const handleFieldChange = (e: any) => {
    const { name, value } = e.target;
    if (name.startsWith("vitals.")) {
      const key = name.split(".")[1];
      setForm((prev: any) => ({
        ...prev,
        vitals: { ...prev.vitals, [key]: value },
      }));
    } else {
      setForm((prev: any) => ({ ...prev, [name]: value }));
    }
  };

  // Symptoms handlers
  const addSymptom = () =>
    setForm((p: any) => ({ ...p, symptoms: [...p.symptoms, ""] }));
  const updateSymptom = (idx: number, value: string) =>
    setForm((p: any) => ({
      ...p,
      symptoms: p.symptoms.map((s: string, i: number) =>
        i === idx ? value : s
      ),
    }));
  const removeSymptom = (idx: number) =>
    setForm((p: any) => ({
      ...p,
      symptoms: p.symptoms.filter((_: any, i: number) => i !== idx),
    }));

  // Prescription handlers (array of objects)
  const addPrescription = () =>
    setForm((p: any) => ({
      ...p,
      prescription: [
        ...p.prescription,
        { medicine: "", dosage: "", frequency: "", days: "" },
      ],
    }));
  const updatePrescription = (idx: number, key: string, value: string) =>
    setForm((p: any) => ({
      ...p,
      prescription: p.prescription.map((pres: any, i: number) =>
        i === idx ? { ...pres, [key]: value } : pres
      ),
    }));
  const removePrescription = (idx: number) =>
    setForm((p: any) => ({
      ...p,
      prescription: p.prescription.filter((_: any, i: number) => i !== idx),
    }));

  // Recommendations handlers
  const addRecommendation = () =>
    setForm((p: any) => ({
      ...p,
      recommendations: [...p.recommendations, ""],
    }));
  const updateRecommendation = (idx: number, value: string) =>
    setForm((p: any) => ({
      ...p,
      recommendations: p.recommendations.map((r: string, i: number) =>
        i === idx ? value : r
      ),
    }));
  const removeRecommendation = (idx: number) =>
    setForm((p: any) => ({
      ...p,
      recommendations: p.recommendations.filter(
        (_: any, i: number) => i !== idx
      ),
    }));

  const handleSubmit = (e: any) => {
    e.preventDefault();
    // Build report payload matching schema
    const payload = {
      appointment_id: appointment?._id,
      p_id: appointment?.p_id,
      p_name: appointment?.p_name,
      doc_id: appointment?.doc_id,
      doc_name: appointment?.doc_name,
      date: form.date,
      department: form.department,
      disease: form.disease,
      status: form.status,
      symptoms: form.symptoms.filter((s: string) => s && s.trim().length > 0),
      vitals: form.vitals,
      prescription: form.prescription.filter(
        (p: any) => p.medicine && p.medicine.trim().length > 0
      ),
      recommendations: form.recommendations.filter(
        (r: string) => r && r.trim().length > 0
      ),
      nextAppointment: form.nextAppointment,
    };
    console.log("your data", payload);
    onCreate(appointment, payload);
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-4 max-h-[70vh] overflow-y-auto pr-2"
    >
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            Patient
          </label>
          <input
            className="w-full px-4 py-3 border-2 border-gray-200 text-black rounded-xl"
            value={appointment?.p_name || ""}
            readOnly
          />
        </div>
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            Date
          </label>
          <input
            name="date"
            type="date"
            value={form.date}
            onChange={handleFieldChange}
            className="w-full px-4 py-3 border-2 border-gray-200 text-black rounded-xl"
            required
          />
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            Department
          </label>
          <input
            name="department"
            value={form.department}
            placeholder="enter your department"
            onChange={handleFieldChange}
            className="w-full px-4 py-3 border-2 border-gray-200 text-black rounded-xl"
            required
          />
        </div>
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            Disease
          </label>
          <input
            name="disease"
            value={form.disease}
            onChange={handleFieldChange}
            className="w-full px-4 py-3 border-2 border-gray-200 text-black rounded-xl"
            readOnly
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-semibold text-gray-700 mb-2">
          Status
        </label>
        <select
          name="status"
          value={form.status}
          onChange={handleFieldChange}
          className="w-full px-4 py-3 border-2 border-gray-200 text-black rounded-xl"
        >
          <option value="completed">Completed</option>
          <option value="pending">Pending</option>
        </select>
      </div>

      <div>
        <div className="flex items-center justify-between mb-2">
          <label className="block text-sm font-semibold text-gray-700">
            Symptoms
          </label>
          <button
            type="button"
            onClick={addSymptom}
            className="text-sm text-blue-600"
          >
            + Add
          </button>
        </div>
        <div className="space-y-2">
          {form.symptoms.map((s: string, idx: number) => (
            <div key={idx} className="flex items-center gap-2">
              <input
                placeholder="add symptoms"
                value={s}
                onChange={(e) => updateSymptom(idx, e.target.value)}
                className="flex-1 px-3 py-2 border border-gray-200 text-black rounded-lg"
              />
              <button
                type="button"
                onClick={() => removeSymptom(idx)}
                className="px-3 py-1 bg-red-100 text-red-600 rounded"
              >
                Remove
              </button>
            </div>
          ))}
          {form.symptoms.length === 0 && (
            <p className="text-sm text-gray-500">No symptoms added yet.</p>
          )}
        </div>
      </div>

      <div>
        <label className="block text-sm font-semibold text-gray-700 mb-2">
          Vitals
        </label>
        <div className="grid grid-cols-2 gap-2">
          <input
            name="vitals.bloodPressure"
            value={form.vitals.bloodPressure}
            onChange={handleFieldChange}
            placeholder="Blood Pressure"
            className="px-4 py-3 border-2 border-gray-200 text-black rounded-xl"
          />
          <input
            name="vitals.temperature"
            value={form.vitals.temperature}
            onChange={handleFieldChange}
            placeholder="Temperature"
            className="px-4 py-3 border-2 border-gray-200 text-black rounded-xl"
          />
          <input
            name="vitals.heartRate"
            value={form.vitals.heartRate}
            onChange={handleFieldChange}
            placeholder="Heart Rate"
            className="px-4 py-3 border-2 border-gray-200 text-black rounded-xl"
          />
          <input
            name="vitals.weight"
            value={form.vitals.weight}
            onChange={handleFieldChange}
            placeholder="Weight"
            className="px-4 py-3 border-2 border-gray-200 text-black rounded-xl"
          />
        </div>
      </div>

      <div>
        <div className="flex items-center justify-between mb-2">
          <label className="block text-sm font-semibold text-gray-700">
            Prescription
          </label>
          <button
            type="button"
            onClick={addPrescription}
            className="text-sm text-blue-600"
          >
            + Add
          </button>
        </div>
        <div className="space-y-2">
          {form.prescription.map((pres: any, idx: number) => (
            <div
              key={idx}
              className="grid grid-cols-1 sm:grid-cols-3 gap-2 items-center"
            >
              <input
                placeholder="Medicine"
                value={pres.medicine}
                onChange={(e) =>
                  updatePrescription(idx, "medicine", e.target.value)
                }
                className="px-3 py-2 border border-gray-200 text-black rounded"
              />
              <input
                placeholder="Dosage"
                value={pres.dosage}
                onChange={(e) =>
                  updatePrescription(idx, "dosage", e.target.value)
                }
                className="px-3 py-2 border border-gray-200 text-black rounded"
              />
              <div className="flex gap-2">
                <input
                  placeholder="Frequency"
                  value={pres.frequency}
                  onChange={(e) =>
                    updatePrescription(idx, "frequency", e.target.value)
                  }
                  className="px-3 py-2 border border-gray-200 text-black rounded flex-1"
                />
                <input
                  placeholder="Days"
                  value={pres.days}
                  onChange={(e) =>
                    updatePrescription(idx, "days", e.target.value)
                  }
                  className="px-3 py-2 border border-gray-200 text-black rounded w-24"
                />
                <button
                  type="button"
                  onClick={() => removePrescription(idx)}
                  className="px-3 py-1 bg-red-100 text-red-600 rounded"
                >
                  Remove
                </button>
              </div>
            </div>
          ))}
          {form.prescription.length === 0 && (
            <p className="text-sm text-gray-500">No prescription items yet.</p>
          )}
        </div>
      </div>

      <div>
        <div className="flex items-center justify-between mb-2">
          <label className="block text-sm font-semibold text-gray-700">
            Recommendations
          </label>
          <button
            type="button"
            onClick={addRecommendation}
            className="text-sm text-blue-600"
          >
            + Add
          </button>
        </div>
        <div className="space-y-2">
          {form.recommendations.map((r: string, idx: number) => (
            <div key={idx} className="flex items-center gap-2">
              <input
                placeholder="add recommendations"
                value={r}
                onChange={(e) => updateRecommendation(idx, e.target.value)}
                className="flex-1 px-3 py-2 border border-gray-200 text-black rounded-lg"
              />
              <button
                type="button"
                onClick={() => removeRecommendation(idx)}
                className="px-3 py-1 bg-red-100 text-red-600 rounded"
              >
                Remove
              </button>
            </div>
          ))}
          {form.recommendations.length === 0 && (
            <p className="text-sm text-gray-500">No recommendations yet.</p>
          )}
        </div>
      </div>

      <div>
        <label className="block text-sm font-semibold text-gray-700 mb-2">
          Next Appointment (optional)
        </label>
        <input
          name="nextAppointment"
          value={form.nextAppointment}
          onChange={handleFieldChange}
          placeholder="e.g., Follow up after 2 weeks"
          className="w-full px-4 py-3 border-2 border-gray-200 text-black rounded-xl"
        />
      </div>

      <div className="flex space-x-3 pt-3">
        <button
          type="submit"
          className="flex-1 px-4 py-3 bg-gradient-to-r from-green-600 to-blue-600 text-white rounded-xl"
        >
          Create Report
        </button>
        <button
          type="button"
          onClick={onCancel}
          className="flex-1 px-4 py-3 bg-gray-300 text-gray-700 rounded-xl"
        >
          Cancel
        </button>
      </div>
    </form>
  );
}
