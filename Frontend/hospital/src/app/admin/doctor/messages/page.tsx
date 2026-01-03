// "use client";
// import React, { useState, useEffect, useRef } from "react";
// import Link from "next/link";
// import axios from "axios";
// import {
//   User,
//   CalendarDays,
//   Users,
//   Wallet,
//   MessageSquare,
//   Search,
//   Phone,
//   Video,
//   Send,
//   Paperclip,
//   Smile,
//   CheckCheck,
//   Menu,
//   X,
//   ChevronLeft,
//   Filter,
//   VideoOff,
//   Mic,
//   MicOff,
//   PhoneOff,
// } from "lucide-react";
// import { useSocket } from "../../../../../context/SocketContext";
// import { useAuth } from "../../../../../context/AuthContext";

// export default function DoctorMessagesPage() {
//   const socket = useSocket();
//   const { user } = useAuth();

//   // State Management
//   const [isSidebarOpen, setIsSidebarOpen] = useState(false);
//   const [activeChat, setActiveChat] = useState(null);
//   const [messageInput, setMessageInput] = useState("");
//   const [messages, setMessages] = useState([]);
//   const [inbox, setInbox] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [conversationId, setConversationId] = useState(null);
//   const [searchTerm, setSearchTerm] = useState("");
//   const messagesEndRef = useRef(null);

//   // --- VIDEO CALL STATE ---
//   const [isCalling, setIsCalling] = useState(false);
//   const [isIncomingCall, setIsIncomingCall] = useState(false);
//   const [isCallAccepted, setIsCallAccepted] = useState(false);

//   const localVideoRef = useRef(null);
//   const remoteVideoRef = useRef(null);

//   // Audio References
//   const sendSoundRef = useRef(null);
//   const receiveSoundRef = useRef(null);

//   // Refs to handle stale state in socket listeners
//   const activeChatRef = useRef(null);
//   const conversationIdRef = useRef(null);

//   useEffect(() => {
//     activeChatRef.current = activeChat;
//   }, [activeChat]);
//   useEffect(() => {
//     conversationIdRef.current = conversationId;
//   }, [conversationId]);

//   // Initialize sounds on mount
//   useEffect(() => {
//     sendSoundRef.current = new Audio("/sounds/send.mp3");
//     receiveSoundRef.current = new Audio("/sounds/receive.wav");
//   }, []);

//   const playSendSound = () => {
//     if (sendSoundRef.current) {
//       sendSoundRef.current.currentTime = 0;
//       sendSoundRef.current.play().catch((e) => console.log("Sound error:", e));
//     }
//   };

//   const playReceiveSound = () => {
//     if (receiveSoundRef.current) {
//       receiveSoundRef.current.currentTime = 0;
//       receiveSoundRef.current
//         .play()
//         .catch((e) => console.log("Sound error:", e));
//     }
//   };

//   const sidebarItems = [
//     { id: "profile", label: "Profile", icon: User, route: "/admin/doctor" },
//     {
//       id: "appointments",
//       label: "Appointments",
//       icon: CalendarDays,
//       route: "/admin/doctor/appointments",
//     },
//     {
//       id: "patients",
//       label: "Patients",
//       icon: Users,
//       route: "/admin/doctor/patients",
//     },
//     {
//       id: "revenue",
//       label: "Revenue",
//       icon: Wallet,
//       route: "/admin/doctor/revenue",
//     },
//     {
//       id: "messages",
//       label: "Messages",
//       icon: MessageSquare,
//       route: "/admin/doctor/messages",
//     },
//   ];

//   const fetchInbox = async () => {
//     try {
//       setLoading(true);
//       const res = await axios.get("/api/chat/inbox", { withCredentials: true });
//       setInbox(res.data.inbox);
//     } catch (err) {
//       console.error("Inbox fetch failed", err);
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     fetchInbox();
//   }, []);

//   const filteredInbox = inbox.filter((item) =>
//     item.patient.name.toLowerCase().includes(searchTerm.toLowerCase())
//   );

//   useEffect(() => {
//     if (activeChat && socket) {
//       const getChat = async () => {
//         try {
//           const res = await axios.get(
//             `/api/chat/conversation/${activeChat._id}`,
//             { withCredentials: true }
//           );
//           setConversationId(res.data.conversationId);
//           setMessages(res.data.messages);
//           socket.emit("join_chat", res.data.conversationId);
//           await axios.patch(
//             `/api/chat/read/${res.data.conversationId}`,
//             {},
//             { withCredentials: true }
//           );
//           setInbox((prev) =>
//             prev.map((item) =>
//               item.patient._id === activeChat._id
//                 ? { ...item, unreadCount: 0 }
//                 : item
//             )
//           );
//         } catch (err) {
//           console.error(err);
//         }
//       };
//       getChat();
//     }
//   }, [activeChat, socket]);

