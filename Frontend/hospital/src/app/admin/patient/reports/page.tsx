"use client";
import React, { useState, useEffect } from "react";
import Link from "next/link";
import axios from "axios";

export default function Reports() {
  const [activeTab, setActiveTab] = useState("reports");
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [user, setUser] = useState<any>(null);
  const [reportsData, setReportsData] = useState<any[]>([]);
  const [filteredReports, setFilteredReports] = useState<any[]>([]);
  const [selectedFilter, setSelectedFilter] = useState({
    doctor: "all",
    reportType: "all",
    dateRange: "all",
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

  // Dummy reports data
  const dummyReports = [
    {
      _id: "rep001",
      p_name: "John Doe",
      doc_name: "Dr. Amit Sharma",
      date: "2025-10-12",
      department: "Cardiology",
      disease: "ECG Report",
      status: "completed",
      symptoms: ["Chest pain", "Shortness of breath"],
      vitals: {
        bloodPressure: "130/85 mmHg",
        temperature: "98.4°F",
        heartRate: "78 bpm",
        weight: "72 kg",
      },
      prescription: [
        {
          medicine: "Aspirin",
          dosage: "75mg",
          frequency: "Once daily",
          days: "30 days",
        },
        {
          medicine: "Atorvastatin",
          dosage: "20mg",
          frequency: "Once daily",
          days: "30 days",
        },
      ],
      recommendations: [
        "Regular exercise",
        "Low sodium diet",
        "Monitor blood pressure daily",
        "Follow up in 2 weeks",
      ],
      nextAppointment: "Follow up in 2 weeks",
    },
    {
      _id: "rep002",
      p_name: "John Doe",
      doc_name: "Dr. Priya Patel",
      date: "2025-09-28",
      department: "Dermatology",
      disease: "Skin Allergy Test",
      status: "completed",
      symptoms: ["Skin rash", "Itching", "Redness"],
      vitals: {
        bloodPressure: "120/80 mmHg",
        temperature: "98.6°F",
        heartRate: "72 bpm",
        weight: "70 kg",
      },
      prescription: [
        {
          medicine: "Cetirizine",
          dosage: "10mg",
          frequency: "Once daily",
          days: "10 days",
        },
        {
          medicine: "Calamine Lotion",
          dosage: "Apply",
          frequency: "Twice daily",
          days: "7 days",
        },
      ],
      recommendations: [
        "Avoid allergens",
        "Use mild soap",
        "Keep skin moisturized",
        "Avoid scratching",
      ],
      nextAppointment: "Follow up if symptoms persist",
    },
    {
      _id: "rep003",
      p_name: "John Doe",
      doc_name: "Dr. Rahul Kumar",
      date: "2025-09-15",
      department: "Neurology",
      disease: "MRI Brain Scan",
      status: "completed",
      symptoms: ["Headache", "Dizziness", "Memory issues"],
      vitals: {
        bloodPressure: "125/82 mmHg",
        temperature: "98.5°F",
        heartRate: "75 bpm",
        weight: "71 kg",
      },
      prescription: [
        {
          medicine: "Sumatriptan",
          dosage: "50mg",
          frequency: "As needed",
          days: "10 days",
        },
        {
          medicine: "Magnesium",
          dosage: "400mg",
          frequency: "Once daily",
          days: "30 days",
        },
      ],
      recommendations: [
        "Adequate sleep",
        "Stress management",
        "Stay hydrated",
        "Regular meals",
      ],
      nextAppointment: "Follow up in 1 month",
    },
    {
      _id: "rep004",
      p_name: "John Doe",
      doc_name: "Dr. Sneha Singh",
      date: "2025-08-20",
      department: "Orthopedic",
      disease: "X-Ray Spine",
      status: "completed",
      symptoms: ["Back pain", "Stiffness", "Limited mobility"],
      vitals: {
        bloodPressure: "118/76 mmHg",
        temperature: "98.3°F",
        heartRate: "70 bpm",
        weight: "69 kg",
      },
      prescription: [
        {
          medicine: "Ibuprofen",
          dosage: "400mg",
          frequency: "Twice daily",
          days: "7 days",
        },
        {
          medicine: "Muscle relaxant",
          dosage: "5mg",
          frequency: "Once daily",
          days: "5 days",
        },
      ],
      recommendations: [
        "Physical therapy",
        "Proper posture",
        "Regular exercise",
        "Avoid heavy lifting",
      ],
      nextAppointment: "Follow up in 3 weeks",
    },
    {
      _id: "rep005",
      p_name: "John Doe",
      doc_name: "Dr. Vijay Mehta",
      date: "2025-08-05",
      department: "General Medicine",
      disease: "Blood Test",
      status: "completed",
      symptoms: ["Fatigue", "Weakness", "Loss of appetite"],
      vitals: {
        bloodPressure: "115/75 mmHg",
        temperature: "98.2°F",
        heartRate: "68 bpm",
        weight: "68 kg",
      },
      prescription: [
        {
          medicine: "Iron supplement",
          dosage: "325mg",
          frequency: "Once daily",
          days: "60 days",
        },
        {
          medicine: "Vitamin B12",
          dosage: "1000mcg",
          frequency: "Once daily",
          days: "30 days",
        },
      ],
      recommendations: [
        "Iron-rich diet",
        "Regular exercise",
        "Adequate rest",
        "Follow-up blood test",
      ],
      nextAppointment: "Follow up in 6 weeks",
    },
  ];

  const generateReport = (report: any) => {
    return {
      id: report._id,
      patientName: report.p_name,
      doctorName: report.doc_name,
      date: report.date,
      department: report.department,
      reportType: report.disease,
      status: report.status,
      symptoms: report.symptoms,
      vitals: report.vitals,
      prescription: report.prescription,
      recommendations: report.recommendations,
      nextAppointment: report.nextAppointment,
    };
  };

  const downloadReport = (report: any) => {
    const fullReport = generateReport(report);
    const reportContent = `
MEDICAL REPORT
=====================================
Patient Name: ${fullReport.patientName}
Doctor: ${fullReport.doctorName}
Department: ${fullReport.department}
Date: ${fullReport.date}
Report Type: ${fullReport.reportType}

SYMPTOMS:
${fullReport.symptoms.map((symptom: string) => `• ${symptom}`).join("\n")}

VITAL SIGNS:
• Blood Pressure: ${fullReport.vitals.bloodPressure}
• Temperature: ${fullReport.vitals.temperature}
• Heart Rate: ${fullReport.vitals.heartRate}
• Weight: ${fullReport.vitals.weight}

PRESCRIPTION:
${fullReport.prescription
  .map(
    (med: any) =>
      `• ${med.medicine} ${med.dosage} - ${med.frequency} for ${med.days}`
  )
  .join("\n")}

RECOMMENDATIONS:
${fullReport.recommendations.map((rec: string) => `• ${rec}`).join("\n")}

NEXT APPOINTMENT:
${fullReport.nextAppointment}

=====================================
Generated on: ${new Date().toLocaleDateString()}
Swasth-Raho Medical Center
    `;

    const blob = new Blob([reportContent], { type: "text/plain" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `Medical_Report_${fullReport.patientName}_${fullReport.date}.txt`;
    document.body.appendChild(a);
    a.click();
    window.URL.revokeObjectURL(url);
    document.body.removeChild(a);
  };

  const handleFilterChange = (filterType: string, value: string) => {
    setSelectedFilter((prev) => ({
      ...prev,
      [filterType]: value,
    }));
  };

  const applyFilters = () => {
    let filtered = dummyReports;

    if (selectedFilter.doctor !== "all") {
      filtered = filtered.filter(
        (report) => report.doc_name === selectedFilter.doctor
      );
    }

    if (selectedFilter.reportType !== "all") {
      filtered = filtered.filter(
        (report) => report.disease === selectedFilter.reportType
      );
    }

    if (selectedFilter.dateRange !== "all") {
      const today = new Date();
      const reportDate = new Date();

      switch (selectedFilter.dateRange) {
        case "lastWeek":
          reportDate.setDate(today.getDate() - 7);
          filtered = filtered.filter(
            (report) => new Date(report.date) >= reportDate
          );
          break;
        case "lastMonth":
          reportDate.setMonth(today.getMonth() - 1);
          filtered = filtered.filter(
            (report) => new Date(report.date) >= reportDate
          );
          break;
        case "last3Months":
          reportDate.setMonth(today.getMonth() - 3);
          filtered = filtered.filter(
            (report) => new Date(report.date) >= reportDate
          );
          break;
      }
    }

    setFilteredReports(filtered);
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "completed":
        return "bg-green-100 text-green-800 border-green-200";
      case "pending":
        return "bg-yellow-100 text-yellow-800 border-yellow-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  const handleLogout = async () => {
    try {
      await axios.post(
        "http://localhost:5000/api/logout",
        {},
        { withCredentials: true }
      );
      window.location.href = "/login";
    } catch (error) {
      console.error("Error logging out:", error);
    }
  };

  useEffect(() => {
    setReportsData(dummyReports);
    setFilteredReports(dummyReports);
  }, []);

  useEffect(() => {
    applyFilters();
  }, [selectedFilter]);

  const uniqueDoctors = [
    ...new Set(dummyReports.map((report) => report.doc_name)),
  ];
  const uniqueReportTypes = [
    ...new Set(dummyReports.map((report) => report.disease)),
  ];

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Sidebar */}
      <div
        className={`bg-white shadow-lg transition-all duration-300 ${
          isSidebarOpen ? "w-64" : "w-20"
        } md:w-64 flex-shrink-0 fixed h-full z-40`}
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
              {/* <span className="text-2xl">{item.icon}</span> */}
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
          <button
            onClick={handleLogout}
            className="w-full flex items-center px-4 py-3 text-gray-700 hover:bg-red-50 hover:text-red-600 rounded-lg transition-colors"
          >
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
      <div
        className={`flex-1 flex flex-col ${
          isSidebarOpen ? "ml-64" : "ml-20"
        } md:ml-64`}
      >
        {/* Header */}
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
                Medical Reports
              </h2>
            </div>

            <div className="flex items-center space-x-4">
              {/* Notifications */}
              {/* <button className="relative p-2 text-gray-600 hover:bg-gray-100 rounded-full">
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
              </button> */}

              {/* Profile */}
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center">
                  <span className="text-white font-semibold">
                    {user?.name
                      .split(" ")
                      .map((ch: any) => ch[0]?.toUpperCase())
                      .join("")
                      .slice(0, 2)}
                  </span>
                </div>
                <div className="hidden md:block">
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
          {/* Summary Cards */}
          <div className="grid md:grid-cols-4 gap-6 mb-6">
            <div className="bg-blue-50 border border-blue-200 rounded-xl p-6">
              <div className="flex items-center">
                <div className="w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center">
                  <span className="text-white text-xl">📊</span>
                </div>
                <div className="ml-4">
                  <p className="text-sm text-blue-600 font-medium">
                    Total Reports
                  </p>
                  <p className="text-2xl font-bold text-blue-800">
                    {reportsData.length}
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-green-50 border border-green-200 rounded-xl p-6">
              <div className="flex items-center">
                <div className="w-12 h-12 bg-green-600 rounded-full flex items-center justify-center">
                  <span className="text-white text-xl">📅</span>
                </div>
                <div className="ml-4">
                  <p className="text-sm text-green-600 font-medium">
                    Latest Report
                  </p>
                  <p className="text-lg font-bold text-green-800">
                    {reportsData[0]?.date || "N/A"}
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-purple-50 border border-purple-200 rounded-xl p-6">
              <div className="flex items-center">
                <div className="w-12 h-12 bg-purple-600 rounded-full flex items-center justify-center">
                  <span className="text-white text-xl">👨‍⚕️</span>
                </div>
                <div className="ml-4">
                  <p className="text-sm text-purple-600 font-medium">
                    Different Doctors
                  </p>
                  <p className="text-2xl font-bold text-purple-800">
                    {uniqueDoctors.length}
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-orange-50 border border-orange-200 rounded-xl p-6">
              <div className="flex items-center">
                <div className="w-12 h-12 bg-orange-600 rounded-full flex items-center justify-center">
                  <span className="text-white text-xl">🔬</span>
                </div>
                <div className="ml-4">
                  <p className="text-sm text-orange-600 font-medium">
                    Report Types
                  </p>
                  <p className="text-2xl font-bold text-orange-800">
                    {uniqueReportTypes.length}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Filters */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-6">
            <h3 className="text-lg font-bold text-gray-800 mb-4">
              🔍 Filter Reports
            </h3>
            <div className="grid md:grid-cols-3 gap-4">
              {/* Doctor Filter */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Filter by Doctor
                </label>
                <select
                  value={selectedFilter.doctor}
                  onChange={(e) => handleFilterChange("doctor", e.target.value)}
                  className="text-black w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option className="text-gray-500 " value="all">
                    All Doctors
                  </option>
                  {uniqueDoctors.map((doctor) => (
                    <option key={doctor} value={doctor}>
                      {doctor}
                    </option>
                  ))}
                </select>
              </div>

              {/* Report Type Filter */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Filter by Report Type
                </label>
                <select
                  value={selectedFilter.reportType}
                  onChange={(e) =>
                    handleFilterChange("reportType", e.target.value)
                  }
                  className="text-black w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="all">All Report Types</option>
                  {uniqueReportTypes.map((type) => (
                    <option key={type} value={type}>
                      {type}
                    </option>
                  ))}
                </select>
              </div>

              {/* Date Range Filter */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Filter by Date Range
                </label>
                <select
                  value={selectedFilter.dateRange}
                  onChange={(e) =>
                    handleFilterChange("dateRange", e.target.value)
                  }
                  className="text-black w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="all">All Time</option>
                  <option value="lastWeek">Last Week</option>
                  <option value="lastMonth">Last Month</option>
                  <option value="last3Months">Last 3 Months</option>
                </select>
              </div>
            </div>
          </div>

          {/* Reports Table */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-200">
              <h3 className="text-xl font-bold text-gray-800">
                📋 Your Medical Reports
              </h3>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Date
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Doctor
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Department
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Report Type
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredReports.map((report) => (
                    <tr
                      key={report._id}
                      className="hover:bg-gray-50 transition-colors"
                    >
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        📅 {report.date}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {report.doc_name}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        🏥 {report.department}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        🔬 {report.disease}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span
                          className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full border ${getStatusBadge(
                            report.status
                          )}`}
                        >
                          {report.status === "completed" ? "✅" : "⏳"}{" "}
                          {report.status.toUpperCase()}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <button
                          onClick={() => downloadReport(report)}
                          className="px-3 py-1 bg-blue-600 text-white text-sm rounded-lg hover:bg-blue-700 transition-colors"
                        >
                          ⬇️ Download
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>

              {filteredReports.length === 0 && (
                <div className="text-center py-12">
                  <div className="text-6xl mb-4">📄</div>
                  <h3 className="text-xl font-semibold text-gray-800 mb-2">
                    No reports found
                  </h3>
                  <p className="text-gray-600">
                    Try adjusting your filters or check back later
                  </p>
                </div>
              )}
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
