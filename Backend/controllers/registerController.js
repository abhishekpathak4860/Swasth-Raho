import Doctor from "../models/Doctor.js";
import Patient from "../models/Patient.js";
import HospitalAdmin from "../models/HospitalAdmin.js";
import SuperAdmin from "../models/SuperAdmin.js";
import bcrypt from "bcryptjs";

export const registerUser = async (req, res) => {
  try {
    const {
      name,
      email,
      password,
      role,
      age,
      type,
      location,
      contact,
      experience,
      education,
      hospital, // this is hospital name choosen by doctor during registration
      consultationFee,
      Total_Revenue,
      patient_ids,
      hospital_name,
      hospital_type,
      hospital_address,
      total_rooms,
      ac_rooms,
      non_ac_rooms,
      connected_pharmacies,
      hospital_duration,
      organisation_type,
    } = req.body;

    if (!name || !email || !password || !role) {
      return res
        .status(400)
        .json({ message: "All required fields must be filled" });
    }

    // Check if email already exists in any collection
    const existingUser =
      (await Doctor.findOne({ email })) ||
      (await Patient.findOne({ email })) ||
      (await HospitalAdmin.findOne({ email })) ||
      (await SuperAdmin.findOne({ email }));

    if (existingUser) {
      return res.status(400).json({ message: "Email already registered" });
    }

    // Hash password before saving
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    let newUser;

    switch (role) {
      case "doctor":
        if (!type)
          return res
            .status(400)
            .json({ message: "Doctor specialization (type) is required" });

        // 🔍 Find the hospital by its name
        const hospitalDoc = await HospitalAdmin.findOne({
          hospital_name: hospital,
        });

        if (!hospitalDoc) {
          return res.status(404).json({
            message: `Hospital '${hospital}' not found. Please select a valid hospital.`,
          });
        }

        // 🏥 Create new doctor with hospital_id = hospitalDoc._id
        newUser = await Doctor.create({
          name,
          email,
          password: hashedPassword,
          role,
          age,
          type,
          contact,
          experience,
          education,
          hospital, // hospital name (for easy readability)
          hospital_id: hospitalDoc._id, //Linking hospital here
          consultationFee,
          Total_Revenue,
          patient_ids,
        });

        break;

      case "patient":
        if (!location)
          return res
            .status(400)
            .json({ message: "Patient location is required" });
        newUser = await Patient.create({
          name,
          email,
          password: hashedPassword,
          role,
          age,
          location,
          contact,
        });
        break;

      case "hospital_admin":
        if (!hospital_name || !hospital_address || !hospital_type)
          return res
            .status(400)
            .json({ message: "Hospital details are required" });

        newUser = await HospitalAdmin.create({
          name,
          email,
          password: hashedPassword,
          role,
          hospital_name,
          hospital_type,
          hospital_address,
          total_rooms,
          ac_rooms,
          non_ac_rooms,
          connected_pharmacies,
          hospital_duration,
          organisation_type,
        });
        break;

      case "super_admin":
        newUser = await SuperAdmin.create({
          name,
          email,
          password: hashedPassword,
          role,
        });
        break;

      default:
        return res.status(400).json({ message: "Invalid role" });
    }

    res.status(201).json({
      message: `${role} registered successfully`,
      user: newUser,
    });
  } catch (error) {
    console.error("Registration error:", error.message);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};
