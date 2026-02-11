// "use client";
// import React, { useEffect, useState } from "react";
// import axios from "axios";
// import {
//   Search,
//   Users,
//   User,
//   Baby,
//   Activity,
//   MapPin,
//   Phone,
//   Mail,
//   MoreVertical,
//   ChevronDown,
//   Loader2,
//   Calendar,
//   Filter,
// } from "lucide-react";

// export default function ManagePatients() {
//   const [patients, setPatients] = useState<any[]>([]);
//   const [loading, setLoading] = useState(true);
//   const [loadingMore, setLoadingMore] = useState(false);

//   // Pagination & Filter State
//   const [page, setPage] = useState(1);
//   const [hasMore, setHasMore] = useState(true);
//   const [search, setSearch] = useState("");

//   // Doctor Filter State
//   const [doctorsList, setDoctorsList] = useState<any[]>([]);
//   const [selectedDoctor, setSelectedDoctor] = useState("All");

//   // Stats State
//   const [stats, setStats] = useState({
//     totalPatients: 0,
//     pediatricPatients: 0,
//     seniorPatients: 0,
//   });

//   const LIMIT = 5;

//   // 1. Fetch Doctors List for Dropdown on Mount
//   useEffect(() => {
//     const fetchDoctorsList = async () => {
//       try {
//         // Fetching a larger limit to get all doctors for the dropdown
//         // Ideally this should be a lightweight "get all names" endpoint
//         const res = await axios.get("/api/hospital/doctors", {
//           params: { limit: 100 },
//           withCredentials: true,
//         });
//         if (res.data.success) {
//           setDoctorsList(res.data.doctors);
//         }
//       } catch (error) {
//         console.error("Error fetching doctors list:", error);
//       }
//     };
//     fetchDoctorsList();
//   }, []);

//   // 2. Fetch Patients Function
//   const fetchPatients = async (reset = false) => {
//     try {
//       const currentPage = reset ? 1 : page;

//       if (reset) {
//         setLoading(true);
//       } else {
//         setLoadingMore(true);
//       }

//       const res = await axios.get("/api/hospital/patients", {
//         params: {
//           page: currentPage,
//           limit: LIMIT,
//           search: search,
//           doctorId: selectedDoctor === "All" ? "" : selectedDoctor, // Pass selected doctor ID
//         },
//         withCredentials: true,
//       });

//       if (res.data.success) {
//         if (reset) {
//           setPatients(res.data.patients);
//         } else {
//           setPatients((prev) => [...prev, ...res.data.patients]);
//         }

//         setStats(res.data.stats);

//         if (res.data.patients.length < LIMIT) {
//           setHasMore(false);
//         } else {
//           setHasMore(true);
//         }

//         if (reset) {
//           setPage(2);
//         } else {
//           setPage((prev) => prev + 1);
//         }
//       }
//     } catch (error) {
//       console.error("Error fetching patients:", error);
//     } finally {
//       setLoading(false);
//       setLoadingMore(false);
//     }
//   };

//   // 3. Effects for Debounce Search & Filter Change
//   useEffect(() => {
//     const timer = setTimeout(() => {
//       fetchPatients(true);
//     }, 500);
//     return () => clearTimeout(timer);
//   }, [search, selectedDoctor]); // Re-fetch when search or selectedDoctor changes

//   return (
//     <div className="space-y-8 font-sans">
//       {/* Header & Stats Section */}
//       <div className="flex flex-col gap-6">
//         <h1 className="text-2xl font-bold text-gray-800">Manage Patients</h1>

//         {/* Stats Grid */}
//         <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
//           {/* Total Patients */}
//           <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm flex items-center justify-between">
//             <div>
//               <p className="text-sm text-gray-500 font-medium">
//                 Total Patients
//               </p>
//               <h3 className="text-3xl font-bold text-gray-800 mt-1">
//                 {stats.totalPatients}
//               </h3>
//             </div>
//             <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-xl flex items-center justify-center">
//               <Users size={24} />
//             </div>
//           </div>

//           {/* Pediatric */}
//           <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm flex items-center justify-between">
//             <div>
//               <p className="text-sm text-gray-500 font-medium">
//                 Pediatric (Child)
//               </p>
//               <h3 className="text-3xl font-bold text-gray-800 mt-1">
//                 {stats.pediatricPatients}
//               </h3>
//             </div>
//             <div className="w-12 h-12 bg-green-50 text-green-600 rounded-xl flex items-center justify-center">
//               <Baby size={24} />
//             </div>
//           </div>

