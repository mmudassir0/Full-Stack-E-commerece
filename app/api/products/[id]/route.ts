import { auth } from "@/lib/auth";
import { softDeleteProduct, updateProduct } from "@/services/productService";
import { z } from "zod";

export async function PATCH(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    // const session = await auth();
    // if (!(session?.user?.role === "ADMIN")) {
    //   return Response.json({ message: "Unauthorized" }, { status: 403 });
    // }

    const formData = await req.formData();
    const updatedProduct = await updateProduct(params.id, formData);

    return new Response(
      JSON.stringify({
        message: "Product updated successfully",
        product: updatedProduct,
      }),
      { status: 200 }
    );
  } catch (error) {
    if (error instanceof z.ZodError) {
      return new Response(
        JSON.stringify({
          error: "Validation failed",
          details: error.errors,
        }),
        { status: 400 }
      );
    }

    console.error("Product update error:", error);
    return new Response(JSON.stringify({ error: "Failed to update product" }), {
      status: 500,
    });
  }
}
export async function DELETE(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const session = await auth();
    if (!(session?.user?.role === "ADMIN")) {
      return Response.json({ message: "Unauthorized" }, { status: 403 });
    }

    const softDeletedProduct = await softDeleteProduct(params.id);

    return new Response(
      JSON.stringify({
        message: "Product soft deleted successfully",
        product: softDeletedProduct,
      }),
      { status: 200 }
    );
  } catch (error) {
    console.error("Product soft delete error:", error);

    if (
      error instanceof Error &&
      error.message === "Product not found or already deleted"
    ) {
      return new Response(
        JSON.stringify({ error: "Product not found or already deleted" }),
        { status: 404 }
      );
    }

    return new Response(
      JSON.stringify({ error: "Failed to soft delete product" }),
      { status: 500 }
    );
  }
}
