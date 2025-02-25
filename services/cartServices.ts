import { db } from "@/lib/db";
import { CretaeCartSchema } from "@/types/cart";
import { z } from "zod";

// --------------------------------------------create cart----------------------------------------------

export const createCart = async (
  cartData: z.infer<typeof CretaeCartSchema>
) => {
  const validateCart = CretaeCartSchema.parse(cartData);

  const result = await db.$transaction(
    async (prisma) => {
      // check user exists
      const user = await prisma.user.findUnique({
        where: { id: validateCart.userId },
      });
      if (!user) throw new Error("User not found");

      // Find existing cart for the user or create a new one
      let cart = await prisma.cart.findFirst({
        where: { userId: validateCart.userId },
        include: { items: true },
      });

      // If no cart exists, create a new one
      if (!cart) {
        cart = await prisma.cart.create({
          data: {
            userId: validateCart.userId,
          },
          include: { items: true },
        });
      }

      // Process each item
      for (const item of validateCart.items) {
        // Validate product and variant
        const product = await prisma.product.findUnique({
          where: { id: item.productId },
        });
        if (!product) throw new Error(`Product ${item.productId} not found`);

        const variant = await prisma.productVariant.findUnique({
          where: {
            id: item.variantId,
            productId: item.productId,
          },
        });
        if (!variant)
          throw new Error(`Product variant ${item.variantId} not found`);

        // Check if cart item already exists
        const existingCartItem = await prisma.cartItem.findFirst({
          where: {
            cartId: cart.id,
            productId: item.productId,
            variantId: item.variantId,
          },
        });

        if (existingCartItem) {
          // Update quantity if item already exists
          await prisma.cartItem.update({
            where: { id: existingCartItem.id },
            data: {
              quantity: existingCartItem.quantity + item.quantity,
            },
          });
        } else {
          // Create new cart item if it doesn't exist
          await prisma.cartItem.create({
            data: {
              cartId: cart.id,
              productId: item.productId,
              variantId: item.variantId,
              quantity: item.quantity,
            },
          });
        }
      }

      // Fetch the updated cart with items
      return prisma.cart.findUnique({
        where: { id: cart.id },
        include: { items: true },
      });
    },
    { timeout: 10000 }
  );
  return result;
};
// --------------------------------get cart------------------------------------------------

export const getCart = async (userId: string) => {
  if (!userId) {
    return Response.json({ error: "User ID is required" }, { status: 400 });
  }
  const user = await db.user.findUnique({
    where: { id: userId },
  });
  if (!user) {
    return Response.json({ error: "user not found" });
  }

  const cart = await db.cart.findFirst({
    where: { userId },
    include: {
      items: {
        include: {
          product: {
            include: {
              productImages: {
                where: { isPrimary: true },
              },
            },
          },
          variant: true,
        },
        orderBy: { createdAt: "desc" },
      },
    },
  });

  if (!cart) {
    return {
      id: null,
      userId,
      items: [],
      createdAt: new Date(),
      updatedAt: new Date(),
    };
  }

  const totalValue = cart.items.reduce((total, item) => {
    return (
      total + (item.product.salePrice || item.product.basePrice) * item.quantity
    );
  }, 0);
  return { ...cart, totalValue };
};

// --------------------------------------update cart quantity----------------------------------------------------------

export const updateCartItemQuantity = async (
  cartItemId: string,
  quantity: number
) => {
  return db.$transaction(async (prisma) => {
    const cartItem = await prisma.cartItem.findFirst({
      where: { id: cartItemId },
      include: {
        product: true,
        variant: true,
      },
    });
    if (!cartItem) {
      throw new Error("cart item not found");
    }
    if (cartItem.variant.stockQuantity < quantity) {
      throw new Error("insufficient stock");
    }
    return await prisma.cartItem.update({
      where: {
        id: cartItemId,
      },
      data: { quantity },
      include: {
        product: true,
        variant: true,
      },
    });
  });
};

// --------------------------------------------remove cart item------------------------------------------------------

export const removeCartItem = async (cartItemId: string) => {
  return await db.$transaction(async (prisma) => {
    const cartItem = await prisma.cartItem.findUnique({
      where: { id: cartItemId },
    });
    if (!cartItem) {
      throw new Error("cart item not found");
    }
    return await prisma.cartItem.delete({
      where: { id: cartItemId },
    });
  });
};

// ------------------------------------------clear cart--------------------------------------------------------------

export const clearCart = async (userId: string) => {
  return await db.$transaction(async (prisma) => {
    const cart = await prisma.cart.findFirst({
      where: { id: userId },
    });
    if (!cart) {
      throw new Error("cart not found");
    }
    return await prisma.cartItem.deleteMany({
      where: { cartId: cart.id },
    });
  });
};
