"use client";
import React, { useEffect, useState } from "react";
import Link from "next/link";
import { DoctorType } from "../doctors/page";
import axios from "axios";

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

  const [formData, setFormData] = useState({
    appointmentId: "",
    doc_id: "",
    name: "",
    email: "",
    disease: "",
    doctor: "",
    date: "",
    time: "",
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
      id: "chat",
      label: "AI Assistant",
      icon: "💬",
      route: "/admin/patient/chat",
    },
  ];

  // Dummy report data
  const generateDummyReport = (appointment: any) => {
    return {
      id: appointment._id,
      patientName: appointment.p_name || "John Doe",
      doctorName: appointment.doc_name,
      date: appointment.date,
      time: appointment.time,
      diagnosis: appointment.disease,
      symptoms: ["Fever", "Headache", "Body ache"],
      vitals: {
        bloodPressure: "120/80 mmHg",
        temperature: "98.6°F",
        heartRate: "72 bpm",
        weight: "70 kg",
      },
      prescription: [
        {
          medicine: "Paracetamol",
          dosage: "500mg",
          frequency: "Twice daily",
          days: "5 days",
        },
        {
          medicine: "Vitamin D",
          dosage: "1000 IU",
          frequency: "Once daily",
          days: "30 days",
        },
      ],
      recommendations: [
        "Take plenty of rest",
        "Drink lots of fluids",
        "Avoid cold foods",
        "Follow up after 1 week if symptoms persist",
      ],
      nextAppointment: "Follow up after 1 week if needed",
    };
  };

  const handleViewReport = (appointment: any) => {
    const report = generateDummyReport(appointment);
    setSelectedReport(report);
    setShowReportModal(true);
  };
  const downloadReport = () => {
    // Simple download functionality - in real app, this would generate PDF
    const reportContent = `
MEDICAL REPORT
================
Patient: ${selectedReport.patientName}
Doctor: ${selectedReport.doctorName}
Date: ${selectedReport.date}
Time: ${selectedReport.time}

DIAGNOSIS: ${selectedReport.diagnosis}

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
    a.download = `Medical_Report_${selectedReport.patientName}_${selectedReport.date}.txt`;
    document.body.appendChild(a);
    a.click();
    window.URL.revokeObjectURL(url);
    document.body.removeChild(a);
  };
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
      const res = await axios.post(
        "http://localhost:5000/patient/appointment",
        formData,
        {
          withCredentials: true,
        }
      );
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
        `http://localhost:5000/patient/UpdateAppointment/${formData.appointmentId}`,
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
        const res = await axios.get("http://localhost:5000/patient/doctors", {
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
      const res = await axios.get(
        "http://localhost:5000/patient/get-appointments",
        {
          withCredentials: true,
        }
      );

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

  const deleteAppointment = async (id: any) => {
    try {
      const res = await axios.delete(
        `http://localhost:5000/patient/cancel-appointment/${id}`,
        {
          withCredentials: true,
        }
      );
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
    <div className="min-h-screen bg-gray-50 flex">
      {/* Sidebar - Fixed Position */}
      <div
        className={`bg-white shadow-lg transition-all duration-300 ${
          isSidebarOpen ? "w-64" : "w-20"
        } md:w-64 flex-shrink-0 fixed h-full z-40 ${
          showBookingForm ? "blur-sm" : ""
        }`}
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

      {/* Main Content - Adjusted for fixed sidebar */}
      <div
        className={`flex-1 flex flex-col ${
          isSidebarOpen ? "ml-64" : "ml-20"
        } md:ml-64 ${showBookingForm ? "blur-sm" : ""}`}
      >
        {/* Header - Fixed Position */}
        <header
          className="bg-white shadow-sm border-b border-gray-200 px-6 py-4 fixed w-full z-30"
          style={{
            left: isSidebarOpen ? "256px" : "80px",
            width: `calc(100% - ${isSidebarOpen ? "256px" : "80px"})`,
          }}
        >
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
              <h2 className="text-2xl font-bold text-gray-800 ml-44">
                📅 Appointments
              </h2>
            </div>

            <div className="flex items-center space-x-4">
              {/* Book Appointment Button */}
              <button
                onClick={() => setShowBookingForm(true)}
                className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition font-medium"
              >
                Book Appointment
              </button>

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

              {/* Profile */}
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

        {/* Main Content Area - Adjusted for fixed header */}
        <main className="flex-1 p-6 mt-20 overflow-y-auto">
          {/* Upcoming Appointments */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-bold text-gray-800">
                Upcoming Appointments
              </h3>
              <span className="px-3 py-1 bg-green-100 text-green-800 text-sm font-medium rounded-full">
                {upcomingAppointments.length} Scheduled
              </span>
            </div>

            <div className="space-y-4">
              {upcomingAppointments.map((appointment) => (
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
                {pastAppointments.length} Records
              </span>
            </div>

            <div className="space-y-4">
              {pastAppointments.map((appointment) => (
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
                          <button
                            className="px-3 py-1 bg-green-600 text-white text-sm rounded hover:bg-green-700 transition"
                            onClick={() => handleViewReport(appointment)}
                          >
                            📄 View Report
                          </button>
                          {/* <button className="px-3 py-1 bg-yellow-600 text-white text-sm rounded hover:bg-yellow-700 transition">
                            ⭐ Rate Doctor
                          </button> */}
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
            <div className="bg-gradient-to-br from-blue-50 to-white rounded-2xl shadow-2xl w-full max-w-md pointer-events-auto border border-blue-200 overflow-hidden">
              <div className="p-6">
                {/* Header with gradient background */}
                <div className="flex items-center justify-between mb-6 -m-6 p-6 bg-gradient-to-r from-blue-600 to-green-600 text-white">
                  <h3 className="text-2xl font-bold">Book New Appointment</h3>
                  <button
                    onClick={() => {
                      setShowBookingForm(false),
                        handleRefreshForm,
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
                          });
                        }
                      }}
                      className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-800 bg-white shadow-sm transition-all"
                      required
                    >
                      <option value="">Select a doctor</option>
                      {doctorsData.map((doctor) => (
                        <option key={doctor._id} value={doctor._id}>
                          {doctor.name} - {doctor.type}
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
                      className="flex-1 px-1 py-2 bg-gradient-to-r from-blue-600 to-green-600 text-white rounded-xl hover:from-blue-700 hover:to-green-700 transition-all font-semibold shadow-lg"
                    >
                      {toggleButton ? "Reschedule" : "Book Appointment"}
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setShowBookingForm(false),
                          handleRefreshForm(),
                          setToggleButton(false);
                      }}
                      className="flex-1 px-1 py-2 bg-gray-500 text-white rounded-xl hover:bg-gray-600 transition-all font-semibold shadow-lg"
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
                    onClick={() => deleteAppointment(appointmentToCancel?._id)}
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
                        <strong>Name:</strong> {selectedReport?.patientName}
                      </p>
                      <p className="text-sm text-black">
                        <strong>Date:</strong> {selectedReport?.date}
                      </p>
                      <p className="text-sm text-black">
                        <strong>Time:</strong> {selectedReport?.time}
                      </p>
                    </div>
                    <div className="bg-green-50 rounded-lg p-4">
                      <h4 className="font-semibold text-green-800 mb-2">
                        Doctor Information
                      </h4>
                      <p className="text-sm text-black">
                        <strong>Doctor:</strong> {selectedReport?.doctorName}
                      </p>
                      <p className="text-sm text-black">
                        <strong>Diagnosis:</strong> {selectedReport?.diagnosis}
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
                        <strong>Weight:</strong> {selectedReport?.vitals.weight}
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
  );
}
