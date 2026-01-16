import { Router } from "express";
import { signup, signin, verifyOtp } from "../controllers/auth.controller";

const router = Router();

router.post("/signup", signup);
router.post("/verify-otp", verifyOtp);
router.post("/signin", signin);

export default router;
