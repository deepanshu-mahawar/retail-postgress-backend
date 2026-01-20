import { AppDataSource } from "../config/data-source";
import { User } from "../entity/User";
import { Request, Response } from "express";
import bcrypt from "bcrypt";
import { generateOtp } from "../utils/generateOtp";
import { sendOtpEmail } from "../utils/sendEmail";
import jwt from "jsonwebtoken";

const userRepo = AppDataSource.getRepository(User);

// export const signup = async (req: Request, res: Response) => {
//   try {
//     const { username, email, password } = req.body;

//     const existingUser = await userRepo.findOne({ where: { email } });
//     if (existingUser) {
//       return res.status(400).json({ message: "User already exits" });
//     }

//     const hashedPassword = await bcrypt.hash(password, 10);
//     const otp = generateOtp();

//     const user = userRepo.create({
//       username,
//       email,
//       password: hashedPassword,
//       otp,
//       otpExpiry: new Date(Date.now() + 5 * 60 * 1000),
//     });

//     await userRepo.save(user);
//     await sendOtpEmail(email, otp);

//     res.json({ message: "Signup success, OTP sent" });
//   } catch (error) {
//     res.status(500).json({ message: "Signup failed" });
//   }
// };

export const signup = async (req: Request, res: Response) => {
  try {
    console.log("📥 Signup API called");
    console.log("👉 Request body:", req.body);

    const { username, email, password } = req.body;

    console.log("🔍 Checking if user already exists for email:", email);
    const existingUser = await userRepo.findOne({ where: { email } });

    if (existingUser) {
      console.log("⚠️ User already exists:", existingUser.id);
      return res.status(400).json({ message: "User already exists" });
    }

    console.log("🔐 Hashing password...");
    const hashedPassword = await bcrypt.hash(password, 10);

    const otp = generateOtp();
    console.log("🔢 Generated OTP:", otp);

    const otpExpiry = new Date(Date.now() + 5 * 60 * 1000);
    console.log("⏰ OTP expiry:", otpExpiry);

    const user = userRepo.create({
      username,
      email,
      password: hashedPassword,
      otp,
      otpExpiry,
    });

    console.log("💾 Saving user to database...");
    await userRepo.save(user);

    console.log("📧 Sending OTP email...");
    await sendOtpEmail(email, otp);

    console.log("✅ Signup successful");
    res.json({ message: "Signup success, OTP sent" });
  } catch (error) {
    console.error("❌ Signup failed:", error);
    res.status(500).json({ message: "Signup failed" });
  }
};

// export const verifyOtp = async (req: Request, res: Response) => {
//   try {
//     const { email, otp } = req.body;
//     const user = await userRepo.findOne({ where: { email } });

//     if (!user) {
//       return res.status(404).json({ message: "User not found" });
//     }

//     if (user.otp !== otp || !user.otpExpiry || user.otpExpiry < new Date()) {
//       return res.status(400).json({ message: "Invalid or expired OTP" });
//     }

//     user.isVerified = true;
//     user.otp = null!;
//     user.otpExpiry = null!;
//     await userRepo.save(user);

//     res.json({ message: "Email verified successfully" });
//   } catch (error) {
//     res.status(500).json({ message: "OTP verification failed" });
//   }
// };

export const verifyOtp = async (req: Request, res: Response) => {
  try {
    console.log("📥 Verify OTP API called");
    console.log("👉 Request body:", req.body);

    const { email, otp } = req.body;

    console.log("🔍 Finding user with email:", email);
    const user = await userRepo.findOne({ where: { email } });

    if (!user) {
      console.log("❌ User not found");
      return res.status(404).json({ message: "User not found" });
    }

    console.log("👤 User found:", user.id);
    console.log("🔢 Stored OTP:", user.otp);
    console.log("🔢 Received OTP:", otp);
    console.log("⏰ OTP Expiry:", user.otpExpiry);
    console.log("⏳ Current Time:", new Date());

    if (user.otp !== otp || !user.otpExpiry || user.otpExpiry < new Date()) {
      console.log("⚠️ Invalid or expired OTP");
      return res.status(400).json({ message: "Invalid or expired OTP" });
    }

    console.log("✅ OTP verified successfully");

    user.isVerified = true;
    user.otp = null!;
    user.otpExpiry = null!;

    console.log("💾 Updating user verification status...");
    await userRepo.save(user);

    console.log("🎉 Email verification completed");
    res.json({ message: "Email verified successfully" });
  } catch (error) {
    console.error("❌ OTP verification failed:", error);
    res.status(500).json({ message: "OTP verification failed" });
  }
};

// export const signin = async (req: Request, res: Response) => {
//   try {
//     const { email, password } = req.body;

//     const user = await userRepo.findOne({ where: { email } });
//     if (!user || !user.isVerified) {
//       return res.status(400).json({ message: "User not verified" });
//     }

//     const isMatch = await bcrypt.compare(password, user.password);
//     if (!isMatch) {
//       return res.status(400).json({ message: "Invalid credentials" });
//     }

//     const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET!, {
//       expiresIn: "7d",
//     });

//     res.json({ token });
//   } catch (error) {
//     res.status(500).json({ message: "Signin failed" });
//   }
// };

export const signin = async (req: Request, res: Response) => {
  try {
    console.log("📥 Signin API called");
    console.log("👉 Request body:", req.body);

    const { email, password } = req.body;

    console.log("🔍 Finding user with email:", email);
    const user = await userRepo.findOne({ where: { email } });

    if (!user) {
      console.log("❌ User not found");
      return res.status(400).json({ message: "User not found" });
    }

    if (!user.isVerified) {
      console.log("⚠️ User not verified:", user.id);
      return res.status(400).json({ message: "User not verified" });
    }

    console.log("🔐 Comparing passwords...");
    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      console.log("❌ Password mismatch for user:", user.id);
      return res.status(400).json({ message: "Invalid credentials" });
    }

    console.log("🔑 Generating JWT token...");
    const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET!, {
      expiresIn: "7d",
    });

    console.log("✅ Signin successful for user:", user.id);
    res.json({ token });
  } catch (error) {
    console.error("❌ Signin failed:", error);
    res.status(500).json({ message: "Signin failed" });
  }
};

export const me = async (req: Request, res: Response) => {
  try {
  } catch (error) {}
};
