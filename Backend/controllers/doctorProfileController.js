import Doctor from "../models/Doctor.js";

export const doctorProfile = async (req, res) => {
  try {
    const { id, role } = req.user;
    if (role !== "doctor")
      return res.status(403).json({ message: "Access denied" });

    const doctor = await Doctor.findById(id).select("-password");
    if (!doctor) return res.status(404).json({ message: "Patient not found" });

    res.status(200).json({
      message: "Doctor profile fetched successfully",
      doctor,
    });
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};
