import express from "express";
import { verifyToken } from "../middleware/auth.js";
import { report } from "../controllers/report.js";

const router = express.Router();

router.post("/report", report);

export default router;
