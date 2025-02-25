import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function createActivityLog(
  userId: string,
  action: string,
  ipAddress: string,
  deviceDetails: string
) {
  try {
    const activityLog = await prisma.activityLog.create({
      data: {
        userId,
        action,
        ipAddress,
        deviceDetails,
      },
    });
    return activityLog;
  } catch (error) {
    console.error("Error creating activity log:", error);
    throw error;
  }
}