//   useEffect(() => {
//     if (!socket) return;
//     const handleNewMessage = (newMessage) => {
//       const senderId = String(newMessage.senderId);
//       const currentUserId = String(user?.id || user?._id);
//       setInbox((prevInbox) => {
//         const itemIndex = prevInbox.findIndex(
//           (item) =>
//             item.patient._id === senderId ||
//             item.patient._id === newMessage.receiverId
//         );
//         let updatedInbox = [...prevInbox];
//         if (itemIndex !== -1) {
//           const targetItem = { ...updatedInbox[itemIndex] };
//           const isChatOpenWithSender =
//             activeChatRef.current && activeChatRef.current._id === senderId;
//           if (senderId !== currentUserId) {
//             playReceiveSound();
//             if (!isChatOpenWithSender) {
//               targetItem.unreadCount = (targetItem.unreadCount || 0) + 1;
//             }
//           }
//           targetItem.lastMessage = { text: newMessage.text };
//           targetItem.updatedAt = newMessage.createdAt;
//           updatedInbox.splice(itemIndex, 1);
//           updatedInbox.unshift(targetItem);
//         } else {
//           fetchInbox();
//         }
//         return updatedInbox;
//       });
//       if (
//         conversationIdRef.current &&
//         String(newMessage.conversationId) === String(conversationIdRef.current)
//       ) {
//         if (senderId === currentUserId) return;
//         setMessages((prev) =>
//           prev.some((m) => m._id === newMessage._id)
//             ? prev
//             : [...prev, newMessage]
//         );
//       }
//     };
//     socket.on("receive_direct_message", handleNewMessage);
//     return () => {
//       socket.off("receive_direct_message", handleNewMessage);
//     };
//   }, [socket, user]);

//   const handleSendMessage = () => {
//     if (!messageInput.trim() || !socket || !conversationId || !activeChat)
//       return;
//     playSendSound();
//     const tempId = "temp-" + Date.now();
//     socket.emit("send_direct_message", {
//       conversationId,
//       receiverId: activeChat._id,
//       text: messageInput,
//     });
//     setMessages((prev) => [
//       ...prev,
//       {
//         _id: tempId,
//         senderId: user?.id || user?._id,
//         text: messageInput,
//         createdAt: new Date().toISOString(),
//         conversationId,
//       },
//     ]);
//     setInbox((prev) => {
//       const idx = prev.findIndex((item) => item.patient._id === activeChat._id);
//       if (idx === -1) return prev;
//       const updated = [...prev];
//       const target = {
//         ...updated[idx],
//         lastMessage: { text: messageInput },
//         updatedAt: new Date().toISOString(),
//       };
//       updated.splice(idx, 1);
//       updated.unshift(target);
//       return updated;
//     });
//     setMessageInput("");
//   };

//   useEffect(() => {
//     messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
//   }, [messages]);

//   // --- VIDEO UI TOGGLE FUNCTIONS ---
//   const startVideoCall = () => {
//     setIsCalling(true);
//   };
//   const endCall = () => {
//     setIsCalling(false);
//     setIsIncomingCall(false);
//     setIsCallAccepted(false);
//   };

//   return (
//     <div className="h-screen flex bg-gray-50 overflow-hidden font-sans text-black">
//       {isSidebarOpen && (
//         <div
//           className="fixed inset-0 bg-black/40 z-50 md:hidden"
//           onClick={() => setIsSidebarOpen(false)}
//         />
//       )}
//       <aside
//         className={`fixed inset-y-0 left-0 z-50 w-64 bg-white shadow-xl transform transition-transform duration-300 md:relative md:translate-x-0 ${
//           isSidebarOpen ? "translate-x-0" : "-translate-x-full"
//         }`}
//       >
//         <div className="p-4 border-b flex items-center justify-between">
//           <div className="flex items-center gap-3">
//             <div className="w-10 h-10 bg-gradient-to-r from-blue-600 to-green-600 rounded-xl flex items-center justify-center text-white font-bold shadow-lg shadow-blue-100">
//               D
//             </div>
//             <div>
//               <h1 className="text-lg font-bold text-gray-800">Swasth-Raho</h1>
//               <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">
//                 Doctor Portal
//               </p>
//             </div>
//           </div>
//           <button className="md:hidden" onClick={() => setIsSidebarOpen(false)}>
//             <X size={20} />
//           </button>
//         </div>
//         <nav className="mt-4 flex-1 px-3 space-y-1 overflow-y-auto">
//           {sidebarItems.map((item) => (
//             <Link
//               key={item.id}
//               href={item.route}
//               className={`flex items-center px-4 py-3 rounded-xl transition-all ${
//                 item.id === "messages"
//                   ? "bg-blue-600 text-white shadow-md shadow-blue-200 font-semibold"
//                   : "text-gray-600 hover:bg-gray-100"
//               }`}
//             >
//               <item.icon size={20} />
//               <span className="ml-3 font-medium text-sm">{item.label}</span>
//             </Link>
//           ))}
//         </nav>
//       </aside>

