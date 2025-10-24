import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import Doctor from "../models/Doctor.js";
import Patient from "../models/Patient.js";

export const loginUser = async (req, res) => {
  try {
    const { email, password, role } = req.body;

    // Check role validity
    if (!role || (role !== "doctor" && role !== "patient")) {
      return res.status(400).json({ message: "Invalid role selected" });
    }

    // Find user based on role
    let user;
    if (role === "doctor") {
      user = await Doctor.findOne({ email });
    } else if (role === "patient") {
      user = await Patient.findOne({ email });
    }

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Compare password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid password" });
    }

    // Generate JWT Token
    const token = jwt.sign(
      { id: user._id, role: role },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    // Store token in cookie
    res.cookie("token", token, {
      httpOnly: true, // cannot be accessed by JS
      secure: process.env.NODE_ENV === "production" ? true : false, // true for HTTPS
      sameSite: "None",
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
      domain: ".vercel.app",
    });

    res.status(200).json({
      message: "Login successful",
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: role,
      },
    });
  } catch (error) {
    console.error("Login Error:", error);
    res.status(500).json({ message: "Server Error" });
  }
};
