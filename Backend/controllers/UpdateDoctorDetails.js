import Doctor from "../models/Doctor.js";

export const UpdateDoctorDetails = async (req, res) => {
  try {
    // id and role come from the verified JWT via middleware
    const { id } = req.user;

    // Get the updated data from the request body
    const updateData = req.body;

    // Find and update the patient document
    const updatedDoctor = await Doctor.findByIdAndUpdate(
      id,
      { $set: updateData },
      { new: true, runValidators: true } // return updated doc and validate schema
    );

    if (!updatedDoctor) {
      return res.status(404).json({ message: "Patient not found" });
    }

    res.status(200).json({
      message: "Profile updated successfully",
      user: updatedDoctor,
    });
  } catch (error) {
    console.error("Error updating profile:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};
