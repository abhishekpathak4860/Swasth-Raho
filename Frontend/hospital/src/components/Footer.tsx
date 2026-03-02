import Link from "next/link";
import React from "react";
import { Mail, Phone, MapPin } from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-gray-800 text-white py-12 px-4 md:px-8 lg:px-20">
      <div className="grid md:grid-cols-4 gap-8">
        {/* Brand Section */}
        <div>
          <div className="flex items-center mb-4">
            <div className="w-8 h-8 bg-gradient-to-r from-primary to-secondary rounded-full flex items-center justify-center mr-2">
              <span className="text-white font-bold">S</span>
            </div>
            <h3 className="text-xl font-bold">Swasth-Raho</h3>
          </div>
          <p className="text-gray-400">
            Your trusted healthcare management partner
          </p>
        </div>

        {/* Quick Links */}
        <div>
          <h4 className="font-semibold mb-4">Quick Links</h4>
          <div className="space-y-2">
            <Link
              href="/"
              className="block text-gray-400 hover:text-white transition"
            >
              Home
            </Link>
            <Link
              href="/about"
              className="block text-gray-400 hover:text-white transition"
            >
              About
            </Link>
            <Link
              href="/contact"
              className="block text-gray-400 hover:text-white transition"
            >
              Contact
            </Link>
          </div>
        </div>

        {/* Services */}
        <div>
          <h4 className="font-semibold mb-4">Services</h4>
          <div className="space-y-2">
            <p className="text-gray-400">Appointments</p>
            <p className="text-gray-400">Medical Records</p>
            <p className="text-gray-400">AI Consultation</p>
          </div>
        </div>

        {/* Contact Info */}
        <div>
          <h4 className="font-semibold mb-4">Contact Info</h4>
          <div className="space-y-3 text-gray-400">
            <div className="flex items-center gap-2">
              <Mail size={18} className="text-blue-400" />
              <p>info@swasthraho.com</p>
            </div>
            <div className="flex items-center gap-2">
              <Phone size={18} className="text-green-400" />
              <p>+91 98765 43210</p>
            </div>
            <div className="flex items-center gap-2">
              <MapPin size={18} className="text-red-400" />
              <p>Healthcare Plaza, India</p>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Section */}
      <div className="border-t border-gray-700 mt-8 pt-8 text-center text-gray-400">
        &copy; {new Date().getFullYear()} Swasth-Raho. All rights reserved. |
        Built with ❤️ for better healthcare
      </div>
    </footer>
  );
}
