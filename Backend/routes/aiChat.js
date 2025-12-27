import express from "express";
import { verifyToken } from "../middleware/auth.js";
// import { aiChat } from "../controllers/aiChatController.js";
import { fetchChatsAi } from "../controllers/fetchChatsAi.js";

const router = express.Router();

// router.post("/chat", verifyToken, aiChat);
router.get("/userChat", verifyToken, fetchChatsAi);
export default router;
