import jwt from "jsonwebtoken";
import { db } from "@/lib/db";
import { NextRequest } from "next/server";

const ACCESS_TOKEN_EXPIRY = "15m"; // 15 minutes
const REFRESH_TOKEN_EXPIRY = "7d"; // 7 days
const JWT_SECRET = process.env.JWT_SECRET!;
const JWT_REFRESH_SECRET = process.env.JWT_REFRESH_SECRET!;

interface TokenPayload {
  userId: string;
  email: string;
  role: string;
}

async function generateTokens(payload: TokenPayload) {
  const accessToken = jwt.sign(payload, JWT_SECRET, {
    expiresIn: ACCESS_TOKEN_EXPIRY,
  });

  const refreshToken = jwt.sign(payload, JWT_REFRESH_SECRET, {
    expiresIn: REFRESH_TOKEN_EXPIRY,
  });

  return {
    accessToken,
    refreshToken,
    accessTokenExpiry: new Date(Date.now() + 15 * 60 * 1000), // 15 minutes
    refreshTokenExpiry: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days
  };
}

export async function POST(req: NextRequest) {
  try {
    // const { refreshToken } = await req.json();
    const refreshToken = req.cookies.get("refreshToken")?.value;

    if (!refreshToken) {
      return Response.json(
        { error: "Refresh token is required" },
        { status: 400 }
      );
    }

    const decoded = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET!);
    if (!decoded) {
      return Response.json(
        { error: "Invalid or expired refresh token" },
        { status: 401 }
      );
    }

    const existingToken = await db.userToken.findFirst({
      where: {
        refreshToken,
        isRevoked: false,
      },
      include: {
        user: true,
      },
    });

    if (!existingToken || existingToken.isRevoked) {
      return Response.json(
        { error: "Invalid or expired refresh token" },
        { status: 401 }
      );
    }

    if (existingToken.expiresAt < new Date()) {
      await db.userToken.update({
        where: { id: existingToken.id },
        data: { isRevoked: true },
      });
      return Response.json(
        { error: "Refresh token has expired" },
        { status: 401 }
      );
    }

    const tokenPayload: TokenPayload = {
      userId: existingToken.user.id,
      email: existingToken.user.email,
      role: existingToken.user.role,
    };

    const {
      accessToken: newAccessToken,
      refreshToken: newRefreshToken,
      accessTokenExpiry,
      refreshTokenExpiry,
    } = await generateTokens(tokenPayload);

    await db.userToken.update({
      where: { id: existingToken.id },
      data: {
        accessToken: newAccessToken,
        refreshToken: newRefreshToken,
        expiresAt: refreshTokenExpiry,
        updatedAt: new Date(),
        isRevoked: false,
      },
    });

    return Response.json(
      {
        accessToken: newAccessToken,
        refreshToken: newRefreshToken,
        accessTokenExpiry,
        refreshTokenExpiry,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error refreshing access token:", error);
    return Response.json({ error: " Internal server error" }, { status: 500 });
  }
}
