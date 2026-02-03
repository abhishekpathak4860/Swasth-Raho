import HospitalAdmin from "../models/HospitalAdmin.js";

export const updatedHospitalData = async (req, res) => {
  try {
    // 1. Get the user ID from the token (added by verifyToken middleware)
    const userId = req.user.id;

    // 2. Get the data to update from the request body
    const updates = req.body;

    // 3. Find the admin by ID and update
    // { new: true } returns the updated document instead of the old one
    // { runValidators: true } ensures the data matches your Schema rules
    const updatedAdmin = await HospitalAdmin.findByIdAndUpdate(
      userId,
      {
        $set: updates, // This updates only the fields sent from frontend
      },
      { new: true, runValidators: true },
    ).select("-password"); // Exclude password from the response

    if (!updatedAdmin) {
      return res.status(404).json({
        success: false,
        message: "Hospital Admin not found",
      });
    }

    // 4. Send back success response
    res.status(200).json({
      success: true,
      message: "Profile updated successfully",
      admin: updatedAdmin,
    });
  } catch (error) {
    console.error("Update Error:", error);
    res.status(500).json({
      success: false,
      message: "Internal Server Error",
      error: error.message,
    });
  }
};
