import nodemailer from 'nodemailer';
import dotenv from 'dotenv';

dotenv.config();

const transporter = nodemailer.createTransport({
  service: 'Gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

export const sendPasswordResetEmail = async (to, resetCode) => {
  const mailOptions = {
    to,
    from: process.env.EMAIL_USER,
    subject: 'Password Reset Code',
    text: `You requested a password reset. Use the following code to reset your password:\n\n${resetCode}\n\nIf you did not request this, please ignore this email.`,
  };

  await transporter.sendMail(mailOptions);
};
