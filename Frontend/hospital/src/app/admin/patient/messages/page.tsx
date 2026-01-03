// "use client";
// import React, { useState, useEffect, useRef } from "react";
// import Link from "next/link";
// import {
//   User,
//   CalendarDays,
//   Stethoscope,
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
//   VideoOff,
//   Mic,
//   MicOff,
//   PhoneOff,
// } from "lucide-react";
// import axios from "axios";
// import { useSocket } from "../../../../../context/SocketContext";
// import { useAuth } from "../../../../../context/AuthContext";

// export default function PatientMessagesPage() {
//   const socket = useSocket();
//   const { user } = useAuth();

//   const [isSidebarOpen, setIsSidebarOpen] = useState(false);
//   const [activeChat, setActiveChat] = useState(null);
//   const [messageInput, setMessageInput] = useState("");
//   const [messages, setMessages] = useState([]);
//   const [doctorsData, setDoctorsData] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [conversationId, setConversationId] = useState(null);
//   const [searchTerm, setSearchTerm] = useState("");
//   const messagesEndRef = useRef(null);

//   // --- 1. VIDEO CALL STATE & REFS ---
//   const [isCalling, setIsCalling] = useState(false); // When Patient clicks call
//   const [isIncomingCall, setIsIncomingCall] = useState(false); // When Doctor calls
//   const [isCallAccepted, setIsCallAccepted] = useState(false);

//   const localVideoRef = useRef(null);
//   const remoteVideoRef = useRef(null);

//   // --- 2. AUDIO REFERENCES ---
//   const sendSoundRef = useRef(null);
//   const receiveSoundRef = useRef(null);

//   useEffect(() => {
//     sendSoundRef.current = new Audio("/sounds/send.mp3");
//     receiveSoundRef.current = new Audio("/sounds/receive.wav");
//   }, []);

//   const playSendSound = () => {
//     if (sendSoundRef.current) {
//       sendSoundRef.current.currentTime = 0;
//       sendSoundRef.current
//         .play()
//         .catch((e) => console.log("Sound play error:", e));
//     }
//   };

//   const playReceiveSound = () => {
//     if (receiveSoundRef.current) {
//       receiveSoundRef.current.currentTime = 0;
//       receiveSoundRef.current
//         .play()
//         .catch((e) => console.log("Sound play error:", e));
//     }
//   };

//   const sidebarItems = [
//     { id: "profile", label: "Profile", icon: User, route: "/admin/patient" },
//     {
//       id: "appointments",
//       label: "Appointments",
//       icon: CalendarDays,
//       route: "/admin/patient/appointments",
//     },
//     {
//       id: "doctors",
//       label: "Doctors",
//       icon: Stethoscope,
//       route: "/admin/patient/doctors",
//     },
//     {
//       id: "messages",
//       label: "Messages",
//       icon: MessageSquare,
//       route: "/admin/patient/messages",
//     },
//   ];

//   const fetchInbox = async () => {
//     try {
//       setLoading(true);
//       const res = await axios.get(`/api/chat/patient-inbox`, {
//         withCredentials: true,
//       });
//       setDoctorsData(res.data.doctor);
//     } catch (error) {
//       console.error("Error fetching inbox:", error);
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     fetchInbox();
//   }, []);

//   const filteredDoctors = doctorsData.filter((doc) => {
//     const nameMatch = doc.name.toLowerCase().includes(searchTerm.toLowerCase());
//     const typeMatch = (doc.type || "")
//       .toLowerCase()
//       .includes(searchTerm.toLowerCase());
//     return nameMatch || typeMatch;
//   });

//   useEffect(() => {
//     if (activeChat && socket) {
//       const getRoomAndMessages = async () => {
//         try {
//           const res = await axios.get(
//             `/api/chat/conversation/${activeChat._id}`,
//             { withCredentials: true }
//           );
//           setConversationId(res.data.conversationId);
//           setMessages(res.data.messages || []);
//           socket.emit("join_chat", res.data.conversationId);
//           await axios.patch(
//             `/api/chat/read/${res.data.conversationId}`,
//             {},
//             { withCredentials: true }
//           );
//           setDoctorsData((prev) =>
//             prev.map((d) =>
//               d._id === activeChat._id ? { ...d, unreadCount: 0 } : d
//             )
//           );
//         } catch (error) {
//           console.error(error);
//         }
//       };
//       getRoomAndMessages();
//     }
//   }, [activeChat, socket]);

