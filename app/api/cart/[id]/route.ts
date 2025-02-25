import { clearCart } from "@/services/cartServices";

export async function DELETE(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const result = await clearCart(params.id);
    console.log(result, "result");
    return Response.json(result);
  } catch (error) {
    console.error("Cart delete error:", error);

    return Response.json(
      {
        error: "Failed to delete cart item",
        details: error instanceof Error ? error.message : String(error),
      },
      { status: 500 }
    );
  }
}
