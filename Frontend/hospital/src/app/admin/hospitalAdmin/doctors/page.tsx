"use client";
import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  Search,
  Users,
  Star,
  Wallet,
  Stethoscope,
  Clock,
  MapPin,
  Banknote,
  Phone,
  MoreVertical,
  ChevronDown,
  Loader2,
} from "lucide-react";

export default function ManageDoctors() {
  const [doctors, setDoctors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);

  // Pagination & Filters State
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [search, setSearch] = useState("");
  const [selectedType, setSelectedType] = useState("All");
  const [stats, setStats] = useState({
    totalDoctors: 0,
    experiencedDocs: 0,
    avgFee: 0,
  });

  // CONSTANT LIMIT (Easier to change for testing)
  const LIMIT = 5; // Change to 2 to test pagination button

  // Doctor Types for Filter Tabs
  const doctorTypes = [
    "All",
    "Cardiologist",
    "Dermatologist",
    "Neurologist",
    "Orthopedic",
    "Pediatrician",
    "Eye Specialist",
  ];

  // Fetch Doctors Function
  const fetchDoctors = async (reset = false) => {
    try {
      const currentPage = reset ? 1 : page;

      if (reset) {
        setLoading(true);
      } else {
        setLoadingMore(true);
      }

      const res = await axios.get("/api/hospital/doctors", {
        params: {
          page: currentPage,
          limit: LIMIT, // Use the constant variable
          search: search,
          type: selectedType === "All" ? "" : selectedType,
        },
        withCredentials: true,
      });

      if (res.data.success) {
        if (reset) {
          setDoctors(res.data.doctors);
        } else {
          setDoctors((prev) => [...prev, ...res.data.doctors]);
        }

        setStats(res.data.stats);

        // FIXED LOGIC: Compare against LIMIT, not hardcoded 6
        if (res.data.doctors.length < LIMIT) {
          setHasMore(false);
        } else {
          setHasMore(true);
        }

        if (reset) {
          setPage(2);
        } else {
          setPage((prev) => prev + 1);
        }
      }
    } catch (error) {
      console.error("Error fetching doctors:", error);
    } finally {
      setLoading(false);
      setLoadingMore(false);
    }
  };

  // Effect to handle Search and Filter changes
  useEffect(() => {
    const timer = setTimeout(() => {
      fetchDoctors(true);
    }, 500);
    return () => clearTimeout(timer);
  }, [search, selectedType]);

  return (
    <div className="space-y-8 font-sans">
      {/* 1. Header & Stats Section */}
      <div className="flex flex-col gap-6">
        <h1 className="text-2xl font-bold text-gray-800">Manage Doctors</h1>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500 font-medium">Total Doctors</p>
              <h3 className="text-3xl font-bold text-gray-800 mt-1">
                {stats.totalDoctors}
              </h3>
            </div>
            <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-xl flex items-center justify-center">
              <Users size={24} />
            </div>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500 font-medium">
                Experienced (8+ Years)
              </p>
              <h3 className="text-3xl font-bold text-gray-800 mt-1">
                {stats.experiencedDocs}
              </h3>
            </div>
            <div className="w-12 h-12 bg-purple-50 text-purple-600 rounded-xl flex items-center justify-center">
              <Star size={24} />
            </div>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500 font-medium">
                Avg. Consultation Fee
              </p>
              <h3 className="text-3xl font-bold text-gray-800 mt-1">
                ₹{stats.avgFee}
              </h3>
            </div>
            <div className="w-12 h-12 bg-green-50 text-green-600 rounded-xl flex items-center justify-center">
              <Wallet size={24} />
            </div>
          </div>
        </div>
      </div>

      {/* 2. Filters & Actions Toolbar */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-white p-4 rounded-2xl border border-gray-100 shadow-sm">
        <div className="flex flex-wrap gap-2">
          {doctorTypes.map((type) => (
            <button
              key={type}
              onClick={() => setSelectedType(type)}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                selectedType === type
                  ? "bg-blue-600 text-white shadow-md shadow-blue-200"
                  : "bg-white text-gray-600 border border-gray-200 hover:bg-gray-50"
              }`}
            >
              {type}
            </button>
          ))}
        </div>

        <div className="relative w-full md:w-64">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
          <input
            type="text"
            placeholder="Search by name..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="text-black w-full pl-10 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all"
          />
        </div>
      </div>

      {/* 3. Doctors Grid */}
      {loading ? (
        <div className="flex justify-center py-20">
          <Loader2 className="w-10 h-10 text-blue-600 animate-spin" />
        </div>
      ) : doctors.length === 0 ? (
        <div className="text-center py-20 bg-white rounded-2xl border border-dashed border-gray-300">
          <Stethoscope className="w-12 h-12 text-gray-300 mx-auto mb-3" />
          <p className="text-gray-500">
            No doctors found matching your criteria.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {doctors.map((doctor) => (
            <div
              key={doctor._id}
              className="bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-all duration-300 p-5 flex flex-col h-full group"
            >
              <div className="flex justify-between items-start mb-4">
                <div className="flex gap-3">
                  <div className="w-12 h-12 bg-gray-100 rounded-full overflow-hidden border border-gray-100">
                    <img
                      src={
                        doctor.profileImg ||
                        "https://img.freepik.com/free-vector/doctor-character-background_1270-84.jpg"
                      }
                      alt={doctor.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div>
                    <h3 className="font-bold text-gray-800 text-lg leading-tight group-hover:text-blue-600 transition-colors">
                      {doctor.name}
                    </h3>
                    <p className="text-blue-600 text-sm font-medium">
                      {doctor.type}
                    </p>
                  </div>
                </div>
                <button className="text-gray-400 hover:text-gray-600 p-1 rounded-full hover:bg-gray-50">
                  <MoreVertical size={18} />
                </button>
              </div>

              <div className="space-y-3 mb-6 flex-1">
                <div className="flex items-center gap-3 text-sm text-gray-600">
                  <Stethoscope size={16} className="text-blue-500 shrink-0" />
                  <span className="truncate">{doctor.education}</span>
                </div>
                <div className="flex items-center gap-3 text-sm text-gray-600">
                  <Clock size={16} className="text-purple-500 shrink-0" />
                  <span>{doctor.experience} Experience</span>
                </div>
                <div className="flex items-center gap-3 text-sm text-gray-600">
                  <MapPin size={16} className="text-green-500 shrink-0" />
                  <span className="truncate">{doctor.hospital}</span>
                </div>
                <div className="flex items-center gap-3 text-sm text-gray-600">
                  <Banknote size={16} className="text-orange-500 shrink-0" />
                  <div>
                    <span className="font-bold text-gray-800">
                      ₹{doctor.consultationFee}
                    </span>
                    <span className="text-xs text-gray-400 ml-1">
                      / Consultation
                    </span>
                  </div>
                </div>
              </div>

              <div className="flex gap-3 mt-auto pt-4 border-t border-gray-50">
                <button className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-2.5 rounded-xl text-sm font-medium transition-all shadow-lg shadow-blue-100 hover:shadow-blue-200">
                  View Profile
                </button>
                <button className="w-10 h-10 flex items-center justify-center bg-green-50 text-green-600 rounded-xl hover:bg-green-100 transition-colors border border-green-100">
                  <Phone size={18} />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Load More Button */}
      {hasMore && doctors.length > 0 && !loading && (
        <div className="flex justify-center mt-8 pb-8">
          <button
            onClick={() => fetchDoctors(false)}
            disabled={loadingMore}
            className="flex items-center gap-2 px-6 py-3 bg-white border border-gray-200 text-gray-600 rounded-full shadow-sm hover:bg-gray-50 font-medium transition-all disabled:opacity-70"
          >
            {loadingMore ? (
              <Loader2 className="animate-spin w-4 h-4" />
            ) : (
              <ChevronDown className="w-4 h-4" />
            )}
            Load More Doctors
          </button>
        </div>
      )}
    </div>
  );
}
