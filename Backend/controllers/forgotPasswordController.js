import bcrypt from "bcryptjs";
import Doctor from "../models/Doctor.js";
import Patient from "../models/Patient.js";
import HospitalAdmin from "../models/HospitalAdmin.js";
import SuperAdmin from "../models/SuperAdmin.js";
import sendEmail from "../utils/sendEmail.js";

// Helper to get the correct model
const getModelByRole = (role) => {
  if (role === "doctor") return Doctor;
  if (role === "patient") return Patient;
  if (role === "hospital_admin") return HospitalAdmin;
  if (role === "super_admin") return SuperAdmin;
  return null;
};

// 1. SEND OTP (Also handles RESEND OTP)
export const forgotPassword = async (req, res) => {
  try {
    const { email, role } = req.body;
    const Model = getModelByRole(role);

    if (!Model) return res.status(400).json({ message: "Invalid Role" });

    const user = await Model.findOne({ email });
    if (!user) return res.status(404).json({ message: "User not found" });

    // Generate 6 digit OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();

    // Save to DB (Valid for 10 mins) - This overwrites any previous OTP
    user.resetPasswordOtp = otp;
    user.resetPasswordExpire = Date.now() + 10 * 60 * 1000;
    await user.save();

    // Send Email
    const message = `Your password reset OTP is: ${otp} \n\nIt is valid for 10 minutes.`;

    try {
      await sendEmail({
        email: user.email,
        subject: "Swasth Raho - Password Reset OTP",
        message,
      });
      res.status(200).json({ success: true, message: "OTP sent to email" });
    } catch (err) {
      // If email fails, clear the OTP so user can't verify nothing
      user.resetPasswordOtp = undefined;
      user.resetPasswordExpire = undefined;
      await user.save();
      return res.status(500).json({ message: "Email could not be sent" });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// 2. VERIFY OTP
export const verifyOtp = async (req, res) => {
  try {
    const { email, role, otp } = req.body;
    const Model = getModelByRole(role);

    if (!Model) return res.status(400).json({ message: "Invalid Role" });

    // Find user with matching Email AND OTP AND Time not expired
    const user = await Model.findOne({
      email,
      resetPasswordOtp: otp,
      resetPasswordExpire: { $gt: Date.now() },
    });

    if (!user) {
      return res.status(400).json({ message: "Invalid or Expired OTP" });
    }

    res.status(200).json({ success: true, message: "OTP Verified" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// 3. RESET PASSWORD
export const resetPassword = async (req, res) => {
  try {
    const { email, role, newPassword } = req.body;
    const Model = getModelByRole(role);

    if (!Model) return res.status(400).json({ message: "Invalid Role" });

    const user = await Model.findOne({ email });
    if (!user) return res.status(404).json({ message: "User not found" });

    // Hash new password
    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(newPassword, salt);

    // Clear OTP fields immediately after success
    user.resetPasswordOtp = undefined;
    user.resetPasswordExpire = undefined;

    await user.save();

    res
      .status(200)
      .json({ success: true, message: "Password Updated Successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
