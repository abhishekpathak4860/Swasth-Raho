import express from "express";
import { patientProfile } from "../controllers/patientProfileController.js";
import { verifyToken } from "../middleware/auth.js";
const router = express.Router();

router.get("/profile", verifyToken, patientProfile);

export default router;
