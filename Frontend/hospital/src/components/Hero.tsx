import Link from "next/link";
import React from "react";

export default function Hero() {
  return (
    <div>
      <div className="flex flex-col lg:flex-row items-center justify-between px-4 md:px-8 lg:px-20 py-12 lg:py-20">
        {/* Left Content */}
        <div className="lg:w-1/2 space-y-8 text-center lg:text-left">
          <div className="space-y-4">
            <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-800 leading-tight">
              Your Health,
              <span className="bg-gradient-to-r from-blue-600 to-green-600 bg-clip-text text-transparent">
                {" "}
                Our Priority
              </span>
            </h2>
            <p className="text-gray-600 text-lg md:text-xl max-w-2xl mx-auto lg:mx-0">
              Experience seamless healthcare management with Swasth-Raho. Book
              appointments, consult with expert doctors, and manage your health
              records—all in one intelligent platform.
            </p>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
            <Link href="/register">
              <button className="w-full sm:w-auto px-8 py-4 bg-gradient-to-r from-green-600 to-green-700 text-white rounded-xl hover:from-green-700 hover:to-green-800 transition font-semibold shadow-lg">
                Get Started Free
              </button>
            </Link>
            <Link href="/login">
              <button className="w-full sm:w-auto px-8 py-4 bg-white text-blue-600 border-2 border-blue-600 rounded-xl hover:bg-blue-50 transition font-semibold">
                Sign In
              </button>
            </Link>
          </div>

          {/* Features List */}
          <div className="flex flex-wrap gap-6 justify-center lg:justify-start pt-8">
            <div className="flex items-center space-x-2">
              <div className="w-5 h-5 bg-green-500 rounded-full flex items-center justify-center">
                <svg
                  className="w-3 h-3 text-white"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                    clipRule="evenodd"
                  />
                </svg>
              </div>
              <span className="text-gray-700 font-medium">24/7 Support</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-5 h-5 bg-green-500 rounded-full flex items-center justify-center">
                <svg
                  className="w-3 h-3 text-white"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                    clipRule="evenodd"
                  />
                </svg>
              </div>
              <span className="text-gray-700 font-medium">AI Chatbot</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-5 h-5 bg-green-500 rounded-full flex items-center justify-center">
                <svg
                  className="w-3 h-3 text-white"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                    clipRule="evenodd"
                  />
                </svg>
              </div>
              <span className="text-gray-700 font-medium">Secure Records</span>
            </div>
          </div>
        </div>

        {/* Right Image */}
        <div className="lg:w-1/2 mt-12 lg:mt-0 relative">
          <div className="relative">
            <div className="absolute inset-0 bg-gradient-to-r from-blue-400 to-green-400 rounded-2xl transform rotate-6 opacity-20"></div>
            <img
              src="/hospital-hero.png"
              alt="Healthcare Management"
              className="relative w-full h-auto rounded-2xl shadow-2xl transform hover:scale-105 transition duration-300"
            />
          </div>

          {/* Floating Cards */}
          <div className="absolute -top-4 -left-4 bg-white p-4 rounded-xl shadow-lg hidden lg:block">
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
              <span className="text-sm font-medium text-gray-700">
                Online Consultations
              </span>
            </div>
          </div>

          <div className="absolute -bottom-4 -right-4 bg-white p-4 rounded-xl shadow-lg hidden lg:block">
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-blue-500 rounded-full animate-pulse"></div>
              <span className="text-sm font-medium text-gray-700">
                Smart Appointments
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
