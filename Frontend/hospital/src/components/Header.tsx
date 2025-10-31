"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import React from "react";
import { Home, Info, Building2, Phone, User } from "lucide-react"; // Lucide icons

export default function Header() {
  const pathname = usePathname(); // current route path

  return (
    <header>
      {/* ---- Top Navbar for Desktop ---- */}
      <nav className="hidden md:flex w-full justify-between items-center px-8 py-4 bg-white shadow-md sticky top-0 z-50">
        <div className="flex items-center">
          <div className="w-10 h-10 bg-gradient-to-r from-blue-600 to-green-600 rounded-full flex items-center justify-center mr-3">
            <span className="text-white font-bold text-xl">S</span>
          </div>
          <Link href="/">
            <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-green-600 bg-clip-text text-transparent">
              Swasth-Raho
            </h1>
          </Link>
        </div>

        <div className="flex items-center space-x-8">
          {[
            { href: "/", label: "Home" },
            { href: "/about", label: "About" },
            { href: "/hospitals", label: "Our Hospitals" },
            { href: "/contact", label: "Contact" },
          ].map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={`font-medium transition ${
                pathname === item.href
                  ? "text-blue-600"
                  : "text-gray-700 hover:text-blue-600"
              }`}
            >
              {item.label}
            </Link>
          ))}

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
      </nav>

      {/* ---- Mobile Top Logo ---- */}
      <div className="md:hidden fixed top-0 left-0 right-0 bg-white shadow-md py-3 flex items-center pl-4 z-50">
        <div className="flex items-center">
          <div className="w-9 h-9 bg-gradient-to-r from-blue-600 to-green-600 rounded-full flex items-center justify-center mr-2">
            <span className="text-white font-bold text-lg">S</span>
          </div>
          <Link href="/">
            <h1 className="text-xl font-bold bg-gradient-to-r from-blue-600 to-green-600 bg-clip-text text-transparent">
              Swasth-Raho
            </h1>
          </Link>
        </div>
      </div>

      {/* ---- Mobile Bottom Fixed Navbar ---- */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 shadow-lg z-50">
        <div className="flex justify-around items-center py-5">
          {[
            { href: "/", label: "Home", icon: Home },
            { href: "/about", label: "About", icon: Info },
            { href: "/hospitals", label: "Hospitals", icon: Building2 },
            { href: "/contact", label: "Contact", icon: Phone },
            { href: "/login", label: "Profile", icon: User },
          ].map((item) => {
            const isActive = pathname === item.href;
            const Icon = item.icon;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex flex-col items-center text-xs font-medium transition ${
                  isActive
                    ? "text-blue-600"
                    : "text-gray-700 hover:text-blue-600"
                }`}
              >
                <Icon className="w-5 h-5 mb-1" />
                <span>{item.label}</span>
              </Link>
            );
          })}
        </div>
      </nav>
    </header>
  );
}
