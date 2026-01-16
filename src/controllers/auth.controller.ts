import { AppDataSource } from "../config/data-source";
import { User } from "../entity/User";
import { Request, Response } from "express";
import bcrypt from "bcrypt";
import { generateOtp } from "../utils/generateOtp";
import { sendOtpEmail } from "../utils/sendEmail";
import jwt from "jsonwebtoken";

const userRepo = AppDataSource.getRepository(User);

export const signup = async (req: Request, res: Response) => {
  try {
    const { username, email, password } = req.body;

    const existingUser = await userRepo.findOne({ where: { email } });
    if (existingUser) {
      return res.status(400).json({ message: "User already exits" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const otp = generateOtp();

    const user = userRepo.create({
      username,
      email,
      password: hashedPassword,
      otp,
      otpExpiry: new Date(Date.now() + 5 * 60 * 1000),
    });

    await userRepo.save(user);
    await sendOtpEmail(email, otp);

    res.json({ message: "Signup success, OTP sent" });
  } catch (error) {
    res.status(500).json({ message: "Signup failed" });
  }
};

export const verifyOtp = async (req: Request, res: Response) => {
  try {
    const { email, otp } = req.body;
    const user = await userRepo.findOne({ where: { email } });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    if (user.otp !== otp || !user.otpExpiry || user.otpExpiry < new Date()) {
      return res.status(400).json({ message: "Invalid or expired OTP" });
    }

    user.isVerified = true;
    user.otp = null!;
    user.otpExpiry = null!;
    await userRepo.save(user);

    res.json({ message: "Email verified successfully" });
  } catch (error) {
    res.status(500).json({ message: "OTP verification failed" });
  }
};

export const signin = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

    const user = await userRepo.findOne({ where: { email } });
    if (!user || !user.isVerified) {
      return res.status(400).json({ message: "User not verified" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET!, {
      expiresIn: "7d",
    });

    res.json({ token });
  } catch (error) {
    res.status(500).json({ message: "Signin failed" });
  }
};
