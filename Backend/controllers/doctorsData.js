import Doctor from "../models/Doctor.js";

export const doctorsData = async (req, res) => {
  try {
    // Fetch all doctors from the database
    const doctors = await Doctor.find().select("-password"); // exclude sensitive data if any

    // If no doctors found
    if (!doctors || doctors.length === 0) {
      return res.status(404).json({ message: "No doctors found" });
    }

    // Send doctors data as array
    res.status(200).json({
      message: "Doctors fetched successfully",
      doctor: doctors,
    });
  } catch (error) {
    console.error("Error fetching doctors:", error);
    res.status(500).json({ message: "Server error", error });
  }
};