//   useEffect(() => {
//     if (!socket) return;
//     const handleNewMessage = (newMessage) => {
//       const senderId = String(newMessage.senderId);
//       const currentUserId = String(user?.id || user?._id);

//       setDoctorsData((prev) => {
//         const docIndex = prev.findIndex(
//           (d) => d._id === senderId || d._id === newMessage.receiverId
//         );
//         let updatedDocs = [...prev];
//         if (docIndex !== -1) {
//           const targetDoc = { ...updatedDocs[docIndex] };
//           if (senderId !== currentUserId) {
//             playReceiveSound();
//             if (!activeChat || activeChat._id !== senderId) {
//               targetDoc.unreadCount = (targetDoc.unreadCount || 0) + 1;
//             }
//           }
//           updatedDocs.splice(docIndex, 1);
//           updatedDocs.unshift(targetDoc);
//         } else {
//           fetchInbox();
//         }
//         return updatedDocs;
//       });

//       if (String(newMessage.conversationId) === String(conversationId)) {
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
//   }, [socket, conversationId, user, activeChat]);

//   const handleSendMessage = () => {
//     if (!messageInput.trim() || !socket || !activeChat || !conversationId)
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
//     setDoctorsData((prev) => {
//       const idx = prev.findIndex((d) => d._id === activeChat._id);
//       if (idx === -1) return prev;
//       const updated = [...prev];
//       const target = updated.splice(idx, 1)[0];
//       updated.unshift(target);
//       return updated;
//     });
//     setMessageInput("");
//   };

//   useEffect(() => {
//     messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
//   }, [messages]);

//   // --- 3. VIDEO UI TOGGLE FUNCTIONS ---
//   const startVideoCall = () => {
//     setIsCalling(true);
//     // WebRTC logic will go here in next step
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
//             <div className="w-10 h-10 bg-gradient-to-r from-blue-600 to-green-600 rounded-xl flex items-center justify-center text-white font-bold shadow-lg">
//               S
//             </div>
//             <h1 className="text-lg font-bold text-gray-800">Swasth-Raho</h1>
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
//                   ? "bg-blue-600 text-white shadow-md shadow-blue-200"
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
//             <h2 className="text-xl font-bold text-gray-800">Direct Messages</h2>
//           </div>
//           <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center text-white border-2 border-white shadow-sm overflow-hidden">
//             {user?.profileImg ? (
//               <img
//                 src={user.profileImg}
//                 className="w-full h-full object-cover"
//                 alt=""
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
//             <div className="p-4 border-b bg-gray-50/50">
//               <div className="relative">
//                 <Search
//                   className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
//                   size={16}
//                 />
//                 <input
//                   type="text"
//                   value={searchTerm}
//                   onChange={(e) => setSearchTerm(e.target.value)}
//                   placeholder="Search doctors..."
//                   className="w-full pl-10 pr-4 py-2.5 bg-white border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-blue-500 outline-none"
//                 />
//               </div>
//             </div>
//             <div className="flex-1 overflow-y-auto">
//               {loading ? (
//                 <div className="p-10 text-center text-sm text-gray-400">
//                   Loading...
//                 </div>
//               ) : (
//                 filteredDoctors.map((doc) => (
//                   <div
//                     key={doc._id}
//                     onClick={() => setActiveChat(doc)}
//                     className={`flex items-center p-4 cursor-pointer border-b border-gray-50 transition-all ${
//                       activeChat?._id === doc._id
//                         ? "bg-blue-50 border-l-4 border-l-blue-600 shadow-inner"
//                         : "hover:bg-gray-50"
//                     }`}
//                   >
//                     <div className="relative shrink-0">
//                       <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center overflow-hidden border">
//                         {doc.profileImg ? (
//                           <img
//                             src={doc.profileImg}
//                             className="w-full h-full object-cover"
//                             alt=""
//                           />
//                         ) : (
//                           <User className="text-blue-600" size={24} />
//                         )}
//                       </div>
//                       <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-white rounded-full"></div>
//                     </div>
//                     <div className="ml-3 flex-1 min-w-0">
//                       <div className="flex justify-between items-center">
//                         <h4 className="font-bold text-gray-800 text-sm truncate">
//                           {doc.name}
//                         </h4>
//                         {doc.unreadCount > 0 && (
//                           <span className="bg-green-500 text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full min-w-[18px] text-center animate-pulse">
//                             {doc.unreadCount}
//                           </span>
//                         )}
//                       </div>
//                       <p className="text-xs text-blue-600 font-medium truncate">
//                         {doc.type}
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
//                 {/* --- 4. VIDEO CALL OVERLAY UI --- */}
//                 {(isCalling || isIncomingCall) && (
//                   <div className="absolute inset-0 z-50 bg-slate-900 flex flex-col items-center justify-center text-white">
//                     {/* Remote Video (Full Size) */}
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
//                               ? "Incoming Request..."
//                               : "Calling Doctor..."}
//                           </h2>
//                           <p className="text-gray-400">{activeChat.name}</p>
//                         </div>
//                       )}
//                     </div>

