import { db } from "@/lib/db";
import {
  addressSchema,
  createOrderSchema,
  updateOrderSchema,
  orderItem,
} from "@/types/order";
import {
  Prisma,
  PrismaClient,
  OrderStatus,
  PaymentStatus,
} from "@prisma/client";
import { z } from "zod";

type PrismaT = Omit<
  PrismaClient<Prisma.PrismaClientOptions>,
  "$connect" | "$disconnect" | "$on" | "$transaction" | "$use" | "$extends"
>;
export class OrderServiceError extends Error {
  constructor(message: string, public status: number = 400) {
    super(message);
    this.name = "OrderServiceError";
  }
}

interface ProductVariantWithDetails {
  id: string;
  stockQuantity: number;
  additionalPrice: number | null;
  requestedQuantity: number;
  product: {
    id: string;
    basePrice: number;
    salePrice: number | null;
    isDiscontinued: boolean;
    isDeleted: boolean;
  };
}

export async function createOrder(
  validatedData: z.infer<typeof createOrderSchema>
) {
  const order = await db.$transaction(
    async (prisma) => {
      // 1. Verify user and get their details
      await verifyUser(validatedData.userId, prisma);
      // 2. Verify address
      const shippingAddress = await processAddress(
        validatedData.address,
        validatedData.userId,
        prisma
      );

      //  Verify all products and variants exist and are in stock
      const validatedItems = await verifyOrderItems(
        validatedData.orderItems,
        prisma
      );

      const subtotal = calculateSubtotal(validatedItems);

      // Apply coupon
      const { discount, appliedCoupon } = await processCoupon(
        validatedData.couponCode,
        subtotal,
        prisma
      );

      const totalAmount = subtotal - discount;

      const newOrder = await createOrderRecord(
        validatedData,
        validatedItems,
        totalAmount,
        shippingAddress,
        appliedCoupon?.id,
        prisma
      );

      await updateInventory(validatedItems, prisma);

      // Clear  cart
      await clearCart(validatedData.userId, prisma);

      //  Log the activity
      await logOrderActivity(validatedData.userId, newOrder.id, prisma);

      // return order

      return newOrder;
    },
    {
      maxWait: 5000,
      timeout: 10000,
    }
  );
  return order;
}

export async function updateOrder(
  validatedData: z.infer<typeof updateOrderSchema>
) {
  const order = await db.$transaction(
    async (prisma) => {
      const existingOrder = await prisma.order.findUnique({
        where: { id: validatedData.id },
        include: { orderItems: true },
      });

      if (!existingOrder) {
        throw new OrderServiceError("Order not found", 404);
      }

      // Update order details
      const updatedOrder = await prisma.order.update({
        where: { id: validatedData.id },
        data: {
          orderStatus: validatedData.orderStatus,
          paymentStatus: validatedData.paymentStatus,
          // ...other fields to update...
        },
        include: { orderItems: true },
      });

      return updatedOrder;
    },
    {
      maxWait: 5000,
      timeout: 10000,
    }
  );
  return order;
}

export async function deleteOrder(orderId: string) {
  await db.$transaction(
    async (prisma) => {
      const existingOrder = await prisma.order.findUnique({
        where: { id: orderId },
      });

      if (!existingOrder) {
        throw new OrderServiceError("Order not found", 404);
      }

      await prisma.order.delete({
        where: { id: orderId },
      });
    },
    {
      maxWait: 5000,
      timeout: 10000,
    }
  );
}

// helper function

//  Verify User
async function verifyUser(userId: string, prisma: PrismaT) {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: { id: true, email: true },
  });

  if (!user) {
    throw new OrderServiceError("User not found", 404);
  }

  return user;
}

//  Process Address
async function processAddress(
  addressData: z.infer<typeof addressSchema>,
  userId: string,
  prisma: PrismaT
) {
  if (addressData.newAddress) {
    return prisma.address.create({
      data: { ...addressData.newAddress, userId },
    });
  } else {
    const existingAddress = await prisma.address.findFirst({
      where: {
        id: addressData.addressId,
        userId,
      },
    });

    if (!existingAddress) {
      throw new OrderServiceError("Invalid shipping address", 400);
    }

    return existingAddress;
  }
}

