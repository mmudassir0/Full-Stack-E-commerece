import jwt from "jsonwebtoken";

const ACCESS_TOKEN_EXPIRY = "15m"; // 15 minutes
const REFRESH_TOKEN_EXPIRY = "7d"; // 7 days
const JWT_SECRET = process.env.JWT_SECRET!;
const JWT_REFRESH_SECRET = process.env.JWT_REFRESH_SECRET!;

interface TokenPayload {
  userId: string;
  email: string;
  role: string;
}

export const generateAccessToken = (payload: TokenPayload) => {
  return jwt.sign(payload, JWT_SECRET, {
    expiresIn: ACCESS_TOKEN_EXPIRY,
  });
};

export const generateRefreshToken = (payload: TokenPayload) => {
  return jwt.sign(payload, JWT_REFRESH_SECRET, {
    expiresIn: REFRESH_TOKEN_EXPIRY,
  });
};

export const verifyToken = async (token: string, secret: string) => {
  try {
    const decoded = jwt.verify(token, secret) as TokenPayload & { exp: number };
    return {
      valid: true,
      expired: false,
      decoded,
    };
  } catch (error) {
    return {
      valid: false,
      expired: error.name === "TokenExpiredError",
      decoded: null,
    };
  }
};