//       <div className="flex-1 flex flex-col min-w-0 relative">
//         <header className="bg-white border-b border-gray-200 px-6 py-3 flex justify-between items-center sticky top-0 z-30">
//           <div className="flex items-center">
//             <button
//               onClick={() => setIsSidebarOpen(true)}
//               className="md:hidden p-2 mr-2 text-gray-600"
//             >
//               <Menu size={24} />
//             </button>
//             <h2 className="text-xl font-bold text-gray-800 tracking-tight">
//               Patient Inquiries
//             </h2>
//           </div>
//           <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center text-white border-2 border-white shadow-sm overflow-hidden">
//             {user?.profileImg ? (
//               <img
//                 src={user.profileImg}
//                 className="w-full h-full object-cover"
//               />
//             ) : (
//               <User size={20} />
//             )}
//           </div>
//         </header>

//         <div className="flex-1 flex overflow-hidden">
//           {/* Sidebar Area */}
//           <div
//             className={`w-full md:w-80 lg:w-96 bg-white border-r border-gray-200 flex flex-col ${
//               activeChat ? "hidden md:flex" : "flex"
//             }`}
//           >
//             <div className="p-4 border-b space-y-3">
//               <div className="flex items-center justify-between">
//                 <span className="text-xs font-bold text-gray-400 uppercase tracking-widest">
//                   Inbox
//                 </span>
//                 <Filter size={14} className="text-gray-400 cursor-pointer" />
//               </div>
//               <div className="relative">
//                 <Search
//                   className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
//                   size={16}
//                 />
//                 <input
//                   type="text"
//                   value={searchTerm}
//                   onChange={(e) => setSearchTerm(e.target.value)}
//                   placeholder="Search patients..."
//                   className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-blue-500 outline-none transition-all shadow-sm"
//                 />
//               </div>
//             </div>
//             <div className="flex-1 overflow-y-auto">
//               {loading ? (
//                 <div className="p-10 text-center text-sm text-gray-400">
//                   Loading...
//                 </div>
//               ) : inbox.length === 0 ? (
//                 <div className="p-10 text-center text-xs text-gray-400 font-bold italic">
//                   No active conversations.
//                 </div>
//               ) : (
//                 filteredInbox.map((item) => (
//                   <div
//                     key={item.conversationId}
//                     onClick={() => setActiveChat(item.patient)}
//                     className={`flex items-center p-4 cursor-pointer border-b border-gray-50 transition-all ${
//                       activeChat?._id === item.patient._id
//                         ? "bg-blue-50 border-r-4 border-r-blue-600 shadow-inner"
//                         : "hover:bg-gray-50"
//                     }`}
//                   >
//                     <div className="relative shrink-0">
//                       <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center border border-gray-200 overflow-hidden shadow-sm">
//                         {item.patient.profileImg ? (
//                           <img
//                             src={item.patient.profileImg}
//                             className="w-full h-full object-cover"
//                           />
//                         ) : (
//                           <User size={24} className="text-gray-400" />
//                         )}
//                       </div>
//                       <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-white rounded-full"></div>
//                     </div>
//                     <div className="ml-3 flex-1 min-w-0">
//                       <div className="flex justify-between items-center">
//                         <h4 className="font-bold text-gray-800 text-sm truncate">
//                           {item.patient.name}
//                         </h4>
//                         {item.unreadCount > 0 && (
//                           <span className="bg-green-500 text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full min-w-[18px] text-center animate-pulse">
//                             {item.unreadCount}
//                           </span>
//                         )}
//                       </div>
//                       <p className="text-[10px] text-blue-600 font-bold">
//                         Age: {item.patient.age || "N/A"}
//                       </p>
//                       <p className="text-xs text-gray-500 truncate mt-0.5">
//                         {item.lastMessage?.text || "No messages yet"}
//                       </p>
//                     </div>
//                   </div>
//                 ))
//               )}
//             </div>
//           </div>

