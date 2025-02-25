import { z } from "zod";

export const addressSchema = z
  .object({
    addressId: z.string().optional(),
    newAddress: z
      .object({
        street: z.string().min(5, "Address must be at least 5 characters"),
        city: z.string().min(2, "City is required"),
        state: z.string().min(2, "State is required"),
        postalCode: z.string().min(4, "Postal code must be valid"),
        country: z.string().min(2, "Country is required"),
      })
      .optional(),
  })
  .refine((data) => data.newAddress || data.addressId, {
    message: "Either newAddress or addressId must be provided",
  });

export const orderItem = z
  .array(
    z.object({
      productId: z.string().min(1, "Product ID is required"),
      variantId: z.string().min(1, "Variant ID is required"),
      quantity: z.number().int().positive("Quantity must be greater than 0"),
    })
  )
  .nonempty("Order must contain at least one item")
  .max(10, "Order can have at most 10 items");

export const createOrderSchema = z.object({
  userId: z.string().min(1, "User ID is required"),
  orderItems: orderItem,
  paymentMethod: z.enum([
    "CREDIT_CARD",
    "DEBIT_CARD",
    "PAYPAL",
    "CASH_ON_DELIVERY",
    "BANK_TRANSFER",
  ]),
  couponCode: z.string().optional(),
  address: addressSchema,
});
