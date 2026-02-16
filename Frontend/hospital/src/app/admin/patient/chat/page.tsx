"use client";
import { useState, useRef, useEffect } from "react";
import { io } from "socket.io-client";
import Cookies from "js-cookie";
import {
  Send,
  Sparkles,
  Paperclip,
  StopCircle,
  PlusCircle,
  User,
} from "lucide-react";
import axios from "axios";
import { useSocket } from "../../../../../context/SocketContext";
import { useAuth } from "../../../../../context/AuthContext";

// Socket connection (ensure this matches your setup if context is not enough)
const socket = io(
  process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:5000",
  {
    auth: {
      token: Cookies.get("token"),
    },
    transports: ["websocket"],
  },
);

export default function AIAssistant() {
  // const socket = useSocket(); // Use context if preferred
  const { user } = useAuth();
  const [messages, setMessages] = useState<any[]>([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isLoading]); // Scroll on new message or loading state

  // Socket Events Setup
  useEffect(() => {
    if (!socket) return;

    socket.on("receive_message", (data) => {
      setMessages((prev) => [
        ...prev,
        { sender: "bot", text: data.reply, isAi: true },
      ]);
      setIsLoading(false);
    });

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

    return () => {
      socket.off("receive_message");
      socket.off("error");
    };
  }, [socket]);

  // Fetch history on load
  useEffect(() => {
    const fetchChatHistory = async () => {
      try {
        const res = await axios.get("/ai/userChat", { withCredentials: true });
        const formattedMessages: any[] = [];
        res.data.messages.forEach((msg: any) => {
          formattedMessages.push({ sender: "user", text: msg.question });
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

  const handleSend = (text = input) => {
    if (!text.trim() || !socket) return;

    const userMessage = { sender: "user", text };
    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setIsLoading(true);

    socket.emit("send_message", {
      message: text,
      history: messages,
    });
  };

  // NEW CHAT / DELETE API LOGIC
  const handleNewChat = async () => {
    try {
      const confirmDelete = window.confirm(
        "Start a new chat? This will clear your current history.",
      );
      if (!confirmDelete) return;

      await axios.delete("/ai/deleteChat", { withCredentials: true });
      setMessages([]);
    } catch (error) {
      console.error("Failed to delete chat history", error);
      alert("Error clearing history. Please try again.");
    }
  };

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
      title: "Report Analysis",
      sub: "Understand results",
      query: "Explain my recent blood test report.",
    },
  ];

  return (
    <div className="h-[calc(100vh-theme(spacing.20))] flex flex-col bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden font-sans relative">
      {/* Internal Header for Chat Actions */}
      <div className="flex items-center justify-between p-4 border-b border-gray-100 bg-white/80 backdrop-blur-sm z-10 sticky top-0">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-blue-600 to-indigo-600 flex items-center justify-center shadow-sm">
            <Sparkles className="w-4 h-4 text-white" />
          </div>
          <div>
            <h2 className="text-sm font-bold text-gray-800">Swasth Bot</h2>
            <p className="text-[10px] text-green-500 font-medium flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse"></span>
              Online
            </p>
          </div>
        </div>

        <button
          onClick={handleNewChat}
          className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors border border-gray-200 hover:border-blue-100"
        >
          <PlusCircle size={14} />
          <span>New Chat</span>
        </button>
      </div>

      {/* Chat Area */}
      <div className="flex-1 overflow-y-auto bg-gray-50/50 p-4 scroll-smooth">
        <div className="max-w-3xl mx-auto">
          {messages.length === 0 && (
            <div className="mt-8 md:mt-16 text-center space-y-6 animate-in fade-in zoom-in duration-500">
              <div className="w-16 h-16 bg-blue-100 text-blue-600 rounded-2xl mx-auto flex items-center justify-center mb-4 shadow-sm">
                <Sparkles className="w-8 h-8" />
              </div>
              <div>
                <h3 className="text-xl md:text-2xl font-bold text-gray-800 tracking-tight">
                  Hello, {user?.name || "Patient"}
                </h3>
                <p className="text-gray-500 max-w-sm mx-auto text-sm mt-2 leading-relaxed">
                  I'm your personal health assistant. Ask me about your reports,
                  finding doctors, or general health advice.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-left mt-8 max-w-2xl mx-auto">
                {suggestedActions.map((action, idx) => (
                  <button
                    key={idx}
                    onClick={() => handleSend(action.query)}
                    className="p-4 border border-gray-200 rounded-xl hover:border-blue-400 hover:shadow-md transition-all bg-white text-left group"
                  >
                    <h4 className="font-bold text-gray-800 text-xs mb-1 group-hover:text-blue-600 uppercase tracking-wide">
                      {action.title}
                    </h4>
                    <p className="text-xs text-gray-500 line-clamp-1">
                      {action.sub}
                    </p>
                  </button>
                ))}
              </div>
            </div>
          )}

          <div className="space-y-6 pb-4">
            {messages.map((msg, index) => (
              <div
                key={index}
                className={`flex gap-3 sm:gap-4 ${
                  msg.sender === "user" ? "justify-end" : "justify-start"
                }`}
              >
                {msg.sender === "bot" && (
                  <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-blue-600 to-indigo-600 flex items-center justify-center shrink-0 shadow-sm mt-1">
                    <Sparkles className="w-4 h-4 text-white" />
                  </div>
                )}

                <div
                  className={`max-w-[85%] sm:max-w-[75%] p-3.5 rounded-2xl text-sm leading-relaxed shadow-sm
                  ${
                    msg.sender === "user"
                      ? "bg-blue-600 text-white rounded-tr-none"
                      : "bg-white border border-gray-200 text-gray-800 rounded-tl-none"
                  }`}
                >
                  {msg.text}
                </div>

                {msg.sender === "user" && (
                  <div className="w-8 h-8 rounded-lg bg-gray-200 flex items-center justify-center shrink-0 mt-1 overflow-hidden">
                    {user?.profileImg ? (
                      <img
                        src={user.profileImg}
                        alt="User"
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <User className="w-4 h-4 text-gray-600" />
                    )}
                  </div>
                )}
              </div>
            ))}

            {isLoading && (
              <div className="flex gap-4">
                <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-blue-600 to-indigo-600 flex items-center justify-center shrink-0">
                  <Sparkles className="w-4 h-4 text-white" />
                </div>
                <div className="bg-white border border-gray-200 px-4 py-3 rounded-2xl rounded-tl-none shadow-sm flex items-center gap-1.5">
                  <div className="w-1.5 h-1.5 bg-blue-400 rounded-full animate-bounce [animation-delay:-0.3s]" />
                  <div className="w-1.5 h-1.5 bg-blue-400 rounded-full animate-bounce [animation-delay:-0.15s]" />
                  <div className="w-1.5 h-1.5 bg-blue-400 rounded-full animate-bounce" />
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>
        </div>
      </div>

      {/* Input Area */}
      <div className="p-4 bg-white border-t border-gray-100">
        <div className="max-w-3xl mx-auto">
          <div className="relative flex items-end gap-2 bg-gray-50 border border-gray-200 rounded-2xl p-2 focus-within:ring-2 focus-within:ring-blue-100 focus-within:border-blue-400 transition-all">
            <button className="p-2.5 text-gray-400 hover:text-gray-600 rounded-xl transition-colors hover:bg-gray-200/50">
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
              placeholder="Ask anything..."
              className="w-full bg-transparent border-none focus:ring-0 resize-none max-h-32 min-h-[44px] py-3 text-sm text-gray-800 placeholder-gray-400"
              rows={1}
            />

            <button
              onClick={() => handleSend()}
              disabled={!input.trim() || isLoading}
              className={`p-2.5 rounded-xl transition-all duration-200 ${
                input.trim()
                  ? "bg-blue-600 text-white shadow-md hover:bg-blue-700 hover:shadow-lg transform active:scale-95"
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
          <p className="text-center text-[10px] text-gray-400 mt-3 font-medium">
            AI can make mistakes. Please check with a doctor for serious
            concerns.
          </p>
        </div>
      </div>
    </div>
  );
}
