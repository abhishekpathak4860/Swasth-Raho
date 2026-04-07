import { redis } from "../config/redis.js";
import Patient from "../models/Patient.js";

export const patientProfile = async (req, res) => {
  try {
    const { id, role } = req.user;

    if (role !== "patient") {
      return res.status(403).json({ message: "Access denied" });
    }

    const cacheKey = `patient:profile:${id}`;

    // 1. Check Redis (CACHE HIT)
    const cachedData = await redis.get(cacheKey);

    if (cachedData) {
      console.log("CACHE HIT (Redis)");
      return res.status(200).json({
        message: "Patient profile fetched from cache",
        patient: cachedData,
      });
    }

    // CACHE MISS → fetch from DB
    console.log("CACHE MISS (MongoDB)");

    const patient = await Patient.findById(id).select("-password");

    if (!patient) {
      return res.status(404).json({ message: "Patient not found" });
    }

    // 2. Save to Redis (with TTL)
    await redis.set(cacheKey, patient, {
      ex: 60, // 60 seconds
    });

    console.log("Data saved in Redis");

    return res.status(200).json({
      message: "Patient profile fetched successfully",
      patient,
    });
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};
