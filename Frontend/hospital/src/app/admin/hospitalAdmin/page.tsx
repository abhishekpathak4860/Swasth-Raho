"use client";

import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  Bed,
  Building2,
  Phone,
  Mail,
  Stethoscope,
  Activity,
  Star,
  Clock,
  MapPin,
} from "lucide-react";
import { useAuth } from "../../../../context/AuthContext";

export default function HospitalAdminDashboard() {
  const { user, loading, fetchUser } = useAuth();
  const [data, setData] = useState<any>(null);

  useEffect(() => {
    fetchUser();
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await axios.get("/api/hospital/get-profile", {
          withCredentials: true,
        });
        setData(res.data);
      } catch (error) {
        console.error("Error fetching hospital admin data:", error);
      }
    };
    fetchData();
  }, []);

  if (!data) {
    return (
      <div className="flex items-center justify-center h-screen text-xl font-semibold text-slate-700">
        Loading hospital dashboard...
      </div>
    );
  }

  const { admin, yourDoctors } = data;

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-emerald-100 to-emerald-200 py-8 px-6">
      <div className="max-w-7xl mx-auto bg-white rounded-3xl shadow-2xl border border-gray-100">
        {/* Top nav / header area */}
        <div className="p-6 border-b">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <h1 className="text-3xl font-extrabold text-slate-900">
                {admin.hospital_name}
              </h1>
              <p className="text-sm text-gray-600 mt-2 max-w-3xl">
                {admin.hospital_description}
              </p>

              <div className="mt-4 flex flex-wrap gap-3 text-sm text-gray-600">
                <span className="flex items-center gap-2 bg-gray-50 border border-gray-100 rounded-md px-3 py-1">
                  <MapPin size={14} /> {admin.hospital_address}
                </span>
                <span className="flex items-center gap-2 bg-gray-50 border border-gray-100 rounded-md px-3 py-1">
                  <Clock size={14} /> {admin.hospital_duration}
                </span>
                <span className="flex items-center gap-2 bg-gray-50 border border-gray-100 rounded-md px-3 py-1">
                  <strong>Type:</strong> {admin.hospital_type}
                </span>
                <span className="flex items-center gap-2 bg-gray-50 border border-gray-100 rounded-md px-3 py-1">
                  <strong>License:</strong> {admin.license_number || "-"}
                </span>
              </div>
            </div>

            <div className="flex items-center gap-4">
              <div className="text-right">
                <p className="text-sm text-gray-500">Rating</p>
                <div className="flex items-center gap-3">
                  <div className="bg-yellow-400 text-white rounded-md p-2">
                    <Star size={16} />
                  </div>
                  <div className="text-right">
                    <p className="text-xl font-bold text-slate-900">
                      {admin.rating ?? "-"}
                    </p>
                    <p className="text-xs text-gray-500">
                      {admin.total_reviews ?? 0} reviews
                    </p>
                  </div>
                </div>
              </div>

              <div className="flex flex-col items-end">
                <button className="px-4 py-2 bg-indigo-600 text-white rounded-md shadow">
                  Edit Hospital
                </button>
                <button className="mt-2 px-4 py-2 border border-gray-200 rounded-md text-sm">
                  Manage Departments
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Content area */}
        <div className="p-6">
          {/* Stats row */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
            <div className="bg-white p-5 rounded-2xl shadow border flex items-center gap-4">
              <div className="bg-blue-50 p-3 rounded-lg">
                <Building2 size={22} className="text-blue-600" />
              </div>
              <div>
                <p className="text-sm text-gray-500">Total Rooms</p>
                <p className="text-2xl font-bold text-slate-900">
                  {admin.total_rooms ?? 0}
                </p>
              </div>
            </div>

            <div className="bg-white p-5 rounded-2xl shadow border flex items-center gap-4">
              <div className="bg-green-50 p-3 rounded-lg">
                <Bed size={22} className="text-green-600" />
              </div>
              <div>
                <p className="text-sm text-gray-500">ICU Beds</p>
                <p className="text-2xl font-bold text-slate-900">
                  {admin.icu_beds ?? 0}
                </p>
              </div>
            </div>

            <div className="bg-white p-5 rounded-2xl shadow border flex items-center gap-4">
              <div className="bg-orange-50 p-3 rounded-lg">
                <Activity size={22} className="text-orange-500" />
              </div>
              <div>
                <p className="text-sm text-gray-500">Ambulances</p>
                <p className="text-2xl font-bold text-slate-900">
                  {admin.ambulances ?? 0}
                </p>
              </div>
            </div>

            <div className="bg-white p-5 rounded-2xl shadow border flex items-center gap-4">
              <div className="bg-purple-50 p-3 rounded-lg">
                <Stethoscope size={22} className="text-purple-600" />
              </div>
              <div>
                <p className="text-sm text-gray-500">Doctors</p>
                <p className="text-2xl font-bold text-slate-900">
                  {yourDoctors?.length ?? 0}
                </p>
              </div>
            </div>
          </div>

          {/* Main grid: large left panel + right column */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Left: analytics-like area (placeholder) */}
            <div className="lg:col-span-2 space-y-6">
              <div className="bg-white rounded-2xl shadow p-6 border">
                <h3 className="text-lg font-semibold mb-4">Overview</h3>
                {/* Example summary row */}
                <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
                  <div className="flex-1">
                    <p className="text-sm text-gray-500">
                      This area can show charts, admissions, sessions, or other
                      analytics using your data.
                    </p>
                    <div className="mt-4 h-56 bg-gradient-to-br from-indigo-50 to-indigo-100 rounded-lg border border-dashed border-indigo-100 flex items-center justify-center text-indigo-700">
                      Chart placeholder
                    </div>
                  </div>

                  <div className="w-full md:w-64 space-y-4">
                    <div className="bg-white p-4 rounded-lg border shadow-sm">
                      <p className="text-sm text-gray-500">
                        All Sessions (example)
                      </p>
                      <p className="text-xl font-bold text-slate-900 mt-2">
                        {admin.total_rooms ?? 0}
                      </p>
                    </div>
                    <div className="bg-white p-4 rounded-lg border shadow-sm">
                      <p className="text-sm text-gray-500">
                        Bounce Rate (example)
                      </p>
                      <p className="text-xl font-bold text-slate-900 mt-2">
                        {admin.rating ?? "-"}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-2xl shadow p-6 border">
                <h3 className="text-lg font-semibold mb-4">Hospital Details</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-gray-500">Hospital Name</p>
                    <p className="font-medium text-slate-900">
                      {admin.hospital_name}
                    </p>

                    <p className="text-sm text-gray-500 mt-3">
                      Organisation Type
                    </p>
                    <p className="font-medium">{admin.organisation_type}</p>

                    <p className="text-sm text-gray-500 mt-3">Accreditation</p>
                    <p className="font-medium">{admin.accreditation || "-"}</p>
                  </div>

                  <div>
                    <p className="text-sm text-gray-500">Contact</p>
                    <p className="font-medium">{admin.contact_number}</p>

                    <p className="text-sm text-gray-500 mt-3">Emergency</p>
                    <p className="font-medium">{admin.emergency_number}</p>

                    <p className="text-sm text-gray-500 mt-3">Established</p>
                    <p className="font-medium">{admin.year_established}</p>
                  </div>
                </div>

                <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-gray-500">License Number</p>
                    <p className="font-medium text-slate-900">
                      {admin.license_number || "-"}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Total Revenue</p>
                    <p className="font-medium text-slate-900">
                      ₹{admin.Total_Revenue_Hospital ?? 0}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Right column */}
            <div className="space-y-6">
              <div className="bg-white rounded-2xl shadow p-6 border">
                <h3 className="text-lg font-semibold mb-4">Contact & Info</h3>
                <div className="space-y-3 text-sm text-gray-600">
                  <div className="flex items-center gap-3">
                    <Phone size={18} />{" "}
                    <span className="font-medium">{admin.contact_number}</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <Mail size={18} />{" "}
                    <span className="font-medium">{user?.email || "-"}</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <MapPin size={18} />{" "}
                    <span className="font-medium">
                      {admin.hospital_address}
                    </span>
                  </div>

                  <div className="mt-3 text-sm text-gray-500">
                    <p>
                      Created:{" "}
                      {admin.createdAt
                        ? new Date(admin.createdAt).toLocaleDateString()
                        : "-"}
                    </p>
                    <p>
                      Updated:{" "}
                      {admin.updatedAt
                        ? new Date(admin.updatedAt).toLocaleDateString()
                        : "-"}
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-2xl shadow p-6 border">
                <h3 className="text-lg font-semibold mb-4">
                  Our Doctors ({yourDoctors?.length ?? 0})
                </h3>
                <div className="space-y-3">
                  {yourDoctors?.slice(0, 5).map((d: any, i: number) => (
                    <div
                      key={i}
                      className="flex items-center justify-between border border-gray-100 rounded-lg p-3 bg-white"
                    >
                      <div>
                        <p className="font-medium">{d.name}</p>
                        <p className="text-sm text-gray-500">{d.type}</p>
                      </div>
                      <div className="text-sm text-gray-500">{d.email}</div>
                    </div>
                  ))}
                </div>

                {yourDoctors?.length > 5 && (
                  <button className="mt-4 w-full px-3 py-2 bg-indigo-50 rounded text-indigo-700 border">
                    View All Doctors
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
