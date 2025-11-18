import Appointment from "../models/Appointment.js";
import Doctor from "../models/Doctor.js";
export const appointment = async (req, res) => {
  try {
    // 1. Get patient info from token
    const { id: patientId, role } = req.user;

    // Optionally, check if role is 'patient'
    if (role !== "patient") {
      return res
        .status(403)
        .json({ message: "Only patients can book appointments" });
    }

    // 2. Get appointment details from request body
    const { name, email, doctor, doc_id, disease, date, time } = req.body;

    // 3. Find the doctor by doc_id
    const doctorData = await Doctor.findById(doc_id);

    if (!doctorData) {
      return res.status(404).json({ message: "Doctor not found" });
    }
    // 4. Create new appointment
    const newAppointment = new Appointment({
      p_id: patientId,
      p_name: name,
      p_email: email,
      doc_id: doc_id,
      doc_name: doctor,
      type: doctorData.type,
      disease,
      date,
      time,
      status: "pending",
      consultationFee,
    });

    // 5. Save appointment to DB
    const savedAppointment = await newAppointment.save();

    res.status(201).json({
      message: "Appointment booked successfully",
      appointment: savedAppointment,
    });
  } catch (error) {
    console.error("Error posting appointment:", error);
    res.status(500).json({ message: "Server error", error });
  }
};
