import Doctor from "../models/Doctor.js";
import Patient from "../models/Patient.js";
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
      hospital,
      consultationFee,
    } = req.body;

    if (!name || !email || !password || !role || !age || !contact) {
      return res
        .status(400)
        .json({ message: "All required fields must be filled" });
    }

    // Check if email already exists (in both collections)
    const existingDoctor = await Doctor.findOne({ email });
    const existingPatient = await Patient.findOne({ email });
    if (existingDoctor || existingPatient) {
      return res.status(400).json({ message: "Email already registered" });
    }

    // Hash password before saving
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    let newUser;

    if (role === "doctor") {
      if (!type)
        return res
          .status(400)
          .json({ message: "Doctor specialization (type) is required" });

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
        hospital,
        consultationFee,
      });
    } else if (role === "patient") {
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
    } else {
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
