import express from "express";
import { registerUser } from "../controllers/registerController.js";
import { loginUser } from "../controllers/loginController.js";
import { logoutUser } from "../controllers/logoutController.js";

const router = express.Router();

router.post("/register", registerUser);
router.post("/login", loginUser);
router.post("/logout", logoutUser);

export default router;
