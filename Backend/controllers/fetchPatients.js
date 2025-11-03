import Doctor from "../models/Doctor.js";
import Patient from "../models/Patient.js";
export const fetchPatients = async (req, res) => {
  try {
    const { id, role } = req.user;
    if (role !== "doctor") {
      res.status(403).json({
        message: "access denied",
      });
    }
    const doctor = await Doctor.findById(id);

    if (!doctor) {
      return res.status(404).json({
        message: "Doctor not found",
      });
    }
    const patientIds = doctor.patient_ids || [];
    const patients = await Patient.find({
      _id: { $in: patientIds },
    });
    res.status(200).json({
      message: "Patients fetched successfully!",
      patients,
    });
  } catch (error) {
    console.error("Error fetching doctors:", error);
    res.status(500).json({ message: "Server error", error });
  }
};
