import Doctor from "../models/Doctor.js";
import HospitalAdmin from "../models/HospitalAdmin.js";
import Patient from "../models/Patient.js";
import SuperAdmin from "../models/SuperAdmin.js";

export const superAdminProfile = async (req, res) => {
  try {
    const { id, role } = req.user;
    if (role !== "super_admin")
      return res.status(403).json({ message: "Access denied" });

    const superAdmin = await SuperAdmin.findById(id).select("-password");
    if (!superAdmin)
      return res.status(404).json({ message: "superAdmin not found" });

    res.status(200).json({
      message: "superAdmin profile fetched successfully",
      superAdmin,
    });
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};

// Get All Hospitals for Dashboard
export const getAllHospitals = async (req, res) => {
  try {
    // 1. Security Check
    if (req.user.role !== "super_admin") {
      return res
        .status(403)
        .json({ message: "Access denied. Super Admin only." });
    }

    // 2. Fetch all hospitals (sorted by newest first)
    // We select specifically the fields needed for the UI cards to optimize bandwidth
    const hospitals = await HospitalAdmin.find()
      .select("-password") // Exclude password
      .sort({ createdAt: -1 }); // Newest first

    res.status(200).json({
      success: true,
      count: hospitals.length,
      hospitals,
    });
  } catch (error) {
    console.error("Error fetching hospitals:", error);
    res.status(500).json({
      message: "Server error fetching hospitals",
      error: error.message,
    });
  }
};

// Get All Doctors for Dashboard
export const getAllDoctors = async (req, res) => {
  try {
    // 1. Security Check
    if (req.user.role !== "super_admin") {
      return res
        .status(403)
        .json({ message: "Access denied. Super Admin only." });
    }

    // 2. Fetch all doctors
    const doctors = await Doctor.find()
      .select("-password") // Exclude sensitive data
      .sort({ createdAt: -1 });

    // 3. Attach Hospital Name manually (Robust method)
    // We do this to ensure we get the name even if 'populate' isn't set up in schema
    const doctorsWithHospitalName = await Promise.all(
      doctors.map(async (doc) => {
        let hospitalName = "Unknown Hospital";
        if (doc.hospital_id) {
          const hospital = await HospitalAdmin.findById(doc.hospital_id).select(
            "hospital_name",
          );
          if (hospital) {
            hospitalName = hospital.hospital_name;
          }
        }
        return {
          ...doc.toObject(), // Convert Mongoose doc to JS object
          hospital: hospitalName, // Overwrite/Attach the name
        };
      }),
    );

    res.status(200).json({
      success: true,
      count: doctorsWithHospitalName.length,
      doctors: doctorsWithHospitalName,
    });
  } catch (error) {
    console.error("Error fetching doctors:", error);
    res
      .status(500)
      .json({ message: "Server error fetching doctors", error: error.message });
  }
};

// Get All Patients for Dashboard
export const getAllPatients = async (req, res) => {
  try {
    // 1. Security Check
    if (req.user.role !== "super_admin") {
      return res
        .status(403)
        .json({ message: "Access denied. Super Admin only." });
    }

    // 2. Fetch all patients
    const patients = await Patient.find()
      .select("-password") // Exclude password
      .sort({ createdAt: -1 }); // Newest first

    res.status(200).json({
      success: true,
      count: patients.length,
      patients,
    });
  } catch (error) {
    console.error("Error fetching patients:", error);
    res
      .status(500)
      .json({
        message: "Server error fetching patients",
        error: error.message,
      });
  }
};
