import { Router } from "express";
import {
  signup,
  signin,
  verifyOtp,
  getUserProfile,
} from "../controllers/auth.controller";
import { authMiddleware } from "../middleware/auth";

const router = Router();

router.post("/signup", signup);
router.post("/verify-otp", verifyOtp);
router.post("/signin", signin);
router.get("/profile", authMiddleware, getUserProfile);

export default router;
