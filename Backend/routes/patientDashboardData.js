import express from "express";
import { verifyToken } from "../middleware/auth.js";
import { patientProfile } from "../controllers/patientProfileController.js";
import { doctorsData } from "../controllers/doctorsData.js";
import { appointment } from "../controllers/appointment.js";
import { UpcomingAppointments } from "../controllers/UpcomingAppointments.js";
import { UpdateAppointment } from "../controllers/UpdateAppointment.js";
import { cancelAppointment } from "../controllers/cancelAppointment.js";
import { UpdateUserDetails } from "../controllers/UpdateUserDetails.js";
import { initiatePayment } from "../controllers/initiatePayment.js";
import { verifyPayment } from "../controllers/verifyPayment.js";
import { getReports } from "../controllers/getReports.js";

const router = express.Router();

router.get("/profile", verifyToken, patientProfile);
router.get("/doctors", verifyToken, doctorsData);
router.get("/verify-payment", verifyToken, verifyPayment);
router.post("/appointment", verifyToken, appointment);
router.post("/initiate-payment", verifyToken, initiatePayment);
router.get("/get-appointments", verifyToken, UpcomingAppointments);
router.get("/get-reports", verifyToken, getReports);
router.patch(
  "/UpdateAppointment/:appointmentId",
  verifyToken,
  UpdateAppointment
);
router.patch("/update-profile", verifyToken, UpdateUserDetails);
router.delete(
  "/cancel-appointment/:appointmentId",
  verifyToken,
  cancelAppointment
);

export default router;