//                     {/* Local Video (Small Picture-in-Picture) */}
//                     <div className="absolute top-6 right-6 w-32 md:w-48 aspect-video bg-gray-800 rounded-2xl border-2 border-white/20 shadow-2xl overflow-hidden z-20">
//                       <video
//                         ref={localVideoRef}
//                         autoPlay
//                         playsInline
//                         muted
//                         className="w-full h-full object-cover bg-slate-700"
//                       />
//                     </div>

//                     {/* Call Controls */}
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
//                           className="p-4 bg-green-500 hover:bg-green-600 rounded-full transition-all shadow-lg shadow-green-500/50"
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

//                 {/* Normal Chat Header */}
//                 <div className="px-4 py-3 border-b flex justify-between items-center bg-white shadow-sm z-10 text-black">
//                   <div className="flex items-center">
//                     <button
//                       onClick={() => setActiveChat(null)}
//                       className="md:hidden p-2 mr-1 text-gray-500"
//                     >
//                       <ChevronLeft size={24} />
//                     </button>
//                     <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center text-white font-bold overflow-hidden shadow-sm">
//                       {activeChat.profileImg ? (
//                         <img
//                           src={activeChat.profileImg}
//                           className="w-full h-full object-cover"
//                           alt=""
//                         />
//                       ) : (
//                         activeChat.name.charAt(0)
//                       )}
//                     </div>
//                     <div className="ml-3">
//                       <h3 className="font-bold text-gray-800 text-sm">
//                         {activeChat.name}
//                       </h3>
//                       <p className="text-[10px] text-green-500 font-bold uppercase tracking-tight">
//                         Online
//                       </p>
//                     </div>
//                   </div>
//                   <div className="flex gap-4 text-gray-400">
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

//                 {/* Chat History */}
//                 <div className="flex-1 overflow-y-auto p-4 space-y-3 scroll-smooth bg-[#e5ddd5]">
//                   {messages.map((msg) => {
//                     const isMe =
//                       String(msg.senderId) === String(user?.id || user?._id);
//                     return (
//                       <div
//                         key={msg._id}
//                         className={`flex ${
//                           isMe ? "justify-end" : "justify-start"
//                         }`}
//                       >
//                         <div
//                           className={`max-w-[85%] sm:max-w-[70%] px-3 py-1.5 rounded-lg text-sm shadow-sm relative ${
//                             isMe
//                               ? "bg-[#dcf8c6] text-gray-800 rounded-tr-none"
//                               : "bg-white text-gray-800 rounded-tl-none border"
//                           }`}
//                         >
//                           <p>{msg.text}</p>
//                           <div className="flex items-center justify-end mt-1 text-[9px] text-gray-500 gap-1">
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

