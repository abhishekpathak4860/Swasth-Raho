import bcrypt from "bcryptjs";
import Doctor from "../models/Doctor.js";
import HospitalAdmin from "../models/HospitalAdmin.js";
import Patient from "../models/Patient.js";
import SuperAdmin from "../models/SuperAdmin.js";
// import bcrypt from "bcrypt";

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
    res.status(500).json({
      message: "Server error fetching patients",
      error: error.message,
    });
  }
};

// Update Super Admin Password
export const updateSuperAdminPassword = async (req, res) => {
  try {
    const { newPassword } = req.body;

    // 1. Validation
    if (!newPassword) {
      return res.status(400).json({ message: "New password is required" });
    }

    // 2. Hash the new password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(newPassword, salt);

    // 3. Update the Super Admin Record
    // Since there is only one Super Admin, we can use the ID from the token (req.user.id)
    const superAdmin = await SuperAdmin.findByIdAndUpdate(
      req.user.id,
      { password: hashedPassword },
      { new: true },
    );

    if (!superAdmin) {
      return res.status(404).json({ message: "Super Admin not found" });
    }

    res.status(200).json({
      success: true,
      message: "Password updated successfully",
    });
  } catch (error) {
    console.error("Password update error:", error);
    res.status(500).json({
      message: "Server error updating password",
      error: error.message,
    });
  }
};

// Update General Profile (Name, Email, Image)
export const updateSuperAdminProfile = async (req, res) => {
  try {
    const userId = req.user.id;
    const { name, email, profileImg } = req.body;

    // 1. Create dynamic update object (only update fields that are sent)
    const updateData = {};
    if (name) updateData.name = name;
    if (email) updateData.email = email;
    if (profileImg) updateData.profileImg = profileImg; // Cloudinary URL

    // 2. Perform Update
    const updatedAdmin = await SuperAdmin.findByIdAndUpdate(
      userId,
      { $set: updateData },
      { new: true, runValidators: true }, // Return the new updated doc
    ).select("-password");

    if (!updatedAdmin) {
      return res.status(404).json({ message: "Super Admin not found" });
    }

    res.status(200).json({
      success: true,
      message: "Profile updated successfully",
      superAdmin: updatedAdmin,
    });
  } catch (error) {
    console.error("Profile update error:", error);
    res.status(500).json({
      message: "Server error updating profile",
      error: error.message,
    });
  }
};
