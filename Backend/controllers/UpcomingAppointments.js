// import Appointment from "../models/Appointment.js";
// import Payment from "../models/Payment.js";

// export const UpcomingAppointments = async (req, res) => {
//   try {
//     // 1. Get patient id and role from token
//     const { id: patientId, role } = req.user;

//     if (role != "patient") {
//       res.status(403).json({ message: "access denied" });
//     }
//     const appointments = await Appointment.find({ p_id: patientId });
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
import Payment from "../models/Payment.js";

export const UpcomingAppointments = async (req, res) => {
  try {
    const { id: patientId, role } = req.user;

    if (role !== "patient") {
      return res.status(403).json({ message: "access denied" });
    }

    // 1. Fetch all appointments of patient
    const appointments = await Appointment.find({ p_id: patientId });

    // 2. For each appointment, attach payment status
    const enhancedAppointments = await Promise.all(
      appointments.map(async (appt) => {
        const payment = await Payment.findOne({ appointmentId: appt._id });

        return {
          ...appt._doc,
          paymentStatus: payment ? payment.status : "incomplete",
        };
      })
    );

    res.status(200).json({
      message: "appointments fetched successfully",
      appointments: enhancedAppointments,
    });
  } catch (error) {
    console.error("Error getting appointment data:", error);
    res.status(500).json({ message: "Server error", error });
  }
};
