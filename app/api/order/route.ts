import { createOrder, OrderServiceError } from "@/services/orderService";
import { createOrderSchema } from "@/types/order";
import { z } from "zod";

export async function POST(req: Request) {
  try {
    const body = await req.json();

    // Validate the request body
    const validatedData = createOrderSchema.parse(body);
    console.log(validatedData.address.newAddress, "validatedData");

    const order = await createOrder(validatedData);

    return Response.json(
      { message: "Order created Successfully", order },
      { status: 201 }
    );
  } catch (error) {
    if (error instanceof z.ZodError) {
      return Response.json(
        {
          message: "Invalid request data",
          errors: error.errors,
        },
        { status: 400 }
      );
    }

    if (error instanceof OrderServiceError) {
      return Response.json(
        { message: error.message },
        { status: error.status }
      );
    }
    console.error("[Order API Error]:", error);
    return Response.json(
      {
        message: "Internal server error",
      },
      { status: 500 }
    );
  }
}

// --------------------------------------------------------------------------------------------------

// // app/api/orders/[id]/route.ts (Get Order by ID)
// import { PrismaClient } from "@prisma/client";
// import { NextResponse } from "next/server";
// import { getServerSession } from "next-auth/next";
// import { authOptions } from "@/app/api/auth/[...nextauth]/route";

// const prisma = new PrismaClient();

// export async function GET(
//   request: Request,
//   { params }: { params: { id: string } }
// ) {
//   const session = await getServerSession(authOptions);
//   if (!session) {
//     return NextResponse.json({ message: "unAuthorized" }, { status: 401 });
//   }
//   try {
//     const order = await prisma.order.findUnique({
//       where: { id: params.id },
//       include: {
//         orderItems: {
//           include: {
//             product: {
//               include: {
//                 productImages: true,
//               },
//             },
//             variant: true,
//           },
//         },
//         shippingAddress: true,
//         user: true,
//         Refund: true,
//         OrderStatusHistory: true,
//       },
//     });

//     if (!order) {
//       return NextResponse.json({ error: "Order not found" }, { status: 404 });
//     }

//     // Authorization: Check if the user owns the order or is an admin
//     if (session.user.role !== "ADMIN" && order.userId !== session.user.id) {
//       return NextResponse.json({ message: "Forbidden" }, { status: 403 });
//     }

//     return NextResponse.json(order);
//   } catch (error) {
//     console.error("Error fetching order:", error);
//     return NextResponse.json(
//       { error: "Failed to fetch order" },
//       { status: 500 }
//     );
//   } finally {
//     await prisma.$disconnect();
//   }
// }

// app/api/orders/route.ts (Get All Orders - Admin Only)
// import { PrismaClient } from "@prisma/client";
// import { NextResponse } from "next/server";
// import { getServerSession } from "next-auth/next";
// import { authOptions } from "@/app/api/auth/[...nextauth]/route";

// const prisma = new PrismaClient();

// export async function GET(request: Request) {
//   const session = await getServerSession(authOptions);
//   if (!session) {
//     return NextResponse.json({ message: "unAuthorized" }, { status: 401 });
//   }
//   if (session.user.role !== "ADMIN") {
//     return NextResponse.json({ message: "Forbidden" }, { status: 403 });
//   }
//   try {
//     const orders = await prisma.order.findMany({
//       include: {
//         orderItems: {
//           include: {
//             product: {
//               include: {
//                 productImages: true,
//               },
//             },
//             variant: true,
//           },
//         },
//         shippingAddress: true,
//         user: true,
//         Refund: true,
//         OrderStatusHistory: true,
//       },
//     });
//     return NextResponse.json(orders);
//   } catch (error) {
//     console.error("Error fetching orders:", error);
//     return NextResponse.json(
//       { error: "Failed to fetch orders" },
//       { status: 500 }
//     );
//   } finally {
//     await prisma.$disconnect();
//   }
// }
