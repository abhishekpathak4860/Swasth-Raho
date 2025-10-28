import express from "express";
import { verifyToken } from "../middleware/auth.js";
import { getHospitalData } from "../controllers/getHospitalData.js";

const router = express.Router();

router.get("/get-hospitalData", getHospitalData);

export default router;
