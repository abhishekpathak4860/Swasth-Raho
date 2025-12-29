"use client";
import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import {
  User,
  CalendarDays,
  Users,
  Wallet,
  MessageSquare,
  Search,
  MoreVertical,
  Phone,
  Video,
  Send,
  Paperclip,
  Smile,
  CheckCheck,
  Menu,
  X,
  ChevronLeft,
  Filter,
} from "lucide-react";

export default function DoctorMessagesPage() {
  // State Management
  const [activeTab, setActiveTab] = useState("messages");
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [activeChat, setActiveChat] = useState(null);
  const [messageInput, setMessageInput] = useState("");
  const messagesEndRef = useRef(null);

  // Fake Doctor Data (Reference from your code)
  const doctor = {
    name: "Dr. Akshat Lohni",
    email: "akshat@gmail.com",
    role: "Doctor",
    profileImg: "",
  };

  const sidebarItems = [
    { id: "profile", label: "Profile", icon: User, route: "/admin/doctor" },
    {
      id: "appointments",
      label: "Appointments",
      icon: CalendarDays,
      route: "/admin/doctor/appointments",
    },
    {
      id: "patients",
      label: "Patients",
      icon: Users,
      route: "/admin/doctor/patients",
    },
    {
      id: "revenue",
      label: "Revenue",
      icon: Wallet,
      route: "/admin/doctor/revenue",
    },
    {
      id: "messages",
      label: "Messages",
      icon: MessageSquare,
      route: "/admin/doctor/messages",
    },
  ];

  const patientList = [
    {
      id: 1,
      name: "Ayush Pal",
      age: "26",
      lastMsg: "Doctor, when should I take the red pill?",
      time: "09:45 AM",
      unread: 3,
      online: true,
    },
    {
      id: 2,
      name: "Rahul Sharma",
      age: "32",
      lastMsg: "The fever has gone down. Thanks!",
      time: "Yesterday",
      unread: 0,
      online: false,
    },
    {
      id: 3,
      name: "Sneha Gupta",
      age: "24",
      lastMsg: "Attached my blood report.",
      time: "Monday",
      unread: 0,
      online: true,
    },
  ];

  const dummyMessages = [
    {
      id: 1,
      sender: "doctor",
      text: "Hello Ayush, how is your recovery going?",
      time: "09:00 AM",
    },
    {
      id: 2,
      sender: "patient",
      text: "It is better, but I have a question about the medicine.",
      time: "09:05 AM",
    },
    { id: 3, sender: "doctor", text: "Sure, ask away.", time: "09:10 AM" },
    {
      id: 4,
      sender: "patient",
      text: "Doctor, when should I take the red pill?",
      time: "09:45 AM",
    },
  ];

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [activeChat]);

  return (
    <div className="h-screen flex bg-gray-50 overflow-hidden">
      {/* --- Mobile Sidebar Overlay --- */}
      {isSidebarOpen && (
        <div
          className="fixed inset-0 bg-black/40 z-50 md:hidden transition-opacity"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* --- Sidebar (Doctor Portal Styling) --- */}
      <aside
        className={`fixed inset-y-0 left-0 z-50 w-64 bg-white shadow-xl transform transition-transform duration-300 md:relative md:translate-x-0 ${
          isSidebarOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="p-4 border-b flex items-center justify-between">
          <div className="flex items-center">
            <div className="w-10 h-10 bg-gradient-to-r from-blue-600 to-green-600 rounded-xl flex items-center justify-center shadow-lg shadow-blue-200">
              <span className="text-white font-bold text-xl">D</span>
            </div>
            <div className="ml-3">
              <h1 className="text-lg font-bold text-gray-800">Swasth-Raho</h1>
              <p className="text-[10px] text-gray-500 font-bold uppercase tracking-wider">
                Doctor Portal
              </p>
            </div>
          </div>
          <button
            className="md:hidden p-2 text-gray-400"
            onClick={() => setIsSidebarOpen(false)}
          >
            <X size={20} />
          </button>
        </div>

        <nav className="mt-4 flex-1 px-3 space-y-1 overflow-y-auto">
          {sidebarItems.map((item) => (
            <Link
              key={item.id}
              href={item.route}
              onClick={() => setActiveTab(item.id)}
              className={`flex items-center px-4 py-3 rounded-xl transition-all ${
                activeTab === item.id
                  ? "bg-blue-50 text-blue-600 border-r-4 border-blue-600 font-semibold"
                  : "text-gray-600 hover:bg-gray-100"
              }`}
            >
              <item.icon size={20} />
              <span className="ml-3 font-medium text-sm">{item.label}</span>
            </Link>
          ))}
        </nav>
      </aside>

      {/* --- Main Area --- */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Header */}
        <header className="bg-white border-b border-gray-200 px-4 py-3 flex items-center justify-between sticky top-0 z-30">
          <div className="flex items-center">
            <button
              onClick={() => setIsSidebarOpen(true)}
              className="md:hidden p-2 mr-2 text-gray-600 hover:bg-gray-100 rounded-lg"
            >
              <Menu size={24} />
            </button>
            <h2 className="text-xl font-bold text-gray-800 tracking-tight">
              Patient Messages
            </h2>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => setShowProfileMenu(!showProfileMenu)}
              className="flex items-center gap-3 p-1 rounded-full hover:bg-gray-100 transition-colors"
            >
              <div className="w-9 h-9 bg-blue-600 rounded-full flex items-center justify-center text-white border-2 border-white shadow-sm overflow-hidden">
                <User size={20} />
              </div>
              <div className="hidden sm:block text-left mr-2">
                <p className="text-xs font-bold text-gray-800 leading-none">
                  {doctor.name}
                </p>
                <p className="text-[10px] text-gray-500">{doctor.email}</p>
              </div>
            </button>
          </div>
        </header>

        {/* --- Chat Content --- */}
        <div className="flex-1 flex overflow-hidden">
          {/* Patient Chat List */}
          <div
            className={`w-full md:w-80 lg:w-96 bg-white border-r border-gray-200 flex flex-col ${
              activeChat ? "hidden md:flex" : "flex"
            }`}
          >
            <div className="p-4 border-b border-gray-100 bg-white space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-gray-400 uppercase tracking-widest">
                  Inbox
                </span>
                <Filter size={14} className="text-gray-400 cursor-pointer" />
              </div>
              <div className="relative">
                <Search
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                  size={16}
                />
                <input
                  type="text"
                  placeholder="Search patients..."
                  className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all"
                />
              </div>
            </div>

            <div className="flex-1 overflow-y-auto">
              {patientList.map((patient) => (
                <div
                  key={patient.id}
                  onClick={() => setActiveChat(patient.id)}
                  className={`flex items-center p-4 cursor-pointer border-b border-gray-50 transition-all ${
                    activeChat === patient.id
                      ? "bg-blue-50"
                      : "hover:bg-gray-50"
                  }`}
                >
                  <div className="relative shrink-0">
                    <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center border border-gray-200 shadow-sm">
                      <User className="text-gray-400" size={24} />
                    </div>
                    {patient.online && (
                      <div className="absolute bottom-0 right-0 w-3.5 h-3.5 bg-green-500 border-2 border-white rounded-full"></div>
                    )}
                  </div>
                  <div className="ml-3 flex-1 min-w-0">
                    <div className="flex justify-between items-center">
                      <h4 className="font-bold text-gray-800 text-sm truncate">
                        {patient.name}
                      </h4>
                      <span className="text-[10px] text-gray-400 font-medium">
                        {patient.time}
                      </span>
                    </div>
                    <p className="text-[10px] text-blue-600 font-bold">
                      Age: {patient.age}
                    </p>
                    <p className="text-xs text-gray-500 truncate mt-0.5">
                      {patient.lastMsg}
                    </p>
                  </div>
                  {patient.unread > 0 && (
                    <div className="ml-2 bg-blue-600 text-white text-[10px] font-bold w-5 h-5 rounded-full flex items-center justify-center shadow-md shadow-blue-200">
                      {patient.unread}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Chat Window */}
          <div
            className={`flex-1 flex flex-col bg-white ${
              !activeChat ? "hidden md:flex" : "flex"
            }`}
          >
            {activeChat ? (
              <>
                {/* Chat Header */}
                <div className="px-4 py-3 border-b border-gray-100 flex justify-between items-center bg-white shadow-sm z-10">
                  <div className="flex items-center">
                    <button
                      onClick={() => setActiveChat(null)}
                      className="md:hidden p-2 mr-1 text-gray-500 hover:bg-gray-100 rounded-full"
                    >
                      <ChevronLeft size={24} />
                    </button>
                    <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-full flex items-center justify-center text-white font-bold shadow-md">
                      <User size={20} />
                    </div>
                    <div className="ml-3">
                      <h3 className="font-bold text-gray-800 text-sm">
                        {patientList.find((p) => p.id === activeChat)?.name}
                      </h3>
                      <div className="flex items-center gap-1">
                        <div className="w-1.5 h-1.5 bg-green-500 rounded-full" />
                        <p className="text-[10px] text-green-500 font-bold uppercase tracking-tighter">
                          Connected
                        </p>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center space-x-1 sm:space-x-3 text-gray-400">
                    <button className="p-2 hover:bg-gray-100 rounded-full transition-colors hidden sm:block">
                      <Phone size={18} />
                    </button>
                    <button className="p-2 hover:bg-gray-100 rounded-full transition-colors hidden sm:block">
                      <Video size={18} />
                    </button>
                    <button className="p-2 hover:bg-gray-100 rounded-full transition-colors">
                      <MoreVertical size={18} />
                    </button>
                  </div>
                </div>

                {/* Messages Area (WhatsApp Style) */}
                <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-[#f0f2f5] shadow-inner">
                  {dummyMessages.map((msg) => (
                    <div
                      key={msg.id}
                      className={`flex ${
                        msg.sender === "doctor"
                          ? "justify-end"
                          : "justify-start"
                      }`}
                    >
                      <div
                        className={`max-w-[85%] sm:max-w-[70%] px-4 py-2.5 rounded-2xl shadow-sm text-sm leading-relaxed ${
                          msg.sender === "doctor"
                            ? "bg-blue-600 text-white rounded-tr-none"
                            : "bg-white text-gray-800 rounded-tl-none border border-gray-100"
                        }`}
                      >
                        <p>{msg.text}</p>
                        <div
                          className={`flex items-center justify-end mt-1 gap-1 ${
                            msg.sender === "doctor"
                              ? "text-blue-100"
                              : "text-gray-400"
                          }`}
                        >
                          <span className="text-[10px] font-medium">
                            {msg.time}
                          </span>
                          {msg.sender === "doctor" && <CheckCheck size={14} />}
                        </div>
                      </div>
                    </div>
                  ))}
                  <div ref={messagesEndRef} />
                </div>

                {/* Input Area */}
                <div className="p-3 bg-white border-t border-gray-200 flex items-center gap-2">
                  <button className="text-gray-400 hover:text-blue-600 p-2 hidden sm:block transition-colors">
                    <Smile size={22} />
                  </button>
                  <button className="text-gray-400 hover:text-blue-600 p-2 transition-colors">
                    <Paperclip size={20} />
                  </button>
                  <input
                    type="text"
                    value={messageInput}
                    onChange={(e) => setMessageInput(e.target.value)}
                    placeholder="Type instructions for patient..."
                    className="flex-1 bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-blue-100 focus:bg-white outline-none transition-all"
                  />
                  <button
                    className={`p-3 rounded-xl transition-all shadow-lg active:scale-95 ${
                      messageInput.trim()
                        ? "bg-blue-600 text-white shadow-blue-200"
                        : "bg-gray-200 text-gray-400"
                    }`}
                  >
                    <Send size={20} />
                  </button>
                </div>
              </>
            ) : (
              <div className="flex-1 flex flex-col items-center justify-center text-gray-400 bg-white">
                <div className="w-24 h-24 bg-blue-50 rounded-full flex items-center justify-center mb-6 animate-pulse">
                  <MessageSquare className="h-10 w-10 text-blue-300" />
                </div>
                <h3 className="text-gray-800 font-bold text-lg">
                  Patient Conversations
                </h3>
                <p className="text-sm max-w-[280px] text-center mt-2 text-gray-500">
                  Select a patient to view medical history and provide real-time
                  consultation.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>

      <style jsx>{`
        ::-webkit-scrollbar {
          width: 5px;
        }
        ::-webkit-scrollbar-track {
          background: transparent;
        }
        ::-webkit-scrollbar-thumb {
          background: #cbd5e1;
          border-radius: 10px;
        }
      `}</style>
    </div>
  );
}
