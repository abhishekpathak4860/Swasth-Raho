"use client";
import React, { useEffect, useState } from "react";
import Link from "next/link";
import { DoctorType } from "../doctors/page";
import axios from "axios";
import Footer from "../../../../components/Footer";

export default function Appointments() {
  const [activeTab, setActiveTab] = useState("appointments");
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [showBookingForm, setShowBookingForm] = useState(false);
  const [doctorsData, setDoctorsData] = useState<DoctorType[]>([]);
  const [upcomingAppointments, setUpcomingAppointments] = useState<any[]>([]);
  const [pastAppointments, setPastAppointments] = useState<any[]>([]);
  const [toggleButton, setToggleButton] = useState(false);
  const [showCancelConfirm, setShowCancelConfirm] = useState(false);
  const [appointmentToCancel, setAppointmentToCancel] = useState<any>(null);
  const [showReportModal, setShowReportModal] = useState(false);
  const [selectedReport, setSelectedReport] = useState<any>(null);
  const [user, setUser] = useState<any>(null);
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
      id: "hospitals",
      label: "Hospitals",
      icon: "💬",
      route: "/admin/patient/hospitals",
    },
    {
      id: "chat",
      label: "AI Assistant",
      icon: "💬",
      route: "/admin/patient/chat",
    },
  ];
  // useEffect(() => {
  //   const fetchProfile = async () => {
  //     try {
  //       const res = await axios.get(`${process.env.NEXT_PUBLIC_BACKEND_URL}/patient/profile`, {
  //         withCredentials: true, // send cookies
  //       });
  //       setUser(res.data.patient);
  //     } catch (error) {
  //       console.error("Error fetching profile:", error);
  //     }
  //   };

  //   fetchProfile();
  // }, []);
  const handleLogout = async () => {
    try {
      const res = await axios.post(
        `/api/logout`,
        {},
        { withCredentials: true }
      );

      window.location.href = "/login";
    } catch (error) {
      console.error("Error logging out:", error);
    }
  };
  // Dummy report data
  // const generateDummyReport = (appointment: any) => {
  //   return {
  //     id: appointment._id,
  //     patientName: appointment.p_name || "John Doe",
  //     doctorName: appointment.doc_name,
  //     date: appointment.date,
  //     time: appointment.time,
  //     diagnosis: appointment.disease,
  //     symptoms: ["Fever", "Headache", "Body ache"],
  //     vitals: {
  //       bloodPressure: "120/80 mmHg",
  //       temperature: "98.6°F",
  //       heartRate: "72 bpm",
  //       weight: "70 kg",
  //     },
  //     prescription: [
  //       {
  //         medicine: "Paracetamol",
  //         dosage: "500mg",
  //         frequency: "Twice daily",
  //         days: "5 days",
  //       },
  //       {
  //         medicine: "Vitamin D",
  //         dosage: "1000 IU",
  //         frequency: "Once daily",
  //         days: "30 days",
  //       },
  //     ],
  //     recommendations: [
  //       "Take plenty of rest",
  //       "Drink lots of fluids",
  //       "Avoid cold foods",
  //       "Follow up after 1 week if symptoms persist",
  //     ],
  //     nextAppointment: "Follow up after 1 week if needed",
  //   };
  // };

  const getReports = async () => {
    const res = await axios.get(`/patient/get-reports`, {
      withCredentials: true,
    });
    setReportsData(res.data.reports);
  };

  useEffect(() => {
    getReports();
  }, []);

  const getReportByAppointmentId = (appointment: any) => {
    const filterReport = reportsData?.filter(
      (report) => report.appointment_id == appointment._id
    );
    return filterReport.length > 0 ? filterReport[0] : null;
  };

  const handleViewReport = (appointment: any) => {
    const report = getReportByAppointmentId(appointment);
    setSelectedReport(report);
    setShowReportModal(true);
  };
  const downloadReport = () => {
    // Simple download functionality - in real app, this would generate PDF
    const reportContent = `
MEDICAL REPORT
================
Patient: ${selectedReport.p_name}
Doctor: ${selectedReport.doc_name}
Date: ${selectedReport.date}


DIAGNOSIS: ${selectedReport.disease}

SYMPTOMS:
${selectedReport.symptoms.map((symptom: string) => `- ${symptom}`).join("\n")}

VITAL SIGNS:
- Blood Pressure: ${selectedReport.vitals.bloodPressure}
- Temperature: ${selectedReport.vitals.temperature}
- Heart Rate: ${selectedReport.vitals.heartRate}
- Weight: ${selectedReport.vitals.weight}

PRESCRIPTION:
${selectedReport.prescription
  .map(
    (med: any) =>
      `- ${med.medicine} ${med.dosage} - ${med.frequency} for ${med.days}`
  )
  .join("\n")}

RECOMMENDATIONS:
${selectedReport.recommendations.map((rec: string) => `- ${rec}`).join("\n")}

Next Appointment: ${selectedReport.nextAppointment}
  `;

    const blob = new Blob([reportContent], { type: "text/plain" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `Medical_Report_${selectedReport.p_name}_${selectedReport.date}.pdf`;
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

  // Call backend to initiate payment and receive redirect URL
  const handleConfirmPayment = async () => {
    if (!paymentAppointment) return;
    setPaymentLoading(true);
    try {
      const payload = {
        appointmentId: paymentAppointment._id,
        p_id: paymentAppointment.p_id || paymentAppointment.p_id,
        doc_id: paymentAppointment.doc_id || paymentAppointment.doc_id,
        p_name: paymentAppointment.p_name,
        doc_name: paymentAppointment.doc_name,
        disease: paymentAppointment.disease,
        consultationFee: paymentAppointment.consultationFee,
        date: getTodayISO(),
      };

      // Replace this endpoint with your real initiate-payment endpoint if different
      const res = await axios.post(`/patient/initiate-payment`, payload, {
        withCredentials: true,
      });

      // Expecting backend to return { redirectUrl: 'https://...' }
      const redirectUrl =
        res?.data?.redirectUrl || res?.data?.paymentUrl || null;
      if (redirectUrl) {
        setPaymentUrl(redirectUrl);
        setPaymentInitiated(true);
      } else {
        // If backend returns some other shape, show a message
        alert(
          "Payment initiation returned no redirect URL. Check server response."
        );
      }
    } catch (error: any) {
      console.error("Payment initiation error:", error);
      alert(error?.response?.data?.message || "Failed to initiate payment.");
    } finally {
      setPaymentLoading(false);
    }
  };

  // When user clicks Proceed Payment, redirect to the gateway URL
  const handleProceedPayment = () => {
    if (!paymentUrl) {
      alert("No payment URL available. Please Confirm Payment first.");
      return;
    }
    // navigate to the payment gateway (open in same tab or new tab as you prefer)
    window.location.href = paymentUrl;
  };

  const removeQueryParam = (key: string) => {
    try {
      const url = new URL(window.location.href);
      url.searchParams.delete(key);
      window.history.replaceState({}, "", url.toString());
    } catch (e) {
      // fallback: rebuild without search
      const [base] = window.location.href.split("?");
      window.history.replaceState({}, "", base);
    }
  };

  // On mount: if redirected back from PhonePe (source=phonepe), open modal and call verify API
  useEffect(() => {
    try {
      const params = new URLSearchParams(window.location.search);
      const src = params.get("source");
      if (src === "phonepe") {
        // open modal and run verify
        setShowPaymentModal(true);
        setPaymentLoading(true);
        (async () => {
          try {
            const res = await axios.get(`/patient/verify-payment`, {
              withCredentials: true,
            });
            // Expecting backend: { status: 'success'|'failed'|'pending', appointment?: {...}, message?: '...' }
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
            // keep result visible for 2 seconds then close modal and remove query param
            setTimeout(() => {
              closePaymentModal();
              removeQueryParam("source");
            }, 10000);
          }
        })();
      }
    } catch (e) {
      console.error("error parsing URL params", e);
    }
  }, []);
  const rescheduleAppointment = (appointment: any) => {
    // Set form data to the current appointment’s details
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

  // handle refresh form
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
  const handleInputChange = (e: { target: { name: any; value: any } }) => {
    const { name, value } = e.target;

    // if (name === "doctor") {
    //   const doctorObj = JSON.parse(value);
    //   setFormData({
    //     ...formData,
    //     doctor: doctorObj.name,
    //     doc_id: doctorObj.id,
    //   });
    // } else {
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = async (e: { preventDefault: () => void }) => {
    try {
      e.preventDefault();
      const res = await axios.post(`/patient/appointment`, formData, {
        withCredentials: true,
      });
      setShowBookingForm(false);
      setToggleButton(false);
      fetchAppointmentData(); // fetch latest appointments after patient submits form
      handleRefreshForm();
      alert(`${res.data.message}`);
    } catch (error) {
      console.log(error);
    }
  };

  const UpdateAppointment = async (e: { preventDefault: () => void }) => {
    try {
      e.preventDefault();
      const res = await axios.patch(
        `/patient/UpdateAppointment/${formData.appointmentId}`,
        formData,
        { withCredentials: true }
      );
      // alert(`${res.data.message}`);
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
  // gets doctors data for appointment form
  useEffect(() => {
    const fetchDoctorData = async () => {
      try {
        const res = await axios.get(`/patient/doctors`, {
          withCredentials: true, // send cookies
        });
        setDoctorsData(res.data.doctor);
      } catch (error) {
        console.error("Error fetching profile:", error);
      }
    };
    fetchDoctorData();
  }, []);
  // get appointments data
  const fetchAppointmentData = async () => {
    try {
      const res = await axios.get(`/patient/get-appointments`, {
        withCredentials: true,
      });

      // Filter appointments based on status
      const allAppointments = res.data.appointments;

      // Upcoming appointments: pending and confirmed
      const upcoming = allAppointments.filter(
        (appointment: any) =>
          appointment.status === "pending" || appointment.status === "confirmed"
      );

      // Past appointments: completed and cancelled
      const past = allAppointments.filter(
        (appointment: any) =>
          appointment.status === "completed" ||
          appointment.status === "cancelled"
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

  // Derived filtered lists based on search & filters
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
      const res = await axios.delete(`/patient/cancel-appointment/${id}`, {
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
    <div className="min-h-screen bg-gray-50">
      {/* Mobile overlay when drawer is open */}
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
        {/* Desktop Sidebar - full height */}
        <aside
          className={`hidden md:flex flex-col w-64 bg-white shadow-lg fixed top-0 left-0 min-h-screen overflow-y-auto z-40 ${
            showBookingForm ? "blur-sm" : ""
          }`}
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
        <div
          className={`flex-1 flex flex-col ${
            showBookingForm ? "blur-sm" : ""
          } md:ml-64`}
        >
          {/* Header */}
          <header className="bg-white shadow-sm border-b border-gray-200 px-4 sm:px-6 py-3 sm:py-4 fixed top-0 w-full z-30">
            <div className="flex items-center justify-between">
              <div className="flex items-center min-w-0">
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

                <div className="ml-2 md:ml-4 min-w-0">
                  <h2 className="text-xl sm:text-2xl font-bold text-gray-800 truncate">
                    Appointments
                  </h2>
                </div>
              </div>

              <div className="flex items-center space-x-3">
                <button
                  onClick={() => setShowBookingForm(true)}
                  className="hidden md:mr-72 sm:inline-flex items-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition font-medium"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5 mr-2"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M8 7V3m8 4V3M5 11h14M5 19h14M5 15h14"
                    />
                  </svg>
                  Book Appointment
                </button>

                <button
                  onClick={() => setShowBookingForm(true)}
                  className="sm:hidden p-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition"
                  aria-label="Book appointment"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M8 7V3m8 4V3M5 11h14M5 19h14M5 15h14"
                    />
                  </svg>
                </button>
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center">
                    <span className="text-white font-semibold">
                      {user?.name
                        ?.split(" ")
                        .map((ch: any) => ch[0]?.toUpperCase())
                        .join("")
                        .slice(0, 2)}
                    </span>
                  </div>
                  <div className="hidden md:block text-right">
                    <p className="text-sm font-medium text-gray-800">
                      {user?.name}
                    </p>
                    <p className="text-xs text-gray-500">{user?.email}</p>
                  </div>
                </div>
              </div>
            </div>
          </header>

          {/* Main Content Area */}
          <main className="flex-1 p-6 mt-20 overflow-y-auto">
            {/* Search & Filters (placed below header) */}
            <div className="bg-white rounded-lg border text-black border-gray-200 p-4 mb-6">
              <div className="flex flex-col sm:flex-row sm:items-center sm:space-x-3 space-y-3 sm:space-y-0">
                <input
                  type="search"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search doctor or patient"
                  className="flex-1 px-3 py-2 border border-gray-200 rounded-lg text-black focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                />

                <select
                  value={filterCategory}
                  onChange={(e) => {
                    const val = e.target.value as "upcoming" | "past" | "both";
                    setFilterCategory(val);
                    setFilterStatus("all");
                  }}
                  className="px-3 py-2 border border-gray-200 rounded-lg text-sm"
                >
                  <option value="upcoming">Upcoming</option>
                  <option value="past">Past</option>
                  <option value="both">Both</option>
                </select>

                {filterCategory === "upcoming" && (
                  <select
                    value={filterStatus}
                    onChange={(e) => setFilterStatus(e.target.value as any)}
                    className="px-3 py-2 border border-gray-200 rounded-lg text-sm"
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
                    className="px-3 py-2 border border-gray-200 rounded-lg text-sm"
                  >
                    <option value="all">All</option>
                    <option value="completed">Completed</option>
                    <option value="cancelled">Cancelled</option>
                  </select>
                )}

                <button
                  onClick={() => {
                    setSearchQuery("");
                    setFilterCategory("both");
                    setFilterStatus("all");
                  }}
                  className="px-3 py-2 bg-gray-100 rounded-lg text-sm"
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
                            {appointment.doc_name}
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
                          🏥 {appointment.type}
                        </p>
                        <p className="text-gray-600 mb-1">
                          💊 {appointment.disease}
                        </p>
                        <div className="flex items-center space-x-4 text-sm text-gray-500">
                          <span>📅 {appointment.date}</span>
                          {/* <span>⏰ {appointment.time}</span> */}
                        </div>
                        <span className="text-sm text-gray-500">
                          ⏰ {appointment.time}
                        </span>
                      </div>

                      <div className="flex space-x-2 mt-4 md:mt-0">
                        {appointment.status === "pending" && (
                          <>
                            <button
                              className="px-3 py-1 bg-yellow-600 text-white text-sm rounded hover:bg-yellow-700 transition"
                              onClick={() => rescheduleAppointment(appointment)}
                            >
                              Reschedule
                            </button>
                            <button
                              className="px-3 py-1 bg-red-600 text-white text-sm rounded hover:bg-red-700 transition"
                              onClick={() => handleCancelClick(appointment)}
                            >
                              Cancel
                            </button>
                          </>
                        )}
                        {appointment.status === "confirmed" && (
                          <>
                            <button className="px-3 py-1 bg-blue-600 text-white text-sm rounded hover:bg-blue-700 transition">
                              Details
                            </button>
                            {/* <button className="px-3 py-1 bg-red-600 text-white text-sm rounded hover:bg-red-700 transition">
                            ❌ Cancel
                          </button> */}
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
                            {appointment.doc_name}
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
                          🏥 {appointment.type}
                        </p>
                        <p className="text-gray-600 mb-1">
                          💊 {appointment.disease}
                        </p>
                        <div className="flex items-center space-x-4 text-sm text-gray-500">
                          <span>📅 {appointment.date}</span>
                        </div>
                        <span className="text-sm text-gray-500">
                          ⏰ {appointment.time}
                        </span>
                      </div>

                      <div className="flex space-x-2 mt-4 md:mt-0">
                        {appointment.status === "completed" && (
                          <>
                            <Link href={"/admin/patient/reports"}>
                              <button
                                className="px-3 py-1 bg-green-600 text-white text-sm rounded hover:bg-green-700 transition"
                                // onClick={() => handleViewReport(appointment)}
                              >
                                View Report Status
                              </button>
                            </Link>
                            <button
                              className="px-3 py-1  bg-green-600 text-white text-sm rounded hover:bg-green-700 transition"
                              onClick={() => openPaymentModal(appointment)}
                            >
                              Pay
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

        {/* Booking Form Modal - Updated with Better Colors */}
        {showBookingForm && (
          <>
            {/* Overlay with backdrop blur */}
            <div
              className="fixed inset-0 bg-gray-900/40 backdrop-blur-sm z-50"
              onClick={() => {
                setShowBookingForm(false),
                  handleRefreshForm(),
                  setToggleButton(false);
              }}
            ></div>

            {/* Modal Content */}
            <div className="fixed inset-0 flex items-center justify-center z-50 p-4 pointer-events-none">
              <div className="bg-gradient-to-br from-blue-50 to-white rounded-2xl shadow-2xl w-full max-w-[95vw] sm:max-w-md pointer-events-auto border border-blue-200 overflow-hidden">
                <div className="p-6">
                  {/* Header with gradient background */}
                  <div className="flex items-center justify-between mb-6 -m-6 p-6 bg-gradient-to-r from-blue-600 to-green-600 text-white">
                    <h3 className="text-2xl font-bold">Book New Appointment</h3>
                    <button
                      onClick={() => {
                        setShowBookingForm(false);
                        handleRefreshForm();
                        setToggleButton(false);
                      }}
                      className="text-white/80 hover:text-white text-2xl hover:bg-white/20 rounded-full w-8 h-8 flex items-center justify-center transition-all"
                    >
                      ✕
                    </button>
                  </div>

                  <form
                    onSubmit={toggleButton ? UpdateAppointment : handleSubmit}
                    className="space-y-4 max-h-[60vh] overflow-y-auto pr-2"
                    style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
                  >
                    <style jsx>{`
                      form::-webkit-scrollbar {
                        display: none;
                      }
                    `}</style>

                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Patient Full Name
                      </label>
                      <input
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-800 bg-white shadow-sm transition-all"
                        placeholder="Enter your full name"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Email Address
                      </label>
                      <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-800 bg-white shadow-sm transition-all"
                        placeholder="your.email@example.com"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Type of Disease/Issue
                      </label>
                      <input
                        type="text"
                        name="disease"
                        value={formData.disease}
                        onChange={handleInputChange}
                        placeholder="e.g., Headache, Fever, Checkup"
                        className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-800 bg-white shadow-sm transition-all"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Choose Doctor
                      </label>

                      <select
                        name="doctor"
                        value={formData.doc_id} // bind by doc_id, not doctor name
                        onChange={(e) => {
                          const selectedDoctor = doctorsData.find(
                            (doc) => doc._id === e.target.value
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
                        className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-800 bg-white shadow-sm transition-all"
                        required
                      >
                        <option value="">Select a doctor</option>
                        {doctorsData.map((doctor) => (
                          <option key={doctor._id} value={doctor._id}>
                            {doctor.name} - {doctor.type} - Rs.
                            {doctor.consultationFee}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Preferred Date
                      </label>
                      <input
                        type="date"
                        name="date"
                        value={formData.date}
                        onChange={handleInputChange}
                        min={new Date().toISOString().split("T")[0]}
                        className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-800 bg-white shadow-sm transition-all"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Preferred Time
                      </label>
                      <select
                        name="time"
                        value={formData.time}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-800 bg-white shadow-sm transition-all"
                        required
                      >
                        <option value="">Select time</option>
                        <option value="9:00 AM">9:00 AM</option>
                        <option value="10:00 AM">10:00 AM</option>
                        <option value="11:00 AM">11:00 AM</option>
                        <option value="2:00 PM">2:00 PM</option>
                        <option value="3:00 PM">3:00 PM</option>
                        <option value="4:00 PM">4:00 PM</option>
                        <option value="5:00 PM">5:00 PM</option>
                      </select>
                    </div>

                    <div className="flex space-x-4 pt-6">
                      <button
                        type="submit"
                        className="flex-1 px-4 py-2 bg-gradient-to-r from-blue-600 to-green-600 text-white rounded-xl hover:from-blue-700 hover:to-green-700 transition-all font-semibold shadow-lg"
                      >
                        {toggleButton ? "Reschedule" : "Book Appointment"}
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          setShowBookingForm(false);
                          handleRefreshForm();
                          setToggleButton(false);
                        }}
                        className="flex-1 px-4 py-2 bg-gray-500 text-white rounded-xl hover:bg-gray-600 transition-all font-semibold shadow-lg"
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
        {/* Payment Modal */}
        {showPaymentModal && (
          <>
            {/* Overlay */}
            <div
              className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50"
              onClick={closePaymentModal}
            ></div>

            {/* Modal */}
            <div className="fixed inset-0 flex items-center justify-center z-50 p-4 pointer-events-none">
              <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg pointer-events-auto border border-gray-200">
                <div className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-xl font-bold">Payment</h3>
                    <button
                      onClick={closePaymentModal}
                      className="text-gray-400 hover:text-gray-600 text-2xl hover:bg-gray-100 rounded-full w-8 h-8 flex items-center justify-center transition-all"
                    >
                      ✕
                    </button>
                  </div>

                  <div className="space-y-4">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div className="p-3 rounded-lg border bg-gray-50">
                        <p className="text-sm text-gray-500">Doctor</p>
                        <p className="font-medium text-gray-800">
                          {paymentAppointment?.doc_name}
                        </p>
                      </div>
                      <div className="p-3 rounded-lg border bg-gray-50">
                        <p className="text-sm text-gray-500">Patient</p>
                        <p className="font-medium text-gray-800">
                          {paymentAppointment?.p_name}
                        </p>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div className="p-3 rounded-lg border bg-gray-50">
                        <p className="text-sm text-gray-500">Current Date</p>
                        <p className="font-medium text-gray-800">
                          {getTodayISO()}
                        </p>
                      </div>
                      <div className="p-3 rounded-lg border bg-gray-50">
                        <p className="text-sm text-gray-500">Amount</p>
                        <p className="font-medium text-gray-800">
                          ₹{paymentAppointment?.consultationFee ?? "0"}
                        </p>
                      </div>
                    </div>

                    <div className="p-3 rounded-lg border bg-gray-50">
                      <p className="text-sm text-gray-500">Disease / Reason</p>
                      <p className="font-medium text-gray-800">
                        {paymentAppointment?.disease ?? "-"}
                      </p>
                    </div>

                    {/* Verification status area (used when redirected back from gateway) */}
                    <div>
                      {paymentLoading && (
                        <div className="p-3 rounded-lg bg-yellow-50 text-yellow-800 border border-yellow-100 text-sm">
                          Verifying payment, please wait...
                        </div>
                      )}

                      {!paymentLoading && paymentVerifyResult && (
                        <div
                          className={`p-3 rounded-lg text-sm ${
                            paymentVerifyResult.status === "success"
                              ? "bg-green-50 text-green-800 border border-green-100"
                              : paymentVerifyResult.status === "pending"
                              ? "bg-yellow-50 text-yellow-800 border border-yellow-100"
                              : "bg-red-50 text-red-800 border border-red-100"
                          }`}
                        >
                          <p className="font-semibold">
                            Status:{" "}
                            {paymentVerifyResult.status ??
                              paymentVerifyResult.message}
                          </p>
                          {paymentVerifyResult.message && (
                            <p className="mt-1">
                              {paymentVerifyResult.message}
                            </p>
                          )}
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="mt-6 pt-4 border-t border-gray-200 flex space-x-3">
                    {!paymentInitiated ? (
                      <button
                        onClick={handleConfirmPayment}
                        disabled={paymentLoading}
                        className={`flex-1 px-4 py-3 bg-gradient-to-r from-green-600 to-blue-600 text-white rounded-xl hover:from-green-700 hover:to-blue-700 transition-all font-semibold shadow-lg ${
                          paymentLoading ? "opacity-60 cursor-wait" : ""
                        }`}
                      >
                        {paymentLoading ? "Processing..." : "Confirm Payment"}
                      </button>
                    ) : (
                      <button
                        onClick={handleProceedPayment}
                        className="flex-1 px-4 py-3 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 transition-all font-semibold shadow-lg"
                      >
                        Proceed Payment
                      </button>
                    )}

                    <button
                      onClick={closePaymentModal}
                      className="flex-1 px-4 py-3 bg-gray-300 text-gray-700 rounded-xl hover:bg-gray-400 transition-all font-semibold"
                    >
                      Close
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </>
        )}

        {/* Floating AI Chat Button */}
        <button
          className={`fixed bottom-6 right-6 w-14 h-14 bg-gradient-to-r from-blue-600 to-green-600 text-white rounded-full shadow-lg hover:shadow-xl transition-all duration-300 flex items-center justify-center z-50 ${
            showBookingForm ? "blur-sm" : ""
          }`}
        >
          <span className="text-2xl">💬</span>
        </button>
        {/* Cancel Confirmation Modal */}
        {showCancelConfirm && (
          <>
            {/* Overlay */}
            <div
              className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50"
              onClick={() => setShowCancelConfirm(false)}
            ></div>

            {/* Confirmation Modal */}
            <div className="fixed inset-0 flex items-center justify-center z-50 p-4 pointer-events-none">
              <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md pointer-events-auto border border-gray-200">
                <div className="p-6">
                  {/* Header */}
                  {/* <div className="flex items-center justify-center mb-4">
                  <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center">
                    <span className="text-3xl">Swasth Raho</span>
                  </div>
                </div> */}

                  {/* Content */}
                  <div className="text-center mb-6">
                    <h3 className="text-xl font-bold text-gray-800 mb-2">
                      Cancel Appointment?
                    </h3>
                    <p className="text-gray-600 mb-4">
                      Are you sure you want to cancel your appointment with{" "}
                      <span className="font-semibold text-gray-800">
                        {appointmentToCancel?.doc_name}
                      </span>
                      ?
                    </p>
                    <div className="bg-gray-50 rounded-lg p-3 text-sm text-gray-600">
                      <p>Date: {appointmentToCancel?.date}</p>
                      <p>Time: {appointmentToCancel?.time}</p>
                      <p>Issue: {appointmentToCancel?.disease}</p>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex space-x-3">
                    <button
                      onClick={() => {
                        setShowCancelConfirm(false);
                        setAppointmentToCancel(null);
                      }}
                      className="flex-1 px-4 py-3 bg-gray-300 text-gray-700 rounded-xl hover:bg-gray-400 transition-all font-medium"
                    >
                      Keep Appointment
                    </button>
                    <button
                      onClick={() =>
                        deleteAppointment(appointmentToCancel?._id)
                      }
                      className="flex-1 px-4 py-3 bg-red-600 text-white rounded-xl hover:bg-red-700 transition-all font-medium"
                    >
                      Yes, Cancel
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </>
        )}
        {/* Medical Report Modal */}
        {showReportModal && (
          <>
            {/* Overlay */}
            <div
              className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50"
              onClick={() => setShowReportModal(false)}
            ></div>

            {/* Report Modal */}
            <div className="fixed inset-0 flex items-center justify-center z-50 p-4 pointer-events-none">
              <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-hidden pointer-events-auto border border-gray-200">
                <div className="p-6">
                  {/* Header */}
                  <div className="flex items-center justify-between mb-6 pb-4 border-b border-gray-200">
                    <div className="flex items-center space-x-3">
                      <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                        <span className="text-2xl">📄</span>
                      </div>
                      <div>
                        <h3 className="text-2xl font-bold text-gray-800">
                          Medical Report
                        </h3>
                        <p className="text-sm text-gray-500">
                          Patient Medical Record
                        </p>
                      </div>
                    </div>
                    <button
                      onClick={() => setShowReportModal(false)}
                      className="text-gray-400 hover:text-gray-600 text-2xl hover:bg-gray-100 rounded-full w-8 h-8 flex items-center justify-center transition-all"
                    >
                      ✕
                    </button>
                  </div>

                  {/* Report Content */}
                  <div className="max-h-[60vh] overflow-y-auto space-y-6">
                    {/* Patient & Doctor Info */}
                    <div className="grid md:grid-cols-2 gap-4">
                      <div className="bg-blue-50 rounded-lg p-4">
                        <h4 className="font-semibold text-blue-800 mb-2">
                          Patient Information
                        </h4>
                        <p className="text-sm text-black">
                          <strong>Name:</strong> {selectedReport?.p_name}
                        </p>
                        <p className="text-sm text-black">
                          <strong>Date:</strong> {selectedReport?.date}
                        </p>
                        {/* <p className="text-sm text-black">
                        <strong>Time:</strong> {selectedReport?.time}
                      </p> */}
                      </div>
                      <div className="bg-green-50 rounded-lg p-4">
                        <h4 className="font-semibold text-green-800 mb-2">
                          Doctor Information
                        </h4>
                        <p className="text-sm text-black">
                          <strong>Doctor:</strong> {selectedReport?.doc_name}
                        </p>
                        <p className="text-sm text-black">
                          <strong>Diagnosis:</strong> {selectedReport?.disease}
                        </p>
                      </div>
                    </div>

                    {/* Symptoms */}
                    <div className="bg-gray-50 rounded-lg p-4">
                      <h4 className="font-semibold text-gray-800 mb-3">
                        Symptoms
                      </h4>
                      <ul className="list-disc list-inside space-y-1">
                        {selectedReport?.symptoms.map(
                          (symptom: string, index: number) => (
                            <li key={index} className="text-sm text-gray-700">
                              {symptom}
                            </li>
                          )
                        )}
                      </ul>
                    </div>

                    {/* Vital Signs */}
                    <div className="bg-purple-50 rounded-lg p-4">
                      <h4 className="font-semibold text-purple-800 mb-3">
                        ❤️ Vital Signs
                      </h4>
                      <div className="grid grid-cols-2 gap-3">
                        <div className="text-sm text-gray-600">
                          <strong>Blood Pressure:</strong>{" "}
                          {selectedReport?.vitals.bloodPressure}
                        </div>
                        <div className="text-sm text-gray-600">
                          <strong>Temperature:</strong>{" "}
                          {selectedReport?.vitals.temperature}
                        </div>
                        <div className="text-sm text-gray-600">
                          <strong>Heart Rate:</strong>{" "}
                          {selectedReport?.vitals.heartRate}
                        </div>
                        <div className="text-sm text-gray-600">
                          <strong>Weight:</strong>{" "}
                          {selectedReport?.vitals.weight}
                        </div>
                      </div>
                    </div>

                    {/* Prescription */}
                    <div className="bg-yellow-50 rounded-lg p-4">
                      <h4 className="font-semibold text-yellow-800 mb-3">
                        💊 Prescription
                      </h4>
                      <div className="space-y-3">
                        {selectedReport?.prescription.map(
                          (med: any, index: number) => (
                            <div
                              key={index}
                              className="border border-yellow-200 rounded-lg p-3 bg-white"
                            >
                              <div className="flex justify-between items-start">
                                <div>
                                  <p className="font-medium text-gray-800">
                                    {med.medicine}
                                  </p>
                                  <p className="text-sm text-gray-600">
                                    {med.dosage} - {med.frequency}
                                  </p>
                                </div>
                                <span className="text-xs bg-yellow-200 text-yellow-800 px-2 py-1 rounded">
                                  {med.days}
                                </span>
                              </div>
                            </div>
                          )
                        )}
                      </div>
                    </div>

                    {/* Recommendations */}
                    <div className="bg-orange-50 rounded-lg p-4">
                      <h4 className="font-semibold text-orange-800 mb-3">
                        💡 Recommendations
                      </h4>
                      <ul className="list-disc list-inside space-y-1">
                        {selectedReport?.recommendations.map(
                          (rec: string, index: number) => (
                            <li key={index} className="text-sm text-gray-700">
                              {rec}
                            </li>
                          )
                        )}
                      </ul>
                    </div>

                    {/* Next Appointment */}
                    <div className="bg-indigo-50 rounded-lg p-4">
                      <h4 className="font-semibold text-indigo-800 mb-2">
                        📅 Next Appointment
                      </h4>
                      <p className="text-sm text-gray-700">
                        {selectedReport?.nextAppointment}
                      </p>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="mt-6 pt-4 border-t border-gray-200 flex space-x-3">
                    <button
                      onClick={downloadReport}
                      className="flex-1 px-4 py-3 bg-gradient-to-r from-green-600 to-blue-600 text-white rounded-xl hover:from-green-700 hover:to-blue-700 transition-all font-semibold shadow-lg"
                    >
                      📥 Download Report
                    </button>
                    <button
                      onClick={() => setShowReportModal(false)}
                      className="flex-1 px-4 py-3 bg-gray-300 text-gray-700 rounded-xl hover:bg-gray-400 transition-all font-semibold"
                    >
                      Close
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </>
        )}
      </div>
      <div className="block md:hidden">
        <Footer />
      </div>
    </div>
  );
}