//           {/* Chat / Video Window Area */}
//           <div
//             className={`flex-1 flex flex-col relative ${
//               !activeChat ? "hidden md:flex" : "flex"
//             }`}
//           >
//             {activeChat ? (
//               <>
//                 {/* --- VIDEO CALL OVERLAY UI --- */}
//                 {(isCalling || isIncomingCall) && (
//                   <div className="absolute inset-0 z-50 bg-slate-900 flex flex-col items-center justify-center text-white">
//                     <div className="absolute inset-0 overflow-hidden flex items-center justify-center bg-black">
//                       {isCallAccepted ? (
//                         <video
//                           ref={remoteVideoRef}
//                           autoPlay
//                           playsInline
//                           className="w-full h-full object-cover"
//                         />
//                       ) : (
//                         <div className="flex flex-col items-center space-y-4">
//                           <div className="w-24 h-24 rounded-full bg-blue-600 flex items-center justify-center text-4xl font-bold border-4 border-white animate-pulse">
//                             {activeChat.name.charAt(0)}
//                           </div>
//                           <h2 className="text-2xl font-bold">
//                             {isIncomingCall
//                               ? "Incoming Consultation Request..."
//                               : "Calling Patient..."}
//                           </h2>
//                           <p className="text-gray-400">{activeChat.name}</p>
//                         </div>
//                       )}
//                     </div>
//                     <div className="absolute top-6 right-6 w-32 md:w-48 aspect-video bg-gray-800 rounded-2xl border-2 border-white/20 shadow-2xl overflow-hidden z-20">
//                       <video
//                         ref={localVideoRef}
//                         autoPlay
//                         playsInline
//                         muted
//                         className="w-full h-full object-cover bg-slate-700"
//                       />
//                     </div>
//                     <div className="absolute bottom-10 flex items-center space-x-6 z-30">
//                       <button className="p-4 bg-gray-700/80 hover:bg-gray-600 rounded-full transition-all backdrop-blur-md">
//                         <Mic size={24} />
//                       </button>
//                       <button className="p-4 bg-gray-700/80 hover:bg-gray-600 rounded-full transition-all backdrop-blur-md">
//                         <VideoOff size={24} />
//                       </button>
//                       {isIncomingCall && !isCallAccepted && (
//                         <button
//                           onClick={() => setIsCallAccepted(true)}
//                           className="p-4 bg-green-500 hover:bg-green-600 rounded-full transition-all shadow-lg"
//                         >
//                           <Video size={24} />
//                         </button>
//                       )}
//                       <button
//                         onClick={endCall}
//                         className="p-4 bg-red-500 hover:bg-red-600 rounded-full transition-all shadow-lg shadow-red-500/50"
//                       >
//                         <PhoneOff size={24} />
//                       </button>
//                     </div>
//                   </div>
//                 )}

//                 <div className="px-4 py-3 border-b flex justify-between items-center bg-white shadow-sm z-10 text-black">
//                   <div className="flex items-center">
//                     <button
//                       onClick={() => setActiveChat(null)}
//                       className="md:hidden p-2 mr-1 text-gray-500 hover:bg-gray-100 rounded-full"
//                     >
//                       <ChevronLeft size={24} />
//                     </button>
//                     <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-full flex items-center justify-center text-white font-bold shadow-md">
//                       {activeChat.profileImg ? (
//                         <img
//                           src={activeChat.profileImg}
//                           className="w-full h-full object-cover"
//                         />
//                       ) : (
//                         activeChat.name.charAt(0)
//                       )}
//                     </div>
//                     <div className="ml-3">
//                       <h3 className="font-bold text-gray-800 text-sm">
//                         {activeChat.name}
//                       </h3>
//                       <div className="flex items-center gap-1">
//                         <div className="w-1.5 h-1.5 bg-green-500 rounded-full" />
//                         <p className="text-[10px] text-green-500 font-bold uppercase tracking-tight">
//                           Connected
//                         </p>
//                       </div>
//                     </div>
//                   </div>
//                   <div className="flex gap-4 text-gray-400 hidden sm:flex">
//                     <Phone
//                       size={18}
//                       className="cursor-pointer hover:text-blue-600"
//                     />
//                     <Video
//                       onClick={startVideoCall}
//                       size={18}
//                       className="cursor-pointer hover:text-blue-600"
//                     />
//                   </div>
//                 </div>

