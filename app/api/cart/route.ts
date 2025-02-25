import { createCart, getCart } from "@/services/cartServices";
import { z } from "zod";

export async function POST(req: Request) {
  console.time("createCart");
  try {
    const cartData = await req.json();

    const result = await createCart(cartData);
    console.timeEnd("createCart");
    return Response.json(result, { status: 201 });
  } catch (error) {
    console.timeEnd("createCart");
    console.error("Cart creation/update error:", error);

    if (error instanceof z.ZodError) {
      return Response.json(
        {
          error: "Validation failed",
          details: error.errors,
        },
        { status: 400 }
      );
    }

    return Response.json(
      {
        error: "Failed to process cart",
        details: error instanceof Error ? error.message : String(error),
      },
      { status: 500 }
    );
  }
}

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const userId = searchParams.get("userId")!;

    const result = await getCart(userId);
    return Response.json(result);
  } catch (error) {
    console.error("Cart retrieval error:", error);

    return Response.json(
      {
        error: "Failed to process cart",
        details: error instanceof Error ? error.message : String(error),
      },
      { status: 500 }
    );
  }
}
