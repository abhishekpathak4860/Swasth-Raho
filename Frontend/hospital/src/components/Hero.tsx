import Link from "next/link";
import Image from "next/image";
import React from "react";

export default function Hero() {
  return (
    <div className="relative min-h-screen flex items-center">
      {/* Background Image */}
      <Image
        src="/homeImage.jpg"
        alt="Hospital Background"
        fill
        className="object-cover"
        priority
      />

      {/* Overlay to darken background for readability */}
      <div className="absolute inset-0 bg-black/50"></div>

      {/* Content Container */}
      <div className="relative z-10 w-full px-4 md:px-8 lg:px-20 py-12 lg:py-20">
        <div className="flex flex-col lg:flex-row items-center justify-between">
          {/* Left Content */}
          <div className="lg:w-1/2 space-y-8 text-center lg:text-left">
            <div className="space-y-4">
              <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white leading-tight">
                Your Health,
                <span className="bg-gradient-to-r from-blue-400 to-green-400 bg-clip-text text-transparent">
                  {" "}
                  Our Priority
                </span>
              </h2>
              <p className="text-gray-100 text-lg md:text-xl max-w-2xl mx-auto lg:mx-0">
                Experience seamless healthcare management with Swasth-Raho. Book
                appointments, consult with expert doctors, and manage your
                health records—all in one intelligent platform.
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
                <button className="w-full sm:w-auto px-8 py-4 bg-white/90 backdrop-blur-sm text-blue-600 border-2 border-white/30 rounded-xl hover:bg-white transition font-semibold">
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
                <span className="text-white font-medium">24/7 Support</span>
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
                <span className="text-white font-medium">AI Chatbot</span>
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
                <span className="text-white font-medium">Secure Records</span>
              </div>
            </div>
          </div>

          {/* Right Side - Visual Elements (Optional) */}
          <div className="lg:w-1/2 mt-12 lg:mt-0 relative hidden lg:block">
            {/* Floating Cards */}
            <div className="absolute top-10 left-10 bg-white/90 backdrop-blur-sm p-4 rounded-xl shadow-lg animate-bounce">
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
                <span className="text-sm font-medium text-gray-700">
                  Online Consultations
                </span>
              </div>
            </div>

            <div className="absolute top-40 right-10 bg-white/90 backdrop-blur-sm p-4 rounded-xl shadow-lg animate-bounce delay-300">
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 bg-blue-500 rounded-full animate-pulse"></div>
                <span className="text-sm font-medium text-gray-700">
                  Smart Appointments
                </span>
              </div>
            </div>

            <div className="absolute bottom-20 left-20 bg-white/90 backdrop-blur-sm p-4 rounded-xl shadow-lg animate-bounce delay-500">
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 bg-purple-500 rounded-full animate-pulse"></div>
                <span className="text-sm font-medium text-gray-700">
                  AI Medical Assistant
                </span>
              </div>
            </div>

            {/* Medical Icons */}
            {/* <div className="absolute top-32 right-32 w-16 h-16 bg-blue-500/20 backdrop-blur-sm rounded-full flex items-center justify-center animate-pulse">
              <svg
                className="w-8 h-8 text-blue-400"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div> */}

            {/* <div className="absolute bottom-32 right-20 w-12 h-12 bg-green-500/20 backdrop-blur-sm rounded-full flex items-center justify-center animate-pulse delay-700">
              <svg
                className="w-6 h-6 text-green-400"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path
                  fillRule="evenodd"
                  d="M3 4a1 1 0 011-1h4a1 1 0 010 2H6.414l2.293 2.293a1 1 0 01-1.414 1.414L5 6.414V8a1 1 0 01-2 0V4zm9 1a1 1 0 010-2h4a1 1 0 011 1v4a1 1 0 01-2 0V6.414l-2.293 2.293a1 1 0 11-1.414-1.414L13.586 5H12z"
                  clipRule="evenodd"
                />
              </svg>
            </div> */}
          </div>
        </div>
      </div>
    </div>
  );
}