async function verifyOrderItems(
  orderItems: z.infer<typeof orderItem>,
  prisma: PrismaT
) {
  const productVariants = await prisma.productVariant.findMany({
    where: {
      id: { in: orderItems.map((item) => item.variantId) },
    },
    include: {
      product: {
        select: {
          id: true,
          basePrice: true,
          salePrice: true,
          isDiscontinued: true,
          isDeleted: true,
        },
      },
    },
  });

  if (productVariants.length !== orderItems.length) {
    throw new OrderServiceError("One or more product variants not found", 400);
  }

  const validatedVariants = productVariants.map((variant) => {
    const item = orderItems.find((item) => item.variantId === variant.id);

    if (!item) {
      throw new OrderServiceError(
        `Order item not found for variant ${variant.id}`,
        400
      );
    }

    if (variant.stockQuantity < item.quantity) {
      throw new OrderServiceError(
        `Insufficient stock for variant ${variant.id}`,
        400
      );
    }

    if (variant.product.isDiscontinued || variant.product.isDeleted) {
      throw new OrderServiceError(
        `Product ${variant.product.id} is no longer available`,
        400
      );
    }

    return {
      ...variant,
      requestedQuantity: item.quantity,
    };
  });

  return validatedVariants;
}

const calculateSubtotal = (variants: ProductVariantWithDetails[]): number => {
  return variants.reduce((sum, variant) => {
    const basePrice = variant.product.salePrice ?? variant.product.basePrice;
    const finalPrice = basePrice + (variant.additionalPrice ?? 0);
    return sum + finalPrice * variant.requestedQuantity;
  }, 0);
};

// Helper function to validate and apply coupon
async function processCoupon(
  couponCode: string | undefined,
  subtotal: number,
  prisma: PrismaT
) {
  if (!couponCode) {
    return { discount: 0, appliedCoupon: null };
  }
  const coupon = await prisma.coupon.findFirst({
    where: {
      code: couponCode,
      isActive: true,
      expiresAt: {
        gt: new Date(),
      },
    },
  });

  if (!coupon) {
    throw new OrderServiceError("Invalid or expired coupon code", 400);
  }

  const discount = (subtotal * coupon.discount) / 100;
  return { discount, appliedCoupon: coupon };
}

async function createOrderRecord(
  validatedData: z.infer<typeof createOrderSchema>,
  validatedItems: ProductVariantWithDetails[],
  totalAmount: number,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  shippingAddress: any,
  appliedCouponId: string | undefined,
  prisma: PrismaT
) {
  let shippingAddressId: string;

  if (validatedData.address.newAddress) {
    const newAddress = await prisma.address.create({
      data: {
        userId: validatedData.userId,
        ...validatedData.address.newAddress,
      },
    });
    shippingAddressId = newAddress.id;
  } else if (validatedData.address.addressId) {
    shippingAddressId = shippingAddress.addressId;
  } else {
    throw new OrderServiceError("No valid shipping address provided");
  }
  return await prisma.order.create({
    data: {
      userId: validatedData.userId,
      totalAmount,
      paymentMethod: validatedData.paymentMethod,
      paymentStatus: PaymentStatus.PENDING,
      orderStatus: OrderStatus.PENDING,
      shippingAddressId,
      orderItems: {
        create: validatedItems.map((item) => ({
          productId: item.product.id,
          variantId: item.id,
          quantity: item.requestedQuantity,
          price:
            (item.product.salePrice ?? item.product.basePrice) +
            (item.additionalPrice ?? 0),
        })),
      },

      ...(appliedCouponId && { couponId: appliedCouponId }),
    },
    include: {
      orderItems: {
        include: {
          product: true,
          variant: true,
        },
      },
      shippingAddress: true,
    },
  });
}

async function updateInventory(
  variants: ProductVariantWithDetails[],
  prisma: PrismaT
) {
  await Promise.all(
    variants.map((variant) =>
      prisma.productVariant.update({
        where: {
          id: variant.id,
          stockQuantity: { gte: variant.requestedQuantity },
        },
        data: {
          stockQuantity: { decrement: variant.requestedQuantity },
        },
      })
    )
  );
}

async function clearCart(userId: string, prisma: PrismaT) {
  await prisma.cartItem.deleteMany({
    where: {
      cart: {
        userId,
      },
    },
  });
}

async function logOrderActivity(
  userId: string,
  orderId: string,
  prisma: PrismaT
) {
  await prisma.activityLog.create({
    data: {
      userId,
      action: `ORDER_CREATED`,
    },
  });
}
