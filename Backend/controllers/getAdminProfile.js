import HospitalAdmin from "../models/HospitalAdmin.js";
import Doctor from "../models/Doctor.js";

export const getAdminProfile = async (req, res) => {
  try {
    const { id, role } = req.user;

    //  Only hospital admins can access this route
    if (role !== "hospital_admin") {
      return res.status(403).json({ message: "Access denied" });
    }

    //  Find the hospital admin details
    const admin = await HospitalAdmin.findById(id);
    if (!admin) {
      return res.status(404).json({ message: "Hospital admin not found" });
    }

    // Find all doctors linked to this hospital
    const doctors = await Doctor.find({ hospital_id: id });

    // Map only required fields (name & type)
    const yourDoctors = doctors.map((doctor) => ({
      name: doctor.name,
      type: doctor.type,
    }));

    //  Return single response including admin + doctors info
    res.status(200).json({
      success: true,
      message: "Hospital admin profile fetched successfully",
      admin,
      yourDoctors,
    });
  } catch (error) {
    console.error("Error fetching hospital admin data:", error);
    res.status(500).json({ message: "Server error", error });
  }
};
