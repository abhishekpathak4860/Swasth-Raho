import express from "express";
import { verifyToken } from "../middleware/auth.js";
import { report } from "../controllers/report.js";
import { doctorProfile } from "../controllers/doctorProfileController.js";
import { UpdateDoctorDetails } from "../controllers/UpdateDoctorDetails.js";
import { UpcomingAppointmentsForDoctor } from "../controllers/UpcomingAppointmentsForDoctor.js";
import { UpdateAppointmentStatus } from "../controllers/UpdateAppointmentStatus.js";

const router = express.Router();

router.post("/report", report);
router.get("/profile", verifyToken, doctorProfile);
router.patch("/update-profile", verifyToken, UpdateDoctorDetails);
router.get("/get-appointments", verifyToken, UpcomingAppointmentsForDoctor);
router.patch(
  "/update-appointment/:appointmentId",
  verifyToken,
  UpdateAppointmentStatus
);

export default router;
