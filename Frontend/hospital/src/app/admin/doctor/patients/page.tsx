"use client";
import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  User,
  Search,
  MessageSquare,
  Phone,
  Mail,
  MapPin,
  Calendar,
} from "lucide-react";
import { useAuth } from "../../../../../context/AuthContext";
import Link from "next/link";

export default function Patients() {
  const { user } = useAuth();
  const [query, setQuery] = useState("");
  const [patients, setPatients] = useState<any[]>([]);

  const fetchPatients = async () => {
    try {
      const res = await axios.get("/doctor/fetchPatients", {
        withCredentials: true,
      });
      setPatients(res.data.patients);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchPatients();
  }, []);

  const filtered = patients.filter((p) =>
    p.name.toLowerCase().includes(query.trim().toLowerCase()),
  );

  return (
    <div className="space-y-6 font-sans text-black">
      {/* Search Bar */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
        <div className="flex flex-col md:flex-row justify-between items-center gap-4">
          <h3 className="text-xl font-bold text-gray-800 flex items-center gap-2">
            <User className="text-blue-600" />
            My Patients
          </h3>
          <div className="relative w-full md:w-96">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search by patient name..."
              className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm text-black"
            />
          </div>
        </div>
      </div>

      {/* Patients Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {filtered.map((p: any, idx: number) => (
          <div
            key={idx}
            className="bg-white rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition-all p-5 group"
          >
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-blue-100 overflow-hidden border border-blue-200">
                  <img
                    src={user?.profileImg || "https://via.placeholder.com/150"}
                    alt="Profile"
                    className="w-full h-full object-cover"
                  />
                </div>
                <div>
                  <h4 className="font-bold text-gray-800 text-lg group-hover:text-blue-600 transition-colors">
                    {p.name}
                  </h4>
                  <p className="text-xs text-gray-500 capitalize">{p.role}</p>
                </div>
              </div>
            </div>

            <div className="space-y-3 mb-6">
              <div className="flex items-center gap-3 text-sm text-gray-600">
                <Calendar className="w-4 h-4 text-blue-500" />
                <span>{p.age} years old</span>
              </div>
              <div className="flex items-center gap-3 text-sm text-gray-600">
                <MapPin className="w-4 h-4 text-green-500" />
                <span className="truncate">{p.location}</span>
              </div>
              <div className="flex items-center gap-3 text-sm text-gray-600">
                <Phone className="w-4 h-4 text-purple-500" />
                <span>{p.contact}</span>
              </div>
              <div className="flex items-center gap-3 text-sm text-gray-600">
                <Mail className="w-4 h-4 text-orange-500" />
                <span className="truncate">{p.email}</span>
              </div>
            </div>

            <div className="pt-4 border-t border-gray-100 flex gap-3">
              <button className="flex-1  flex items-center justify-center gap-2 px-4 py-2 border border-gray-200 text-gray-700 rounded-lg hover:bg-gray-50 transition text-sm font-medium">
                <MessageSquare className="w-4 h-4" />
                <Link href="/admin/doctor/messages">Message</Link>
              </button>
              {/* Add View Profile button later if needed */}
            </div>
          </div>
        ))}
      </div>

      {filtered.length === 0 && (
        <div className="text-center py-20 bg-white rounded-xl border border-dashed border-gray-300">
          <User className="w-16 h-16 text-gray-300 mx-auto mb-3" />
          <h3 className="text-xl font-semibold text-gray-800 mb-2">
            No patients found
          </h3>
          <p className="text-gray-500">Try adjusting your search query</p>
        </div>
      )}
    </div>
  );
}
