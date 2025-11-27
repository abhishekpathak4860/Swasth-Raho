"use client";
import React, { useEffect, useState } from "react";
import Link from "next/link";
import axios from "axios";
import Footer from "../../../../components/Footer";
import {
  GraduationCap,
  Briefcase,
  User,
  CalendarDays,
  Stethoscope,
  FileText,
  Hospital,
  Receipt,
  MessageCircle,
  IndianRupee,
} from "lucide-react";
import { useAuth } from "../../../../../context/AuthContext";

export interface DoctorType {
  _id: string;
  name: string;
  email: string;
  type: string;
  education: string;
  experience: string;
  hospital: string;
  consultationFee: string;
  age: number;
  contact: string;
}
export default function Doctors() {
  const { user, loading } = useAuth();
  const [activeTab, setActiveTab] = useState("doctors");
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [showBookingForm, setShowBookingForm] = useState(false);
  const [selectedFilter, setSelectedFilter] = useState("all");
  const [selectedDoctor, setSelectedDoctor] = useState("");
  const [doctorsData, setDoctorsData] = useState<DoctorType[]>([]);
  // const [user, setUser] = useState<any>(null);
  const [formData, setFormData] = useState({
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
      icon: User,
      route: "/admin/patient",
    },
    {
      id: "appointments",
      label: "Appointments",
      icon: CalendarDays,
      route: "/admin/patient/appointments",
    },
    {
      id: "doctors",
      label: "Doctors",
      icon: Stethoscope,
      route: "/admin/patient/doctors",
    },
    {
      id: "reports",
      label: "Medical Reports",
      icon: FileText,
      route: "/admin/patient/reports",
    },
    {
      id: "hospitals",
      label: "Hospitals",
      icon: Hospital,
      route: "/admin/patient/hospitals",
    },
    {
      id: "bills",
      label: "Bills",
      icon: Receipt,
      route: "/admin/patient/bills",
    },
    {
      id: "chat",
      label: "AI Assistant",
      icon: MessageCircle,
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

  const specializations = [
    { id: "all", name: "All Doctors", icon: "🏥" },
    { id: "Cardiologist", name: "Heart", icon: "❤️" },
    { id: "Dermatologist", name: "Skin", icon: "🔬" },
    { id: "Neurologist", name: "Brain", icon: "🧠" },
    { id: "Orthopedic", name: "Bones", icon: "🦴" },
    { id: "Pediatrician", name: "Children", icon: "👶" },
    { id: "Ophthalmologist", name: "Eyes", icon: "👁️" },
  ];

  const filteredDoctors =
    selectedFilter === "all"
      ? doctorsData
      : doctorsData.filter((doctor) => doctor.type === selectedFilter);

  const handleInputChange = (e: { target: { name: any; value: any } }) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleBookAppointment = (doctor: DoctorType) => {
    setSelectedDoctor(doctor.name);
    setFormData({
      ...formData,
      doctor: doctor.name,
      doc_id: doctor._id,
    });
    setShowBookingForm(true);
  };

  const handleSubmit = async (e: { preventDefault: () => void }) => {
    try {
      e.preventDefault();
      const res = await axios.post(`/patient/appointment`, formData, {
        withCredentials: true,
      });
      setShowBookingForm(false);
      setFormData({
        doc_id: "",
        name: "",
        email: "",
        disease: "",
        doctor: "",
        date: "",
        time: "",
      });
      alert(`${res.data.message}`);
    } catch (error) {
      console.log(error);
    }
  };

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
  return (
    <div
      className={`min-h-screen bg-gray-50 ${
        showBookingForm ? "overflow-hidden" : ""
      }`}
    >
      {/* Mobile overlay sidebar */}
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
              <item.icon className="h-5 w-5" />
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
        {/* Desktop Sidebar */}
        <aside
          className={`hidden md:flex flex-col w-64 bg-white shadow-lg transition-all duration-300 flex-shrink-0 min-h-screen overflow-y-auto ${
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
                <item.icon className="h-5 w-5" />
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
        <div className="flex-1 flex flex-col">
          {/* Header */}
          <header className="bg-white shadow-sm border-b border-gray-200 px-4 md:px-6 py-3 sticky top-0 z-30">
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
                <h2 className="text-lg md:text-2xl font-bold text-gray-800 ml-2">
                  Our Doctors
                </h2>
              </div>

              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center overflow-hidden">
                  <img
                    src={user?.profileImg ? user.profileImg : null}
                    alt=""
                    className="w-full h-full rounded-full object-cover"
                  />
                </div>
                <div className="hidden md:block text-right">
                  <p className="text-sm font-medium text-gray-800">
                    {user?.name}
                  </p>
                  <p className="text-xs text-gray-500">{user?.email}</p>
                </div>
              </div>
            </div>
          </header>

          {/* Main Content Area */}
          <main className="flex-1 p-4 md:p-6 overflow-y-auto">
            {/* Special AI Doctor Card */}
            <div className="md:bg-gradient-to-r from-purple-600 to-pink-600 rounded-2xl mb-6">
              {/* Desktop View */}
              <div className="hidden md:block p-6 text-white">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center text-3xl">
                      🤖
                    </div>
                    <div>
                      <h3 className="text-2xl font-bold">Dr. Meera Sharma</h3>
                      <p className="text-purple-100">AI Medical Assistant</p>
                      <p className="text-sm text-purple-200 mt-1">
                        Available 24/7 • Instant Consultation
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={() =>
                      window.open(
                        "https://abhishekpathak4860-medibot.hf.space/",
                        "_blank"
                      )
                    }
                    className="px-6 py-3 bg-white text-purple-600 rounded-xl font-semibold hover:bg-purple-50 transition-all shadow-lg"
                  >
                    Consult AI Doctor
                  </button>
                </div>
              </div>

              {/* Mobile View */}
              <div className="md:hidden">
                <button
                  onClick={() =>
                    window.open(
                      "https://abhishekpathak4860-medibot.hf.space/",
                      "_blank"
                    )
                  }
                  className="w-full bg-gradient-to-r from-purple-600 to-pink-600 p-3 text-white rounded-xl flex items-center justify-between shadow-lg hover:opacity-95 transition-all"
                >
                  <div className="flex items-center space-x-3">
                    <span className="text-2xl">🤖</span>
                    <div className="text-left">
                      <p className="font-semibold">Consult Dr. Meera</p>
                      <p className="text-xs text-purple-100">
                        AI Medical Assistant • 24/7
                      </p>
                    </div>
                  </div>
                  <span className="text-white">→</span>
                </button>
              </div>
            </div>{" "}
            {/* Filter Buttons */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 md:p-6 mb-4 md:mb-6">
              <h3 className="text-lg font-bold text-gray-800 mb-3 md:mb-4">
                Filter by Specialization
              </h3>
              <div className="flex flex-nowrap overflow-x-auto md:flex-wrap gap-2 md:gap-3 pb-2 md:pb-0 scrollbar-hide">
                {specializations.map((spec) => (
                  <button
                    key={spec.id}
                    onClick={() => setSelectedFilter(spec.id)}
                    className={`flex-none px-3 md:px-4 py-2 rounded-xl font-medium transition-all whitespace-nowrap ${
                      selectedFilter === spec.id
                        ? "bg-blue-600 text-white shadow-lg"
                        : "bg-gray-100 text-gray-700 hover:bg-blue-50 hover:text-blue-600"
                    }`}
                  >
                    {spec.name}
                  </button>
                ))}
              </div>
            </div>
            {/* Doctors Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
              {filteredDoctors.map((doctor) => (
                <div
                  key={doctor._id}
                  className="bg-white rounded-xl shadow-lg border border-gray-200 p-4 md:p-6 hover:shadow-xl transition-all duration-300 transform hover:scale-105"
                >
                  {/* Doctor Header */}
                  <div className="flex items-center space-x-4 mb-4">
                    {/* <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-green-500 rounded-full flex items-center justify-center text-3xl">
                    {doctor.image}
                  </div> */}
                    <div>
                      <h4 className="text-xl font-bold text-gray-800">
                        {doctor.name}
                      </h4>
                      <p className="text-blue-600 font-medium">{doctor.type}</p>
                      <div className="flex items-center space-x-1 mt-1">
                        {/* <span className="text-yellow-500">⭐</span>
                      <span className="text-sm text-gray-600">
                        {doctor.rating}/5
                      </span> */}
                      </div>
                    </div>
                  </div>

                  {/* Doctor Details */}
                  <div className="space-y-2 mb-4">
                    <div className="flex items-center space-x-2 text-sm text-gray-600">
                      <GraduationCap className="w-4 h-4 text-blue-600" />
                      <span>{doctor.education}</span>
                    </div>

                    <div className="flex items-center space-x-2 text-sm text-gray-600">
                      <Briefcase className="w-4 h-4 text-purple-600" />
                      <span>{doctor.experience} experience</span>
                    </div>

                    <div className="flex items-center space-x-2 text-sm text-gray-600">
                      <Hospital className="w-4 h-4 text-green-600" />
                      <span>{doctor.hospital}</span>
                    </div>

                    {/* Availability example if you enable it later
  <div className="flex items-center space-x-2 text-sm text-gray-600">
    <Clock className="w-4 h-4 text-orange-600" />
    <span>{doctor.availability}</span>
  </div> 
  */}

                    <div className="flex items-center space-x-2 text-sm text-gray-600">
                      <IndianRupee className="w-4 h-4 text-yellow-600" />
                      <span>Consultation: ₹{doctor.consultationFee}</span>
                    </div>
                  </div>
                  {/* Action Buttons */}
                  <div className="flex space-x-2">
                    <button
                      onClick={() => handleBookAppointment(doctor)}
                      className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition font-medium"
                    >
                      Book Appointment
                    </button>
                    <button className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition">
                      📞
                    </button>
                  </div>
                </div>
              ))}
            </div>
            {/* No doctors found */}
            {filteredDoctors.length === 0 && (
              <div className="text-center py-12">
                <div className="text-6xl mb-4">🔍</div>
                <h3 className="text-xl font-semibold text-gray-800 mb-2">
                  No doctors found
                </h3>
                <p className="text-gray-600">
                  Try selecting a different specialization
                </p>
              </div>
            )}
          </main>
        </div>

        {/* Booking Form Modal - Same as appointments page */}
        {showBookingForm && (
          <>
            {/* Overlay with backdrop blur */}
            <div
              className="fixed inset-0 bg-gray-900/40 backdrop-blur-sm z-50"
              onClick={() => setShowBookingForm(false)}
            ></div>

            {/* Modal Content */}
            <div className="fixed inset-0 flex items-center justify-center z-50 p-4 pointer-events-none">
              <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md pointer-events-auto border border-gray-200 overflow-hidden">
                <div className="p-4 md:p-6">
                  {/* Header with gradient background */}
                  <div className="flex items-center justify-between mb-4 md:mb-6 -m-4 md:-m-6 p-4 md:p-6 bg-gradient-to-r from-blue-600 to-green-600 text-white">
                    <div>
                      <h3 className="text-lg md:text-2xl font-bold">
                        Book Appointment
                      </h3>
                      <p className="text-sm text-blue-100 mt-1">
                        with {selectedDoctor}
                      </p>
                    </div>
                    <button
                      onClick={() => setShowBookingForm(false)}
                      className="text-white/80 hover:text-white text-xl hover:bg-white/20 rounded-full w-8 h-8 flex items-center justify-center transition-all"
                    >
                      ✕
                    </button>
                  </div>

                  <form
                    onSubmit={handleSubmit}
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
                        Doctor
                      </label>
                      <input
                        type="text"
                        name="doctor"
                        value={formData.doctor}
                        className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl bg-gray-100 text-gray-800"
                        readOnly
                      />
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
                        // onClick={handleSubmit}
                        type="submit"
                        className="flex-1 px-1 py-2 bg-gradient-to-r from-blue-600 to-green-600 text-white rounded-xl hover:from-blue-700 hover:to-green-700 transition-all font-semibold shadow-lg"
                      >
                        Book Appointment
                      </button>
                      <button
                        type="button"
                        onClick={() => setShowBookingForm(false)}
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
      </div>
      <div className="block md:hidden">
        <Footer />
      </div>
    </div>
  );
}
