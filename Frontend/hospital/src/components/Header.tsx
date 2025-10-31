import Link from "next/link";
import React from "react";

export default function Header() {
  return (
    <div>
      {/* Enhanced Navbar */}{" "}
      <nav className="w-full flex justify-between items-center px-4 md:px-8 py-4 bg-white shadow-lg sticky top-0 z-50">
        <div className="flex items-center">
          <div className="w-10 h-10 bg-gradient-to-r from-blue-600 to-green-600 rounded-full flex items-center justify-center mr-3">
            <span className="text-white font-bold text-xl">S</span>
          </div>
          <h1 className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-blue-600 to-green-600 bg-clip-text text-transparent">
            Swasth-Raho
          </h1>
        </div>

        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center space-x-8">
          <Link
            href="/"
            className="text-gray-700 hover:text-blue-600 transition font-medium"
          >
            Home
          </Link>
          <Link
            href="/about"
            className="text-gray-700 hover:text-blue-600 transition font-medium"
          >
            About
          </Link>
          <Link
            href="/hospitals"
            className="text-gray-700 hover:text-blue-600 transition font-medium"
          >
            Our Hospitals
          </Link>
          <Link
            href="/contact"
            className="text-gray-700 hover:text-blue-600 transition font-medium"
          >
            Contact
          </Link>

          <div className="flex space-x-3">
            <Link href="/login">
              <button className="px-5 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition font-medium">
                Login
              </button>
            </Link>
            <Link href="/register">
              <button className="px-5 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition font-medium">
                Register
              </button>
            </Link>
          </div>
        </div>

        {/* Mobile Menu Button */}
        <div className="md:hidden">
          <button className="text-gray-700 hover:text-blue-600">
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
        </div>
      </nav>
    </div>
  );
}
