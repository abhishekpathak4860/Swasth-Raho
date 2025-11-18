import express from "express";
import { verifyToken } from "../middleware/auth.js";
import { getHospitalData } from "../controllers/getHospitalData.js";
import { getAdminProfile } from "../controllers/getAdminProfile.js";
const router = express.Router();

router.get("/get-hospitalData", getHospitalData);

router.get("/get-profile", verifyToken, getAdminProfile);

export default router;
