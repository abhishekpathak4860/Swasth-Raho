import express from "express";
import {
  getAllDoctors,
  getAllHospitals,
  getAllPatients,
  superAdminProfile,
  updateSuperAdminPassword,
  updateSuperAdminProfile,
} from "../controllers/superAdminController.js";
import { verifyToken } from "../middleware/auth.js";

const router = express.Router();

router.get("/profile", verifyToken, superAdminProfile);
router.get("/hospitals", verifyToken, getAllHospitals);
router.get("/doctors", verifyToken, getAllDoctors);
router.get("/patients", verifyToken, getAllPatients);
router.patch("/updatePassword", verifyToken, updateSuperAdminPassword);
router.patch("/update-profile", verifyToken, updateSuperAdminProfile);

export default router;
