import express from "express";
import { getUserToken } from "../controllers/UserToken.js";
import { verifyToken } from "../middleware/auth.js";
const router = express.Router();

router.get("/get-role", verifyToken, getUserToken);

export default router;
