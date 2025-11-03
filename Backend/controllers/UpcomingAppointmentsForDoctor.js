// import Appointment from "../models/Appointment.js";
// import MedicalReport from "../models/MedicalReport.js";
// export const UpcomingAppointmentsForDoctor = async (req, res) => {
//   try {
//     // 1. Get patient id and role from token
//     const { id: doctorId, role } = req.user;

//     if (role != "doctor") {
//       res.status(403).json({ message: "access denied" });
//     }
//     const appointments = await Appointment.find({
//       doc_id: doctorId,
//     });
//     res.status(200).json({
//       message: "appointments fetched successfully",
//       appointments,
//     });
//   } catch (error) {
//     console.error("Error getting appointment data:", error);
//     res.status(500).json({ message: "Server error", error });
//   }
// };
import Appointment from "../models/Appointment.js";
import MedicalReport from "../models/MedicalReport.js";

export const UpcomingAppointmentsForDoctor = async (req, res) => {
  try {
    // 1. Get doctor id and role from token
    const { id: doctorId, role } = req.user;

    if (role !== "doctor") {
      return res.status(403).json({ message: "Access denied" });
    }

    // 2. Fetch all appointments for this doctor
    const appointments = await Appointment.find({ doc_id: doctorId });

    // 3. For each appointment, check MedicalReport table
    const updatedAppointments = await Promise.all(
      appointments.map(async (appointment) => {
        const report = await MedicalReport.findOne({
          appointment_id: appointment._id.toString(),
        });

        let report_status = "incompleted"; // default

        if (report) {
          if (report.status === "completed") {
            report_status = "completed";
          } else if (report.status === "pending") {
            report_status = "pending";
          }
        }

        // Convert appointment doc to plain object to add custom field
        const appointmentObj = appointment.toObject();
        appointmentObj.report_status = report_status;

        return appointmentObj;
      })
    );

    res.status(200).json({
      message: "Appointments fetched successfully",
      appointments: updatedAppointments,
    });
  } catch (error) {
    console.error("Error getting appointment data:", error);
    res.status(500).json({ message: "Server error", error });
  }
};
