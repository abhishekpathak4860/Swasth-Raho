import { redis } from "../config/redis.js";
import Doctor from "../models/Doctor.js";

export const doctorProfile = async (req, res) => {
  try {
    const { id, role } = req.user;

    if (role !== "doctor") {
      return res.status(403).json({ message: "Access denied" });
    }

    const cacheKey = `doctor:profile:${id}`;

    //  Check Redis
    const cachedData = await redis.get(cacheKey);

    if (cachedData) {
      console.log("DOCTOR CACHE HIT (Redis)");
      return res.status(200).json({
        message: "Doctor profile fetched from cache",
        doctor: cachedData,
      });
    }

    console.log("DOCTOR CACHE MISS (MongoDB)");

    // Fetch from DB
    const doctor = await Doctor.findById(id).select("-password");

    if (!doctor) {
      return res.status(404).json({ message: "Doctor not found" });
    }

    // Save to Redis
    await redis.set(cacheKey, doctor, {
      ex: 60,
    });

    console.log(" Doctor data saved in Redis");

    return res.status(200).json({
      message: "Doctor profile fetched successfully",
      doctor,
    });
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};