//                 {/* Input Area */}
//                 <div className="p-3 bg-[#f0f0f0] flex items-center gap-2">
//                   <button className="text-gray-500 p-2">
//                     <Smile size={22} />
//                   </button>
//                   <button className="text-gray-500 p-2">
//                     <Paperclip size={20} />
//                   </button>
//                   <input
//                     type="text"
//                     value={messageInput}
//                     onChange={(e) => setMessageInput(e.target.value)}
//                     onKeyDown={(e) => e.key === "Enter" && handleSendMessage()}
//                     placeholder="Type a message..."
//                     className="flex-1 bg-white border-none text-black rounded-xl px-4 py-2.5 text-sm outline-none shadow-sm"
//                   />
//                   <button
//                     onClick={handleSendMessage}
//                     className={`p-2.5 rounded-full transition-all active:scale-90 ${
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
//               <div className="flex-1 flex flex-col items-center justify-center text-gray-400 bg-[#f8fafc]">
//                 <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center shadow-md mb-4 border border-blue-50">
//                   <MessageSquare className="h-10 w-10 text-blue-200" />
//                 </div>
//                 <h3 className="text-gray-800 font-bold text-lg text-black">
//                   WhatsApp for Swasth-Raho
//                 </h3>
//                 <p className="text-xs text-center mt-1 px-10 text-gray-500">
//                   Pick a doctor to start a consultation.
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
import {
  User,
  CalendarDays,
  Stethoscope,
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
  VideoOff,
  Mic,
  MicOff,
  PhoneOff,
  Receipt,
  Hospital,
  FileText,
  MessageCircle,
} from "lucide-react";
import axios from "axios";
import { useSocket } from "../../../../../context/SocketContext";
import { useAuth } from "../../../../../context/AuthContext";
import { useWebRTC } from "../../../../../hooks/useWebRTC"; // Hook import kiya

