import express from "express";
import { verifyToken } from "../middleware/auth.js";
import { fetchChatsAi } from "../controllers/fetchChatsAi.js";
import { deleteChatsAi } from "../controllers/deleteChatsAi.js";

const router = express.Router();

// router.post("/chat", verifyToken, aiChat);
router.get("/userChat", verifyToken, fetchChatsAi);
router.delete("/deleteChat", verifyToken, deleteChatsAi);
export default router;