//           {/* Senior */}
//           <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm flex items-center justify-between">
//             <div>
//               <p className="text-sm text-gray-500 font-medium">
//                 Senior Citizens
//               </p>
//               <h3 className="text-3xl font-bold text-gray-800 mt-1">
//                 {stats.seniorPatients}
//               </h3>
//             </div>
//             <div className="w-12 h-12 bg-orange-50 text-orange-600 rounded-xl flex items-center justify-center">
//               <User size={24} />
//             </div>
//           </div>
//         </div>
//       </div>

//       {/* Filter & Search Toolbar */}
//       <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-white p-4 rounded-2xl border border-gray-100 shadow-sm">
//         <h2 className="text-lg font-semibold text-gray-800 pl-2">
//           Patient Directory
//         </h2>

//         <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
//           {/* Doctor Filter Dropdown */}
//           <div className="relative">
//             <select
//               value={selectedDoctor}
//               onChange={(e) => setSelectedDoctor(e.target.value)}
//               className="appearance-none w-full sm:w-48 pl-4 pr-10 py-2 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-700 cursor-pointer"
//             >
//               <option value="All">All Doctors</option>
//               {doctorsList.map((doc) => (
//                 <option key={doc._id} value={doc._id}>
//                   {doc.name}
//                 </option>
//               ))}
//             </select>
//             <Filter className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4 pointer-events-none" />
//           </div>

//           {/* Search Input */}
//           <div className="relative w-full sm:w-64">
//             <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
//             <input
//               type="text"
//               placeholder="Search by name..."
//               value={search}
//               onChange={(e) => setSearch(e.target.value)}
//               className="w-full pl-10 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all text-black"
//             />
//           </div>
//         </div>
//       </div>

//       {/* Patients Grid */}
//       {loading ? (
//         <div className="flex justify-center py-20">
//           <Loader2 className="w-10 h-10 text-blue-600 animate-spin" />
//         </div>
//       ) : patients.length === 0 ? (
//         <div className="text-center py-20 bg-white rounded-2xl border border-dashed border-gray-300">
//           <Users className="w-12 h-12 text-gray-300 mx-auto mb-3" />
//           <p className="text-gray-500">
//             No patients found matching your search.
//           </p>
//         </div>
//       ) : (
//         <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
//           {patients.map((patient) => (
//             <div
//               key={patient._id}
//               className="bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-all duration-300 overflow-hidden flex flex-col h-full group"
//             >
//               {/* Card Header */}
//               <div className="p-6 pb-4 flex items-start justify-between">
//                 <div className="flex items-center gap-4">
//                   <div className="w-14 h-14 rounded-full bg-gray-100 overflow-hidden border-2 border-white shadow-sm shrink-0">
//                     <img
//                       src={
//                         patient.profileImg || "https://via.placeholder.com/150"
//                       }
//                       alt={patient.name}
//                       className="w-full h-full object-cover"
//                     />
//                   </div>
//                   <div>
//                     <h3 className="font-bold text-gray-800 text-lg leading-tight group-hover:text-blue-600 transition-colors">
//                       {patient.name}
//                     </h3>
//                     <p className="text-gray-500 text-sm mt-0.5">
//                       {patient.age} Years Old
//                     </p>
//                   </div>
//                 </div>
//                 <button className="text-gray-400 hover:text-gray-600 p-1 rounded-full hover:bg-gray-50">
//                   <MoreVertical size={18} />
//                 </button>
//               </div>

//               {/* Body Content */}
//               <div className="px-6 py-2 space-y-3 flex-1">
//                 <div className="flex items-center gap-3 text-sm text-gray-600">
//                   <Mail size={16} className="text-blue-500 shrink-0" />
//                   <span className="truncate">{patient.email}</span>
//                 </div>
//                 <div className="flex items-center gap-3 text-sm text-gray-600">
//                   <Phone size={16} className="text-green-500 shrink-0" />
//                   <span>{patient.contact}</span>
//                 </div>
//                 <div className="flex items-center gap-3 text-sm text-gray-600">
//                   <MapPin size={16} className="text-red-500 shrink-0" />
//                   <span className="truncate">{patient.location}</span>
//                 </div>

