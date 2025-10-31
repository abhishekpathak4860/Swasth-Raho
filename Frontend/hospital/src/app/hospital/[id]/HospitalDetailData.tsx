"use client";

import React, { useEffect, useRef, useState } from "react";
import Header from "../../../components/Header";
import Footer from "../../../components/Footer";
import { Mail, Phone, MapPin, AlertTriangle } from "lucide-react";

type CarouselProps = {
  images: string[];
  alt?: string;
};

function Carousel({ images, alt }: CarouselProps) {
  const [index, setIndex] = useState(0);
  const len = images?.length || 0;
  const intervalRef = useRef<number | null>(null);

  useEffect(() => {
    if (!len) return;
    // start auto advance
    intervalRef.current = window.setInterval(() => {
      setIndex((i) => (i + 1) % len);
    }, 4000);
    return () => {
      if (intervalRef.current) window.clearInterval(intervalRef.current);
    };
  }, [len]);

  const go = (next: number) => {
    setIndex(() => (next + len) % len);
  };

  const resetInterval = () => {
    if (intervalRef.current) window.clearInterval(intervalRef.current);
    intervalRef.current = window.setInterval(() => {
      setIndex((i) => (i + 1) % len);
    }, 4000);
  };

  if (!len) return null;

  return (
    <div className="relative">
      <div className="h-64 md:h-80 w-full overflow-hidden rounded-b-2xl shadow-inner relative">
        {images.map((src, i) => (
          <img
            key={i}
            src={src}
            alt={alt ? `${alt} ${i + 1}` : `slide-${i + 1}`}
            className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-700 ${
              i === index ? "opacity-100" : "opacity-0 pointer-events-none"
            }`}
          />
        ))}
      </div>

      {/* arrows */}
      <div className="absolute inset-0 flex items-center justify-between px-4 md:px-8">
        <button
          aria-label="Previous"
          onClick={() => {
            go(index - 1);
            resetInterval();
          }}
          className="bg-black/30 hover:bg-black/40 text-white p-2 rounded-full"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-5 w-5"
            viewBox="0 0 20 20"
            fill="currentColor"
          >
            <path
              fillRule="evenodd"
              d="M12.293 16.293a1 1 0 010-1.414L15.586 11H4a1 1 0 110-2h11.586l-3.293-3.293a1 1 0 111.414-1.414l5 5a1 1 0 010 1.414l-5 5a1 1 0 01-1.414 0z"
              clipRule="evenodd"
            />
          </svg>
        </button>

        <button
          aria-label="Next"
          onClick={() => {
            go(index + 1);
            resetInterval();
          }}
          className="bg-black/30 hover:bg-black/40 text-white p-2 rounded-full"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-5 w-5 rotate-180"
            viewBox="0 0 20 20"
            fill="currentColor"
          >
            <path
              fillRule="evenodd"
              d="M12.293 16.293a1 1 0 010-1.414L15.586 11H4a1 1 0 110-2h11.586l-3.293-3.293a1 1 0 111.414-1.414l5 5a1 1 0 010 1.414l-5 5a1 1 0 01-1.414 0z"
              clipRule="evenodd"
            />
          </svg>
        </button>
      </div>

      {/* dots */}
      <div className="absolute left-0 right-0 bottom-3 flex justify-center gap-2">
        {images.map((_, i) => (
          <button
            key={i}
            aria-label={`Go to slide ${i + 1}`}
            onClick={() => {
              go(i);
              resetInterval();
            }}
            className={`w-3 h-3 rounded-full ${
              i === index ? "bg-white" : "bg-white/60"
            }`}
          />
        ))}
      </div>
    </div>
  );
}

export default function HospitalDetailData({ hospital }: { hospital: any }) {
  // defensive defaults
  const h = hospital || {};
  const chips = [h.hospital_type, h.accreditation];

  return (
    <div className="bg-gradient-to-b from-slate-50 via-slate-100 to-slate-50 min-h-screen text-slate-800">
      <Header />

      {/* Hero - image carousel */}
      <div className="relative">
        <Carousel
          images={["/homeImage.jpg", "/image1.jpg", "/image3.jpg"]}
          alt={h.hospital_name}
        />

        <div className="max-w-6xl mx-auto -mt-20 px-4 md:px-6">
          <div className="bg-white/90 backdrop-blur-sm rounded-xl shadow-lg p-6 md:p-8 flex flex-col md:flex-row gap-6 items-start">
            <div className="flex-1">
              <h1 className="text-2xl md:text-3xl font-extrabold text-slate-900">
                {h.hospital_name}
              </h1>
              <div className="flex flex-wrap items-center gap-3 mt-3">
                {chips.filter(Boolean).map((c: string, i: number) => (
                  <span
                    key={i}
                    className="inline-flex items-center px-3 py-1.5 rounded-full text-sm bg-gradient-to-r from-cyan-50 to-emerald-50 text-slate-700 border"
                  >
                    {c}
                  </span>
                ))}

                <div className="flex items-center text-sm text-slate-600">
                  <span className="text-amber-500 font-semibold mr-2">
                    ★ {h.rating ?? "-"}
                  </span>
                  <span className="mr-2">·</span>
                  <span className="text-slate-500">
                    {h.total_reviews ?? 0} reviews
                  </span>
                </div>
              </div>

              <p className="mt-4 text-slate-700 max-w-3xl leading-relaxed">
                {h.hospital_description}
              </p>
            </div>

            <aside className="w-full md:w-80 flex-shrink-0">
              <div className="bg-white rounded-lg border p-4 shadow-sm">
                <h4 className="font-semibold text-slate-800 mb-3">
                  Quick Info
                </h4>
                <ul className="text-sm text-slate-700 space-y-2">
                  <li>
                    <strong>Organisation: </strong>
                    <span className="capitalize">{h.organisation_type}</span>
                  </li>
                  <li>
                    <strong>Established: </strong>
                    <span>{h.year_established}</span>
                  </li>
                  <li>
                    <strong>Visiting Hours: </strong>
                    <span>{h.hospital_duration}</span>
                  </li>
                  <li>
                    <strong>License: </strong>
                    <span>{h.license_number}</span>
                  </li>
                </ul>

                <div className="mt-4">
                  <a
                    href={`tel:${h.contact_number}`}
                    className="block w-full text-center bg-emerald-600 hover:bg-emerald-700 text-white py-2 rounded-md font-semibold"
                  >
                    Call Hospital
                  </a>
                  <a
                    href={`tel:${h.emergency_number}`}
                    className="block w-full text-center mt-2 border border-rose-500 text-rose-600 py-2 rounded-md font-medium"
                  >
                    Emergency: {h.emergency_number}
                  </a>
                </div>
              </div>
            </aside>
          </div>
        </div>
      </div>

      {/* Content Sections */}
      <main className="max-w-6xl mx-auto px-4 md:px-6 py-10 grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left - Main content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Facilities Card */}
          <div className="bg-white rounded-xl shadow p-6">
            <h3 className="text-xl font-semibold mb-4">Key Facilities</h3>
            <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-4 text-slate-700">
              <div className="p-3 bg-slate-50 rounded">
                <div className="text-sm text-slate-500">Total Rooms</div>
                <div className="mt-1 font-semibold text-slate-900">
                  {h.total_rooms ?? 0}
                </div>
              </div>
              <div className="p-3 bg-slate-50 rounded">
                <div className="text-sm text-slate-500">AC Rooms</div>
                <div className="mt-1 font-semibold text-slate-900">
                  {h.ac_rooms ?? 0}
                </div>
              </div>
              <div className="p-3 bg-slate-50 rounded">
                <div className="text-sm text-slate-500">Non-AC Rooms</div>
                <div className="mt-1 font-semibold text-slate-900">
                  {h.non_ac_rooms ?? 0}
                </div>
              </div>
              <div className="p-3 bg-slate-50 rounded">
                <div className="text-sm text-slate-500">ICU Beds</div>
                <div className="mt-1 font-semibold text-slate-900">
                  {h.icu_beds ?? 0}
                </div>
              </div>
              <div className="p-3 bg-slate-50 rounded">
                <div className="text-sm text-slate-500">Ambulances</div>
                <div className="mt-1 font-semibold text-slate-900">
                  {h.ambulances ?? 0}
                </div>
              </div>
              <div className="p-3 bg-slate-50 rounded">
                <div className="text-sm text-slate-500">Teleconsultation</div>
                <div className="mt-1 font-semibold text-slate-900">
                  {h.teleconsultation_available ? "Available" : "No"}
                </div>
              </div>
              <div className="p-3 bg-slate-50 rounded">
                <div className="text-sm text-slate-500">Parking</div>
                <div className="mt-1 font-semibold text-slate-900">
                  {h.parking_available ? "Available" : "No"}
                </div>
              </div>
              <div className="p-3 bg-slate-50 rounded">
                <div className="text-sm text-slate-500">Canteen</div>
                <div className="mt-1 font-semibold text-slate-900">
                  {h.canteen_available ? "Available" : "No"}
                </div>
              </div>
            </div>
          </div>

          {/* Departments & Labs */}
          <div className="bg-white rounded-xl shadow p-6">
            <h3 className="text-xl font-semibold mb-4">
              Departments & Lab Facilities
            </h3>
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <h4 className="font-medium mb-2">Departments</h4>
                <ul className="list-disc pl-5 text-slate-700 space-y-1">
                  {Array.isArray(h.departments) && h.departments.length > 0 ? (
                    h.departments.map((d: string, idx: number) => (
                      <li key={idx}>{d}</li>
                    ))
                  ) : (
                    <li>Not specified</li>
                  )}
                </ul>
              </div>
              <div>
                <h4 className="font-medium mb-2">Lab Facilities</h4>
                <ul className="list-disc pl-5 text-slate-700 space-y-1">
                  {Array.isArray(h.lab_facilities) &&
                  h.lab_facilities.length > 0 ? (
                    h.lab_facilities.map((l: string, idx: number) => (
                      <li key={idx}>{l}</li>
                    ))
                  ) : (
                    <li>Not specified</li>
                  )}
                </ul>
              </div>
            </div>
          </div>

          {/* Payment & Insurance */}
          <div className="bg-white rounded-xl shadow p-6">
            <h3 className="text-xl font-semibold mb-4">Payment & Insurance</h3>
            <div className="grid md:grid-cols-3 gap-6 text-slate-700">
              <div>
                <h4 className="font-medium mb-2">Payment Modes</h4>
                <ul className="list-disc pl-5">
                  {Array.isArray(h.payment_modes) &&
                  h.payment_modes.length > 0 ? (
                    h.payment_modes.map((m: string, idx: number) => (
                      <li key={idx}>{m}</li>
                    ))
                  ) : (
                    <li>Not specified</li>
                  )}
                </ul>
              </div>
              <div>
                <h4 className="font-medium mb-2">Insurance Partners</h4>
                <ul className="list-disc pl-5">
                  {Array.isArray(h.insurance_partners) &&
                  h.insurance_partners.length > 0 ? (
                    h.insurance_partners.map((p: string, idx: number) => (
                      <li key={idx}>{p}</li>
                    ))
                  ) : (
                    <li>Not specified</li>
                  )}
                </ul>
              </div>
              <div>
                <h4 className="font-medium mb-2">Connected Pharmacies</h4>
                <ul className="list-disc pl-5">
                  {Array.isArray(h.connected_pharmacies) &&
                  h.connected_pharmacies.length > 0 ? (
                    h.connected_pharmacies.map((c: string, idx: number) => (
                      <li key={idx}>{c}</li>
                    ))
                  ) : (
                    <li>Not specified</li>
                  )}
                </ul>
              </div>
            </div>
          </div>

          {/* Contact */}
          <div className="bg-white rounded-xl shadow p-6">
            <h3 className="text-xl font-semibold mb-4">Contact Information</h3>
            <div className="flex flex-col sm:flex-row sm:justify-between gap-4">
              <div className="text-slate-700 ml-3.5 space-y-2">
                <p className="flex items-center gap-2">
                  <MapPin size={18} className="text-blue-500" />
                  {h.hospital_address}
                </p>
                <p className="flex items-center gap-2">
                  <Phone size={18} className="text-green-500" />
                  {h.contact_number}
                </p>
                <p className="flex items-center gap-2">
                  <AlertTriangle size={18} className="text-red-500" />
                  Emergency: {h.emergency_number}
                </p>
              </div>
              <div className="flex flex-col items-start sm:items-end">
                <a
                  href={`tel:${h.contact_number}`}
                  className="px-4 py-2 bg-emerald-600 text-white rounded-md font-semibold"
                >
                  Call Now
                </a>
                <a
                  href={`mailto:info@swasthraho.com`}
                  className="mt-2 text-sm text-slate-600"
                >
                  Contact via email
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Right - Sidebar */}
        <div className="space-y-6">
          <div className="bg-white rounded-xl shadow p-6">
            <h4 className="font-semibold mb-3">Highlights</h4>
            <ul className="text-slate-700 space-y-2 text-sm">
              <li>
                Accreditation:{" "}
                <strong className="text-slate-900">
                  {h.accreditation || "N/A"}
                </strong>
              </li>
              <li>License: {h.license_number || "N/A"}</li>
              <li>Rating: {h.rating ?? "-"}</li>
              <li>Reviews: {h.total_reviews ?? 0}</li>
            </ul>
          </div>

          <div className="bg-white rounded-xl shadow p-6">
            <h4 className="font-semibold mb-3">Actions</h4>
            <div className="flex flex-col gap-3">
              <button className="w-full px-4 py-2 bg-blue-600 text-white rounded-md font-semibold">
                Book Appointment
              </button>
              <button className="w-full px-4 py-2 border border-slate-200 rounded-md">
                Get Directions
              </button>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
