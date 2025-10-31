import axios from "axios";

export async function getHospitalDataFromServer() {
  try {
    // Use environment variable when available (set NEXT_PUBLIC_BACKEND_URL or BACKEND_URL in env)
    const baseUrl = process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:5000";
    const apiUrl = `${baseUrl.replace(/\/$/, "")}/data/get-hospitalDataFromServer`;
    //  const apiUrl = `${baseUrl.replace(/\/$/, "")}/hospital/get-hospitalData`;
    const res = await axios.get(apiUrl);
    // ensure we throw on non-2xx
    if (res.status < 200 || res.status >= 300) throw new Error(`Failed to fetch hospitals: ${res.status}`);
    return res.data;
  } catch (error) {
    console.error("getHospitalDataFromServer error:", error);
    throw error;
  }
}