//                 <div className="flex items-center gap-3 text-sm text-gray-600 mt-2 pt-2 border-t border-dashed border-gray-100">
//                   <Activity size={16} className="text-purple-500 shrink-0" />
//                   <span>
//                     Status:{" "}
//                     <span className="font-medium text-green-600">Active</span>
//                   </span>
//                 </div>
//               </div>

//               {/* Footer Actions */}
//               <div className="p-4 border-t border-gray-50 bg-gray-50/30 mt-4 flex gap-3">
//                 <button className="flex-1 py-2 bg-white border border-gray-200 hover:bg-gray-50 text-gray-700 rounded-lg text-sm font-medium transition-all shadow-sm">
//                   History
//                 </button>
//                 <button className="flex-1 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm font-medium transition-all shadow-sm">
//                   Details
//                 </button>
//               </div>
//             </div>
//           ))}
//         </div>
//       )}

//       {/* Load More Button */}
//       {hasMore && patients.length > 0 && !loading && (
//         <div className="flex justify-center mt-8 pb-8">
//           <button
//             onClick={() => fetchPatients(false)}
//             disabled={loadingMore}
//             className="flex items-center gap-2 px-6 py-3 bg-white border border-gray-200 text-gray-600 rounded-full shadow-sm hover:bg-gray-50 font-medium transition-all disabled:opacity-70"
//           >
//             {loadingMore ? (
//               <Loader2 className="animate-spin w-4 h-4" />
//             ) : (
//               <ChevronDown className="w-4 h-4" />
//             )}
//             Load More Patients
//           </button>
//         </div>
//       )}
//     </div>
//   );
// }

"use client";
import React, { useEffect, useState, useRef } from "react";
import axios from "axios";
import {
  Search,
  Users,
  User,
  Baby,
  Activity,
  MapPin,
  Phone,
  Mail,
  MoreVertical,
  ChevronDown,
  Loader2,
  Filter,
  Check,
} from "lucide-react";

