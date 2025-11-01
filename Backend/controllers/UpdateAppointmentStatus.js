import Appointment from "../models/Appointment.js";
import Doctor from "../models/Doctor.js";

export const UpdateAppointmentStatus = async (req, res) => {
  try {
    const { appointmentId } = req.params;
    const updatedData = req.body;

    // Update appointment
    const updatedAppointment = await Appointment.findByIdAndUpdate(
      appointmentId,
      { $set: updatedData },
      { new: true }
    );

    if (!updatedAppointment) {
      return res.status(404).json({ message: "Appointment not found" });
    }

    //  If status is 'completed', link patient to doctor
    if (updatedAppointment.status === "completed") {
      const { doc_id, p_id } = updatedAppointment;

      // Find the doctor by doc_id
      const doctor = await Doctor.findById(doc_id);
      if (doctor) {
        // Only push p_id if not already in patient_ids
        if (!doctor.patient_ids.includes(p_id)) {
          doctor.patient_ids.push(p_id);
          await doctor.save();
        }
      }
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
