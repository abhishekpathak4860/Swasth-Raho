"use client";
import React, { useState } from "react";
import Link from "next/link";

export default function Doctors() {
  const [activeTab, setActiveTab] = useState("doctors");
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [showBookingForm, setShowBookingForm] = useState(false);
  const [selectedFilter, setSelectedFilter] = useState("all");
  const [selectedDoctor, setSelectedDoctor] = useState("");
  const [formData, setFormData] = useState({
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

  const doctorsData = [
    {
      id: 1,
      name: "Dr. Amit Sharma",
      specialization: "Cardiologist",
      experience: "15 years",
      rating: 4.8,
      image: "👨‍⚕️",
      contact: "+91 98765 43210",
      education: "MBBS, MD Cardiology",
      hospital: "Heart Care Centre",
      availability: "Mon-Fri: 9AM-5PM",
      consultationFee: "₹1500",
    },
    {
      id: 2,
      name: "Dr. Priya Patel",
      specialization: "Dermatologist",
      experience: "12 years",
      rating: 4.9,
      image: "👩‍⚕️",
      contact: "+91 87654 32109",
      education: "MBBS, MD Dermatology",
      hospital: "Skin Care Clinic",
      availability: "Tue-Sat: 10AM-6PM",
      consultationFee: "₹1200",
    },
    {
      id: 3,
      name: "Dr. Rahul Kumar",
      specialization: "Neurologist",
      experience: "18 years",
      rating: 4.7,
      image: "👨‍⚕️",
      contact: "+91 76543 21098",
      education: "MBBS, DM Neurology",
      hospital: "Neuro Care Institute",
      availability: "Mon-Wed-Fri: 11AM-4PM",
      consultationFee: "₹2000",
    },
    {
      id: 4,
      name: "Dr. Sneha Singh",
      specialization: "Orthopedic",
      experience: "10 years",
      rating: 4.6,
      image: "👩‍⚕️",
      contact: "+91 65432 10987",
      education: "MBBS, MS Orthopedics",
      hospital: "Bone & Joint Clinic",
      availability: "Mon-Sat: 8AM-2PM",
      consultationFee: "₹1800",
    },
    {
      id: 5,
      name: "Dr. Vijay Mehta",
      specialization: "Pediatrician",
      experience: "20 years",
      rating: 4.9,
      image: "👨‍⚕️",
      contact: "+91 54321 09876",
      education: "MBBS, MD Pediatrics",
      hospital: "Children's Hospital",
      availability: "Daily: 9AM-7PM",
      consultationFee: "₹1000",
    },
    {
      id: 6,
      name: "Dr. Ravi Gupta",
      specialization: "Ophthalmologist",
      experience: "14 years",
      rating: 4.8,
      image: "👨‍⚕️",
      contact: "+91 43210 98765",
      education: "MBBS, MS Ophthalmology",
      hospital: "Eye Care Centre",
      availability: "Tue-Thu-Sat: 10AM-5PM",
      consultationFee: "₹1300",
    },
  ];

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
      : doctorsData.filter(
          (doctor) => doctor.specialization === selectedFilter
        );

  const handleInputChange = (e: { target: { name: any; value: any } }) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleBookAppointment = (doctorName: string) => {
    setSelectedDoctor(doctorName);
    setFormData({
      ...formData,
      doctor: doctorName,
    });
    setShowBookingForm(true);
  };

  const handleSubmit = (e: { preventDefault: () => void }) => {
    e.preventDefault();
    console.log("Booking appointment:", formData);
    setShowBookingForm(false);
    setFormData({
      name: "",
      email: "",
      disease: "",
      doctor: "",
      date: "",
      time: "",
    });
    alert("Appointment booked successfully!");
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
                Our Doctors
              </h2>
            </div>

            <div className="flex items-center space-x-4">
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

        {/* Main Content Area */}
        <main className="flex-1 p-6 mt-20 overflow-y-auto">
          {/* Special AI Doctor Card */}
          <div className="bg-gradient-to-r from-purple-600 to-pink-600 rounded-2xl p-6 mb-6 text-white">
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

          {/* Filter Buttons */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-6">
            <h3 className="text-lg font-bold text-gray-800 mb-4">
              Filter by Specialization
            </h3>
            <div className="flex flex-wrap gap-3">
              {specializations.map((spec) => (
                <button
                  key={spec.id}
                  onClick={() => setSelectedFilter(spec.id)}
                  className={`px-4 py-2 rounded-xl font-medium transition-all ${
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
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredDoctors.map((doctor) => (
              <div
                key={doctor.id}
                className="bg-white rounded-xl shadow-lg border border-gray-200 p-6 hover:shadow-xl transition-all duration-300 transform hover:scale-105"
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
                    <p className="text-blue-600 font-medium">
                      {doctor.specialization}
                    </p>
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
                    <span>🎓</span>
                    <span>{doctor.education}</span>
                  </div>
                  <div className="flex items-center space-x-2 text-sm text-gray-600">
                    <span>💼</span>
                    <span>{doctor.experience} experience</span>
                  </div>
                  <div className="flex items-center space-x-2 text-sm text-gray-600">
                    <span>🏥</span>
                    <span>{doctor.hospital}</span>
                  </div>
                  <div className="flex items-center space-x-2 text-sm text-gray-600">
                    <span>⏰</span>
                    <span>{doctor.availability}</span>
                  </div>
                  <div className="flex items-center space-x-2 text-sm text-gray-600">
                    <span>💰</span>
                    <span>Consultation: {doctor.consultationFee}</span>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex space-x-2">
                  <button
                    onClick={() => handleBookAppointment(doctor.name)}
                    className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition font-medium"
                  >
                    📅 Book Appointment
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
            <div className="bg-gradient-to-br from-blue-50 to-white rounded-2xl shadow-2xl w-full max-w-md pointer-events-auto border border-blue-200 overflow-hidden">
              <div className="p-6">
                {/* Header with gradient background */}
                <div className="flex items-center justify-between mb-6 -m-6 p-6 bg-gradient-to-r from-blue-600 to-green-600 text-white">
                  <h3 className="text-2xl font-bold">
                    📅 Book Appointment with {selectedDoctor}
                  </h3>
                  <button
                    onClick={() => setShowBookingForm(false)}
                    className="text-white/80 hover:text-white text-2xl hover:bg-white/20 rounded-full w-8 h-8 flex items-center justify-center transition-all"
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
                      👤 Full Name
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
                      📧 Email Address
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
                      💊 Type of Disease/Issue
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
                      👨‍⚕️ Doctor
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
                      📅 Preferred Date
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
                      ⏰ Preferred Time
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
                      className="flex-1 px-6 py-3 bg-gradient-to-r from-blue-600 to-green-600 text-white rounded-xl hover:from-blue-700 hover:to-green-700 transition-all font-semibold shadow-lg hover:shadow-xl transform hover:scale-105"
                    >
                      📅 Book Appointment
                    </button>
                    <button
                      type="button"
                      onClick={() => setShowBookingForm(false)}
                      className="flex-1 px-6 py-3 bg-gray-500 text-white rounded-xl hover:bg-gray-600 transition-all font-semibold shadow-lg"
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
  );
}
