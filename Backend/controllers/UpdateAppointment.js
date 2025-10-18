import Appointment from "../models/Appointment.js";

export const UpdateAppointment = async (req, res) => {
  try {
    const { appointmentId } = req.params; // get id from URL
    const updatedData = req.body; // get new data from frontend

    // find and update the appointment
    const updatedAppointment = await Appointment.findByIdAndUpdate(
      appointmentId,
      { $set: updatedData },
      { new: true } // returns updated document
    );

    if (!updatedAppointment) {
      return res.status(404).json({ message: "Appointment not found" });
    }

    res.status(200).json({
      message: "Appointment updated successfully!",
      appointment: updatedAppointment,
    });
  } catch (error) {
    console.error("Error editing appointment:", error);
    res.status(500).json({ message: "Server error", error });
  }
};
