import Appointment from "../models/Appointment.js";

export const UpcomingAppointmentsForDoctor = async (req, res) => {
  try {
    // 1. Get patient id and role from token
    const { id: doctorId, role } = req.user;

    if (role != "doctor") {
      res.status(403).json({ message: "access denied" });
    }
    const appointments = await Appointment.find({
      doc_id: doctorId,
    });
    res.status(200).json({
      message: "appointments fetched successfully",
      appointments,
    });
  } catch (error) {
    console.error("Error getting appointment data:", error);
    res.status(500).json({ message: "Server error", error });
  }
};
