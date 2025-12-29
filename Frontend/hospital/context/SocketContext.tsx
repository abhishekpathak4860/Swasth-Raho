"use client";
import { createContext, useContext, useEffect, useState } from "react";
import { io } from "socket.io-client";
import Cookies from "js-cookie";

const SocketContext = createContext(null);

export const SocketProvider = ({ children }) => {
  const [socket, setSocket] = useState(null);

  useEffect(() => {
    const token = Cookies.get("token");

    // Agar token nahi hai toh connection mat banao
    if (!token) {
      console.warn("No token found, socket connection skipped.");
      return;
    }

    const socketInstance = io(
      process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:5000",
      {
        auth: { token },
        withCredentials: true,
        transports: ["websocket"],
      }
    );

    setSocket(socketInstance);

    // Cleanup on unmount
    return () => {
      socketInstance.disconnect();
    };
  }, []);

  return (
    <SocketContext.Provider value={socket}>{children}</SocketContext.Provider>
  );
};

export const useSocket = () => useContext(SocketContext);
