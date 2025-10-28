import HospitalAdmin from "../models/HospitalAdmin.js";

export const getHospitalData = async (req, res) => {
  try {
    // Fetch all hospitals from the database
    const hospitals = await HospitalAdmin.find();

    // If no hospitals found
    if (!hospitals || hospitals.length === 0) {
      return res.status(404).json({ message: "No hospitals found" });
    }

    // Return hospitals as an array
    res.status(200).json(hospitals);
  } catch (error) {
    console.error("Error fetching hospital data:", error);
    res.status(500).json({
      message: "Server error while fetching hospital data",
      error: error.message,
    });
  }
};
