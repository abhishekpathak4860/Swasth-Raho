"use client";
import React, { useEffect, useState } from "react";
import Link from "next/link";
import { DoctorType } from "../doctors/page";
import axios from "axios";
import {
  Calendar,
  Clock,
  MapPin,
  CreditCard,
  FileText,
  AlertCircle,
  CheckCircle,
  X,
  Search,
  Filter,
  Plus,
  Download,
  Stethoscope,
  Pill,
  ChevronDown,
  Loader2,
  ArrowRight,
} from "lucide-react";
import { useAuth } from "../../../../../context/AuthContext";

export default function Appointments() {
  const { user } = useAuth();
  const [showBookingForm, setShowBookingForm] = useState(false);
  const [doctorsData, setDoctorsData] = useState<DoctorType[]>([]);
  const [upcomingAppointments, setUpcomingAppointments] = useState<any[]>([]);
  const [pastAppointments, setPastAppointments] = useState<any[]>([]);
  const [toggleButton, setToggleButton] = useState(false);
  const [showCancelConfirm, setShowCancelConfirm] = useState(false);
  const [appointmentToCancel, setAppointmentToCancel] = useState<any>(null);
  const [showReportModal, setShowReportModal] = useState(false);
  const [selectedReport, setSelectedReport] = useState<any>(null);
  const [reportsData, setReportsData] = useState<any[]>([]);

  // Payment modal state
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [paymentAppointment, setPaymentAppointment] = useState<any>(null);
  const [paymentUrl, setPaymentUrl] = useState<string | null>(null);
  const [paymentLoading, setPaymentLoading] = useState(false);
  const [paymentInitiated, setPaymentInitiated] = useState(false);
  const [paymentVerifyResult, setPaymentVerifyResult] = useState<any>(null);

  // Search & filter state
  const [searchQuery, setSearchQuery] = useState("");
  const [filterCategory, setFilterCategory] = useState<
    "upcoming" | "past" | "both"
  >("both");
  const [filterStatus, setFilterStatus] = useState<
    "all" | "pending" | "confirmed" | "completed" | "cancelled"
  >("all");

  const [formData, setFormData] = useState({
    appointmentId: "",
    doc_id: "",
    name: "",
    email: "",
    disease: "",
    doctor: "",
    date: "",
    time: "",
    consultationFee: "",
  });

  const getReports = async () => {
    try {
      const res = await axios.get(`/patient/get-reports`, {
        withCredentials: true,
      });
      setReportsData(res.data.reports);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    getReports();
  }, []);

  const getReportByAppointmentId = (appointment: any) => {
    const filterReport = reportsData?.filter(
      (report) => report.appointment_id == appointment._id,
    );
    return filterReport.length > 0 ? filterReport[0] : null;
  };

  const handleViewReport = (appointment: any) => {
    const report = getReportByAppointmentId(appointment);
    if (report) {
      setSelectedReport(report);
      setShowReportModal(true);
    } else {
      alert("Report not generated yet.");
    }
  };

  const downloadReport = () => {
    const reportContent = `
MEDICAL REPORT
================
Patient: ${selectedReport.p_name}
Doctor: ${selectedReport.doc_name}
Date: ${selectedReport.date}

DIAGNOSIS: ${selectedReport.disease}

SYMPTOMS:
${selectedReport.symptoms?.map((symptom: string) => `- ${symptom}`).join("\n")}

VITAL SIGNS:
- Blood Pressure: ${selectedReport.vitals?.bloodPressure}
- Temperature: ${selectedReport.vitals?.temperature}
- Heart Rate: ${selectedReport.vitals?.heartRate}
- Weight: ${selectedReport.vitals?.weight}

PRESCRIPTION:
${selectedReport.prescription
  ?.map(
    (med: any) =>
      `- ${med.medicine} ${med.dosage} - ${med.frequency} for ${med.days}`,
  )
  .join("\n")}

RECOMMENDATIONS:
${selectedReport.recommendations?.map((rec: string) => `- ${rec}`).join("\n")}

Next Appointment: ${selectedReport.nextAppointment}
  `;

    const blob = new Blob([reportContent], { type: "text/plain" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `Medical_Report_${selectedReport.p_name}_${selectedReport.date}.txt`;
    document.body.appendChild(a);
    a.click();
    window.URL.revokeObjectURL(url);
    document.body.removeChild(a);
  };

  // Payment helpers
  const openPaymentModal = (appointment: any) => {
    setPaymentAppointment(appointment);
    setPaymentUrl(null);
    setPaymentInitiated(false);
    setPaymentLoading(false);
    setShowPaymentModal(true);
  };

  const closePaymentModal = () => {
    setShowPaymentModal(false);
    setPaymentAppointment(null);
    setPaymentUrl(null);
    setPaymentInitiated(false);
    setPaymentLoading(false);
  };

  const getTodayISO = () => {
    return new Date().toISOString().split("T")[0];
  };

  const handleConfirmPayment = async () => {
    if (!paymentAppointment) return;
    setPaymentLoading(true);
    try {
      const payload = {
        appointmentId: paymentAppointment._id,
        p_id: paymentAppointment.p_id,
        doc_id: paymentAppointment.doc_id,
        p_name: paymentAppointment.p_name,
        doc_name: paymentAppointment.doc_name,
        disease: paymentAppointment.disease,
        consultationFee: paymentAppointment.consultationFee,
        date: getTodayISO(),
      };

      const res = await axios.post(`/patient/initiate-payment`, payload, {
        withCredentials: true,
      });

      const redirectUrl =
        res?.data?.redirectUrl || res?.data?.paymentUrl || null;
      if (redirectUrl) {
        setPaymentUrl(redirectUrl);
        setPaymentInitiated(true);
      } else {
        alert("Payment initiation returned no redirect URL.");
      }
    } catch (error: any) {
      console.error("Payment initiation error:", error);
      alert(error?.response?.data?.message || "Failed to initiate payment.");
    } finally {
      setPaymentLoading(false);
    }
  };

  const handleProceedPayment = () => {
    if (!paymentUrl) {
      alert("No payment URL available.");
      return;
    }
    window.location.href = paymentUrl;
  };

  const removeQueryParam = (key: string) => {
    try {
      const url = new URL(window.location.href);
      url.searchParams.delete(key);
      window.history.replaceState({}, "", url.toString());
    } catch (e) {
      const [base] = window.location.href.split("?");
      window.history.replaceState({}, "", base);
    }
  };

  useEffect(() => {
    try {
      const params = new URLSearchParams(window.location.search);
      const src = params.get("source");
      if (src === "phonepe") {
        setShowPaymentModal(true);
        setPaymentLoading(true);
        (async () => {
          try {
            const res = await axios.get(`/patient/verify-payment`, {
              withCredentials: true,
            });
            const data = res?.data || {};
            if (data.appointment) setPaymentAppointment(data.appointment);
            setPaymentVerifyResult(data);
          } catch (err: any) {
            console.error("verify-payment error:", err);
            setPaymentVerifyResult({
              status: "error",
              message: err?.message || "Verification failed",
            });
          } finally {
            setPaymentLoading(false);
            setTimeout(() => {
              closePaymentModal();
              removeQueryParam("source");
              setPaymentVerifyResult(null);
              fetchAppointmentData();
            }, 5000);
          }
        })();
      }
    } catch (e) {
      console.error("error parsing URL params", e);
    }
  }, []);

  const rescheduleAppointment = (appointment: any) => {
    setFormData({
      appointmentId: appointment._id,
      doc_id: appointment.doc_id || "",
      name: appointment.p_name || "",
      email: appointment.p_email || "",
      disease: appointment.disease || "",
      doctor: appointment.doc_name || "",
      date: appointment.date || "",
      time: appointment.time || "",
      consultationFee: appointment.consultationFee,
    });
    setToggleButton(true);
    setShowBookingForm(true);
  };

  const handleRefreshForm = () => {
    setFormData({
      appointmentId: "",
      doc_id: "",
      name: "",
      email: "",
      disease: "",
      doctor: "",
      date: "",
      time: "",
      consultationFee: "",
    });
  };

  const handleInputChange = (e: any) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e: any) => {
    try {
      e.preventDefault();
      const res = await axios.post(`/patient/appointment`, formData, {
        withCredentials: true,
      });
      setShowBookingForm(false);
      setToggleButton(false);
      fetchAppointmentData();
      handleRefreshForm();
      alert(`${res.data.message}`);
    } catch (error) {
      console.log(error);
    }
  };

  const UpdateAppointment = async (e: any) => {
    try {
      e.preventDefault();
      await axios.patch(
        `/patient/UpdateAppointment/${formData.appointmentId}`,
        formData,
        { withCredentials: true },
      );
      setShowBookingForm(false);
      fetchAppointmentData();
      handleRefreshForm();
    } catch (error) {
      console.log(error);
    }
  };

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

  useEffect(() => {
    const fetchDoctorData = async () => {
      try {
        const res = await axios.get(`/patient/doctors`, {
          withCredentials: true,
        });
        setDoctorsData(res.data.doctor);
      } catch (error) {
        console.error("Error fetching doctors:", error);
      }
    };
    fetchDoctorData();
  }, []);

  const fetchAppointmentData = async () => {
    try {
      const res = await axios.get(`/patient/get-appointments`, {
        withCredentials: true,
      });
      const allAppointments = res.data.appointments;
      const upcoming = allAppointments.filter(
        (appointment: any) =>
          appointment.status === "pending" ||
          appointment.status === "confirmed",
      );
      const past = allAppointments.filter(
        (appointment: any) =>
          appointment.status === "completed" ||
          appointment.status === "cancelled",
      );
      setUpcomingAppointments(upcoming);
      setPastAppointments(past);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchAppointmentData();
  }, []);

  const matchesSearch = (appointment: any) => {
    if (!searchQuery) return true;
    const q = searchQuery.toLowerCase();
    return (
      (appointment.doc_name || "").toLowerCase().includes(q) ||
      (appointment.p_name || "").toLowerCase().includes(q)
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

  const deleteAppointment = async (id: any) => {
    try {
      await axios.delete(`/patient/cancel-appointment/${id}`, {
        withCredentials: true,
      });
      fetchAppointmentData();
      setShowCancelConfirm(false);
      setAppointmentToCancel(null);
    } catch (error) {
      console.log(error);
    }
  };

  const handleCancelClick = (appointment: any) => {
    setAppointmentToCancel(appointment);
    setShowCancelConfirm(true);
  };

  return (
    <div className="space-y-6 text-black font-sans">
      {/* Search & Filters */}
      <div className="bg-white rounded-xl border border-gray-200 p-4 shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
            <input
              type="search"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search doctor or patient..."
              className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-black text-sm"
            />
          </div>

          <div className="flex items-center gap-2">
            <Filter className="text-gray-400 w-4 h-4" />
            <select
              value={filterCategory}
              onChange={(e) => {
                const val = e.target.value as "upcoming" | "past" | "both";
                setFilterCategory(val);
                setFilterStatus("all");
              }}
              className="px-3 py-2 border border-gray-200 rounded-lg text-sm bg-white text-black outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="both">All Categories</option>
              <option value="upcoming">Upcoming</option>
              <option value="past">Past</option>
            </select>

            {filterCategory !== "both" && (
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value as any)}
                className="px-3 py-2 border border-gray-200 rounded-lg text-sm bg-white text-black outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="all">All Status</option>
                {filterCategory === "upcoming" ? (
                  <>
                    <option value="confirmed">Confirmed</option>
                    <option value="pending">Pending</option>
                  </>
                ) : (
                  <>
                    <option value="completed">Completed</option>
                    <option value="cancelled">Cancelled</option>
                  </>
                )}
              </select>
            )}

            <button
              onClick={() => setShowBookingForm(true)}
              className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition text-sm font-medium ml-2"
            >
              <Plus className="w-4 h-4" />
              <span className="hidden sm:inline">Book</span>
            </button>
          </div>
        </div>
      </div>

      {/* Upcoming Appointments */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-xl font-bold text-gray-800 flex items-center gap-2">
            <Calendar className="w-5 h-5 text-blue-600" />
            Upcoming Appointments
          </h3>
          <span className="px-3 py-1 bg-green-100 text-green-800 text-sm font-medium rounded-full">
            {filteredUpcoming.length} Scheduled
          </span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {filteredUpcoming.length === 0 ? (
            <p className="text-gray-500 text-sm col-span-full text-center py-4">
              No upcoming appointments found.
            </p>
          ) : (
            filteredUpcoming.map((appointment) => (
              <div
                key={appointment._id}
                className="border border-gray-200 rounded-xl p-5 hover:shadow-md transition bg-gray-50/50"
              >
                <div className="flex flex-col sm:flex-row justify-between items-start gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h4 className="text-lg font-bold text-gray-800">
                        {appointment.doc_name}
                      </h4>
                      <span
                        className={`px-2 py-0.5 text-xs font-semibold rounded-full border uppercase tracking-wide ${getStatusBadge(
                          appointment.status,
                        )}`}
                      >
                        {appointment.status}
                      </span>
                    </div>

                    <div className="space-y-1 mb-3">
                      <div className="flex items-center text-sm text-gray-600">
                        <Stethoscope className="w-4 h-4 mr-2 text-blue-500" />
                        {appointment.type}
                      </div>
                      <div className="flex items-center text-sm text-gray-600">
                        <Pill className="w-4 h-4 mr-2 text-purple-500" />
                        {appointment.disease}
                      </div>
                    </div>

                    <div className="flex flex-wrap gap-4 pt-3 border-t border-gray-200 mt-3">
                      <div className="flex items-center text-sm font-medium text-gray-700">
                        <Calendar className="w-4 h-4 mr-2 text-gray-400" />
                        {appointment.date}
                      </div>
                      <div className="flex items-center text-sm font-medium text-gray-700">
                        <Clock className="w-4 h-4 mr-2 text-gray-400" />
                        {appointment.time}
                      </div>
                    </div>
                  </div>

                  <div className="flex sm:flex-col gap-2 w-full sm:w-auto mt-2 sm:mt-0">
                    {appointment.status === "pending" && (
                      <>
                        <button
                          onClick={() => rescheduleAppointment(appointment)}
                          className="px-4 py-2 bg-yellow-100 text-yellow-700 text-sm font-medium rounded-lg hover:bg-yellow-200 transition"
                        >
                          Reschedule
                        </button>
                        <button
                          onClick={() => handleCancelClick(appointment)}
                          className="px-4 py-2 bg-red-100 text-red-700 text-sm font-medium rounded-lg hover:bg-red-200 transition"
                        >
                          Cancel
                        </button>
                      </>
                    )}
                    {appointment.status === "confirmed" && (
                      <button className="px-4 py-2 bg-blue-100 text-blue-700 text-sm font-medium rounded-lg hover:bg-blue-200 transition">
                        View Details
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Past Appointments */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-xl font-bold text-gray-800 flex items-center gap-2">
            <FileText className="w-5 h-5 text-gray-600" />
            Past Appointments
          </h3>
          <span className="px-3 py-1 bg-gray-100 text-gray-800 text-sm font-medium rounded-full">
            {filteredPast.length} Records
          </span>
        </div>

        <div className="space-y-4">
          {filteredPast.length === 0 ? (
            <p className="text-gray-500 text-sm text-center py-4">
              No past appointments found.
            </p>
          ) : (
            filteredPast.map((appointment) => (
              <div
                key={appointment._id}
                className="border border-gray-200 rounded-xl p-4 hover:bg-gray-50 transition flex flex-col md:flex-row items-center justify-between gap-4"
              >
                <div className="flex-1 w-full">
                  <div className="flex items-center gap-3 mb-1">
                    <h4 className="font-bold text-gray-800">
                      {appointment.doc_name}
                    </h4>
                    <span
                      className={`px-2 py-0.5 text-xs font-semibold rounded-full border uppercase ${getStatusBadge(
                        appointment.status,
                      )}`}
                    >
                      {appointment.status}
                    </span>
                  </div>
                  <div className="flex items-center gap-4 text-sm text-gray-500 mt-2">
                    <span className="flex items-center gap-1">
                      <Calendar className="w-3.5 h-3.5" /> {appointment.date}
                    </span>
                    <span className="flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5" /> {appointment.time}
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-3 w-full md:w-auto">
                  {appointment.status === "completed" && (
                    <>
                      <Link
                        href={"/admin/patient/reports"}
                        className="flex-1 md:flex-none"
                      >
                        <button className="w-full px-4 py-2 border border-gray-300 text-gray-700 text-sm font-medium rounded-lg hover:bg-gray-100 transition flex items-center justify-center gap-2">
                          <FileText className="w-4 h-4" /> Report
                        </button>
                      </Link>

                      {appointment.paymentStatus === "paid" ? (
                        <span className="flex-1 md:flex-none px-4 py-2 bg-green-50 text-green-700 border border-green-200 text-sm font-medium rounded-lg flex items-center justify-center gap-2 cursor-default">
                          <CheckCircle className="w-4 h-4" /> Paid
                        </span>
                      ) : (
                        <button
                          onClick={() => openPaymentModal(appointment)}
                          className="flex-1 md:flex-none px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition flex items-center justify-center gap-2"
                        >
                          <CreditCard className="w-4 h-4" /> Pay Now
                        </button>
                      )}
                    </>
                  )}
                  {appointment.status === "cancelled" && (
                    <button className="px-4 py-2 bg-gray-100 text-gray-600 text-sm font-medium rounded-lg hover:bg-gray-200 transition">
                      Book Again
                    </button>
                  )}
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Booking Form Modal */}
      {showBookingForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            className="fixed inset-0 bg-black/50 backdrop-blur-sm"
            onClick={() => {
              setShowBookingForm(false);
              handleRefreshForm();
              setToggleButton(false);
            }}
          ></div>
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-lg z-10 overflow-hidden flex flex-col max-h-[90vh]">
            <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center bg-gray-50">
              <h3 className="text-lg font-bold text-gray-800">
                {toggleButton ? "Reschedule Appointment" : "Book Appointment"}
              </h3>
              <button
                onClick={() => {
                  setShowBookingForm(false);
                  handleRefreshForm();
                  setToggleButton(false);
                }}
                className="text-gray-400 hover:text-gray-600"
              >
                <X size={20} />
              </button>
            </div>

            <div className="p-6 overflow-y-auto">
              <form
                onSubmit={toggleButton ? UpdateAppointment : handleSubmit}
                className="space-y-4"
              >
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Patient Name
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none text-black"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Email
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none text-black"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Reason for Visit
                  </label>
                  <input
                    type="text"
                    name="disease"
                    value={formData.disease}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none text-black"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Doctor
                  </label>
                  <select
                    name="doctor"
                    value={formData.doc_id}
                    onChange={(e) => {
                      const selectedDoctor = doctorsData.find(
                        (doc) => doc._id === e.target.value,
                      );
                      if (selectedDoctor) {
                        setFormData({
                          ...formData,
                          doc_id: selectedDoctor._id,
                          doctor: selectedDoctor.name,
                          consultationFee: selectedDoctor.consultationFee,
                        });
                      }
                    }}
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none text-black bg-white"
                    required
                  >
                    <option value="">Select a Doctor</option>
                    {doctorsData.map((doc) => (
                      <option key={doc._id} value={doc._id}>
                        {doc.name} - {doc.type} (₹{doc.consultationFee})
                      </option>
                    ))}
                  </select>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Date
                    </label>
                    <input
                      type="date"
                      name="date"
                      value={formData.date}
                      onChange={handleInputChange}
                      min={new Date().toISOString().split("T")[0]}
                      className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none text-black"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Time
                    </label>
                    <select
                      name="time"
                      value={formData.time}
                      onChange={handleInputChange}
                      className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none text-black bg-white"
                      required
                    >
                      <option value="">Select Time</option>
                      {[
                        "9:00 AM",
                        "10:00 AM",
                        "11:00 AM",
                        "2:00 PM",
                        "3:00 PM",
                        "4:00 PM",
                        "5:00 PM",
                      ].map((time) => (
                        <option key={time} value={time}>
                          {time}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="pt-4 flex gap-3">
                  <button
                    type="button"
                    onClick={() => {
                      setShowBookingForm(false);
                      handleRefreshForm();
                      setToggleButton(false);
                    }}
                    className="flex-1 px-4 py-2.5 border border-gray-300 text-gray-700 font-medium rounded-lg hover:bg-gray-50 transition"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="flex-1 px-4 py-2.5 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition shadow-sm"
                  >
                    {toggleButton ? "Update Appointment" : "Confirm Booking"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* Payment Modal */}
      {showPaymentModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            className="fixed inset-0 bg-black/50 backdrop-blur-sm"
            onClick={closePaymentModal}
          ></div>
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-md z-10 overflow-hidden">
            <div className="p-6">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-xl font-bold text-gray-900">
                  Payment Details
                </h3>
                <button
                  onClick={closePaymentModal}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <X size={20} />
                </button>
              </div>

              <div className="bg-gray-50 rounded-xl p-4 space-y-3 mb-6 border border-gray-100">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">Doctor</span>
                  <span className="font-medium text-gray-900">
                    {paymentAppointment?.doc_name}
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">Patient</span>
                  <span className="font-medium text-gray-900">
                    {paymentAppointment?.p_name}
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">Date</span>
                  <span className="font-medium text-gray-900">
                    {getTodayISO()}
                  </span>
                </div>
                <div className="border-t border-gray-200 pt-2 flex justify-between text-base font-bold">
                  <span className="text-gray-700">Total Amount</span>
                  <span className="text-blue-600">
                    ₹{paymentAppointment?.consultationFee}
                  </span>
                </div>
              </div>

              {paymentVerifyResult && (
                <div
                  className={`p-3 rounded-lg text-sm mb-4 ${
                    paymentVerifyResult.status === "success"
                      ? "bg-green-50 text-green-700"
                      : "bg-red-50 text-red-700"
                  }`}
                >
                  <p className="font-semibold text-center">
                    {paymentVerifyResult.message}
                  </p>
                </div>
              )}

              {!paymentInitiated ? (
                <button
                  onClick={handleConfirmPayment}
                  disabled={paymentLoading}
                  className="w-full py-3 bg-green-600 text-white rounded-xl font-semibold hover:bg-green-700 transition flex items-center justify-center gap-2"
                >
                  {paymentLoading ? (
                    <Loader2 className="animate-spin w-5 h-5" />
                  ) : (
                    "Confirm & Pay"
                  )}
                </button>
              ) : (
                <button
                  onClick={handleProceedPayment}
                  className="w-full py-3 bg-indigo-600 text-white rounded-xl font-semibold hover:bg-indigo-700 transition flex items-center justify-center gap-2"
                >
                  Proceed to Gateway <ArrowRight size={18} />
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Cancel Confirmation Modal */}
      {showCancelConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            className="fixed inset-0 bg-black/50 backdrop-blur-sm"
            onClick={() => setShowCancelConfirm(false)}
          ></div>
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-sm z-10 p-6 text-center">
            <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <AlertCircle className="w-6 h-6 text-red-600" />
            </div>
            <h3 className="text-lg font-bold text-gray-900 mb-2">
              Cancel Appointment?
            </h3>
            <p className="text-gray-500 text-sm mb-6">
              Are you sure you want to cancel your appointment with{" "}
              <strong>{appointmentToCancel?.doc_name}</strong>? This action
              cannot be undone.
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setShowCancelConfirm(false)}
                className="flex-1 py-2.5 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 font-medium transition"
              >
                Keep It
              </button>
              <button
                onClick={() => deleteAppointment(appointmentToCancel?._id)}
                className="flex-1 py-2.5 bg-red-600 text-white rounded-lg hover:bg-red-700 font-medium transition"
              >
                Yes, Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Report Modal */}
      {showReportModal && selectedReport && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            className="fixed inset-0 bg-black/50 backdrop-blur-sm"
            onClick={() => setShowReportModal(false)}
          ></div>
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-2xl z-10 overflow-hidden max-h-[90vh] flex flex-col">
            <div className="p-6 border-b border-gray-200 flex justify-between items-center bg-gray-50">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center text-blue-600">
                  <FileText size={20} />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-gray-900">
                    Medical Report
                  </h3>
                  <p className="text-xs text-gray-500">{selectedReport.date}</p>
                </div>
              </div>
              <button
                onClick={() => setShowReportModal(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <X size={20} />
              </button>
            </div>

            <div className="p-6 overflow-y-auto space-y-6">
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div className="bg-gray-50 p-3 rounded-lg">
                  <span className="text-gray-500 block mb-1">Doctor</span>
                  <span className="font-semibold text-gray-900">
                    {selectedReport.doc_name}
                  </span>
                </div>
                <div className="bg-gray-50 p-3 rounded-lg">
                  <span className="text-gray-500 block mb-1">Diagnosis</span>
                  <span className="font-semibold text-gray-900">
                    {selectedReport.disease}
                  </span>
                </div>
              </div>

              <div>
                <h4 className="font-semibold text-gray-900 mb-2">
                  Prescription
                </h4>
                <div className="space-y-2">
                  {selectedReport.prescription?.map((med: any, idx: number) => (
                    <div
                      key={idx}
                      className="flex justify-between items-center p-3 border border-gray-100 rounded-lg"
                    >
                      <div>
                        <p className="font-medium text-gray-900">
                          {med.medicine}
                        </p>
                        <p className="text-xs text-gray-500">
                          {med.dosage} • {med.frequency}
                        </p>
                      </div>
                      <span className="text-xs bg-blue-50 text-blue-700 px-2 py-1 rounded">
                        {med.days}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="p-4 border-t border-gray-200 bg-gray-50">
              <button
                onClick={downloadReport}
                className="w-full py-3 bg-blue-600 text-white rounded-xl font-semibold hover:bg-blue-700 transition flex items-center justify-center gap-2"
              >
                <Download size={18} /> Download PDF
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