export default function ManagePatients() {
  const [patients, setPatients] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);

  // Pagination & Patient Search State
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [search, setSearch] = useState("");

  // --- DOCTOR FILTER STATE ---
  const [doctorsList, setDoctorsList] = useState<any[]>([]);
  const [selectedDoctor, setSelectedDoctor] = useState("All");
  const [selectedDoctorName, setSelectedDoctorName] = useState("All Doctors");

  // Custom Dropdown State
  const [isDoctorDropdownOpen, setIsDoctorDropdownOpen] = useState(false);
  const [doctorSearchQuery, setDoctorSearchQuery] = useState("");
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Stats State
  const [stats, setStats] = useState({
    totalPatients: 0,
    pediatricPatients: 0,
    seniorPatients: 0,
  });

  const LIMIT = 5;

  // 1. Fetch Doctors for Dropdown (with Search)
  useEffect(() => {
    const fetchDoctorsList = async () => {
      try {
        const res = await axios.get("/api/hospital/doctors", {
          params: {
            limit: 100,
            search: doctorSearchQuery, // Pass search query to backend
          },
          withCredentials: true,
        });
        if (res.data.success) {
          setDoctorsList(res.data.doctors);
        }
      } catch (error) {
        console.error("Error fetching doctors list:", error);
      }
    };

    // Debounce the doctor search API call
    const timer = setTimeout(() => {
      fetchDoctorsList();
    }, 300);

    return () => clearTimeout(timer);
  }, [doctorSearchQuery]);

  // 2. Click Outside Listener to close Dropdown
  useEffect(() => {
    function handleClickOutside(event: any) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDoctorDropdownOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // 3. Fetch Patients Function
  const fetchPatients = async (reset = false) => {
    try {
      const currentPage = reset ? 1 : page;

      if (reset) {
        setLoading(true);
      } else {
        setLoadingMore(true);
      }

      const res = await axios.get("/api/hospital/patients", {
        params: {
          page: currentPage,
          limit: LIMIT,
          search: search,
          doctorId: selectedDoctor === "All" ? "" : selectedDoctor,
        },
        withCredentials: true,
      });

      if (res.data.success) {
        if (reset) {
          setPatients(res.data.patients);
        } else {
          setPatients((prev) => [...prev, ...res.data.patients]);
        }

        setStats(res.data.stats);

        if (res.data.patients.length < LIMIT) {
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
      console.error("Error fetching patients:", error);
    } finally {
      setLoading(false);
      setLoadingMore(false);
    }
  };

  // 4. Trigger Patient Fetch when filters change
  useEffect(() => {
    const timer = setTimeout(() => {
      fetchPatients(true);
    }, 500);
    return () => clearTimeout(timer);
  }, [search, selectedDoctor]);

  return (
    <div className="space-y-8 font-sans">
      {/* Header & Stats Section */}
      <div className="flex flex-col gap-6">
        <h1 className="text-2xl font-bold text-gray-800">Manage Patients</h1>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500 font-medium">
                Total Patients
              </p>
              <h3 className="text-3xl font-bold text-gray-800 mt-1">
                {stats.totalPatients}
              </h3>
            </div>
            <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-xl flex items-center justify-center">
              <Users size={24} />
            </div>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500 font-medium">
                Pediatric (Child)
              </p>
              <h3 className="text-3xl font-bold text-gray-800 mt-1">
                {stats.pediatricPatients}
              </h3>
            </div>
            <div className="w-12 h-12 bg-green-50 text-green-600 rounded-xl flex items-center justify-center">
              <Baby size={24} />
            </div>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500 font-medium">
                Senior Citizens
              </p>
              <h3 className="text-3xl font-bold text-gray-800 mt-1">
                {stats.seniorPatients}
              </h3>
            </div>
            <div className="w-12 h-12 bg-orange-50 text-orange-600 rounded-xl flex items-center justify-center">
              <User size={24} />
            </div>
          </div>
        </div>
      </div>

      {/* Filter & Search Toolbar */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-white p-4 rounded-2xl border border-gray-100 shadow-sm z-20 relative">
        <h2 className="text-lg font-semibold text-gray-800 pl-2">
          Patient Directory
        </h2>

        <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
          {/* --- CUSTOM SEARCHABLE DROPDOWN --- */}
          <div className="relative w-full sm:w-64" ref={dropdownRef}>
            {/* Dropdown Trigger Button */}
            <button
              onClick={() => setIsDoctorDropdownOpen(!isDoctorDropdownOpen)}
              className="w-full flex items-center justify-between px-4 py-2 bg-gray-50 border border-gray-200 rounded-xl text-sm text-gray-700 hover:bg-gray-100 transition-colors focus:ring-2 focus:ring-blue-500"
            >
              <span className="truncate">{selectedDoctorName}</span>
              <Filter className="w-4 h-4 text-gray-400 ml-2" />
            </button>

            {/* Dropdown Body */}
            {isDoctorDropdownOpen && (
              <div className="absolute top-full mt-2 left-0 w-full bg-white border border-gray-200 rounded-xl shadow-xl z-50 overflow-hidden animate-in fade-in zoom-in duration-200 origin-top">
                {/* Internal Search Bar */}
                <div className="p-2 border-b border-gray-100 bg-gray-50">
                  <div className="relative">
                    <Search className="absolute left-2 top-1/2 -translate-y-1/2 text-gray-400 w-3.5 h-3.5" />
                    <input
                      autoFocus
                      type="text"
                      placeholder="Search doctor..."
                      value={doctorSearchQuery}
                      onChange={(e) => setDoctorSearchQuery(e.target.value)}
                      className="w-full pl-8 pr-3 py-1.5 text-xs bg-white border border-gray-200 rounded-lg focus:outline-none focus:border-blue-500 text-black"
                    />
                  </div>
                </div>

                {/* Options List */}
                <div className="max-h-60 overflow-y-auto p-1">
                  <button
                    onClick={() => {
                      setSelectedDoctor("All");
                      setSelectedDoctorName("All Doctors");
                      setIsDoctorDropdownOpen(false);
                    }}
                    className={`w-full text-left px-3 py-2 text-sm rounded-lg flex items-center justify-between ${selectedDoctor === "All" ? "bg-blue-50 text-blue-700" : "text-gray-700 hover:bg-gray-50"}`}
                  >
                    All Doctors
                    {selectedDoctor === "All" && <Check className="w-4 h-4" />}
                  </button>

                  {doctorsList.map((doc) => (
                    <button
                      key={doc._id}
                      onClick={() => {
                        setSelectedDoctor(doc._id);
                        setSelectedDoctorName(doc.name);
                        setIsDoctorDropdownOpen(false);
                      }}
                      className={`w-full text-left px-3 py-2 text-sm rounded-lg flex items-center justify-between ${selectedDoctor === doc._id ? "bg-blue-50 text-blue-700" : "text-gray-700 hover:bg-gray-50"}`}
                    >
                      <span className="truncate">{doc.name}</span>
                      {selectedDoctor === doc._id && (
                        <Check className="w-4 h-4" />
                      )}
                    </button>
                  ))}

                  {doctorsList.length === 0 && (
                    <div className="px-3 py-2 text-xs text-gray-400 text-center">
                      No doctors found
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Main Patient Search Input */}
          <div className="relative w-full sm:w-64">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
            <input
              type="text"
              placeholder="Search patients..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all text-black"
            />
          </div>
        </div>
      </div>

      {/* Patients Grid */}
      {loading ? (
        <div className="flex justify-center py-20">
          <Loader2 className="w-10 h-10 text-blue-600 animate-spin" />
        </div>
      ) : patients.length === 0 ? (
        <div className="text-center py-20 bg-white rounded-2xl border border-dashed border-gray-300">
          <Users className="w-12 h-12 text-gray-300 mx-auto mb-3" />
          <p className="text-gray-500">
            No patients found matching your criteria.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {patients.map((patient) => (
            <div
              key={patient._id}
              className="bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-all duration-300 overflow-hidden flex flex-col h-full group"
            >
              {/* Card Header */}
              <div className="p-6 pb-4 flex items-start justify-between">
                <div className="flex items-center gap-4">
                  <div className="w-14 h-14 rounded-full bg-gray-100 overflow-hidden border-2 border-white shadow-sm shrink-0">
                    <img
                      src={
                        patient.profileImg || "https://via.placeholder.com/150"
                      }
                      alt={patient.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div>
                    <h3 className="font-bold text-gray-800 text-lg leading-tight group-hover:text-blue-600 transition-colors">
                      {patient.name}
                    </h3>
                    <p className="text-gray-500 text-sm mt-0.5">
                      {patient.age} Years Old
                    </p>
                  </div>
                </div>
                <button className="text-gray-400 hover:text-gray-600 p-1 rounded-full hover:bg-gray-50">
                  <MoreVertical size={18} />
                </button>
              </div>

              {/* Body Content */}
              <div className="px-6 py-2 space-y-3 flex-1">
                <div className="flex items-center gap-3 text-sm text-gray-600">
                  <Mail size={16} className="text-blue-500 shrink-0" />
                  <span className="truncate">{patient.email}</span>
                </div>
                <div className="flex items-center gap-3 text-sm text-gray-600">
                  <Phone size={16} className="text-green-500 shrink-0" />
                  <span>{patient.contact}</span>
                </div>
                <div className="flex items-center gap-3 text-sm text-gray-600">
                  <MapPin size={16} className="text-red-500 shrink-0" />
                  <span className="truncate">{patient.location}</span>
                </div>

                <div className="flex items-center gap-3 text-sm text-gray-600 mt-2 pt-2 border-t border-dashed border-gray-100">
                  <Activity size={16} className="text-purple-500 shrink-0" />
                  <span>
                    Status:{" "}
                    <span className="font-medium text-green-600">Active</span>
                  </span>
                </div>
              </div>

              {/* Footer Actions */}
              <div className="p-4 border-t border-gray-50 bg-gray-50/30 mt-4 flex gap-3">
                <button className="flex-1 py-2 bg-white border border-gray-200 hover:bg-gray-50 text-gray-700 rounded-lg text-sm font-medium transition-all shadow-sm">
                  History
                </button>
                <button className="flex-1 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm font-medium transition-all shadow-sm">
                  Details
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Load More Button */}
      {hasMore && patients.length > 0 && !loading && (
        <div className="flex justify-center mt-8 pb-8">
          <button
            onClick={() => fetchPatients(false)}
            disabled={loadingMore}
            className="flex items-center gap-2 px-6 py-3 bg-white border border-gray-200 text-gray-600 rounded-full shadow-sm hover:bg-gray-50 font-medium transition-all disabled:opacity-70"
          >
            {loadingMore ? (
              <Loader2 className="animate-spin w-4 h-4" />
            ) : (
              <ChevronDown className="w-4 h-4" />
            )}
            Load More Patients
          </button>
        </div>
      )}
    </div>
  );
}
