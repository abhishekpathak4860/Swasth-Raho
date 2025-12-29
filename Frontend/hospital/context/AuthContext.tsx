"use client";

import { createContext, useContext, useEffect, useState } from "react";
import axios from "axios";

// Context
const AuthContext = createContext(null);

// Provider
export function AuthProvider({ children }: any) {
  const [user, setUser] = useState();
  const [loading, setLoading] = useState(true);

  // Fetch profile dynamically based on role inside JWT cookie
  const fetchUser = async () => {
    try {
      // 1. Hit a single API to read cookie + return role
      const resToken = await axios.get("/auth/get-role", {
        withCredentials: true,
      });

      const role = resToken.data.role; // doctor / patient / hospital_admin / super_admin

      if (!role) {
        setUser(null);
        setLoading(false);
        return;
      }

      let endpoint = "";

      if (role === "doctor") endpoint = "/doctor/profile";
      else if (role === "patient") endpoint = "/patient/profile";
      else if (role === "hospital_admin")
        endpoint = "/api/hospital/get-profile";
      else if (role === "super_admin") endpoint = "/superAdmin/profile";

      const res = await axios.get(endpoint, { withCredentials: true });

      // pick correct field
      const data =
        res.data.doctor ||
        res.data.patient ||
        res.data.hospital_admin ||
        res.data.super_admin ||
        res.data;

      setUser({ ...data, role });
      console.log("hello", { ...data, role });
    } catch (err) {
      console.log("Auth error:", err);
      setUser(null);
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    fetchUser();
  }, []);

  return (
    <AuthContext.Provider value={{ user, setUser, loading, fetchUser }}>
      {children}
    </AuthContext.Provider>
  );
}

// Custom Hook
export function useAuth() {
  return useContext(AuthContext);
}
