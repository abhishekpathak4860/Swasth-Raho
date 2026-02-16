"use client";
import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  GraduationCap,
  Briefcase,
  Hospital,
  IndianRupee,
  Building2,
  Heart,
  Activity,
  Brain,
  Bone,
  Baby,
  Eye,
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
  const { user } = useAuth();
  const [showBookingForm, setShowBookingForm] = useState(false);
  const [selectedFilter, setSelectedFilter] = useState("all");
  const [selectedDoctor, setSelectedDoctor] = useState("");
  const [doctorsData, setDoctorsData] = useState<DoctorType[]>([]);

  const [formData, setFormData] = useState({
    doc_id: "",
    name: "",
    email: "",
    disease: "",
    doctor: "",
    date: "",
    time: "",
  });

  const specializations = [
    { id: "all", name: "All Doctors", icon: <Building2 size={18} /> },
    { id: "Cardiologist", name: "Heart", icon: <Heart size={18} /> },
    { id: "Dermatologist", name: "Skin", icon: <Activity size={18} /> },
    { id: "Neurologist", name: "Brain", icon: <Brain size={18} /> },
    { id: "Orthopedic", name: "Bones", icon: <Bone size={18} /> },
    { id: "Pediatrician", name: "Children", icon: <Baby size={18} /> },
    { id: "Ophthalmologist", name: "Eyes", icon: <Eye size={18} /> },
  ];

  const filteredDoctors =
    selectedFilter === "all"
      ? doctorsData
      : doctorsData.filter((doctor) => doctor.type === selectedFilter);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ) => {
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

  const handleSubmit = async (e: React.FormEvent) => {
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
          withCredentials: true,
        });
        setDoctorsData(res.data.doctor);
      } catch (error) {
        console.error("Error fetching doctors:", error);
      }
    };

    fetchDoctorData();
  }, []);

  return (
    <div
      className={`min-h-screen bg-gray-50 ${showBookingForm ? "overflow-hidden" : ""}`}
    >
      {/* Main Content Area */}
      <div className="p-4 md:p-6">
        {/* Filter Buttons */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 md:p-6 mb-6">
          <h3 className="text-lg font-bold text-gray-800 mb-4">
            Filter by Specialization
          </h3>
          <div className="flex flex-nowrap overflow-x-auto md:flex-wrap gap-3 pb-2 md:pb-0 scrollbar-hide">
            {specializations.map((spec) => (
              <button
                key={spec.id}
                onClick={() => setSelectedFilter(spec.id)}
                className={`flex items-center gap-2 px-4 py-2 rounded-xl font-medium transition-all whitespace-nowrap ${
                  selectedFilter === spec.id
                    ? "bg-blue-600 text-white shadow-lg"
                    : "bg-gray-100 text-gray-700 hover:bg-blue-50 hover:text-blue-600"
                }`}
              >
                {spec.icon}
                {spec.name}
              </button>
            ))}
          </div>
        </div>

        {/* Doctors Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredDoctors.map((doctor) => (
            <div
              key={doctor._id}
              className="bg-white rounded-xl shadow-lg border border-gray-200 p-6 hover:shadow-xl transition-all duration-300 transform hover:scale-105"
            >
              {/* Doctor Header */}
              <div className="flex items-center space-x-4 mb-4">
                <div>
                  <h4 className="text-xl font-bold text-gray-800">
                    {doctor.name}
                  </h4>
                  <p className="text-blue-600 font-medium">{doctor.type}</p>
                </div>
              </div>

              {/* Doctor Details */}
              <div className="space-y-3 mb-6">
                <div className="flex items-center space-x-3 text-sm text-gray-600">
                  <GraduationCap className="w-4 h-4 text-blue-600" />
                  <span>{doctor.education}</span>
                </div>

                <div className="flex items-center space-x-3 text-sm text-gray-600">
                  <Briefcase className="w-4 h-4 text-purple-600" />
                  <span>{doctor.experience} experience</span>
                </div>

                <div className="flex items-center space-x-3 text-sm text-gray-600">
                  <Hospital className="w-4 h-4 text-green-600" />
                  <span>{doctor.hospital}</span>
                </div>

                <div className="flex items-center space-x-3 text-sm text-gray-600">
                  <IndianRupee className="w-4 h-4 text-yellow-600" />
                  <span className="font-semibold text-gray-800">
                    Consultation: ₹{doctor.consultationFee}
                  </span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex space-x-3">
                <button
                  onClick={() => handleBookAppointment(doctor)}
                  className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition font-medium shadow-md"
                >
                  Book Appointment
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
      </div>

      {/* Booking Form Modal */}
      {showBookingForm && (
        <>
          {/* Overlay */}
          <div
            className="fixed inset-0 bg-gray-900/40 backdrop-blur-sm z-50"
            onClick={() => setShowBookingForm(false)}
          ></div>

          {/* Modal Content */}
          <div className="fixed inset-0 flex items-center justify-center z-50 p-4 pointer-events-none">
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md pointer-events-auto border border-gray-200 overflow-hidden animate-in zoom-in-95 duration-200">
              <div className="p-6">
                {/* Header */}
                <div className="flex items-center justify-between mb-6 -m-6 p-6 bg-gradient-to-r from-blue-600 to-green-600 text-white">
                  <div>
                    <h3 className="text-xl font-bold">Book Appointment</h3>
                    <p className="text-sm text-blue-100 mt-1">
                      with {selectedDoctor}
                    </p>
                  </div>
                  <button
                    onClick={() => setShowBookingForm(false)}
                    className="text-white/80 hover:text-white rounded-full p-1 transition-colors"
                  >
                    ✕
                  </button>
                </div>

                <form
                  onSubmit={handleSubmit}
                  className="space-y-4 max-h-[60vh] overflow-y-auto pr-2 custom-scrollbar"
                >
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Patient Full Name
                    </label>
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 text-black"
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
                      className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 text-black"
                      placeholder="your.email@example.com"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Reason for Visit
                    </label>
                    <input
                      type="text"
                      name="disease"
                      value={formData.disease}
                      onChange={handleInputChange}
                      placeholder="e.g., Headache, Fever, Checkup"
                      className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 text-black"
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
                      className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl bg-gray-100 text-gray-600 cursor-not-allowed"
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
                      className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 text-black"
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
                      className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 text-black bg-white"
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

                  <div className="flex space-x-4 pt-4 border-t border-gray-100">
                    <button
                      type="button"
                      onClick={() => setShowBookingForm(false)}
                      className="flex-1 px-4 py-3 bg-gray-100 text-gray-700 rounded-xl hover:bg-gray-200 transition font-medium"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="flex-1 px-4 py-3 bg-gradient-to-r from-blue-600 to-green-600 text-white rounded-xl hover:from-blue-700 hover:to-green-700 transition font-medium shadow-md"
                    >
                      Confirm Booking
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
