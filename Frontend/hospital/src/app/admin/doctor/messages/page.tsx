"use client";
import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import axios from "axios";
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
import { useSocket } from "../../../../../context/SocketContext";
import { useAuth } from "../../../../../context/AuthContext";

export default function DoctorMessagesPage() {
  const socket = useSocket();
  const { user } = useAuth(); // Doctor ki login details

  // State Management
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [activeChat, setActiveChat] = useState(null); // Selected Patient Object
  const [messageInput, setMessageInput] = useState("");
  const [messages, setMessages] = useState([]); // Selected chat history
  const [inbox, setInbox] = useState([]); // List of active conversations
  const [loading, setLoading] = useState(true);
  const [conversationId, setConversationId] = useState(null);
  const messagesEndRef = useRef(null);

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

  // 1. Fetch Doctor Inbox (Sirf wahi patients jinhone message bheja hai)
  useEffect(() => {
    const fetchInbox = async () => {
      try {
        setLoading(true);
        const res = await axios.get("/api/chat/inbox", {
          withCredentials: true,
        });
        setInbox(res.data.inbox);
      } catch (err) {
        console.error("Inbox fetch failed", err);
      } finally {
        setLoading(false);
      }
    };
    fetchInbox();
  }, []);

  // 2. Chat Select logic: Messages load karna aur Room join karna
  useEffect(() => {
    if (activeChat && socket) {
      const getChat = async () => {
        try {
          // activeChat._id patient ki ID hai
          const res = await axios.get(
            `/api/chat/conversation/${activeChat._id}`,
            {
              withCredentials: true,
            }
          );
          setConversationId(res.data.conversationId);
          setMessages(res.data.messages);

          // Socket room join karna
          socket.emit("join_chat", res.data.conversationId);
        } catch (err) {
          console.error("Failed to load conversation", err);
        }
      };
      getChat();
    }
  }, [activeChat, socket]);

  // 3. Real-time Listening (Incoming Patient Messages)
  // useEffect(() => {
  //   if (!socket) return;

  //   socket.on("receive_direct_message", (newMsg) => {
  //     if (newMsg.conversationId === conversationId) {
  //       setMessages((prev) => [...prev, newMsg]);
  //     }
  //   });

  //   return () => socket.off("receive_direct_message");
  // }, [socket, conversationId]);
  useEffect(() => {
    if (!socket || !conversationId) return;

    const handleNewMessage = (newMessage) => {
      // BUG FIX: Agar sender doctor khud hai, toh ignore
      if (String(newMessage.senderId) === String(user?.id || user?._id)) {
        return;
      }

      if (String(newMessage.conversationId) === String(conversationId)) {
        setMessages((prev) => {
          const isDuplicate = prev.some((m) => m._id === newMessage._id);
          if (isDuplicate) return prev;
          return [...prev, newMessage];
        });
      }
    };

    socket.on("receive_direct_message", handleNewMessage);
    return () => {
      socket.off("receive_direct_message", handleNewMessage);
    };
  }, [socket, conversationId, user]);
  // 4. Send Message Logic
  // const handleSendMessage = () => {
  //   if (!messageInput.trim() || !socket || !conversationId || !activeChat)
  //     return;

  //   const payload = {
  //     conversationId: conversationId,
  //     receiverId: activeChat._id, // Patient ID
  //     text: messageInput,
  //   };

  //   socket.emit("send_direct_message", payload);

  //   // Optimistic UI Update
  //   const localMsg = {
  //     senderId: user?.id || user?._id,
  //     text: messageInput,
  //     createdAt: new Date().toISOString(),
  //     conversationId: conversationId,
  //   };
  //   setMessages((prev) => [...prev, localMsg]);
  //   setMessageInput("");
  // };
  // const handleSendMessage = () => {
  //   if (!messageInput.trim() || !socket || !conversationId || !activeChat)
  //     return;

  //   const payload = {
  //     conversationId: conversationId,
  //     receiverId: activeChat, // Doctor side par activeChat patient ki ID hai
  //     text: messageInput,
  //   };

  //   socket.emit("send_direct_message", payload);

  //   // Optimistic UI: Backend ke emit hone ka wait na karein, turant dikhayein
  //   const localMsg = {
  //     senderId: user?.id || user?._id,
  //     text: messageInput,
  //     createdAt: new Date().toISOString(),
  //     conversationId: conversationId,
  //     _id: Date.now().toString(), // Temporary ID
  //   };
  //   setMessages((prev) => [...prev, localMsg]);
  //   setMessageInput("");
  // };

  const handleSendMessage = () => {
    if (!messageInput.trim() || !socket || !conversationId || !activeChat)
      return;

    const tempId = Date.now().toString();
    const payload = {
      conversationId: conversationId,
      receiverId: activeChat._id,
      text: messageInput,
    };

    socket.emit("send_direct_message", payload);

    const localMsg = {
      _id: tempId,
      senderId: user?.id || user?._id,
      text: messageInput,
      createdAt: new Date().toISOString(),
      conversationId: conversationId,
    };
    setMessages((prev) => [...prev, localMsg]);
    setMessageInput("");
  };

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  return (
    <div className="h-screen flex bg-gray-50 overflow-hidden font-sans">
      {/* Mobile Sidebar Overlay */}
      {isSidebarOpen && (
        <div
          className="fixed inset-0 bg-black/40 z-50 md:hidden"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* --- SIDEBAR --- */}
      <aside
        className={`fixed inset-y-0 left-0 z-50 w-64 bg-white shadow-xl transform transition-transform duration-300 md:relative md:translate-x-0 ${
          isSidebarOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="p-4 border-b flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-r from-blue-600 to-green-600 rounded-xl flex items-center justify-center text-white font-bold shadow-lg shadow-blue-100">
              D
            </div>
            <div>
              <h1 className="text-lg font-bold text-gray-800">Swasth-Raho</h1>
              <p className="text-[10px] text-gray-400 font-bold uppercase">
                Doctor Portal
              </p>
            </div>
          </div>
          <button className="md:hidden" onClick={() => setIsSidebarOpen(false)}>
            <X size={20} />
          </button>
        </div>
        <nav className="mt-4 flex-1 px-3 space-y-1">
          {sidebarItems.map((item) => (
            <Link
              key={item.id}
              href={item.route}
              className={`flex items-center px-4 py-3 rounded-xl transition-all ${
                item.id === "messages"
                  ? "bg-blue-600 text-white shadow-md shadow-blue-200 font-semibold"
                  : "text-gray-600 hover:bg-gray-100"
              }`}
            >
              <item.icon size={20} />
              <span className="ml-3 font-medium text-sm">{item.label}</span>
            </Link>
          ))}
        </nav>
      </aside>

      {/* --- MAIN CONTENT AREA --- */}
      <div className="flex-1 flex flex-col min-w-0">
        <header className="bg-white border-b border-gray-200 px-6 py-3 flex items-center justify-between sticky top-0 z-30">
          <div className="flex items-center">
            <button
              onClick={() => setIsSidebarOpen(true)}
              className="md:hidden p-2 mr-2 text-gray-600"
            >
              <Menu size={24} />
            </button>
            <h2 className="text-xl font-bold text-gray-800 tracking-tight">
              Patient Inquiries
            </h2>
          </div>
          <div className="flex items-center gap-3">
            <div className="hidden sm:block text-right">
              <p className="text-xs font-bold text-gray-800">{user?.name}</p>
              <p className="text-[10px] text-green-600 font-medium">Online</p>
            </div>
            <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center text-white border-2 border-white shadow-sm overflow-hidden">
              {user?.profileImg ? (
                <img
                  src={user.profileImg}
                  className="w-full h-full object-cover"
                />
              ) : (
                <User size={20} />
              )}
            </div>
          </div>
        </header>

        <div className="flex-1 flex overflow-hidden">
          {/* Inbox / Patient List */}
          <div
            className={`w-full md:w-80 lg:w-96 bg-white border-r border-gray-200 flex flex-col ${
              activeChat ? "hidden md:flex" : "flex"
            }`}
          >
            <div className="p-4 border-b space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-gray-400 uppercase tracking-widest">
                  Inbox
                </span>
                <Filter
                  size={14}
                  className="text-gray-400 cursor-pointer hover:text-blue-600"
                />
              </div>
              <div className="relative">
                <Search
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                  size={16}
                />
                <input
                  type="text"
                  placeholder="Search patients..."
                  className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>

            <div className="flex-1 overflow-y-auto">
              {loading ? (
                <div className="p-10 text-center text-sm text-gray-400">
                  Loading patients...
                </div>
              ) : inbox.length === 0 ? (
                <div className="p-10 text-center text-xs text-gray-400">
                  No active conversations found.
                </div>
              ) : (
                inbox.map((item) => (
                  <div
                    key={item.conversationId}
                    onClick={() => setActiveChat(item.patient)}
                    className={`flex items-center p-4 cursor-pointer border-b border-gray-50 transition-all ${
                      activeChat?._id === item.patient._id
                        ? "bg-blue-50 border-r-4 border-r-blue-600"
                        : "hover:bg-gray-50"
                    }`}
                  >
                    <div className="relative shrink-0">
                      <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center border border-gray-200 overflow-hidden shadow-sm text-gray-400">
                        {item.patient.profileImg ? (
                          <img
                            src={item.patient.profileImg}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <User size={24} />
                        )}
                      </div>
                      <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-white rounded-full"></div>
                    </div>
                    <div className="ml-3 flex-1 min-w-0">
                      <div className="flex justify-between items-center">
                        <h4 className="font-bold text-gray-800 text-sm truncate">
                          {item.patient.name}
                        </h4>
                        <span className="text-[10px] text-gray-400 font-medium">
                          {new Date(item.updatedAt).toLocaleTimeString([], {
                            hour: "2-digit",
                            minute: "2-digit",
                          })}
                        </span>
                      </div>
                      <p className="text-[10px] text-blue-600 font-bold">
                        Age: {item.patient.age || "N/A"}
                      </p>
                      <p className="text-xs text-gray-500 truncate mt-0.5">
                        {item.lastMessage?.text || "No messages yet"}
                      </p>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Active Chat Window */}
          <div
            className={`flex-1 flex flex-col bg-white ${
              !activeChat ? "hidden md:flex" : "flex"
            }`}
          >
            {activeChat ? (
              <>
                <div className="px-4 py-3 border-b flex justify-between items-center shadow-sm z-10 bg-white">
                  <div className="flex items-center">
                    <button
                      onClick={() => setActiveChat(null)}
                      className="md:hidden p-2 mr-1 text-gray-500 hover:bg-gray-100 rounded-full"
                    >
                      <ChevronLeft size={24} />
                    </button>
                    <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-full flex items-center justify-center text-white font-bold shadow-md">
                      {activeChat.profileImg ? (
                        <img
                          src={activeChat.profileImg}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        activeChat.name.charAt(0)
                      )}
                    </div>
                    <div className="ml-3">
                      <h3 className="font-bold text-gray-800 text-sm">
                        {activeChat.name}
                      </h3>
                      <div className="flex items-center gap-1">
                        <div className="w-1.5 h-1.5 bg-green-500 rounded-full" />
                        <p className="text-[10px] text-green-500 font-bold uppercase tracking-tight">
                          Active Connection
                        </p>
                      </div>
                    </div>
                  </div>
                  <div className="flex gap-4 text-gray-400 hidden sm:flex">
                    <Phone
                      size={18}
                      className="cursor-pointer hover:text-blue-600"
                    />
                    <Video
                      size={18}
                      className="cursor-pointer hover:text-blue-600"
                    />
                  </div>
                </div>

                <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-[#f0f2f5] shadow-inner">
                  {messages.map((msg, idx) => {
                    const isMe = msg.senderId === (user?.id || user?._id);
                    return (
                      <div
                        key={idx}
                        className={`flex ${
                          isMe ? "justify-end" : "justify-start"
                        }`}
                      >
                        <div
                          className={`max-w-[85%] sm:max-w-[70%] px-4 py-2.5 rounded-2xl text-sm shadow-sm leading-relaxed ${
                            isMe
                              ? "bg-blue-600 text-white rounded-tr-none"
                              : "bg-white text-gray-800 rounded-tl-none border border-gray-100"
                          }`}
                        >
                          <p>{msg.text}</p>
                          <div
                            className={`flex items-center justify-end mt-1 text-[10px] ${
                              isMe ? "text-blue-100" : "text-gray-400"
                            }`}
                          >
                            {new Date(msg.createdAt).toLocaleTimeString([], {
                              hour: "2-digit",
                              minute: "2-digit",
                            })}
                            {isMe && <CheckCheck size={12} className="ml-1" />}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                  <div ref={messagesEndRef} />
                </div>

                <div className="p-3 bg-white border-t border-gray-100 flex items-center gap-2">
                  <button className="text-gray-400 p-2 hover:bg-gray-100 rounded-lg transition-colors">
                    <Paperclip size={20} />
                  </button>
                  <input
                    type="text"
                    value={messageInput}
                    onChange={(e) => setMessageInput(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && handleSendMessage()}
                    placeholder="Type professional advice for patient..."
                    className="flex-1 bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-blue-100 focus:bg-white outline-none transition-all"
                  />
                  <button
                    onClick={handleSendMessage}
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
                  Patient Consultations
                </h3>
                <p className="text-sm max-w-[280px] text-center mt-2 text-gray-500 px-5">
                  Select a patient inquiry from the left to start providing
                  professional medical guidance.
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
