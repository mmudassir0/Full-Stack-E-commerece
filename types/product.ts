import { Prisma } from "@prisma/client";
import { z } from "zod";

export type TProduct = {
  id: number;
  title: string;
  description: string;
  price: number;
  originalPrice?: number;
  image: string;
  colors: string[];
  sizes: string[];
  categories: string[];
};

// --------------------------------------------get product schema-----------------------------------------------------------

export const ProductQuerySchema = z.object({
  page: z.coerce.number().int().positive().optional().default(1),
  limit: z.coerce.number().int().min(1).max(100).optional().default(10),
  search: z.string().optional(),
  category: z.string().optional(),
  minPrice: z.coerce.number().min(0).optional(),
  maxPrice: z.coerce.number().min(0).optional(),
  inStock: z.coerce.boolean().optional(),
  sortBy: z
    .enum(["createdAt", "name", "basePrice", "salePrice"])
    .optional()
    .default("createdAt"),
  sortOrder: z.enum(["asc", "desc"]).optional().default("desc"),
});

// ---------------------------------------create or update schema-------------------------------------------------------------

const ColorEnum = z.enum([
  "RED",
  "BLUE",
  "GREEN",
  "BLACK",
  "WHITE",
  "GRAY",
  "YELLOW",
  "PURPLE",
  "PINK",
  "ORANGE",
  "BROWN",
]);

const SizeEnum = z.enum(["XXS", "XS", "S", "M", "L", "XL", "XXL", "XXXL"]);

// Variant Schema
const ProductVariantSchema = z.object({
  id: z.string().optional(), // Allow existing variant updates
  color: ColorEnum.optional(),
  size: SizeEnum.optional(),
  stockQuantity: z
    .number()
    .int()
    .min(0, "Stock quantity cannot be negative")
    .default(0),
  additionalPrice: z.number().optional(),
  sku: z.string().optional(),
});

// Image Schema
const ProductImageSchema = z.object({
  id: z.string().optional(), // Allow existing image updates
  url: z.string().url("Invalid image URL"),
  alt: z.string().optional(),
  isPrimary: z.boolean().optional(),
});

const BaseProductSchema = z.object({
  name: z.string().min(2, "Product name must be at least 2 characters"),
  description: z.string().min(10, "Description must be at least 10 characters"),
  basePrice: z.number().positive("Base price must be positive"),
  discountPercentage: z.number().min(0).max(100).optional(),
  brand: z.string().optional(),
  isInStock: z.boolean().optional(),
  isDiscontinued: z.boolean().optional(),
});

// Product Create Schema
export const ProductCreateSchema = BaseProductSchema.extend({
  categories: z.array(z.string()).min(1, "At least one category is required"),
  variants: z.array(ProductVariantSchema).optional(),
  productImages: z.array(ProductImageSchema).optional(),
});

// Product Update Schema
export const ProductUpdateSchema = BaseProductSchema.partial().extend({
  categories: z.array(z.string()).optional(),
  variants: z.array(ProductVariantSchema).optional(),
  productImages: z.array(ProductImageSchema).optional(),
});

// -----------------------------------------------------------------------------------

export type ProductCreateInput = Prisma.ProductCreateInput;
export type ProductUpdateInput = Prisma.ProductUpdateInput;
export type ProductWhereUniqueInput = Prisma.ProductWhereUniqueInput;
