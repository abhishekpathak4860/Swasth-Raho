import express from "express";
import { registerUser } from "../controllers/registerController.js";
import { loginUser } from "../controllers/loginController.js";
import { logoutUser } from "../controllers/logoutController.js";
import {
  forgotPassword,
  verifyOtp,
  resetPassword,
} from "../controllers/forgotPasswordController.js";

const router = express.Router();

router.post("/register", registerUser);
router.post("/login", loginUser);
router.post("/logout", logoutUser);

router.post("/forgot-password", forgotPassword);
router.post("/verify-otp", verifyOtp);
router.post("/reset-password", resetPassword);

export default router;
