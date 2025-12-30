// routes/chatRoute.js
import express from "express";
import { verifyToken } from "../middleware/auth.js";
import {
  getDoctorInbox,
  getOrCreateConversation,
  getPatientInbox,
  markAsRead,
} from "../controllers/chatController.js";

const router = express.Router();

router.get("/conversation/:doctorId", verifyToken, getOrCreateConversation);
router.get("/inbox", verifyToken, getDoctorInbox);
router.get("/patient-inbox", verifyToken, getPatientInbox);
router.patch("/read/:conversationId", verifyToken, markAsRead);

export default router;
