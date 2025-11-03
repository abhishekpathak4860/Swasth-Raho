import express from "express";
import { verifyToken } from "../middleware/auth.js";
import { report } from "../controllers/report.js";
import { doctorProfile } from "../controllers/doctorProfileController.js";
import { UpdateDoctorDetails } from "../controllers/UpdateDoctorDetails.js";
import { UpcomingAppointmentsForDoctor } from "../controllers/UpcomingAppointmentsForDoctor.js";
import { UpdateAppointmentStatus } from "../controllers/UpdateAppointmentStatus.js";
import { getReportsForDoctor } from "../controllers/getReportsForDoctor.js";
import { UpdateReportData } from "../controllers/UpdateReportData.js";
import { fetchPatients } from "../controllers/fetchPatients.js";
const router = express.Router();

router.post("/report", verifyToken, report);
router.get("/profile", verifyToken, doctorProfile);
router.patch("/update-profile", verifyToken, UpdateDoctorDetails);
router.get("/get-appointments", verifyToken, UpcomingAppointmentsForDoctor);
router.get("/get-reports", verifyToken, getReportsForDoctor);
router.get("/fetchPatients", verifyToken, fetchPatients);
router.patch(
  "/update-appointment/:appointmentId",
  verifyToken,
  UpdateAppointmentStatus
);
router.patch("/update-report/:reportId", verifyToken, UpdateReportData);

export default router;
// doctor/fetchPatients
