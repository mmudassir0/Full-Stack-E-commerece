import { z } from "zod";

export const CretaeCartSchema = z.object({
  userId: z.string(),
  items: z.array(
    z.object({
      quantity: z.number(),
      productId: z.string(),
      variantId: z.string(),
    })
  ),
});
