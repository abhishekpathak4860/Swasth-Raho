import express from "express";
import { verifyToken } from "../middleware/auth.js";
import { getHospitalData } from "../controllers/getHospitalData.js";
import { getAdminProfile } from "../controllers/getAdminProfile.js";
import { updatedHospitalData } from "../controllers/updatedHospitalData.js";

const router = express.Router();

router.get("/get-hospitalData", getHospitalData);

router.get("/get-profile", verifyToken, getAdminProfile);
router.patch("/update-profile", verifyToken, updatedHospitalData);
export default router;
