// import { NextResponse } from "next/server";
// import { db } from "@/lib/db";

import { db } from "@/lib/db";
import { createActivityLog } from "@/services/activity-log";

// export async function POST(req: Request) {
//   try {
//     const { action, deviceDetails } = await req.json();
//     const ipAddress =
//       req.headers.get("x-forwarded-for")?.split(",")[0] || "Unknown";

//     if (!action || !deviceDetails) {
//       return NextResponse.json({ error: "Missing data" }, { status: 400 });
//     }

//     await db.activityLog.create({
//       data: {
//         userId: "1",
//         action,
//         ipAddress,
//         deviceDetails,
//       },
//     });

//     return NextResponse.json({ message: "Activity logged successfully" });
//   } catch (error) {
//     console.error("Error logging activity:", error);
//     return NextResponse.json(
//       { error: "Internal server error" },
//       { status: 500 }
//     );
//   }
// }

export async function POST(request: Request) {
  try {
    const { userId } = await request.json();

    // Get IP address from request headers
    const forwardedFor = request.headers.get("x-forwarded-for");
    const ipAddress = forwardedFor ? forwardedFor.split(",")[0] : "Unknown";

    // Get device details from user agent
    const userAgent = request.headers.get("user-agent") || "Unknown";

    // Create activity log entry
    const activityLog = await createActivityLog(
      userId,
      "USER_LOGIN",
      ipAddress,
      userAgent
    );

    return Response.json({
      success: true,
      data: activityLog,
    });
  } catch (error) {
    console.error("Error in activity log API:", error);
    return Response.json(
      {
        success: false,
        error: "Failed to create activity log",
      },
      { status: 500 }
    );
  }
}

// API route handler to get user activity logs
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get("userId");

    if (!userId) {
      return Response.json(
        { success: false, error: "User ID is required" },
        { status: 400 }
      );
    }

    const activityLogs = await db.activityLog.findMany({
      where: {
        userId: userId,
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    return Response.json({
      success: true,
      data: activityLogs,
    });
  } catch (error) {
    console.error("Error fetching activity logs:", error);
    return Response.json(
      {
        success: false,
        error: "Failed to fetch activity logs",
      },
      { status: 500 }
    );
  }
}
