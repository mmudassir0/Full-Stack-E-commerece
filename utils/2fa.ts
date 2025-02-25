// utils/2fa.ts
import { db } from "@/lib/db";

// Generate a random 6-digit code
export const generateTwoFactorCode = () => {
  return Math.floor(100000 + Math.random() * 900000).toString();
};

// Create expiry time (10 minutes from now)
export const generateTwoFactorExpiry = () => {
  return new Date(Date.now() + 10 * 60 * 1000); // 10 minutes
};

// Send 2FA code via email
// export const sendTwoFactorEmail = async (email: string, code: string) => {
//   const transporter = createTransport({
//     // Configure your email provider here
//     host: process.env.SMTP_HOST,
//     port: Number(process.env.SMTP_PORT),
//     secure: true,
//     auth: {
//       user: process.env.SMTP_USER,
//       pass: process.env.SMTP_PASS,
//     },
//   });

//   await transporter.sendMail({
//     from: process.env.SMTP_FROM,
//     to: email,
//     subject: 'Your Two-Factor Authentication Code',
//     html: `
//       <div>
//         <h1>Two-Factor Authentication Code</h1>
//         <p>Your verification code is: <strong>${code}</strong></p>
//         <p>This code will expire in 10 minutes.</p>
//         <p>If you didn't request this code, please ignore this email.</p>
//       </div>
//     `,
//   });
// };

// Verify 2FA code
export const verifyTwoFactorCode = async (userId: string, code: string) => {
  const user = await db.user.findUnique({
    where: { id: userId },
  });

  if (!user || !user.twoFactorCode || !user.twoFactorCodeExpires) {
    return false;
  }

  const isCodeValid = user.twoFactorCode === code;
  const isCodeExpired = new Date() > user.twoFactorCodeExpires;

  return isCodeValid && !isCodeExpired;
};

export const saveTwoFactorCode = async (
  userId: string,
  code: string,
  expiresAt: Date
) => {
  await db.user.update({
    where: { id: userId },
    data: {
      twoFactorCode: code,
      twoFactorCodeExpires: expiresAt,
    },
  });
};

// Clear the 2FA code after successful verification or expiry
export const clearTwoFactorCode = async (userId: string) => {
  await db.user.update({
    where: { id: userId },
    data: {
      twoFactorCode: null,
      twoFactorCodeExpires: null,
    },
  });
};
