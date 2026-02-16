"use client";
import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  CalendarDays,
  Clock,
  CheckCircle,
  XCircle,
  AlertCircle,
  FileText,
  Search,
  Filter,
  Trash2,
  Edit,
  Plus,
  X,
} from "lucide-react";
import { useAuth } from "../../../../../context/AuthContext";

export default function Appointments() {
  const { user } = useAuth();
  const [allAppointments, setAllAppointments] = useState<any[]>([]);
  const [showReportModal, setShowReportModal] = useState(false);
  const [selectedAppointmentForReport, setSelectedAppointmentForReport] =
    useState<any>(null);
  const [reportsData, setReportsData] = useState<any[]>([]);

  // Search & Filters
  const [searchQuery, setSearchQuery] = useState("");
  const [filterCategory, setFilterCategory] = useState<
    "upcoming" | "past" | "both"
  >("both");
  const [filterStatus, setFilterStatus] = useState<
    "all" | "pending" | "confirmed" | "completed" | "cancelled"
  >("all");

  const fetchAppointmentData = async () => {
    try {
      const res = await axios.get(`/doctor/get-appointments`, {
        withCredentials: true,
      });
      setAllAppointments(res.data.appointments);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchAppointmentData();
  }, []);

  const getReports = async () => {
    const res = await axios.get(`/doctor/get-reports`, {
      withCredentials: true,
    });
    setReportsData(res.data.reports);
  };

  useEffect(() => {
    getReports();
  }, []);

  const updateAppointmentStatus = async (id: string, newStatus: string) => {
    try {
      // optimistic update
      setAllAppointments((prev) =>
        prev.map((a) => (a._id === id ? { ...a, status: newStatus } : a)),
      );
      await axios.patch(
        `/doctor/update-appointment/${id}`,
        { status: newStatus },
        { withCredentials: true },
      );
      fetchAppointmentData();
    } catch (err) {
      console.error(err);
    }
  };

  const createReportForAppointment = async (
    appointment: any,
    reportData: any,
  ) => {
    try {
      await axios.post(
        `/doctor/report`,
        { ...reportData },
        { withCredentials: true },
      );
      setShowReportModal(false);
      setSelectedAppointmentForReport(null);
      fetchAppointmentData(); // Refresh to update report status
      alert("Report created successfully!");
    } catch (err) {
      console.error(err);
      alert("Failed to create report.");
    }
  };

  const handleOpenReportForm = (appointment: any) => {
    setSelectedAppointmentForReport(appointment);
    setShowReportModal(true);
  };

  // Filter Logic
  const matchesSearch = (appointment: any) => {
    if (!searchQuery) return true;
    const q = searchQuery.toLowerCase();
    return (
      (appointment.p_name || "").toLowerCase().includes(q) ||
      (appointment.p_email || "").toLowerCase().includes(q)
    );
  };

  const filteredAppointments = allAppointments.filter((appointment) => {
    if (!matchesSearch(appointment)) return false;

    // Category Filter
    if (filterCategory === "upcoming") {
      if (
        appointment.status === "completed" ||
        appointment.status === "cancelled"
      )
        return false;
    } else if (filterCategory === "past") {
      if (
        appointment.status === "pending" ||
        appointment.status === "confirmed"
      )
        return false;
    }

    // Status Filter
    if (filterStatus !== "all" && appointment.status !== filterStatus)
      return false;

    return true;
  });

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "confirmed":
        return "bg-green-100 text-green-700 border-green-200";
      case "pending":
        return "bg-yellow-100 text-yellow-700 border-yellow-200";
      case "cancelled":
        return "bg-red-100 text-red-700 border-red-200";
      case "completed":
        return "bg-blue-100 text-blue-700 border-blue-200";
      default:
        return "bg-gray-100 text-gray-700 border-gray-200";
    }
  };

  return (
    <div className="space-y-6 font-sans text-black">
      {/* Search & Filters */}
      <div className="bg-white rounded-xl border border-gray-200 p-4 shadow-sm">
        <div className="flex flex-col md:flex-row gap-4 items-center">
          {/* Search */}
          <div className="relative flex-1 w-full">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
            <input
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search patient name..."
              className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm text-black"
            />
          </div>

          {/* Category Filter */}
          <div className="relative w-full md:w-40">
            <CalendarDays className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
            <select
              value={filterCategory}
              onChange={(e: any) => {
                setFilterCategory(e.target.value);
                setFilterStatus("all");
              }}
              className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm bg-white text-black appearance-none cursor-pointer"
            >
              <option value="both">All Time</option>
              <option value="upcoming">Upcoming</option>
              <option value="past">Past</option>
            </select>
          </div>

          {/* Status Filter */}
          <div className="relative w-full md:w-40">
            <Filter className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
            <select
              value={filterStatus}
              onChange={(e: any) => setFilterStatus(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm bg-white text-black appearance-none cursor-pointer"
            >
              <option value="all">All Status</option>
              {filterCategory === "upcoming" ? (
                <>
                  <option value="confirmed">Confirmed</option>
                  <option value="pending">Pending</option>
                </>
              ) : filterCategory === "past" ? (
                <>
                  <option value="completed">Completed</option>
                  <option value="cancelled">Cancelled</option>
                </>
              ) : (
                <>
                  <option value="confirmed">Confirmed</option>
                  <option value="pending">Pending</option>
                  <option value="completed">Completed</option>
                  <option value="cancelled">Cancelled</option>
                </>
              )}
            </select>
          </div>
        </div>
      </div>

      {/* Appointments List */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center">
          <h3 className="text-lg font-bold text-gray-800">
            Appointment Requests
          </h3>
          <span className="px-3 py-1 bg-blue-50 text-blue-700 text-xs font-semibold rounded-full border border-blue-100">
            {filteredAppointments.length} Total
          </span>
        </div>

        <div className="divide-y divide-gray-100">
          {filteredAppointments.length === 0 ? (
            <div className="p-8 text-center text-gray-500">
              No appointments found matching your criteria.
            </div>
          ) : (
            filteredAppointments.map((appointment) => (
              <div
                key={appointment._id}
                className="p-6 hover:bg-gray-50 transition-colors"
              >
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                  {/* Patient Info */}
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h4 className="text-lg font-bold text-gray-800">
                        {appointment.p_name}
                      </h4>
                      <span
                        className={`px-2.5 py-0.5 rounded-full text-xs font-medium border uppercase tracking-wide ${getStatusBadge(appointment.status)}`}
                      >
                        {appointment.status}
                      </span>
                    </div>

                    <div className="text-sm text-gray-600 space-y-1">
                      <p>📧 {appointment.p_email}</p>
                      <p>
                        💊{" "}
                        <span className="font-medium text-gray-800">
                          Reason:
                        </span>{" "}
                        {appointment.disease}
                      </p>
                    </div>

                    <div className="flex items-center gap-4 mt-3 text-sm font-medium text-gray-500">
                      <span className="flex items-center gap-1">
                        <CalendarDays size={16} /> {appointment.date}
                      </span>
                      <span className="flex items-center gap-1">
                        <Clock size={16} /> {appointment.time}
                      </span>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-2">
                    {/* PENDING ACTIONS */}
                    {appointment.status === "pending" && (
                      <>
                        <button
                          onClick={() =>
                            updateAppointmentStatus(
                              appointment._id,
                              "confirmed",
                            )
                          }
                          className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white text-sm font-medium rounded-lg hover:bg-green-700 transition shadow-sm"
                        >
                          <CheckCircle size={16} /> Confirm
                        </button>
                        <button
                          onClick={() =>
                            updateAppointmentStatus(
                              appointment._id,
                              "cancelled",
                            )
                          }
                          className="flex items-center gap-2 px-4 py-2 bg-red-50 text-red-600 text-sm font-medium rounded-lg hover:bg-red-100 transition border border-red-100"
                        >
                          <XCircle size={16} /> Cancel
                        </button>
                      </>
                    )}

                    {/* CONFIRMED ACTIONS */}
                    {appointment.status === "confirmed" && (
                      <>
                        <button
                          onClick={() =>
                            updateAppointmentStatus(
                              appointment._id,
                              "completed",
                            )
                          }
                          className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition shadow-sm"
                        >
                          <CheckCircle size={16} /> Mark Completed
                        </button>
                        <button
                          onClick={() =>
                            updateAppointmentStatus(
                              appointment._id,
                              "cancelled",
                            )
                          }
                          className="flex items-center gap-2 px-4 py-2 bg-red-50 text-red-600 text-sm font-medium rounded-lg hover:bg-red-100 transition border border-red-100"
                        >
                          Cancel
                        </button>
                      </>
                    )}

                    {/* COMPLETED ACTIONS (Reports) */}
                    {appointment.status === "completed" && (
                      <>
                        {appointment.report_status === "incompleted" ? (
                          <button
                            onClick={() => handleOpenReportForm(appointment)}
                            className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white text-sm font-medium rounded-lg hover:bg-indigo-700 transition shadow-sm"
                          >
                            <Plus size={16} /> Create Report
                          </button>
                        ) : appointment.report_status === "pending" ? (
                          <button
                            onClick={() => handleOpenReportForm(appointment)}
                            className="flex items-center gap-2 px-4 py-2 bg-orange-500 text-white text-sm font-medium rounded-lg hover:bg-orange-600 transition shadow-sm"
                          >
                            <Edit size={16} /> Complete Report
                          </button>
                        ) : (
                          <span className="flex items-center gap-2 px-4 py-2 bg-gray-100 text-gray-500 text-sm font-medium rounded-lg cursor-default">
                            <FileText size={16} /> Report Done
                          </span>
                        )}
                      </>
                    )}

                    {/* CANCELLED STATE */}
                    {appointment.status === "cancelled" && (
                      <span className="flex items-center gap-2 px-4 py-2 bg-gray-100 text-gray-500 text-sm font-medium rounded-lg border border-gray-200 cursor-default">
                        <Trash2 size={16} /> Cancelled
                      </span>
                    )}
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Report Creation Modal */}
      {showReportModal && (
        <>
          <div
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 transition-opacity"
            onClick={() => setShowReportModal(false)}
          ></div>
          <div className="fixed inset-0 flex items-center justify-center z-50 p-4 pointer-events-none">
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl pointer-events-auto border border-gray-200 overflow-hidden animate-in zoom-in-95 duration-200">
              <div className="p-6">
                <div className="flex justify-between items-center mb-6 pb-4 border-b border-gray-100">
                  <div>
                    <h3 className="text-xl font-bold text-gray-800">
                      Medical Report
                    </h3>
                    <p className="text-sm text-gray-500">
                      Create report for {selectedAppointmentForReport?.p_name}
                    </p>
                  </div>
                  <button
                    onClick={() => setShowReportModal(false)}
                    className="text-gray-400 hover:text-gray-600 p-2 hover:bg-gray-100 rounded-full transition"
                  >
                    <X size={24} />
                  </button>
                </div>

                <ReportForm
                  appointment={selectedAppointmentForReport}
                  initialReport={
                    selectedAppointmentForReport
                      ? reportsData.find(
                          (r: any) =>
                            r.appointment_id ===
                            selectedAppointmentForReport._id,
                        )
                      : undefined
                  }
                  onCreate={createReportForAppointment}
                  onCancel={() => {
                    setShowReportModal(false);
                    setSelectedAppointmentForReport(null);
                  }}
                  fetchAppointmentData={fetchAppointmentData}
                  getReports={getReports}
                />
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}

// --- Report Form Component (Internal) ---
function ReportForm({
  appointment,
  initialReport,
  onCreate,
  onCancel,
  fetchAppointmentData,
  getReports,
}: any) {
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

  useEffect(() => {
    if (appointment) {
      const base = {
        date: appointment.date || "",
        department: appointment.type || "",
        disease: appointment.disease || "",
      };

      if (appointment.report_status === "pending" && initialReport) {
        setForm((f: any) => ({
          ...f,
          date: initialReport.date || base.date,
          department: initialReport.department || base.department,
          disease: initialReport.disease || base.disease,
          status: initialReport.status || f.status,
          symptoms: Array.isArray(initialReport.symptoms)
            ? initialReport.symptoms
            : f.symptoms,
          vitals: initialReport.vitals || f.vitals,
          prescription: Array.isArray(initialReport.prescription)
            ? initialReport.prescription
            : f.prescription,
          recommendations: Array.isArray(initialReport.recommendations)
            ? initialReport.recommendations
            : f.recommendations,
          nextAppointment: initialReport.nextAppointment || f.nextAppointment,
        }));
      } else {
        setForm((f: any) => ({
          ...f,
          date: base.date || f.date,
          department: base.department || f.department,
          disease: base.disease || f.disease,
        }));
      }
    }
  }, [appointment, initialReport]);

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
        i === idx ? value : s,
      ),
    }));
  const removeSymptom = (idx: number) =>
    setForm((p: any) => ({
      ...p,
      symptoms: p.symptoms.filter((_: any, i: number) => i !== idx),
    }));

  // Prescription handlers
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
        i === idx ? { ...pres, [key]: value } : pres,
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
        i === idx ? value : r,
      ),
    }));
  const removeRecommendation = (idx: number) =>
    setForm((p: any) => ({
      ...p,
      recommendations: p.recommendations.filter(
        (_: any, i: number) => i !== idx,
      ),
    }));

  const handleSubmit = async (e: any) => {
    e.preventDefault();
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
        (p: any) => p.medicine && p.medicine.trim().length > 0,
      ),
      recommendations: form.recommendations.filter(
        (r: string) => r && r.trim().length > 0,
      ),
      nextAppointment: form.nextAppointment,
    };

    const isEditingPendingReport =
      appointment?.report_status === "pending" && initialReport;

    if (isEditingPendingReport) {
      try {
        await axios.patch(
          `/doctor/update-report/${initialReport._id}`,
          payload,
          { withCredentials: true },
        );
        fetchAppointmentData();
        getReports();
        onCancel();
      } catch (err) {
        console.error(err);
        alert("Failed to update report.");
      }
    } else {
      onCreate(appointment, payload);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-6 max-h-[65vh] overflow-y-auto pr-2 custom-scrollbar"
    >
      {/* Patient Info Readonly */}
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-1">
            Patient Name
          </label>
          <input
            className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-gray-600 cursor-not-allowed"
            value={appointment?.p_name || ""}
            readOnly
          />
        </div>
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-1">
            Date
          </label>
          <input
            type="date"
            name="date"
            value={form.date}
            onChange={handleFieldChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg text-black focus:ring-2 focus:ring-blue-500 outline-none"
            required
          />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-1">
            Department
          </label>
          <input
            name="department"
            value={form.department}
            onChange={handleFieldChange}
            placeholder="e.g. Cardiology"
            className="w-full px-3 py-2 border border-gray-300 rounded-lg text-black focus:ring-2 focus:ring-blue-500 outline-none"
            required
          />
        </div>
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-1">
            Diagnosis / Disease
          </label>
          <input
            name="disease"
            value={form.disease}
            onChange={handleFieldChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg text-black focus:ring-2 focus:ring-blue-500 outline-none"
          />
        </div>
      </div>

      {/* Symptoms Section */}
      <div>
        <div className="flex justify-between items-center mb-2">
          <label className="text-sm font-semibold text-gray-700">
            Symptoms
          </label>
          <button
            type="button"
            onClick={addSymptom}
            className="text-sm text-blue-600 hover:text-blue-700 font-medium"
          >
            + Add Symptom
          </button>
        </div>
        <div className="space-y-2">
          {form.symptoms.map((s: string, idx: number) => (
            <div key={idx} className="flex gap-2">
              <input
                value={s}
                onChange={(e) => updateSymptom(idx, e.target.value)}
                placeholder="e.g. High Fever"
                className="flex-1 px-3 py-2 border border-gray-300 rounded-lg text-black focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <button
                type="button"
                onClick={() => removeSymptom(idx)}
                className="text-red-500 hover:bg-red-50 p-2 rounded-lg transition"
              >
                <Trash2 size={18} />
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Vitals Section */}
      <div>
        <label className="block text-sm font-semibold text-gray-700 mb-2">
          Vitals
        </label>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          <input
            name="vitals.bloodPressure"
            value={form.vitals.bloodPressure}
            onChange={handleFieldChange}
            placeholder="BP (120/80)"
            className="px-3 py-2 border border-gray-300 rounded-lg text-black outline-none"
          />
          <input
            name="vitals.temperature"
            value={form.vitals.temperature}
            onChange={handleFieldChange}
            placeholder="Temp (98°F)"
            className="px-3 py-2 border border-gray-300 rounded-lg text-black outline-none"
          />
          <input
            name="vitals.heartRate"
            value={form.vitals.heartRate}
            onChange={handleFieldChange}
            placeholder="HR (72 bpm)"
            className="px-3 py-2 border border-gray-300 rounded-lg text-black outline-none"
          />
          <input
            name="vitals.weight"
            value={form.vitals.weight}
            onChange={handleFieldChange}
            placeholder="Weight (kg)"
            className="px-3 py-2 border border-gray-300 rounded-lg text-black outline-none"
          />
        </div>
      </div>

      {/* Prescription Section */}
      <div>
        <div className="flex justify-between items-center mb-2">
          <label className="text-sm font-semibold text-gray-700">
            Prescription
          </label>
          <button
            type="button"
            onClick={addPrescription}
            className="text-sm text-blue-600 hover:text-blue-700 font-medium"
          >
            + Add Medicine
          </button>
        </div>
        <div className="space-y-3">
          {form.prescription.map((pres: any, idx: number) => (
            <div
              key={idx}
              className="grid grid-cols-1 sm:grid-cols-12 gap-2 items-center border p-3 rounded-lg border-gray-100 bg-gray-50/50"
            >
              <div className="sm:col-span-4">
                <input
                  placeholder="Medicine Name"
                  value={pres.medicine}
                  onChange={(e) =>
                    updatePrescription(idx, "medicine", e.target.value)
                  }
                  className="w-full px-2 py-1.5 border border-gray-300 rounded-md text-sm text-black"
                />
              </div>
              <div className="sm:col-span-3">
                <input
                  placeholder="Dosage (e.g. 500mg)"
                  value={pres.dosage}
                  onChange={(e) =>
                    updatePrescription(idx, "dosage", e.target.value)
                  }
                  className="w-full px-2 py-1.5 border border-gray-300 rounded-md text-sm text-black"
                />
              </div>
              <div className="sm:col-span-3">
                <input
                  placeholder="Freq (e.g. 1-0-1)"
                  value={pres.frequency}
                  onChange={(e) =>
                    updatePrescription(idx, "frequency", e.target.value)
                  }
                  className="w-full px-2 py-1.5 border border-gray-300 rounded-md text-sm text-black"
                />
              </div>
              <div className="sm:col-span-2 flex items-center gap-1">
                <input
                  placeholder="Days"
                  value={pres.days}
                  onChange={(e) =>
                    updatePrescription(idx, "days", e.target.value)
                  }
                  className="w-full px-2 py-1.5 border border-gray-300 rounded-md text-sm text-black"
                />
                <button
                  type="button"
                  onClick={() => removePrescription(idx)}
                  className="text-red-500 hover:text-red-700"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Buttons */}
      <div className="pt-4 flex gap-3 border-t border-gray-100">
        <button
          type="button"
          onClick={onCancel}
          className="flex-1 py-2.5 border border-gray-300 text-gray-700 font-medium rounded-xl hover:bg-gray-50 transition"
        >
          Cancel
        </button>
        <button
          type="submit"
          className="flex-1 py-2.5 bg-blue-600 text-white font-medium rounded-xl hover:bg-blue-700 transition shadow-md"
        >
          Save Report
        </button>
      </div>
    </form>
  );
}
