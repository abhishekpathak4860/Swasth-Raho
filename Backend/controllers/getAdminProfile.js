import HospitalAdmin from "../models/HospitalAdmin.js";
import Doctor from "../models/Doctor.js";
import { redis } from "../config/redis.js";

export const getAdminProfile = async (req, res) => {
  try {
    const { id, role } = req.user;

    if (role !== "hospital_admin") {
      return res.status(403).json({ message: "Access denied" });
    }

    const cacheKey = `hospital:admin:profile:${id}`;

    // Check Redis
    const cachedData = await redis.get(cacheKey);

    if (cachedData) {
      console.log("CACHE HIT (Redis - Hospital Admin)");
      return res.status(200).json(cachedData);
    }

    console.log("CACHE MISS (MongoDB - Hospital Admin)");

    // Fetch admin
    const admin = await HospitalAdmin.findById(id);
    if (!admin) {
      return res.status(404).json({ message: "Hospital admin not found" });
    }

    // Fetch doctors
    const doctors = await Doctor.find({ hospital_id: id });

    const yourDoctors = doctors.map((doctor) => ({
      name: doctor.name,
      type: doctor.type,
    }));

    const responseData = {
      success: true,
      message: "Hospital admin profile fetched successfully",
      admin,
      yourDoctors,
    };

    // Save to Redis
    await redis.set(cacheKey, responseData, {
      ex: 60,
    });

    console.log("Data saved in Redis (Hospital Admin)");

    return res.status(200).json(responseData);
  } catch (error) {
    console.error("Error fetching hospital admin data:", error);
    res.status(500).json({ message: "Server error", error });
  }
};
