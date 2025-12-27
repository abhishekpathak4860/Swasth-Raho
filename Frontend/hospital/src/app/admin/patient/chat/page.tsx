"use client";
import React, { useState, useRef, useEffect } from "react";
import { io } from "socket.io-client";
import {
  Send,
  Bot,
  User,
  CalendarDays,
  Stethoscope,
  FileText,
  Hospital,
  Receipt,
  Sparkles,
  ChevronRight,
  Paperclip,
  StopCircle,
  MessageCircle,
} from "lucide-react";
import Link from "next/link";
import axios from "axios";
// import { useAuth } from "../../../../../context/AuthContext"; // Uncomment this in your real project

const socket = io(
  process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:5000",
  {
    withCredentials: true, // Cookies (token) bhejne ke liye zaruri hai
    transports: ["websocket"], // Sirf websocket use karein faster connection ke liye
  }
);

export default function AIAssistant() {
  // const { user } = useAuth(); // Uncomment in real project

  // Fake user for display purposes
  const user = { name: "Patient" };

  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef(null);

  // Auto-scroll to bottom
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // make socket connection
  useEffect(() => {
    // 1. AI reply ko sunne ke liye listener
    socket.on("receive_message", (data) => {
      setMessages((prev) => [
        ...prev,
        {
          sender: "bot",
          text: data.reply,
          isAi: true,
        },
      ]);
      setIsLoading(false);
    });

    // 2. Error handling listener
    socket.on("error", (err) => {
      console.error("Socket Error:", err.message);
      setMessages((prev) => [
        ...prev,
        {
          sender: "bot",
          text: "Sorry, I am unable to respond right now.",
          isAi: true,
        },
      ]);
      setIsLoading(false);
    });

    // Clean up listeners when component unmounts
    return () => {
      socket.off("receive_message");
      socket.off("error");
    };
  }, []);

  // const handleSend = async (text = input) => {
  //   if (!text.trim()) return;

  //   // 1 User message UI me add karo
  //   const userMessage = { sender: "user", text };
  //   setMessages((prev) => [...prev, userMessage]);

  //   setInput("");
  //   setIsLoading(true);

  //   try {
  //     // 2 Backend ko message + previous chat bhejo
  //     const res = await axios.post(
  //       "/ai/chat",
  //       {
  //         message: text,
  //         history: messages,
  //       },
  //       {
  //         withCredentials: true,
  //       }
  //     );

  //     // 3 AI reply UI me add karo
  //     setMessages((prev) => [
  //       ...prev,
  //       {
  //         sender: "bot",
  //         text: res.data.reply,
  //         isAi: true,
  //       },
  //     ]);
  //   } catch (err) {
  //     console.error(err);
  //     setMessages((prev) => [
  //       ...prev,
  //       {
  //         sender: "bot",
  //         text: "Sorry, I am unable to respond right now.",
  //         isAi: true,
  //       },
  //     ]);
  //   } finally {
  //     setIsLoading(false);
  //   }
  // };

  const handleSend = (text = input) => {
    if (!text.trim()) return;

    // UI mein user message dikhao
    const userMessage = { sender: "user", text };
    setMessages((prev) => [...prev, userMessage]);

    setInput("");
    setIsLoading(true);

    // 3. Backend ko message bhejo (Event-based)
    // Ab Axios.post ki zarurat nahi hai!
    socket.emit("send_message", {
      message: text,
      history: messages, // Current chat state
    });
  };

  // fetch user ai message chats

  useEffect(() => {
    const fetchChatHistory = async () => {
      try {
        const res = await axios.get("/ai/userChat", {
          withCredentials: true,
        });

        // Backend will send messages as:
        // [{ question, answer }, { question, answer }]
        const formattedMessages = [];

        res.data.messages.forEach((msg) => {
          formattedMessages.push({
            sender: "user",
            text: msg.question,
          });

          formattedMessages.push({
            sender: "bot",
            text: msg.answer,
            isAi: true,
          });
        });

        setMessages(formattedMessages);
      } catch (error) {
        console.error("Failed to load chat history", error);
      }
    };

    fetchChatHistory();
  }, []);

  // Suggested Prompts for Empty State
  const suggestedActions = [
    {
      title: "Find a Doctor",
      sub: "Specialists near you",
      query: "I need to find a heart specialist near me.",
    },
    {
      title: "Check Appointments",
      sub: "Upcoming schedules",
      query: "When is my next appointment?",
    },
    {
      title: "Medical Report Analysis",
      sub: "Understand your results",
      query: "Can you explain my recent blood test report?",
    },
  ];

  return (
    <div className="h-screen flex bg-gray-50 font-sans overflow-hidden">
      {/* ================= SIDEBAR (Kept mostly same) ================= */}
      <aside className="hidden md:flex flex-col w-64 bg-white border-r border-gray-200 h-screen z-10">
        <div className="p-5 border-b border-gray-100 flex items-center gap-3">
          <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-xl flex items-center justify-center text-white text-xl font-bold shadow-lg shadow-blue-200">
            S
          </div>
          <div>
            <h1 className="text-lg font-bold text-gray-800 tracking-tight">
              Swasth-Raho
            </h1>
            <p className="text-xs text-gray-500 font-medium">Patient Portal</p>
          </div>
        </div>

        <nav className="mt-6 flex-1 px-3 space-y-1">
          {[
            { label: "Profile", route: "/admin/patient", icon: User },
            {
              label: "Appointments",
              route: "/admin/patient/appointments",
              icon: CalendarDays,
            },
            {
              label: "Doctors",
              route: "/admin/patient/doctors",
              icon: Stethoscope,
            },
            {
              label: "Medical Reports",
              route: "/admin/patient/reports",
              icon: FileText,
            },
            {
              label: "Hospitals",
              route: "/admin/patient/hospitals",
              icon: Hospital,
            },
            { label: "Bills", route: "/admin/patient/bills", icon: Receipt },
            {
              label: "Swasth Bot",
              route: "/admin/patient/chat",
              icon: MessageCircle,
            },
          ].map((item) => (
            <Link
              key={item.route}
              href={item.route}
              className={`flex items-center px-3 py-2.5 rounded-xl transition-all duration-200 group
              ${
                item.label === "AI Health Assistant"
                  ? "bg-blue-50 text-blue-700 font-semibold shadow-inner"
                  : "text-gray-600 hover:bg-gray-100 hover:text-gray-900"
              }`}
            >
              <item.icon
                className={`w-5 h-5 ${
                  item.label === "AI Health Assistant"
                    ? "text-blue-600"
                    : "text-gray-400 group-hover:text-gray-600"
                }`}
              />
              <span className="ml-3 text-sm">{item.label}</span>
            </Link>
          ))}
        </nav>

        <div className="p-4 border-t">
          <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-3 rounded-xl border border-blue-100">
            <p className="text-xs text-blue-800 font-medium mb-1">
              Premium Plan
            </p>
            <p className="text-[10px] text-blue-600">
              Get unlimited AI consultations.
            </p>
          </div>
        </div>
      </aside>

      {/* ================= MAIN CONTENT ================= */}
      <div className="flex-1 flex flex-col relative bg-white">
        {/* Header */}
        <header className="bg-white/80 backdrop-blur-md border-b border-gray-100 p-4 flex justify-between items-center sticky top-0 z-20">
          <div className="flex items-center gap-2">
            <MessageCircle className="w-5 h-5 text-blue-600" />
            <h2 className="text-xl font-bold text-gray-800">Swasth Bot</h2>
            {/* <span className="bg-green-100 text-green-700 text-xs px-2 py-0.5 rounded-full font-medium">
              Beta
            </span> */}
          </div>
          <div className="text-sm text-gray-500">
            Connected to Swasth-Raho Database
          </div>
        </header>

        {/* Chat Area */}
        <div className="flex-1 overflow-y-auto custom-scrollbar">
          <div className="max-w-3xl mx-auto px-4 py-8">
            {/* Empty State (If no messages) */}
            {messages.length === 0 && (
              <div className="mt-12 text-center space-y-6 animate-in fade-in zoom-in duration-500">
                <div className="w-16 h-16 bg-blue-100 text-blue-600 rounded-2xl mx-auto flex items-center justify-center mb-4">
                  <Sparkles className="w-8 h-8" />
                </div>
                <h3 className="text-2xl font-bold text-gray-800">
                  Hello, {user?.name || "Patient"}
                </h3>
                <p className="text-gray-500 max-w-md mx-auto">
                  I can help you find doctors, analyze reports, or schedule
                  appointments within the Swasth-Raho ecosystem.
                </p>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-left mt-8">
                  {suggestedActions.map((action, idx) => (
                    <button
                      key={idx}
                      onClick={() => handleSend(action.query)}
                      className="p-4 border border-gray-200 rounded-xl hover:border-blue-400 hover:shadow-md transition-all bg-white group"
                    >
                      <h4 className="font-semibold text-gray-800 text-sm mb-1 group-hover:text-blue-600">
                        {action.title}
                      </h4>
                      <p className="text-xs text-gray-500">{action.sub}</p>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Message History */}
            <div className="space-y-6">
              {messages.map((msg, index) => (
                <div
                  key={index}
                  className={`flex gap-4 ${
                    msg.sender === "user" ? "justify-end" : "justify-start"
                  }`}
                >
                  {/* Bot Avatar */}
                  {msg.sender === "bot" && (
                    <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-blue-600 to-indigo-600 flex items-center justify-center shrink-0 shadow-md">
                      <Sparkles className="w-4 h-4 text-white" />
                    </div>
                  )}

                  <div
                    className={`max-w-[80%] p-4 rounded-2xl text-sm leading-relaxed shadow-sm ${
                      msg.sender === "user"
                        ? "bg-gray-900 text-white rounded-tr-sm"
                        : "bg-white border border-gray-100 text-gray-800 rounded-tl-sm"
                    }`}
                  >
                    {msg.text}
                  </div>

                  {/* User Avatar */}
                  {msg.sender === "user" && (
                    <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center shrink-0">
                      <User className="w-4 h-4 text-gray-600" />
                    </div>
                  )}
                </div>
              ))}

              {/* Loading Indicator */}
              {isLoading && (
                <div className="flex gap-4">
                  <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-blue-600 to-indigo-600 flex items-center justify-center shrink-0">
                    <Sparkles className="w-4 h-4 text-white" />
                  </div>
                  <div className="bg-white border border-gray-100 px-4 py-3 rounded-2xl rounded-tl-sm shadow-sm flex items-center gap-1">
                    <div
                      className="w-2 h-2 bg-blue-400 rounded-full animate-bounce"
                      style={{ animationDelay: "0ms" }}
                    />
                    <div
                      className="w-2 h-2 bg-blue-400 rounded-full animate-bounce"
                      style={{ animationDelay: "150ms" }}
                    />
                    <div
                      className="w-2 h-2 bg-blue-400 rounded-full animate-bounce"
                      style={{ animationDelay: "300ms" }}
                    />
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>
          </div>
        </div>

        {/* Input Area */}
        <div className="p-4 bg-white/80 backdrop-blur-sm border-t border-gray-100">
          <div className="max-w-3xl mx-auto relative">
            <div className="relative flex items-end gap-2 bg-gray-50 border border-gray-200 rounded-2xl p-2 focus-within:ring-2 focus-within:ring-blue-100 focus-within:border-blue-400 transition-all shadow-sm">
              <button className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-200 rounded-xl transition-colors">
                <Paperclip className="w-5 h-5" />
              </button>

              <textarea
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && !e.shiftKey) {
                    e.preventDefault();
                    handleSend();
                  }
                }}
                placeholder="Ask about your reports, doctors, or hospitals..."
                className="w-full bg-transparent border-none focus:ring-0 resize-none max-h-32 min-h-[44px] py-3 text-gray-800 placeholder:text-gray-400 text-sm"
                rows={1}
              />

              <button
                onClick={() => handleSend()}
                disabled={!input.trim() || isLoading}
                className={`p-2 rounded-xl transition-all duration-200 ${
                  input.trim()
                    ? "bg-blue-600 text-white shadow-lg shadow-blue-200 hover:bg-blue-700"
                    : "bg-gray-200 text-gray-400 cursor-not-allowed"
                }`}
              >
                {isLoading ? (
                  <StopCircle className="w-5 h-5" />
                ) : (
                  <Send className="w-5 h-5" />
                )}
              </button>
            </div>
            <p className="text-center text-[10px] text-gray-400 mt-2">
              AI can make mistakes. Please check with a real doctor for medical
              advice.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