//                 <div className="flex-1 overflow-y-auto p-4 space-y-4 shadow-inner bg-[#f0f2f5]">
//                   {messages.map((msg, idx) => {
//                     const isMe =
//                       String(msg.senderId) === String(user?.id || user?._id);
//                     return (
//                       <div
//                         key={msg._id || idx}
//                         className={`flex ${
//                           isMe ? "justify-end" : "justify-start"
//                         }`}
//                       >
//                         <div
//                           className={`max-w-[85%] sm:max-w-[70%] px-3 py-1.5 rounded-lg shadow-sm text-sm leading-relaxed relative ${
//                             isMe
//                               ? "bg-[#dcf8c6] text-gray-800 rounded-tr-none"
//                               : "bg-white text-gray-800 rounded-tl-none border"
//                           }`}
//                         >
//                           <p>{msg.text}</p>
//                           <div
//                             className={`flex items-center justify-end mt-1 text-[9px] text-gray-500 gap-1`}
//                           >
//                             {new Date(msg.createdAt).toLocaleTimeString([], {
//                               hour: "2-digit",
//                               minute: "2-digit",
//                             })}
//                             {isMe && (
//                               <CheckCheck size={11} className="text-blue-400" />
//                             )}
//                           </div>
//                         </div>
//                       </div>
//                     );
//                   })}
//                   <div ref={messagesEndRef} />
//                 </div>

//                 <div className="p-3 bg-[#f0f0f0] flex items-center gap-2">
//                   <button className="text-gray-500 p-2 hover:bg-gray-200 rounded-lg">
//                     <Smile size={22} />
//                   </button>
//                   <button className="text-gray-500 p-2 hover:bg-gray-200 rounded-lg">
//                     <Paperclip size={20} />
//                   </button>
//                   <input
//                     type="text"
//                     value={messageInput}
//                     onChange={(e) => setMessageInput(e.target.value)}
//                     onKeyDown={(e) => e.key === "Enter" && handleSendMessage()}
//                     placeholder="Type professional advice..."
//                     className="flex-1 bg-white border-none rounded-xl px-4 py-2.5 text-sm outline-none shadow-sm"
//                   />
//                   <button
//                     onClick={handleSendMessage}
//                     className={`p-2.5 rounded-full transition-all active:scale-95 ${
//                       messageInput.trim()
//                         ? "bg-[#00a884] text-white shadow-md"
//                         : "bg-gray-300 text-white cursor-default"
//                     }`}
//                   >
//                     <Send size={20} />
//                   </button>
//                 </div>
//               </>
//             ) : (
//               <div className="flex-1 flex flex-col items-center justify-center text-gray-400 bg-white">
//                 <div className="w-24 h-24 bg-blue-50 rounded-full flex items-center justify-center mb-6 animate-pulse">
//                   <MessageSquare className="h-10 w-10 text-blue-300" />
//                 </div>
//                 <h3 className="text-gray-800 font-bold text-lg">
//                   Patient Consultations
//                 </h3>
//                 <p className="text-sm max-w-[280px] text-center mt-2 text-gray-500 px-5 text-gray-500">
//                   Select a patient inquiry from the left to start providing
//                   professional medical guidance.
//                 </p>
//               </div>
//             )}
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }
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
  VideoOff,
  Mic,
  MicOff,
  PhoneOff,
} from "lucide-react";
import { useSocket } from "../../../../../context/SocketContext";
import { useAuth } from "../../../../../context/AuthContext";
import { useWebRTC } from "../../../../../hooks/useWebRTC"; // WebRTC Hook import kiya

