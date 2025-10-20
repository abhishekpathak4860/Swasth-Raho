import Appointment from "../models/Appointment.js";

export const cancelAppointment = async (req, res) => {
  try {
    const { appointmentId } = req.params; // get the appointment ID from URL

    // try to find and delete the appointment
    const deletedAppointment = await Appointment.findByIdAndDelete(
      appointmentId
    );

    if (!deletedAppointment) {
      return res.status(404).json({ message: "Appointment not found" });
    }

    res.status(200).json({
      message: "Appointment cancelled successfully!",
    });
  } catch (error) {
    console.error("Error cancelling appointment:", error);
    res.status(500).json({ message: "Server error", error });
  }
};
