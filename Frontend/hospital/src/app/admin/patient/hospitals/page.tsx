"use client";
import React, { useEffect, useState } from "react";
import Link from "next/link";
import axios from "axios";
import { HospitalAdminFormData } from "../../../register/page"; // Ensure this path is correct
import {
  ArrowRight,
  MapPin,
  Loader2,
  Search,
  Building,
  Building2,
  Heart,
  Brain,
  Bone,
  Baby,
  Stethoscope,
  Clock,
  BedDouble,
  Pill,
} from "lucide-react";

export default function Hospitals() {
  const [showModal, setShowModal] = useState(false);
  const [selectedHospital, setSelectedHospital] =
    useState<HospitalAdminFormData | null>(null);

  const [formData, setFormData] = useState({
    patientName: "",
    phone: "",
    roomType: "AC",
    rooms: 1,
  });
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedFilter, setSelectedFilter] = useState("all");
  const [hospitalsData, setHospitalsData] = useState<HospitalAdminFormData[]>(
    [],
  );
  const [loading, setLoading] = useState(false);

  // Google Maps Direction Logic
  const handleGetDirections = (hospitalLat: any, hospitalLng: any) => {
    setLoading(true);

    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const userLat = position.coords.latitude;
          const userLng = position.coords.longitude;

          const mapsUrl = `https://www.google.com/maps/dir/?api=1&origin=${userLat},${userLng}&destination=${hospitalLat},${hospitalLng}&travelmode=driving`;

          window.open(mapsUrl, "_blank");
          setLoading(false);
        },
        (error) => {
          alert(
            "Unable to fetch your location. Please enable location access.",
          );
          setLoading(false);
        },
      );
    } else {
      alert("Geolocation is not supported on this device.");
      setLoading(false);
    }
  };
  // patient room booking form functions
  const openBookingModal = (hospital: HospitalAdminFormData) => {
    setSelectedHospital(hospital);
    setShowModal(true);
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };
  const handleSubmit = async () => {
    try {
      const res = await axios.post("/patient/book-room", {
        hospitalId: selectedHospital?._id,
        patientName: formData.patientName,
        phone: formData.phone,
        roomType: formData.roomType,
        rooms: Number(formData.rooms),
      });

      alert("Room booked successfully ");
      setShowModal(false);
    } catch (error) {
      console.log(error);
      alert("Booking failed ");
    }
  };
  const closeModal = () => {
    setShowModal(false);
  };
  const fetchHospitalData = async () => {
    try {
      const apiUrl = `/api/hospital/get-hospitalData`;
      const res = await axios.get(apiUrl);
      setHospitalsData(res.data);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchHospitalData();
  }, []);

  const specializations = [
    { id: "all", name: "All Hospitals", icon: <Building size={18} /> },
    { id: "Cardiology", name: "Heart Care", icon: <Heart size={18} /> },
    { id: "Neurology", name: "Brain & Nerve", icon: <Brain size={18} /> },
    { id: "Orthopedic", name: "Bone & Joint", icon: <Bone size={18} /> },
    { id: "Pediatric", name: "Children", icon: <Baby size={18} /> },
    {
      id: "Multi-Specialty",
      name: "Multi-Specialty",
      icon: <Stethoscope size={18} />,
    },
  ];

  // Filter logic
  const filteredHospitals = hospitalsData.filter((hospital) => {
    const matchesSearch =
      hospital.hospital_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      hospital.hospital_address
        .toLowerCase()
        .includes(searchTerm.toLowerCase());
    const matchesType =
      selectedFilter === "all" || hospital.hospital_type === selectedFilter;
    return matchesSearch && matchesType;
  });

  return (
    <>
      <div className="space-y-6 font-sans text-black">
        {/* Search Section */}
        <div className="bg-white text-black rounded-xl shadow-sm border border-gray-200 p-4 md:p-6">
          <div className="max-w-4xl mx-auto">
            <div className="relative">
              <input
                type="text"
                placeholder="Search hospitals by name or location..."
                className="w-full px-4 py-3 pl-12 rounded-xl border-2 border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all outline-none"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
            </div>
          </div>
        </div>

        {/* Filter Section */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 md:p-6">
          <h3 className="text-lg font-bold text-gray-800 mb-3 md:mb-4">
            Filter by Specialization
          </h3>
          <div className="flex flex-nowrap overflow-x-auto md:flex-wrap gap-2 md:gap-3 pb-2 md:pb-0 scrollbar-hide">
            {specializations.map((spec) => (
              <button
                key={spec.id}
                onClick={() => setSelectedFilter(spec.id)}
                className={`flex items-center gap-2 px-3 md:px-4 py-2 rounded-xl font-medium transition-all whitespace-nowrap ${
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

        {/* Hospitals Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredHospitals.map((hospital) => (
            <div
              key={hospital._id}
              className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 flex flex-col h-full"
            >
              {/* Hospital Header with Gradient */}
              <div className="p-4 bg-gradient-to-r from-blue-50 to-green-50 border-b border-gray-200">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-xl font-bold text-gray-800 line-clamp-1">
                      {hospital.hospital_name}
                    </h3>
                    <p className="text-blue-600 font-medium mt-0.5 text-sm">
                      {hospital.hospital_type}
                    </p>
                  </div>
                  <span
                    className={`px-2 py-1 rounded-full text-xs font-medium flex items-center shrink-0 gap-1 ${
                      hospital.organisation_type === "private"
                        ? "bg-blue-100 text-blue-700"
                        : "bg-green-100 text-green-700"
                    }`}
                  >
                    {hospital.organisation_type === "private" ? (
                      <Building2 size={14} />
                    ) : (
                      <Building size={14} />
                    )}
                    <span className="capitalize">
                      {hospital.organisation_type}
                    </span>
                  </span>
                </div>
              </div>

              {/* Hospital Details */}
              <div className="p-4 md:p-6 flex-1 flex flex-col">
                <div className="space-y-4 flex-1">
                  {/* Address */}
                  <div className="flex items-start space-x-3">
                    <span className="flex-shrink-0 w-8 h-8 flex items-center justify-center rounded-full bg-blue-50 text-blue-600">
                      <MapPin size={16} />
                    </span>
                    <div className="flex-1">
                      <span className="text-sm font-medium text-gray-900">
                        Location
                      </span>
                      <p className="text-sm text-gray-600 mt-0.5 line-clamp-2">
                        {hospital.hospital_address}
                      </p>
                    </div>
                  </div>

                  {/* Working Hours */}
                  <div className="flex items-start space-x-3">
                    <span className="flex-shrink-0 w-8 h-8 flex items-center justify-center rounded-full bg-green-50 text-green-600">
                      <Clock size={16} />
                    </span>
                    <div className="flex-1">
                      <span className="text-sm font-medium text-gray-900">
                        Working Hours
                      </span>
                      <p className="text-sm text-gray-600 mt-0.5">
                        {hospital.hospital_duration}
                      </p>
                    </div>
                  </div>

                  {/* Rooms Info */}
                  <div className="flex items-start space-x-3">
                    <span className="flex-shrink-0 w-8 h-8 flex items-center justify-center rounded-full bg-purple-50 text-purple-600">
                      <BedDouble size={16} />
                    </span>
                    <div className="flex-1">
                      <span className="text-sm font-medium text-gray-900">
                        Available Rooms
                      </span>
                      <div className="mt-2 flex flex-wrap gap-2">
                        <span className="inline-flex items-center px-2.5 py-1 rounded-md text-xs font-medium bg-blue-50 text-blue-700">
                          AC: {hospital.ac_rooms}
                        </span>
                        <span className="inline-flex items-center px-2.5 py-1 rounded-md text-xs font-medium bg-gray-100 text-gray-700">
                          Non-AC: {hospital.non_ac_rooms}
                        </span>
                        <span className="inline-flex items-center px-2.5 py-1 rounded-md text-xs font-medium bg-green-50 text-green-700">
                          Total: {hospital.total_rooms}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Connected Pharmacies */}
                  <div className="flex items-start space-x-3">
                    <span className="flex-shrink-0 w-8 h-8 flex items-center justify-center rounded-full bg-pink-50 text-pink-600">
                      <Pill size={16} />
                    </span>
                    <div className="flex-1">
                      <span className="text-sm font-medium text-gray-900">
                        Connected Pharmacies
                      </span>
                      <div className="mt-2 flex flex-wrap gap-2">
                        {hospital.connected_pharmacies &&
                        hospital.connected_pharmacies.length > 0 ? (
                          hospital.connected_pharmacies.map((pharmacy, idx) => (
                            <span
                              key={idx}
                              className="inline-flex items-center px-2.5 py-1 rounded-md text-xs font-medium bg-gray-100 text-gray-700"
                            >
                              {pharmacy}
                            </span>
                          ))
                        ) : (
                          <span className="text-xs text-gray-400">
                            None Listed
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="mt-6 space-y-3">
                  <Link
                    href={`/admin/patient/doctors`}
                    className="block w-full"
                  >
                    <button className="w-full py-3 bg-gradient-to-r from-blue-600 to-green-600 text-white rounded-xl font-semibold hover:opacity-90 transition-all flex items-center justify-center group shadow-md hover:shadow-lg">
                      <span>View Doctors</span>
                      <ArrowRight className="ml-2 w-5 h-5 transform group-hover:translate-x-1 transition-transform" />
                    </button>
                  </Link>
                  <button
                    onClick={() => openBookingModal(hospital)}
                    className="w-full py-3 bg-green-600 text-white rounded-xl font-semibold hover:opacity-90 transition-all"
                  >
                    Book Room
                  </button>
                  <button
                    onClick={() =>
                      handleGetDirections(
                        hospital.hospitalLat,
                        hospital.hospitalLng,
                      )
                    }
                    disabled={loading}
                    className={`w-full py-3 bg-white border-2 border-gray-200 text-gray-700 rounded-xl font-semibold hover:bg-gray-50 hover:border-gray-300 transition-all flex items-center justify-center gap-2 group ${
                      loading ? "opacity-70 cursor-not-allowed" : ""
                    }`}
                  >
                    {loading ? (
                      <>
                        <Loader2 className="w-5 h-5 animate-spin text-blue-600" />
                        <span className="text-blue-600">Opening Maps...</span>
                      </>
                    ) : (
                      <>
                        <span>Get Directions</span>
                        <MapPin className="w-5 h-5 text-red-500 group-hover:scale-110 transition-transform" />
                      </>
                    )}
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* No hospitals found state */}
        {filteredHospitals.length === 0 && (
          <div className="text-center py-20 bg-white rounded-xl border border-dashed border-gray-300">
            <div className="text-6xl mb-4">
              <Building className="w-16 h-16 text-gray-300 mx-auto" />
            </div>
            <h3 className="text-xl font-semibold text-gray-800 mb-2">
              No hospitals found
            </h3>
            <p className="text-gray-500">
              Try adjusting your search terms or filters
            </p>
          </div>
        )}
      </div>
      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 px-4">
          <div className="bg-white w-full max-w-md rounded-xl p-6 shadow-lg">
            <h2 className="text-xl font-bold mb-4">
              Book Room - {selectedHospital?.hospital_name}
            </h2>

            {/* Name */}
            <input
              type="text"
              name="patientName"
              placeholder="Your Name"
              value={formData.patientName}
              onChange={handleChange}
              className="w-full mb-3 px-4 py-2 border rounded-lg"
            />

            {/* Phone */}
            <input
              type="text"
              name="phone"
              placeholder="Phone Number"
              value={formData.phone}
              onChange={handleChange}
              className="w-full mb-3 px-4 py-2 border rounded-lg"
            />

            {/* Room Type */}
            <select
              name="roomType"
              value={formData.roomType}
              onChange={handleChange}
              className="w-full mb-3 px-4 py-2 border rounded-lg"
            >
              <option value="AC">AC</option>
              <option value="Non-AC">Non-AC</option>
              <option value="ICU">ICU</option>
            </select>

            {/* Rooms Count */}
            <input
              type="number"
              name="rooms"
              min="1"
              value={formData.rooms}
              onChange={handleChange}
              className="w-full mb-4 px-4 py-2 border rounded-lg"
            />

            {/* Buttons */}
            <div className="flex gap-3">
              <button
                onClick={handleSubmit}
                className="flex-1 bg-green-600 text-white py-2 rounded-lg"
              >
                Submit
              </button>
              <button
                onClick={closeModal}
                className="flex-1 bg-gray-200 py-2 rounded-lg"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
