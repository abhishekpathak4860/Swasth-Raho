import express from "express";
import { patientProfile } from "../controllers/patientProfileController.js";
import { doctorsData } from "../controllers/doctorsData.js";
import { appointment } from "../controllers/appointment.js";
import { UpcomingAppointments } from "../controllers/UpcomingAppointments.js";
import { UpdateAppointment } from "../controllers/UpdateAppointment.js";
import { verifyToken } from "../middleware/auth.js";
const router = express.Router();

router.get("/profile", verifyToken, patientProfile);
router.get("/doctors", verifyToken, doctorsData);
router.post("/appointment", verifyToken, appointment);
router.get("/get-appointments", verifyToken, UpcomingAppointments);
router.patch(
  "/UpdateAppointment/:appointmentId",
  verifyToken,
  UpdateAppointment
);

export default router;
