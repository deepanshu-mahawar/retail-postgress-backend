import nodemailer from "nodemailer";

export const sendOtpEmail = async (email: string, otp: string) => {
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.EMAIL,
      pass: process.env.EMAIL_PASS,
    },
  });

  await transporter.sendMail({
    from: "OTP Auth App",
    to: email,
    subject: "Your OTP Code",
    html: `<h2>Your OTP is: ${otp}</h2>`,
  });
};
