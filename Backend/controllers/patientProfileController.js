import Patient from "../models/Patient.js";

export const patientProfile = async (req, res) => {
  try {
    const { id, role } = req.user;
    if (role !== "patient")
      return res.status(403).json({ message: "Access denied" });

    const patient = await Patient.findById(id).select("-password");
    if (!patient) return res.status(404).json({ message: "Patient not found" });

    res.status(200).json({
      message: "Patient profile fetched successfully",
      patient,
    });
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};
