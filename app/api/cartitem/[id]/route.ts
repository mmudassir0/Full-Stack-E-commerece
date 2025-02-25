import {
  removeCartItem,
  updateCartItemQuantity,
} from "@/services/cartServices";

export async function PATCH(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const { quantity } = await req.json();
    console.log(params.id, quantity);
    const result = await updateCartItemQuantity(params.id, quantity);
    return Response.json(result);
  } catch (error) {
    console.error("Cart update error:", error);

    return Response.json(
      {
        error: "Failed to update cart item",
        details: error instanceof Error ? error.message : String(error),
      },
      { status: 500 }
    );
  }
}

export async function DELETE(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const result = await removeCartItem(params.id);
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
