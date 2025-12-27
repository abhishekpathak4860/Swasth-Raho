import express from "express";
import { verifyToken } from "../middleware/auth.js";
import { aiChat } from "../controllers/aiChatController.js";

const router = express.Router();

router.post("/chat", verifyToken, aiChat);

export default router;
