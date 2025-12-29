"use client";
import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import {
  User,
  CalendarDays,
  Stethoscope,
  FileText,
  Hospital,
  Receipt,
  MessageCircle,
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
} from "lucide-react";

export default function PatientMessagesPage() {
  // State Management
  const [activeTab, setActiveTab] = useState("messages");
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [activeChat, setActiveChat] = useState(null); // null shows welcome screen on desktop
  const [messageInput, setMessageInput] = useState("");
  const messagesEndRef = useRef(null);

  // Fake User Data
  const user = {
    name: "Ayush Pal",
    email: "pal@gmail.com",
    role: "patient",
    profileImg: "",
  };

  const sidebarItems = [
    { id: "profile", label: "Profile", icon: User, route: "/admin/patient" },
    {
      id: "appointments",
      label: "Appointments",
      icon: CalendarDays,
      route: "/admin/patient/appointments",
    },
    {
      id: "doctors",
      label: "Doctors",
      icon: Stethoscope,
      route: "/admin/patient/doctors",
    },
    {
      id: "reports",
      label: "Medical Reports",
      icon: FileText,
      route: "/admin/patient/reports",
    },
    {
      id: "hospitals",
      label: "Hospitals",
      icon: Hospital,
      route: "/admin/patient/hospitals",
    },
    {
      id: "bills",
      label: "Bills",
      icon: Receipt,
      route: "/admin/patient/bills",
    },
    {
      id: "chat",
      label: "Swasth Bot",
      icon: MessageCircle,
      route: "/admin/patient/chat",
    },
    {
      id: "messages",
      label: "Messages",
      icon: MessageSquare,
      route: "/admin/patient/messages",
    },
  ];

  const chatList = [
    {
      id: 1,
      name: "Dr. Ayush Pal",
      specialty: "Cardiologist",
      lastMsg: "Please bring your reports tomorrow.",
      time: "10:30 AM",
      unread: 2,
      online: true,
    },
    {
      id: 2,
      name: "Dr. Sarah Khan",
      specialty: "Neurologist",
      lastMsg: "The prescription has been updated.",
      time: "9:15 AM",
      unread: 0,
      online: false,
    },
    {
      id: 3,
      name: "Dr. Amit Verma",
      specialty: "General Physician",
      lastMsg: "How are you feeling now?",
      time: "Yesterday",
      unread: 0,
      online: true,
    },
  ];

  const dummyMessages = [
    {
      id: 1,
      sender: "doctor",
      text: "Hello Ayush, I reviewed your blood tests.",
      time: "10:00 AM",
    },
    {
      id: 2,
      sender: "patient",
      text: "Thank you doctor. Is everything normal?",
      time: "10:05 AM",
    },
    {
      id: 3,
      sender: "doctor",
      text: "Yes, but your cholesterol is slightly high.",
      time: "10:10 AM",
    },
    {
      id: 4,
      sender: "doctor",
      text: "Please bring your reports tomorrow.",
      time: "10:30 AM",
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

      {/* --- Sidebar --- */}
      <aside
        className={`fixed inset-y-0 left-0 z-50 w-64 bg-white shadow-xl transform transition-transform duration-300 md:relative md:translate-x-0 ${
          isSidebarOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="p-4 border-b flex items-center justify-between">
          <div className="flex items-center">
            <div className="w-10 h-10 bg-gradient-to-r from-blue-600 to-green-600 rounded-xl flex items-center justify-center shadow-lg shadow-blue-200">
              <span className="text-white font-bold text-xl">S</span>
            </div>
            <div className="ml-3">
              <h1 className="text-lg font-bold text-gray-800">Swasth-Raho</h1>
              <p className="text-[10px] text-gray-500 font-bold uppercase tracking-wider">
                Patient Portal
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
                  ? "bg-blue-600 text-white shadow-md shadow-blue-200"
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
              Messages
            </h2>
          </div>

          <div className="flex items-center gap-3">
            <div className="relative">
              <button
                onClick={() => setShowProfileMenu(!showProfileMenu)}
                className="flex items-center gap-3 p-1 rounded-full hover:bg-gray-100 transition-colors"
              >
                <div className="w-9 h-9 bg-blue-500 rounded-full flex items-center justify-center text-white border-2 border-white shadow-sm overflow-hidden">
                  <User size={20} />
                </div>
                <div className="hidden sm:block text-left mr-2">
                  <p className="text-xs font-bold text-gray-800 leading-none">
                    {user.name}
                  </p>
                  <p className="text-[10px] text-gray-500">{user.role}</p>
                </div>
              </button>
            </div>
          </div>
        </header>

        {/* --- Chat Content --- */}
        <div className="flex-1 flex overflow-hidden">
          {/* Chat List (Hides on mobile when a chat is active) */}
          <div
            className={`w-full md:w-80 lg:w-96 bg-white border-r border-gray-200 flex flex-col ${
              activeChat ? "hidden md:flex" : "flex"
            }`}
          >
            <div className="p-4 border-b border-gray-100 bg-white">
              <div className="relative">
                <Search
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                  size={16}
                />
                <input
                  type="text"
                  placeholder="Search doctors..."
                  className="w-full pl-10 pr-4 py-2.5 bg-gray-100 border-none rounded-xl text-sm focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>

            <div className="flex-1 overflow-y-auto">
              {chatList.map((chat) => (
                <div
                  key={chat.id}
                  onClick={() => setActiveChat(chat.id)}
                  className={`flex items-center p-4 cursor-pointer border-b border-gray-50 transition-all ${
                    activeChat === chat.id ? "bg-blue-50" : "hover:bg-gray-50"
                  }`}
                >
                  <div className="relative shrink-0">
                    <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center border border-blue-200">
                      <User className="text-blue-600" size={24} />
                    </div>
                    {chat.online && (
                      <div className="absolute bottom-0 right-0 w-3.5 h-3.5 bg-green-500 border-2 border-white rounded-full"></div>
                    )}
                  </div>
                  <div className="ml-3 flex-1 min-w-0">
                    <div className="flex justify-between items-center">
                      <h4 className="font-bold text-gray-800 text-sm truncate">
                        {chat.name}
                      </h4>
                      <span className="text-[10px] text-gray-400 font-medium">
                        {chat.time}
                      </span>
                    </div>
                    <p className="text-xs text-blue-600 font-medium truncate">
                      {chat.specialty}
                    </p>
                    <p className="text-xs text-gray-500 truncate mt-0.5">
                      {chat.lastMsg}
                    </p>
                  </div>
                  {chat.unread > 0 && (
                    <div className="ml-2 bg-blue-600 text-white text-[10px] font-bold w-5 h-5 rounded-full flex items-center justify-center">
                      {chat.unread}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Chat Window (Full width on mobile when active) */}
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
                    <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center text-white font-bold shadow-md shadow-blue-100">
                      {chatList
                        .find((c) => c.id === activeChat)
                        ?.name.charAt(4)}
                    </div>
                    <div className="ml-3">
                      <h3 className="font-bold text-gray-800 text-sm">
                        {chatList.find((c) => c.id === activeChat)?.name}
                      </h3>
                      <div className="flex items-center gap-1">
                        <div className="w-1.5 h-1.5 bg-green-500 rounded-full" />
                        <p className="text-[10px] text-green-500 font-bold">
                          Online
                        </p>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2 text-gray-400">
                    <button className="p-2 hover:bg-gray-100 rounded-full transition-colors">
                      <Phone size={18} />
                    </button>
                    <button className="p-2 hover:bg-gray-100 rounded-full transition-colors">
                      <Video size={18} />
                    </button>
                    <button className="p-2 hover:bg-gray-100 rounded-full transition-colors">
                      <MoreVertical size={18} />
                    </button>
                  </div>
                </div>

                {/* Messages */}
                <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-[#f8fafc]">
                  {dummyMessages.map((msg) => (
                    <div
                      key={msg.id}
                      className={`flex ${
                        msg.sender === "patient"
                          ? "justify-end"
                          : "justify-start"
                      }`}
                    >
                      <div
                        className={`max-w-[85%] sm:max-w-[70%] px-4 py-2.5 rounded-2xl shadow-sm text-sm leading-relaxed ${
                          msg.sender === "patient"
                            ? "bg-blue-600 text-white rounded-tr-none"
                            : "bg-white text-gray-800 rounded-tl-none border border-gray-100"
                        }`}
                      >
                        <p>{msg.text}</p>
                        <div
                          className={`flex items-center justify-end mt-1 gap-1 ${
                            msg.sender === "patient"
                              ? "text-blue-100"
                              : "text-gray-400"
                          }`}
                        >
                          <span className="text-[10px] font-medium">
                            {msg.time}
                          </span>
                          {msg.sender === "patient" && <CheckCheck size={14} />}
                        </div>
                      </div>
                    </div>
                  ))}
                  <div ref={messagesEndRef} />
                </div>

                {/* Input Area */}
                <div className="p-3 bg-white border-t border-gray-100 flex items-center gap-2">
                  <button className="text-gray-400 hover:text-blue-600 p-2 hidden sm:block">
                    <Smile size={22} />
                  </button>
                  <button className="text-gray-400 hover:text-blue-600 p-2">
                    <Paperclip size={20} />
                  </button>
                  <input
                    type="text"
                    value={messageInput}
                    onChange={(e) => setMessageInput(e.target.value)}
                    placeholder="Type a message..."
                    className="flex-1 bg-gray-100 border-none rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-blue-100 transition-all outline-none"
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
              <div className="flex-1 flex flex-col items-center justify-center text-gray-400 bg-gray-50">
                <div className="w-20 h-20 bg-white rounded-3xl flex items-center justify-center shadow-sm mb-4">
                  <MessageSquare className="h-10 w-10 text-blue-200" />
                </div>
                <h3 className="text-gray-800 font-bold">Your Messages</h3>
                <p className="text-xs max-w-[200px] text-center mt-1">
                  Select a doctor from the list to view the conversation.
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
          background: #e2e8f0;
          border-radius: 10px;
        }
        ::-webkit-scrollbar-thumb:hover {
          background: #cbd5e1;
        }
      `}</style>
    </div>
  );
}