export default function PatientMessagesPage() {
  const socket = useSocket();
  const { user } = useAuth();

  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [activeChat, setActiveChat] = useState(null);
  const [messageInput, setMessageInput] = useState("");
  const [messages, setMessages] = useState([]);
  const [doctorsData, setDoctorsData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [conversationId, setConversationId] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const messagesEndRef = useRef(null);

  // --- VIDEO CALL UI STATE ---
  const [isCalling, setIsCalling] = useState(false); // Jab Patient call initiate kare
  const [isIncomingCall, setIsIncomingCall] = useState(false); // Jab Doctor ka call aaye
  const [isCallAccepted, setIsCallAccepted] = useState(false);
  const [incomingOffer, setIncomingOffer] = useState(null);

  const localVideoRef = useRef(null);
  const remoteVideoRef = useRef(null);

  // --- WebRTC Hook Integration ---
  const {
    createOffer,
    handleIncomingCall,
    handleCallAccepted,
    handleNewICECandidate,
    cleanup,
  } = useWebRTC(socket, conversationId, localVideoRef, remoteVideoRef);

  // --- AUDIO REFERENCES ---
  const sendSoundRef = useRef(null);
  const receiveSoundRef = useRef(null);

  useEffect(() => {
    sendSoundRef.current = new Audio("/sounds/send.mp3");
    receiveSoundRef.current = new Audio("/sounds/receive.wav");
  }, []);

  const playSendSound = () => {
    if (sendSoundRef.current) {
      sendSoundRef.current.currentTime = 0;
      sendSoundRef.current
        .play()
        .catch((e) => console.log("Sound play error:", e));
    }
  };

  const playReceiveSound = () => {
    if (receiveSoundRef.current) {
      receiveSoundRef.current.currentTime = 0;
      receiveSoundRef.current
        .play()
        .catch((e) => console.log("Sound play error:", e));
    }
  };

  // --- SIGNALING LISTENERS ---
  useEffect(() => {
    if (!socket || !conversationId) return;

    socket.on("incoming_call", (data) => {
      setIsIncomingCall(true);
      setIncomingOffer(data.offer);
      playReceiveSound(); // Call aane par sound
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
    await createOffer(); // Signaling Offer bhejna
  };

  const acceptCall = async () => {
    setIsIncomingCall(false);
    setIsCallAccepted(true);
    await handleIncomingCall(incomingOffer); // Signaling Answer bhejna
  };

  const endCallLocally = () => {
    setIsCalling(false);
    setIsIncomingCall(false);
    setIsCallAccepted(false);
    setIncomingOffer(null);
    cleanup(); // Camera aur PeerConnection close karna
  };

  const endCall = () => {
    socket.emit("end_call", conversationId);
    endCallLocally();
  };

  // --- CHAT LOGIC ---
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
      id: "messages",
      label: "Messages",
      icon: MessageSquare,
      route: "/admin/patient/messages",
    },
  ];

  const fetchInbox = async () => {
    try {
      setLoading(true);
      const res = await axios.get(`/api/chat/patient-inbox`, {
        withCredentials: true,
      });
      setDoctorsData(res.data.doctor);
    } catch (error) {
      console.error("Error fetching inbox:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchInbox();
  }, []);

  const filteredDoctors = doctorsData.filter((doc) => {
    const nameMatch = doc.name.toLowerCase().includes(searchTerm.toLowerCase());
    const typeMatch = (doc.type || "")
      .toLowerCase()
      .includes(searchTerm.toLowerCase());
    return nameMatch || typeMatch;
  });

  useEffect(() => {
    if (activeChat && socket) {
      const getRoomAndMessages = async () => {
        try {
          const res = await axios.get(
            `/api/chat/conversation/${activeChat._id}`,
            { withCredentials: true }
          );
          setConversationId(res.data.conversationId);
          setMessages(res.data.messages || []);
          socket.emit("join_chat", res.data.conversationId);
          await axios.patch(
            `/api/chat/read/${res.data.conversationId}`,
            {},
            { withCredentials: true }
          );
          setDoctorsData((prev) =>
            prev.map((d) =>
              d._id === activeChat._id ? { ...d, unreadCount: 0 } : d
            )
          );
        } catch (error) {
          console.error(error);
        }
      };
      getRoomAndMessages();
    }
  }, [activeChat, socket]);

  useEffect(() => {
    if (!socket) return;
    const handleNewMessage = (newMessage) => {
      const senderId = String(newMessage.senderId);
      const currentUserId = String(user?.id || user?._id);
      setDoctorsData((prev) => {
        const docIndex = prev.findIndex(
          (d) => d._id === senderId || d._id === newMessage.receiverId
        );
        let updatedDocs = [...prev];
        if (docIndex !== -1) {
          const targetDoc = { ...updatedDocs[docIndex] };
          if (senderId !== currentUserId) {
            playReceiveSound();
            if (!activeChat || activeChat._id !== senderId) {
              targetDoc.unreadCount = (targetDoc.unreadCount || 0) + 1;
            }
          }
          updatedDocs.splice(docIndex, 1);
          updatedDocs.unshift(targetDoc);
        } else {
          fetchInbox();
        }
        return updatedDocs;
      });
      if (String(newMessage.conversationId) === String(conversationId)) {
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
  }, [socket, conversationId, user, activeChat]);

  const handleSendMessage = () => {
    if (!messageInput.trim() || !socket || !activeChat || !conversationId)
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
    setDoctorsData((prev) => {
      const idx = prev.findIndex((d) => d._id === activeChat._id);
      if (idx === -1) return prev;
      const updated = [...prev];
      const target = updated.splice(idx, 1)[0];
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
            <div className="w-10 h-10 bg-gradient-to-r from-blue-600 to-green-600 rounded-xl flex items-center justify-center text-white font-bold shadow-lg">
              S
            </div>
            <h1 className="text-lg font-bold text-gray-800">Swasth-Raho</h1>
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

      <div className="flex-1 flex flex-col min-w-0 relative">
        <header className="bg-white border-b border-gray-200 px-6 py-3 flex justify-between items-center sticky top-0 z-30">
          <div className="flex items-center">
            <button
              onClick={() => setIsSidebarOpen(true)}
              className="md:hidden p-2 mr-2 text-gray-600"
            >
              <Menu size={24} />
            </button>
            <h2 className="text-xl font-bold text-gray-800">Direct Messages</h2>
          </div>
          <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center text-white border-2 border-white shadow-sm overflow-hidden">
            {user?.profileImg ? (
              <img
                src={user.profileImg}
                className="w-full h-full object-cover"
                alt=""
              />
            ) : (
              <User size={20} />
            )}
          </div>
        </header>

        <div className="flex-1 flex overflow-hidden">
          <div
            className={`w-full md:w-80 lg:w-96 bg-white border-r border-gray-200 flex flex-col ${
              activeChat ? "hidden md:flex" : "flex"
            }`}
          >
            <div className="p-4 border-b bg-gray-50/50">
              <div className="relative">
                <Search
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                  size={16}
                />
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Search doctors..."
                  className="w-full pl-10 pr-4 py-2.5 bg-white border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-blue-500 outline-none"
                />
              </div>
            </div>
            <div className="flex-1 overflow-y-auto">
              {loading ? (
                <div className="p-10 text-center text-sm text-gray-400">
                  Loading...
                </div>
              ) : (
                filteredDoctors.map((doc) => (
                  <div
                    key={doc._id}
                    onClick={() => setActiveChat(doc)}
                    className={`flex items-center p-4 cursor-pointer border-b border-gray-50 transition-all ${
                      activeChat?._id === doc._id
                        ? "bg-blue-50 border-l-4 border-l-blue-600 shadow-inner"
                        : "hover:bg-gray-50"
                    }`}
                  >
                    <div className="relative shrink-0">
                      <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center overflow-hidden border">
                        {doc.profileImg ? (
                          <img
                            src={doc.profileImg}
                            className="w-full h-full object-cover"
                            alt=""
                          />
                        ) : (
                          <User className="text-blue-600" size={24} />
                        )}
                      </div>
                      <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-white rounded-full"></div>
                    </div>
                    <div className="ml-3 flex-1 min-w-0">
                      <div className="flex justify-between items-center">
                        <h4 className="font-bold text-gray-800 text-sm truncate">
                          {doc.name}
                        </h4>
                        {doc.unreadCount > 0 && (
                          <span className="bg-green-500 text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full min-w-[18px] text-center animate-pulse">
                            {doc.unreadCount}
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-blue-600 font-medium truncate">
                        {doc.type}
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
                              : "Calling Doctor..."}
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
                    <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center text-white font-bold overflow-hidden shadow-sm">
                      {activeChat.name.charAt(0)}
                    </div>
                    <div className="ml-3">
                      <h3 className="font-bold text-gray-800 text-sm">
                        {activeChat.name}
                      </h3>
                      <p className="text-[10px] text-green-500 font-bold uppercase tracking-tight">
                        Online
                      </p>
                    </div>
                  </div>
                  <div className="flex gap-4 text-gray-400">
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

                <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-[#e5ddd5]">
                  {messages.map((msg) => {
                    const isMe =
                      String(msg.senderId) === String(user?.id || user?._id);
                    return (
                      <div
                        key={msg._id}
                        className={`flex ${
                          isMe ? "justify-end" : "justify-start"
                        }`}
                      >
                        <div
                          className={`max-w-[85%] sm:max-w-[70%] px-3 py-1.5 rounded-lg text-sm shadow-sm relative ${
                            isMe
                              ? "bg-[#dcf8c6] text-gray-800 rounded-tr-none"
                              : "bg-white text-gray-800 rounded-tl-none border"
                          }`}
                        >
                          <p>{msg.text}</p>
                          <div className="flex items-center justify-end mt-1 text-[9px] text-gray-500 gap-1">
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
                  <button className="text-gray-500 p-2">
                    <Smile size={22} />
                  </button>
                  <button className="text-gray-500 p-2">
                    <Paperclip size={20} />
                  </button>
                  <input
                    type="text"
                    value={messageInput}
                    onChange={(e) => setMessageInput(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && handleSendMessage()}
                    placeholder="Type a message..."
                    className="flex-1 bg-white border-none text-black rounded-xl px-4 py-2.5 text-sm outline-none shadow-sm"
                  />
                  <button
                    onClick={handleSendMessage}
                    className={`p-2.5 rounded-full transition-all active:scale-90 ${
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
              <div className="flex-1 flex flex-col items-center justify-center text-gray-400 bg-[#f8fafc]">
                <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center shadow-md mb-4 border border-blue-50">
                  <MessageSquare className="h-10 w-10 text-blue-200" />
                </div>
                <h3 className="text-gray-800 font-bold text-lg text-black">
                  WhatsApp for Swasth-Raho
                </h3>
                <p className="text-xs text-center mt-1 px-10 text-gray-500">
                  Pick a doctor to start a consultation.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
