// routes/chatRoute.js
import express from "express";
import { verifyToken } from "../middleware/auth.js";
import {
  getDoctorInbox,
  getOrCreateConversation,
} from "../controllers/chatController.js";

const router = express.Router();

router.get("/conversation/:doctorId", verifyToken, getOrCreateConversation);
router.get("/inbox", verifyToken, getDoctorInbox);

export default router;
