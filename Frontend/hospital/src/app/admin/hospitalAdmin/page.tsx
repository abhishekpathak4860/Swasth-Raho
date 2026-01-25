"use client";
import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  Building2,
  Stethoscope,
  Star,
  Activity,
  MapPin,
  Clock,
  ShieldCheck,
  TrendingUp,
  BedDouble,
  CreditCard,
  Phone,
  Mail,
  Edit2,
  CheckCircle,
  XCircle,
  X,
  Save,
  Loader2,
  Pill,
  Car,
  Utensils
} from "lucide-react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
  PieChart,
  Pie,
  Legend,
} from "recharts";

export default function HospitalDashboard() {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  
  // Edit Mode State
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editFormData, setEditFormData] = useState<any>({});
  const [updating, setUpdating] = useState(false);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const res = await axios.get("/api/hospital/get-profile", {
        withCredentials: true,
      });
      setData(res.data);
      // Initialize edit form with current data
      setEditFormData(res.data.admin);
    } catch (error) {
      console.error("Error fetching hospital admin data:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    // Handle checkbox/boolean separately if needed, though most here are text/number
    setEditFormData((prev: any) => ({
        ...prev,
        [name]: type === 'number' ? Number(value) : value
    }));
  };

  // Helper for array inputs (comma separated)
  const handleArrayChange = (e: React.ChangeEvent<HTMLInputElement>, field: string) => {
    setEditFormData((prev: any) => ({
        ...prev,
        [field]: e.target.value.split(',').map(item => item.trim())
    }));
  };

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    setUpdating(true);
    try {
        // You need to create this PATCH endpoint in your backend
        await axios.patch("/api/hospital/update-profile", editFormData, { withCredentials: true });
        setIsEditModalOpen(false);
        fetchData(); // Refresh data
        alert("Hospital details updated successfully!");
    } catch (error) {
        console.error("Update failed", error);
        alert("Failed to update profile.");
    } finally {
        setUpdating(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-600"></div>
      </div>
    );
  }

  if (!data) return <div className="text-center p-10">No data available.</div>;

  const { admin, yourDoctors } = data;

  // --- CHART DATA ---
  const bedData = [
    { name: "General", value: admin.non_ac_rooms || 0, color: "#94a3b8" },
    { name: "Private (AC)", value: admin.ac_rooms || 0, color: "#3b82f6" },
    { name: "ICU Beds", value: admin.icu_beds || 0, color: "#ef4444" },
  ];

  const revenueData = [
    { name: "Jan", revenue: 4000 },
    { name: "Feb", revenue: 3000 },
    { name: "Mar", revenue: 2000 },
    { name: "Apr", revenue: 2780 },
    { name: "May", revenue: 1890 },
    { name: "Jun", revenue: 2390 },
    { name: "Jul", revenue: 3490 },
  ];

  return (
    <div className="space-y-6 relative">
      
      {/* 1. Welcome Banner */}
      <div className="bg-gradient-to-r from-emerald-600 to-teal-600 rounded-2xl p-6 text-white shadow-lg relative overflow-hidden">
        <div className="relative z-10">
            <div className="flex justify-between items-start">
                <div>
                    <h1 className="text-3xl font-bold mb-2">{admin.hospital_name}</h1>
                    <p className="opacity-90 max-w-2xl text-sm md:text-base leading-relaxed">
                    {admin.hospital_description}
                    </p>
                </div>
                <button 
                    onClick={() => setIsEditModalOpen(true)}
                    className="bg-white/20 hover:bg-white/30 text-white px-4 py-2 rounded-lg text-sm font-medium backdrop-blur-sm transition-all flex items-center gap-2"
                >
                    <Edit2 size={16} /> Edit Details
                </button>
            </div>
            
            <div className="flex flex-wrap gap-4 mt-6 text-sm font-medium">
            <span className="flex items-center gap-1 bg-white/20 px-3 py-1 rounded-full backdrop-blur-sm">
                <MapPin size={14} /> {admin.hospital_address}
            </span>
            <span className="flex items-center gap-1 bg-white/20 px-3 py-1 rounded-full backdrop-blur-sm">
                <ShieldCheck size={14} /> License: {admin.license_number}
            </span>
            <span className="flex items-center gap-1 bg-white/20 px-3 py-1 rounded-full backdrop-blur-sm">
                <Clock size={14} /> {admin.hospital_duration}
            </span>
            </div>
        </div>
        {/* Background Pattern */}
        <div className="absolute top-0 right-0 -mt-10 -mr-10 w-64 h-64 bg-white/10 rounded-full blur-3xl"></div>
      </div>

      {/* 2. Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Revenue */}
        <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm flex flex-col justify-between hover:shadow-md transition-shadow">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-slate-500 text-sm font-medium mb-1">Total Revenue</p>
              <h3 className="text-2xl font-bold text-slate-800">₹{admin.Total_Revenue_Hospital?.toLocaleString()}</h3>
            </div>
            <div className="p-2 bg-green-50 text-green-600 rounded-lg"><CreditCard size={20} /></div>
          </div>
          <div className="mt-4 flex items-center text-xs text-green-600 font-medium">
            <TrendingUp size={14} className="mr-1" /> +0% growth
          </div>
        </div>

        {/* Doctors */}
        <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm flex flex-col justify-between hover:shadow-md transition-shadow">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-slate-500 text-sm font-medium mb-1">Total Doctors</p>
              <h3 className="text-2xl font-bold text-slate-800">{yourDoctors?.length || 0}</h3>
            </div>
            <div className="p-2 bg-blue-50 text-blue-600 rounded-lg"><Stethoscope size={20} /></div>
          </div>
          <p className="mt-4 text-xs text-slate-400">Across {admin.departments?.length || 1} departments</p>
        </div>

        {/* Capacity */}
        <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm flex flex-col justify-between hover:shadow-md transition-shadow">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-slate-500 text-sm font-medium mb-1">Total Capacity</p>
              <h3 className="text-2xl font-bold text-slate-800">{admin.total_rooms} <span className="text-sm font-normal text-slate-400">Beds</span></h3>
            </div>
            <div className="p-2 bg-purple-50 text-purple-600 rounded-lg"><BedDouble size={20} /></div>
          </div>
          <div className="mt-4 w-full bg-gray-100 h-1.5 rounded-full overflow-hidden">
            <div className="bg-purple-500 h-full w-[70%]"></div>
          </div>
        </div>

        {/* Rating */}
        <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm flex flex-col justify-between hover:shadow-md transition-shadow">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-slate-500 text-sm font-medium mb-1">Patient Rating</p>
              <h3 className="text-2xl font-bold text-slate-800">{admin.rating} <span className="text-sm text-slate-400">/ 5.0</span></h3>
            </div>
            <div className="p-2 bg-yellow-50 text-yellow-600 rounded-lg"><Star size={20} /></div>
          </div>
          <p className="mt-4 text-xs text-slate-400">Based on {admin.total_reviews} reviews</p>
        </div>
      </div>

      {/* 3. Detailed Info Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left Column: Charts & Facilities */}
        <div className="lg:col-span-2 space-y-6">
            
            {/* Revenue Chart */}
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                <h3 className="text-lg font-bold text-slate-800 mb-6">Financial Overview</h3>
                <div className="h-[250px] w-full">
                    <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={revenueData}>
                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                        <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: "#64748b", fontSize: 12 }} />
                        <YAxis axisLine={false} tickLine={false} tick={{ fill: "#64748b", fontSize: 12 }} />
                        <Tooltip cursor={{ fill: "#f8fafc" }} contentStyle={{ borderRadius: "8px", border: "none", boxShadow: "0 4px 6px -1px rgb(0 0 0 / 0.1)" }} />
                        <Bar dataKey="revenue" fill="#10b981" radius={[4, 4, 0, 0]} barSize={40} />
                    </BarChart>
                    </ResponsiveContainer>
                </div>
            </div>

            {/* Facilities & Amenities */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Lab Facilities */}
                <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                    <h4 className="font-semibold text-slate-800 mb-4 flex items-center gap-2"><Activity size={18} className="text-blue-500"/> Lab Facilities</h4>
                    <div className="flex flex-wrap gap-2">
                        {admin.lab_facilities?.length > 0 ? admin.lab_facilities.map((lab: string, i: number) => (
                            <span key={i} className="px-3 py-1 bg-blue-50 text-blue-700 text-xs rounded-full font-medium border border-blue-100">{lab}</span>
                        )) : <span className="text-sm text-gray-400">None listed</span>}
                    </div>
                </div>

                {/* Facilities Booleans */}
                <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                    <h4 className="font-semibold text-slate-800 mb-4">Amenities</h4>
                    <div className="space-y-3">
                        <div className="flex justify-between items-center text-sm">
                            <span className="flex items-center gap-2 text-gray-600"><Car size={16}/> Parking</span>
                            {admin.parking_available ? <CheckCircle size={16} className="text-green-500"/> : <XCircle size={16} className="text-red-400"/>}
                        </div>
                        <div className="flex justify-between items-center text-sm">
                            <span className="flex items-center gap-2 text-gray-600"><Utensils size={16}/> Canteen</span>
                            {admin.canteen_available ? <CheckCircle size={16} className="text-green-500"/> : <XCircle size={16} className="text-red-400"/>}
                        </div>
                        <div className="flex justify-between items-center text-sm">
                            <span className="flex items-center gap-2 text-gray-600"><ShieldCheck size={16}/> Emergency</span>
                            {admin.emergency_available ? <CheckCircle size={16} className="text-green-500"/> : <XCircle size={16} className="text-red-400"/>}
                        </div>
                    </div>
                </div>
            </div>

            {/* Payment & Insurance */}
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                <h4 className="font-semibold text-slate-800 mb-4">Payment & Insurance</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                        <p className="text-xs text-gray-400 uppercase font-medium mb-2">Accepted Payments</p>
                        <div className="flex flex-wrap gap-2">
                            {admin.payment_modes?.length > 0 ? admin.payment_modes.map((mode: string, i: number) => (
                                <span key={i} className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded border">{mode}</span>
                            )) : <span className="text-sm text-gray-400">-</span>}
                        </div>
                    </div>
                    <div>
                        <p className="text-xs text-gray-400 uppercase font-medium mb-2">Insurance Partners</p>
                        <div className="flex flex-wrap gap-2">
                            {admin.insurance_partners?.length > 0 ? admin.insurance_partners.map((ins: string, i: number) => (
                                <span key={i} className="px-2 py-1 bg-green-50 text-green-700 text-xs rounded border border-green-100">{ins}</span>
                            )) : <span className="text-sm text-gray-400">-</span>}
                        </div>
                    </div>
                </div>
            </div>

        </div>

        {/* Right Column: Contact & Bed Chart */}
        <div className="space-y-6">
            
            {/* Contact Info Card */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
                <h3 className="text-lg font-bold text-slate-800 mb-4">Contact Information</h3>
                <div className="space-y-4">
                    <div className="flex items-start gap-3">
                        <div className="w-8 h-8 rounded-full bg-blue-50 flex items-center justify-center flex-shrink-0"><Phone size={16} className="text-blue-600"/></div>
                        <div>
                            <p className="text-xs text-gray-400 font-medium">Reception</p>
                            <p className="text-sm font-medium text-slate-800">{admin.contact_number}</p>
                        </div>
                    </div>
                    <div className="flex items-start gap-3">
                        <div className="w-8 h-8 rounded-full bg-red-50 flex items-center justify-center flex-shrink-0"><Activity size={16} className="text-red-600"/></div>
                        <div>
                            <p className="text-xs text-gray-400 font-medium">Emergency</p>
                            <p className="text-sm font-medium text-slate-800">{admin.emergency_number}</p>
                        </div>
                    </div>
                    <div className="flex items-start gap-3">
                        <div className="w-8 h-8 rounded-full bg-purple-50 flex items-center justify-center flex-shrink-0"><Mail size={16} className="text-purple-600"/></div>
                        <div>
                            <p className="text-xs text-gray-400 font-medium">Email</p>
                            <p className="text-sm font-medium text-slate-800">{admin.email}</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Bed Chart */}
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                <h3 className="text-lg font-bold text-slate-800 mb-2">Bed Occupancy</h3>
                <div className="h-[250px] w-full relative">
                    <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                        <Pie data={bedData} cx="50%" cy="50%" innerRadius={60} outerRadius={80} paddingAngle={5} dataKey="value">
                        {bedData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                        </Pie>
                        <Tooltip />
                        <Legend verticalAlign="bottom" height={36} />
                    </PieChart>
                    </ResponsiveContainer>
                    <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-center -mt-4">
                        <p className="text-3xl font-bold text-slate-800">{admin.total_rooms}</p>
                        <p className="text-xs text-slate-400 uppercase tracking-wide">Total</p>
                    </div>
                </div>
            </div>

            {/* Pharmacies */}
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                <h4 className="font-semibold text-slate-800 mb-4 flex items-center gap-2"><Pill size={18} className="text-pink-500"/> Pharmacy</h4>
                <div className="flex flex-wrap gap-2">
                    {admin.connected_pharmacies?.length > 0 ? admin.connected_pharmacies.map((ph: string, i: number) => (
                        <span key={i} className="px-3 py-1 bg-pink-50 text-pink-700 text-xs rounded-full font-medium border border-pink-100">{ph}</span>
                    )) : <span className="text-sm text-gray-400">None</span>}
                </div>
            </div>

        </div>
      </div>

      {/* --- EDIT MODAL --- */}
      {isEditModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden flex flex-col">
                {/* Modal Header */}
                <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center bg-gray-50">
                    <h2 className="text-xl font-bold text-slate-800">Edit Hospital Details</h2>
                    <button onClick={() => setIsEditModalOpen(false)} className="text-gray-500 hover:text-gray-700 hover:bg-gray-200 p-2 rounded-full transition-all">
                        <X size={20} />
                    </button>
                </div>

                {/* Modal Body (Scrollable Form) */}
                <div className="p-6 overflow-y-auto">
                    <form onSubmit={handleUpdate} className="space-y-6">
                        
                        {/* Section 1: Basic Info */}
                        <div>
                            <h3 className="text-sm uppercase tracking-wide text-gray-500 font-semibold mb-3 border-b pb-1">Basic Information</h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 mb-1">Hospital Name</label>
                                    <input type="text" name="hospital_name" value={editFormData.hospital_name || ""} onChange={handleInputChange} className="w-full px-4 py-2 text-black border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 outline-none" />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 mb-1">Type</label>
                                    <input type="text" name="hospital_type" value={editFormData.hospital_type || ""} onChange={handleInputChange} className="w-full px-4 py-2 text-black border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 outline-none" />
                                </div>
                                <div className="md:col-span-2">
                                    <label className="block text-sm font-medium text-slate-700 mb-1">Description</label>
                                    <textarea name="hospital_description" value={editFormData.hospital_description || ""} onChange={handleInputChange} rows={2} className="w-full px-4 py-2 text-black border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 outline-none"></textarea>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 mb-1">Address</label>
                                    <input type="text" name="hospital_address" value={editFormData.hospital_address || ""} onChange={handleInputChange} className="w-full px-4 py-2 text-black border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 outline-none" />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 mb-1">Working Hours</label>
                                    <input type="text" name="hospital_duration" value={editFormData.hospital_duration || ""} onChange={handleInputChange} className="w-full px-4 py-2 text-black border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 outline-none" />
                                </div>
                            </div>
                        </div>

                        {/* Section 2: Contact Numbers */}
                        <div>
                            <h3 className="text-sm uppercase tracking-wide text-gray-500 font-semibold mb-3 border-b pb-1">Contact Details</h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 mb-1">Reception Number</label>
                                    <input type="text" name="contact_number" value={editFormData.contact_number || ""} onChange={handleInputChange} className="w-full px-4 py-2 text-black border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 outline-none" />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 mb-1">Emergency Number</label>
                                    <input type="text" name="emergency_number" value={editFormData.emergency_number || ""} onChange={handleInputChange} className="w-full px-4 py-2 text-black border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 outline-none" />
                                </div>
                            </div>
                        </div>

                        {/* Section 3: Capacity */}
                        <div>
                            <h3 className="text-sm uppercase tracking-wide text-gray-500 font-semibold mb-3 border-b pb-1">Capacity</h3>
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 mb-1">Total Rooms</label>
                                    <input type="number" name="total_rooms" value={editFormData.total_rooms || 0} onChange={handleInputChange} className="w-full px-4 py-2 text-black border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 outline-none" />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 mb-1">AC Rooms</label>
                                    <input type="number" name="ac_rooms" value={editFormData.ac_rooms || 0} onChange={handleInputChange} className="w-full px-4 py-2 text-black border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 outline-none" />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 mb-1">Non-AC Rooms</label>
                                    <input type="number" name="non_ac_rooms" value={editFormData.non_ac_rooms || 0} onChange={handleInputChange} className="w-full px-4 py-2 text-black border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 outline-none" />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 mb-1">ICU Beds</label>
                                    <input type="number" name="icu_beds" value={editFormData.icu_beds || 0} onChange={handleInputChange} className="w-full px-4 py-2 text-black border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 outline-none" />
                                </div>
                            </div>
                        </div>

                        {/* Section 4: Facilities (Arrays as Comma Separated Strings) */}
                        <div>
                            <h3 className="text-sm uppercase tracking-wide text-gray-500 font-semibold mb-3 border-b pb-1">Facilities (Comma Separated)</h3>
                            <div className="space-y-3">
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 mb-1">Lab Facilities</label>
                                    <input type="text" value={editFormData.lab_facilities?.join(', ') || ""} onChange={(e) => handleArrayChange(e, 'lab_facilities')} className="w-full px-4 py-2 text-black border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 outline-none" />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 mb-1">Connected Pharmacies</label>
                                    <input type="text" value={editFormData.connected_pharmacies?.join(', ') || ""} onChange={(e) => handleArrayChange(e, 'connected_pharmacies')} className="w-full px-4 py-2 text-black border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 outline-none" />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 mb-1">Payment Modes</label>
                                    <input type="text" value={editFormData.payment_modes?.join(', ') || ""} onChange={(e) => handleArrayChange(e, 'payment_modes')} className="w-full px-4 py-2 text-black border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 outline-none" />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 mb-1">Insurance Partners</label>
                                    <input type="text" value={editFormData.insurance_partners?.join(', ') || ""} onChange={(e) => handleArrayChange(e, 'insurance_partners')} className="w-full px-4 py-2 text-black border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 outline-none" />
                                </div>
                            </div>
                        </div>

                    </form>
                </div>

                {/* Modal Footer */}
                <div className="px-6 py-4 border-t border-gray-100 bg-gray-50 flex justify-end gap-3">
                    <button 
                        onClick={() => setIsEditModalOpen(false)}
                        className="px-6 py-2 rounded-lg border border-gray-300 text-gray-600 font-medium hover:bg-gray-100 transition-colors"
                    >
                        Cancel
                    </button>
                    <button 
                        onClick={handleUpdate}
                        disabled={updating}
                        className="px-6 py-2 rounded-lg bg-emerald-600 text-white font-medium hover:bg-emerald-700 transition-colors shadow-lg shadow-emerald-200 flex items-center gap-2"
                    >
                        {updating ? <Loader2 className="animate-spin w-4 h-4"/> : <Save className="w-4 h-4" />}
                        Save Changes
                    </button>
                </div>
            </div>
        </div>
      )}

    </div>
  );
}