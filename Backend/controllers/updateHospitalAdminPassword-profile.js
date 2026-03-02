import HospitalAdmin from "../models/HospitalAdmin.js";

export const updateHospitalAdminPassword = async (req, res) => {
  try {
    const { newPassword } = req.body;

    // 1. Validation
    if (!newPassword) {
      return res.status(400).json({ message: "New password is required" });
    }

    // 2. Hash the new password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(newPassword, salt);

    // 3. Update the hospital Admin Record
    // Since there is only one hospital Admin, we can use the ID from the token (req.user.id)
    const hospitalAdmin = await HospitalAdmin.findByIdAndUpdate(
      req.user.id,
      { password: hashedPassword },
      { new: true },
    );

    if (!hospitalAdmin) {
      return res.status(404).json({ message: "hospitalAdmin not found" });
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
export const updateHospitalAdminProfile = async (req, res) => {
  try {
    const userId = req.user.id;
    const { name, email, profileImg } = req.body;
    // 1. Create dynamic update object (only update fields that are sent)
    const updateData = {};
    if (name) updateData.name = name;
    if (email) updateData.email = email;
    if (profileImg) updateData.profileImg = profileImg; // Cloudinary URL
    // 2. Perform Update
    const updatedAdmin = await HospitalAdmin.findByIdAndUpdate(
      userId,
      { $set: updateData },
      { new: true, runValidators: true }, // Return the new updated doc
    ).select("-password");
    if (!updatedAdmin) {
      return res.status(404).json({ message: "hospitalAdmin not found" });
    }
    res.status(200).json({
      success: true,
      message: "Profile updated successfully",
      hospitalAdmin: updatedAdmin,
    });
  } catch (error) {
    console.error("Profile update error:", error);
    res.status(500).json({
      message: "Server error updating profile",
      error: error.message,
    });
  }
};
