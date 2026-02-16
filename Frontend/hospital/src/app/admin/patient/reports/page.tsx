"use client";
import React, { useState, useEffect } from "react";
import axios from "axios";
import { BarChart3, CalendarDays, UserCheck, Microscope } from "lucide-react";
import { useAuth } from "../../../../../context/AuthContext";

export default function Reports() {
  const { user } = useAuth();

  const [reportsData, setReportsData] = useState<any[]>([]);
  const [filteredReports, setFilteredReports] = useState<any[]>([]);
  const [selectedFilter, setSelectedFilter] = useState({
    doctor: "all",
    reportType: "all",
    dateRange: "all",
    doctorName: "",
  });

  const getReports = async () => {
    try {
      const res = await axios.get(`/patient/get-reports`, {
        withCredentials: true,
      });
      setReportsData(res.data.reports);
      setFilteredReports(res.data.reports);
    } catch (error) {
      console.error("Error fetching reports:", error);
    }
  };

  useEffect(() => {
    getReports();
  }, []);

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
${fullReport.symptoms?.map((symptom: string) => `• ${symptom}`).join("\n") || "None"}

VITAL SIGNS:
• Blood Pressure: ${fullReport.vitals?.bloodPressure || "N/A"}
• Temperature: ${fullReport.vitals?.temperature || "N/A"}
• Heart Rate: ${fullReport.vitals?.heartRate || "N/A"}
• Weight: ${fullReport.vitals?.weight || "N/A"}

PRESCRIPTION:
${
  fullReport.prescription
    ?.map(
      (med: any) =>
        `• ${med.medicine} ${med.dosage} - ${med.frequency} for ${med.days}`,
    )
    .join("\n") || "None"
}

RECOMMENDATIONS:
${fullReport.recommendations?.map((rec: string) => `• ${rec}`).join("\n") || "None"}

NEXT APPOINTMENT:
${fullReport.nextAppointment || "Not scheduled"}

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
    let filtered = reportsData;

    if (selectedFilter.doctor !== "all") {
      filtered = filtered.filter(
        (report) => report.doc_name === selectedFilter.doctor,
      );
    }

    if (selectedFilter.reportType !== "all") {
      filtered = filtered.filter(
        (report) => report.disease === selectedFilter.reportType,
      );
    }

    // Filter by doctor name (case-insensitive search)
    if (selectedFilter.doctorName.trim() !== "") {
      filtered = filtered.filter((report) =>
        report.doc_name
          .toLowerCase()
          .includes(selectedFilter.doctorName.toLowerCase()),
      );
    }

    if (selectedFilter.dateRange !== "all") {
      const today = new Date();
      const reportDate = new Date();

      switch (selectedFilter.dateRange) {
        case "lastWeek":
          reportDate.setDate(today.getDate() - 7);
          filtered = filtered.filter(
            (report) => new Date(report.date) >= reportDate,
          );
          break;
        case "lastMonth":
          reportDate.setMonth(today.getMonth() - 1);
          filtered = filtered.filter(
            (report) => new Date(report.date) >= reportDate,
          );
          break;
        case "last3Months":
          reportDate.setMonth(today.getMonth() - 3);
          filtered = filtered.filter(
            (report) => new Date(report.date) >= reportDate,
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

  useEffect(() => {
    applyFilters();
  }, [selectedFilter, reportsData]); // Added reportsData dependency

  const uniqueDoctors = [
    ...new Set(reportsData.map((report) => report.doc_name)),
  ];
  const uniqueReportTypes = [
    ...new Set(reportsData.map((report) => report.disease)),
  ];

  return (
    <div className="space-y-6 font-sans text-black">
      {/* 1. Summary Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {/* Total Reports */}
        <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 md:p-6 transition-transform hover:scale-105">
          <div className="flex items-center">
            <div className="w-10 h-10 md:w-12 md:h-12 bg-blue-600 rounded-full flex items-center justify-center shadow-lg shadow-blue-200">
              <BarChart3 className="text-white w-5 h-5 md:w-6 md:h-6" />
            </div>
            <div className="ml-3 md:ml-4">
              <p className="text-xs md:text-sm text-blue-600 font-medium uppercase tracking-wide">
                Total Reports
              </p>
              <p className="text-lg md:text-2xl font-bold text-blue-800">
                {reportsData.length}
              </p>
            </div>
          </div>
        </div>

        {/* Latest Report */}
        <div className="bg-green-50 border border-green-200 rounded-xl p-4 md:p-6 transition-transform hover:scale-105">
          <div className="flex items-center">
            <div className="w-10 h-10 md:w-12 md:h-12 bg-green-600 rounded-full flex items-center justify-center shadow-lg shadow-green-200">
              <CalendarDays className="text-white w-5 h-5 md:w-6 md:h-6" />
            </div>
            <div className="ml-3 md:ml-4">
              <p className="text-xs md:text-sm text-green-600 font-medium uppercase tracking-wide">
                Latest Report
              </p>
              <p className="text-sm md:text-lg font-bold text-green-800 truncate">
                {reportsData[0]?.date || "N/A"}
              </p>
            </div>
          </div>
        </div>

        {/* Doctors */}
        <div className="bg-purple-50 border border-purple-200 rounded-xl p-4 md:p-6 transition-transform hover:scale-105">
          <div className="flex items-center">
            <div className="w-10 h-10 md:w-12 md:h-12 bg-purple-600 rounded-full flex items-center justify-center shadow-lg shadow-purple-200">
              <UserCheck className="text-white w-5 h-5 md:w-6 md:h-6" />
            </div>
            <div className="ml-3 md:ml-4">
              <p className="text-xs md:text-sm text-purple-600 font-medium uppercase tracking-wide">
                Doctors
              </p>
              <p className="text-lg md:text-2xl font-bold text-purple-800">
                {uniqueDoctors.length}
              </p>
            </div>
          </div>
        </div>

        {/* Report Types */}
        <div className="bg-orange-50 border border-orange-200 rounded-xl p-4 md:p-6 transition-transform hover:scale-105">
          <div className="flex items-center">
            <div className="w-10 h-10 md:w-12 md:h-12 bg-orange-600 rounded-full flex items-center justify-center shadow-lg shadow-orange-200">
              <Microscope className="text-white w-5 h-5 md:w-6 md:h-6" />
            </div>
            <div className="ml-3 md:ml-4">
              <p className="text-xs md:text-sm text-orange-600 font-medium uppercase tracking-wide">
                Types
              </p>
              <p className="text-lg md:text-2xl font-bold text-orange-800">
                {uniqueReportTypes.length}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* 2. Filters */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 md:p-6 mb-6">
        <h3 className="text-lg font-bold text-gray-800 mb-4">Filter Reports</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Doctor Filter */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Filter by Doctor
            </label>
            <select
              value={selectedFilter.doctor}
              onChange={(e) => handleFilterChange("doctor", e.target.value)}
              className="text-black w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
            >
              <option className="text-gray-500" value="all">
                All Doctors
              </option>
              {uniqueDoctors.map((doctor: any) => (
                <option key={doctor} value={doctor}>
                  {doctor}
                </option>
              ))}
            </select>
          </div>

          {/* Doctor Name Search */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Search by Doctor Name
            </label>
            <input
              type="text"
              value={selectedFilter.doctorName}
              onChange={(e) => handleFilterChange("doctorName", e.target.value)}
              placeholder="Type doctor name..."
              className="text-black w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 placeholder-gray-400"
            />
          </div>

          {/* Report Type Filter */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Filter by Report Type
            </label>
            <select
              value={selectedFilter.reportType}
              onChange={(e) => handleFilterChange("reportType", e.target.value)}
              className="text-black w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
            >
              <option value="all">All Report Types</option>
              {uniqueReportTypes.map((type: any) => (
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
              onChange={(e) => handleFilterChange("dateRange", e.target.value)}
              className="text-black w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
            >
              <option value="all">All Time</option>
              <option value="lastWeek">Last Week</option>
              <option value="lastMonth">Last Month</option>
              <option value="last3Months">Last 3 Months</option>
            </select>
          </div>
        </div>
      </div>

      {/* 3. Reports Table */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="px-4 md:px-6 py-4 border-b border-gray-200">
          <h3 className="text-lg md:text-xl font-bold text-gray-800">
            📋 Your Medical Reports
          </h3>
        </div>

        {/* Desktop Table */}
        <div className="hidden md:block overflow-x-auto">
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
                    {report.date}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {report.doc_name}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {report.department}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {report.disease}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span
                      className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full border ${getStatusBadge(
                        report.status,
                      )}`}
                    >
                      {report.status === "completed" ? "" : "⏳"}{" "}
                      {report.status.toUpperCase()}
                    </span>
                  </td>
                  {report.status === "completed" && (
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <button
                        onClick={() => downloadReport(report)}
                        className="cursor-pointer px-3 py-1 bg-green-600 text-white text-sm rounded-lg hover:bg-green-700 transition-colors shadow-sm"
                      >
                        Download
                      </button>
                    </td>
                  )}
                  {report.status === "pending" && (
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <button className="cursor-not-allowed px-3 py-1 bg-gray-300 text-gray-500 text-sm rounded-lg">
                        Pending...
                      </button>
                    </td>
                  )}
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Mobile Cards View */}
        <div className="md:hidden divide-y divide-gray-200">
          {filteredReports.map((report) => (
            <div key={report._id} className="p-4 hover:bg-gray-50">
              <div className="flex justify-between items-start mb-2">
                <div>
                  <h4 className="font-medium text-gray-900">
                    {report.doc_name}
                  </h4>
                  <p className="text-sm text-gray-500">{report.date}</p>
                </div>
                <span
                  className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full border ${getStatusBadge(
                    report.status,
                  )}`}
                >
                  {report.status === "completed" ? "" : "⏳"}{" "}
                  {report.status.toUpperCase()}
                </span>
              </div>
              <div className="space-y-1 mb-3">
                <p className="text-sm text-gray-600">
                  <span className="font-medium">Department:</span>{" "}
                  {report.department}
                </p>
                <p className="text-sm text-gray-600">
                  <span className="font-medium">Report Type:</span>{" "}
                  {report.disease}
                </p>
              </div>
              {report.status === "completed" ? (
                <button
                  onClick={() => downloadReport(report)}
                  className="w-full cursor-pointer px-3 py-2 bg-blue-600 text-white text-sm rounded-lg hover:bg-blue-700 transition-colors shadow-sm"
                >
                  Download Report
                </button>
              ) : (
                <button
                  disabled
                  className="w-full cursor-not-allowed px-3 py-2 bg-gray-200 text-gray-500 text-sm rounded-lg"
                >
                  Processing...
                </button>
              )}
            </div>
          ))}
        </div>

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
  );
}