export default function DoctorMessagesPage() {
  const socket = useSocket();
  const { user } = useAuth();

  // State Management
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [activeChat, setActiveChat] = useState(null);
  const [messageInput, setMessageInput] = useState("");
  const [messages, setMessages] = useState([]);
  const [inbox, setInbox] = useState([]);
  const [loading, setLoading] = useState(true);
  const [conversationId, setConversationId] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const messagesEndRef = useRef(null);

  // --- VIDEO CALL UI STATE ---
  const [isCalling, setIsCalling] = useState(false);
  const [isIncomingCall, setIsIncomingCall] = useState(false);
  const [isCallAccepted, setIsCallAccepted] = useState(false);
  const [incomingOffer, setIncomingOffer] = useState(null);

  const localVideoRef = useRef(null);
  const remoteVideoRef = useRef(null);

  // Audio References
  const sendSoundRef = useRef(null);
  const receiveSoundRef = useRef(null);

  // Refs to handle stale state in socket listeners
  const activeChatRef = useRef(null);
  const conversationIdRef = useRef(null);

  useEffect(() => {
    activeChatRef.current = activeChat;
  }, [activeChat]);
  useEffect(() => {
    conversationIdRef.current = conversationId;
  }, [conversationId]);

  // WebRTC Hook Integration
  const {
    createOffer,
    handleIncomingCall,
    handleCallAccepted,
    handleNewICECandidate,
    cleanup,
  } = useWebRTC(socket, conversationId, localVideoRef, remoteVideoRef);

  // Initialize sounds on mount
  useEffect(() => {
    sendSoundRef.current = new Audio("/sounds/send.mp3");
    receiveSoundRef.current = new Audio("/sounds/receive.wav");
  }, []);

  const playSendSound = () => {
    if (sendSoundRef.current) {
      sendSoundRef.current.currentTime = 0;
      sendSoundRef.current.play().catch((e) => console.log("Sound error:", e));
    }
  };

  const playReceiveSound = () => {
    if (receiveSoundRef.current) {
      receiveSoundRef.current.currentTime = 0;
      receiveSoundRef.current
        .play()
        .catch((e) => console.log("Sound error:", e));
    }
  };

  // --- WebRTC SIGNALING LISTENERS ---
  useEffect(() => {
    if (!socket || !conversationId) return;

    socket.on("incoming_call", (data) => {
      setIncomingOffer(data.offer);
      setIsIncomingCall(true);
      playReceiveSound(); // Incoming call sound
    });

    socket.on("call_accepted", async (data) => {
      setIsCallAccepted(true);
      await handleCallAccepted(data.answer);
    });

    socket.on("ice_candidate", async (data) => {
      await handleNewICECandidate(data.candidate);
    });

    socket.on("call_ended", () => {
      endCallLocally();
    });

    return () => {
      socket.off("incoming_call");
      socket.off("call_accepted");
      socket.off("ice_candidate");
      socket.off("call_ended");
    };
  }, [socket, conversationId]);

  // --- CALLING FUNCTIONS ---
  const startVideoCall = async () => {
    setIsCalling(true);
    await createOffer(); // Send Signaling Offer
  };

  const acceptCall = async () => {
    setIsIncomingCall(false);
    setIsCallAccepted(true);
    await handleIncomingCall(incomingOffer); // Send Signaling Answer
  };

  const endCallLocally = () => {
    setIsCalling(false);
    setIsIncomingCall(false);
    setIsCallAccepted(false);
    setIncomingOffer(null);
    cleanup(); // Stop Camera and PeerConnection
  };

  const endCall = () => {
    socket.emit("end_call", conversationId);
    endCallLocally();
  };

  // --- PREVIOUS CHAT LOGIC (UNCHANGED) ---
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

  const fetchInbox = async () => {
    try {
      setLoading(true);
      const res = await axios.get("/api/chat/inbox", { withCredentials: true });
      setInbox(res.data.inbox);
    } catch (err) {
      console.error("Inbox fetch failed", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchInbox();
  }, []);

  const filteredInbox = inbox.filter((item) =>
    item.patient.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  useEffect(() => {
    if (activeChat && socket) {
      const getChat = async () => {
        try {
          const res = await axios.get(
            `/api/chat/conversation/${activeChat._id}`,
            { withCredentials: true }
          );
          setConversationId(res.data.conversationId);
          setMessages(res.data.messages);
          socket.emit("join_chat", res.data.conversationId);
          await axios.patch(
            `/api/chat/read/${res.data.conversationId}`,
            {},
            { withCredentials: true }
          );
          setInbox((prev) =>
            prev.map((item) =>
              item.patient._id === activeChat._id
                ? { ...item, unreadCount: 0 }
                : item
            )
          );
        } catch (err) {
          console.error(err);
        }
      };
      getChat();
    }
  }, [activeChat, socket]);

  useEffect(() => {
    if (!socket) return;
    const handleNewMessage = (newMessage) => {
      const senderId = String(newMessage.senderId);
      const currentUserId = String(user?.id || user?._id);
      setInbox((prevInbox) => {
        const itemIndex = prevInbox.findIndex(
          (item) =>
            item.patient._id === senderId ||
            item.patient._id === newMessage.receiverId
        );
        let updatedInbox = [...prevInbox];
        if (itemIndex !== -1) {
          const targetItem = { ...updatedInbox[itemIndex] };
          const isChatOpenWithSender =
            activeChatRef.current && activeChatRef.current._id === senderId;
          if (senderId !== currentUserId) {
            playReceiveSound();
            if (!isChatOpenWithSender) {
              targetItem.unreadCount = (targetItem.unreadCount || 0) + 1;
            }
          }
          targetItem.lastMessage = { text: newMessage.text };
          targetItem.updatedAt = newMessage.createdAt;
          updatedInbox.splice(itemIndex, 1);
          updatedInbox.unshift(targetItem);
        } else {
          fetchInbox();
        }
        return updatedInbox;
      });
      if (
        conversationIdRef.current &&
        String(newMessage.conversationId) === String(conversationIdRef.current)
      ) {
        if (senderId === currentUserId) return;
        setMessages((prev) =>
          prev.some((m) => m._id === newMessage._id)
            ? prev
            : [...prev, newMessage]
        );
      }
    };
    socket.on("receive_direct_message", handleNewMessage);
    return () => {
      socket.off("receive_direct_message", handleNewMessage);
    };
  }, [socket, user]);

  const handleSendMessage = () => {
    if (!messageInput.trim() || !socket || !conversationId || !activeChat)
      return;
    playSendSound();
    const tempId = "temp-" + Date.now();
    socket.emit("send_direct_message", {
      conversationId,
      receiverId: activeChat._id,
      text: messageInput,
    });
    setMessages((prev) => [
      ...prev,
      {
        _id: tempId,
        senderId: user?.id || user?._id,
        text: messageInput,
        createdAt: new Date().toISOString(),
        conversationId,
      },
    ]);
    setInbox((prev) => {
      const idx = prev.findIndex((item) => item.patient._id === activeChat._id);
      if (idx === -1) return prev;
      const updated = [...prev];
      const target = {
        ...updated[idx],
        lastMessage: { text: messageInput },
        updatedAt: new Date().toISOString(),
      };
      updated.splice(idx, 1);
      updated.unshift(target);
      return updated;
    });
    setMessageInput("");
  };

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  return (
    <div className="h-screen flex bg-gray-50 overflow-hidden font-sans text-black">
      {isSidebarOpen && (
        <div
          className="fixed inset-0 bg-black/40 z-50 md:hidden"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}
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
              <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">
                Doctor Portal
              </p>
            </div>
          </div>
          <button className="md:hidden" onClick={() => setIsSidebarOpen(false)}>
            <X size={20} />
          </button>
        </div>
        <nav className="mt-4 flex-1 px-3 space-y-1 overflow-y-auto">
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

      <div className="flex-1 flex flex-col min-w-0 relative">
        <header className="bg-white border-b border-gray-200 px-6 py-3 flex justify-between items-center sticky top-0 z-30">
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
        </header>

        <div className="flex-1 flex overflow-hidden">
          {/* Inbox Area */}
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
                <Filter size={14} className="text-gray-400 cursor-pointer" />
              </div>
              <div className="relative">
                <Search
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                  size={16}
                />
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Search patients..."
                  className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-blue-500 outline-none transition-all shadow-sm"
                />
              </div>
            </div>
            <div className="flex-1 overflow-y-auto">
              {loading ? (
                <div className="p-10 text-center text-sm text-gray-400">
                  Loading...
                </div>
              ) : (
                filteredInbox.map((item) => (
                  <div
                    key={item.conversationId}
                    onClick={() => setActiveChat(item.patient)}
                    className={`flex items-center p-4 cursor-pointer border-b border-gray-50 transition-all ${
                      activeChat?._id === item.patient._id
                        ? "bg-blue-50 border-r-4 border-r-blue-600 shadow-inner"
                        : "hover:bg-gray-50"
                    }`}
                  >
                    <div className="relative shrink-0">
                      <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center border border-gray-200 overflow-hidden shadow-sm">
                        {item.patient.profileImg ? (
                          <img
                            src={item.patient.profileImg}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <User size={24} className="text-gray-400" />
                        )}
                      </div>
                      <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-white rounded-full"></div>
                    </div>
                    <div className="ml-3 flex-1 min-w-0">
                      <div className="flex justify-between items-center">
                        <h4 className="font-bold text-gray-800 text-sm truncate">
                          {item.patient.name}
                        </h4>
                        {item.unreadCount > 0 && (
                          <span className="bg-green-500 text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full min-w-[18px] text-center animate-pulse">
                            {item.unreadCount}
                          </span>
                        )}
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

          <div
            className={`flex-1 flex flex-col relative ${
              !activeChat ? "hidden md:flex" : "flex"
            }`}
          >
            {activeChat ? (
              <>
                {/* --- VIDEO CALL OVERLAY UI --- */}
                {(isCalling || isIncomingCall || isCallAccepted) && (
                  <div className="absolute inset-0 z-50 bg-slate-900 flex flex-col items-center justify-center text-white">
                    <div className="absolute inset-0 overflow-hidden flex items-center justify-center bg-black">
                      {isCallAccepted ? (
                        <video
                          ref={remoteVideoRef}
                          autoPlay
                          playsInline
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="flex flex-col items-center space-y-4">
                          <div className="w-24 h-24 rounded-full bg-blue-600 flex items-center justify-center text-4xl font-bold border-4 border-white animate-pulse">
                            {activeChat.name.charAt(0)}
                          </div>
                          <h2 className="text-2xl font-bold">
                            {isIncomingCall
                              ? "Incoming Request..."
                              : "Calling Patient..."}
                          </h2>
                          <p className="text-gray-400">{activeChat.name}</p>
                        </div>
                      )}
                    </div>
                    <div className="absolute top-6 right-6 w-32 md:w-48 aspect-video bg-gray-800 rounded-2xl border-2 border-white/20 shadow-2xl overflow-hidden z-20">
                      <video
                        ref={localVideoRef}
                        autoPlay
                        playsInline
                        muted
                        className="w-full h-full object-cover bg-slate-700"
                      />
                    </div>
                    <div className="absolute bottom-10 flex items-center space-x-6 z-30">
                      <button className="p-4 bg-gray-700/80 hover:bg-gray-600 rounded-full transition-all backdrop-blur-md">
                        <Mic size={24} />
                      </button>
                      <button className="p-4 bg-gray-700/80 hover:bg-gray-600 rounded-full transition-all backdrop-blur-md">
                        <VideoOff size={24} />
                      </button>
                      {isIncomingCall && !isCallAccepted && (
                        <button
                          onClick={acceptCall}
                          className="p-4 bg-green-500 hover:bg-green-600 rounded-full transition-all shadow-lg shadow-green-500/50"
                        >
                          <Video size={24} />
                        </button>
                      )}
                      <button
                        onClick={endCall}
                        className="p-4 bg-red-500 hover:bg-red-600 rounded-full transition-all shadow-lg shadow-red-500/50"
                      >
                        <PhoneOff size={24} />
                      </button>
                    </div>
                  </div>
                )}

                <div className="px-4 py-3 border-b flex justify-between items-center bg-white shadow-sm z-10 text-black">
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
                          Connected
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
                      onClick={startVideoCall}
                      size={18}
                      className="cursor-pointer hover:text-blue-600"
                    />
                  </div>
                </div>

                <div className="flex-1 overflow-y-auto p-4 space-y-3 shadow-inner bg-[#f0f2f5]">
                  {messages.map((msg, idx) => {
                    const isMe =
                      String(msg.senderId) === String(user?.id || user?._id);
                    return (
                      <div
                        key={msg._id || idx}
                        className={`flex ${
                          isMe ? "justify-end" : "justify-start"
                        }`}
                      >
                        <div
                          className={`max-w-[85%] sm:max-w-[70%] px-3 py-1.5 rounded-lg shadow-sm text-sm leading-relaxed relative ${
                            isMe
                              ? "bg-[#dcf8c6] text-gray-800 rounded-tr-none"
                              : "bg-white text-gray-800 rounded-tl-none border"
                          }`}
                        >
                          <p>{msg.text}</p>
                          <div
                            className={`flex items-center justify-end mt-1 text-[9px] text-gray-500 gap-1`}
                          >
                            {new Date(msg.createdAt).toLocaleTimeString([], {
                              hour: "2-digit",
                              minute: "2-digit",
                            })}
                            {isMe && (
                              <CheckCheck size={11} className="text-blue-400" />
                            )}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                  <div ref={messagesEndRef} />
                </div>

                <div className="p-3 bg-[#f0f0f0] flex items-center gap-2">
                  <button className="text-gray-500 p-2 hover:bg-gray-200 rounded-lg">
                    <Smile size={22} />
                  </button>
                  <button className="text-gray-400 p-2 hover:bg-gray-100 rounded-lg transition-colors">
                    <Paperclip size={20} />
                  </button>
                  <input
                    type="text"
                    value={messageInput}
                    onChange={(e) => setMessageInput(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && handleSendMessage()}
                    placeholder="Type professional advice..."
                    className="flex-1 bg-white border-none rounded-xl px-4 py-2.5 text-sm outline-none shadow-sm shadow-inner"
                  />
                  <button
                    onClick={handleSendMessage}
                    className={`p-2.5 rounded-full transition-all active:scale-95 ${
                      messageInput.trim()
                        ? "bg-[#00a884] text-white shadow-md"
                        : "bg-gray-300 text-white cursor-default"
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
                <p className="text-sm max-w-[280px] text-center mt-2 text-gray-500">
                  Select a patient inquiry from the left to start providing
                  professional medical guidance.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
