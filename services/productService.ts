import { db } from "@/lib/db";
import { ImageUploadService } from "@/services/imageUploadService";
import { ProductCreateSchema, ProductUpdateSchema } from "@/types/product";
import { v4 as uuidv4 } from "uuid";
import { z } from "zod";

/**
 * Parse product data from form data
 * @param formData FormData containing product information
 * @param isUpdate Whether this is an update operation
 * @returns Validated product data
 */

export const parseProductData = (
  formData: FormData,
  isUpdate: boolean = false
) => {
  const productData = {
    name: formData.get("name")?.toString(),
    description: formData.get("description")?.toString(),
    basePrice: formData.get("basePrice")
      ? parseFloat(formData.get("basePrice")?.toString() || "0")
      : undefined,
    discountPercentage: formData.get("discountPercentage")
      ? parseFloat(formData.get("discountPercentage")?.toString() || "0")
      : undefined,
    brand: formData.get("brand")?.toString(),
    categories: formData.get("categories")
      ? JSON.parse(formData.get("categories")?.toString() || "[]")
      : undefined,
    variants: formData.get("variants")
      ? JSON.parse(formData.get("variants")?.toString() || "[]")
      : [],
    isInStock: formData.get("isInStock")
      ? formData.get("isInStock")?.toString() === "true"
      : undefined,
    isDiscontinued: formData.get("isDiscontinued")
      ? formData.get("isDiscontinued")?.toString() === "true"
      : undefined,
  };

  return isUpdate
    ? ProductUpdateSchema.parse(productData)
    : ProductCreateSchema.parse(productData);
};

/**
 * Upload product images
 * @param imageFiles Files to upload
 * @returns Array of uploaded image objects
 */

export async function uploadProductImages(imageFiles: File[]) {
  if (!imageFiles || imageFiles.length === 0) {
    return [];
  }

  return Promise.all(
    imageFiles.map(async (file, index) => {
      const uploadedImage = await ImageUploadService.uploadImage(file);
      return {
        url: uploadedImage.url,
        alt: `Product image ${index + 1}`,
        isPrimary: index === 0,
      };
    })
  );
}

/**
 * Calculate total variant stock and sale price
 * @param validatedData Validated product data
 * @returns Object with totalVariantStock and discountPrice
 */
export function calculateProductMetrics(
  validatedData: z.infer<typeof ProductCreateSchema>
) {
  const totalVariantStock =
    validatedData.variants?.reduce(
      (total: number, variant) => total + (variant.stockQuantity || 0),
      0
    ) ?? 0;

  let discountPrice = 0;
  if (validatedData.basePrice && validatedData.discountPercentage) {
    discountPrice =
      validatedData.basePrice * (1 - validatedData.discountPercentage / 100);
  }

  return { totalVariantStock, discountPrice };
}

/**
 * Create a new product
 * @param formData Form data for product creation
 * @returns Created product
 */
export async function createProduct(formData: FormData) {
  // Validate product data
  const validatedData = parseProductData(formData, false) as z.infer<
    typeof ProductCreateSchema
  >;

  // Upload images
  const imageFiles = formData.getAll("images") as File[];

  const uploadedImages = await uploadProductImages(imageFiles);

  if (!uploadedImages.length) {
    throw new Error("At least one image is required");
  }

  // Calculate metrics
  const { totalVariantStock, discountPrice } =
    calculateProductMetrics(validatedData);

  // Create product
  const product = await db.product.create({
    data: {
      ...validatedData,
      totalVariantStock,
      salePrice: discountPrice,
      isInStock: totalVariantStock > 0,
      categories: {
        connect: validatedData.categories?.map((id: string) => ({ id })),
      },
      variants: validatedData.variants
        ? {
            create: validatedData.variants.map((variant) => ({
              color: variant.color,
              size: variant.size,
              stockQuantity: variant.stockQuantity,
              additionalPrice: variant.additionalPrice,
              sku: variant.sku || `SKU-${uuidv4()}`,
            })),
          }
        : undefined,
      productImages: {
        create: uploadedImages,
      },
    },
    include: {
      categories: true,
      productImages: true,
      variants: true,
    },
  });

  return product;
}

// -------------------------------update------------------------------------------

/**
 * Update an existing product
 * @param productId ID of the product to update
 * @param formData Form data for product update
 * @returns Updated product
 */
export async function updateProduct(productId: string, formData: FormData) {
  // Validate product data
  const validatedData = parseProductData(formData, true) as z.infer<
    typeof ProductCreateSchema
  >;

  // Check if product exists
  const existingProduct = await db.product.findUnique({
    where: { id: productId },
    include: {
      categories: true,
      variants: true,
      productImages: true,
    },
  });

  if (!existingProduct) {
    throw new Error("Product not found");
  }

  // Upload new images
  const imageFiles = formData.getAll("images") as File[];
  const uploadedImages = await uploadProductImages(imageFiles);

  // Calculate metrics
  const { totalVariantStock, discountPrice } =
    calculateProductMetrics(validatedData);

  // Perform update in transaction
  const productUpdate = await db.product.update({
    where: { id: productId },
    data: {
      ...validatedData,
      totalVariantStock,
      salePrice: discountPrice || undefined,
      isInStock: totalVariantStock > 0,

      // Handle categories
      categories: validatedData.categories
        ? {
            disconnect: existingProduct.categories.map((cat) => ({
              id: cat.id,
            })),
            connect: validatedData.categories.map((catId) => ({
              id: catId,
            })),
          }
        : undefined,

      // Handle variants
      variants: validatedData.variants
        ? {
            deleteMany: {},
            create: validatedData.variants.map((variant) => ({
              color: variant.color,
              size: variant.size,
              stockQuantity: variant.stockQuantity || 0,
              additionalPrice: variant.additionalPrice,
              sku: variant.sku || `SKU-${uuidv4()}`,
            })),
          }
        : undefined,

      // Handle product images
      productImages: {
        deleteMany: {},
        create: [
          ...(existingProduct.productImages || [])
            .filter(
              (img) =>
                !validatedData.productImages?.some(
                  (newImg) => newImg.url === img.url
                )
            )
            .map((img) => ({
              url: img.url,
              alt: img.alt,
              isPrimary: false,
            })),
          ...uploadedImages,
        ],
      },
    },
    include: {
      categories: true,
      variants: true,
      productImages: true,
    },
  });

  return productUpdate;
}

// --------------------------------------------delete------------------------------------------------------

// -------------------soft delete-----------------------
/**
 * Soft delete a product
 * @param productId ID of the product to soft delete
 * @returns Soft deleted product
 */

export async function softDeleteProduct(id: string) {
  const existingProduct = await db.product.findUnique({
    where: {
      id,
      deletedAt: null,
    },
  });

  if (!existingProduct) {
    throw new Error("Product not found or already deleted");
  }

  const softDeletedProduct = await db.product.update({
    where: { id },
    data: {
      deletedAt: new Date(),
      isDiscontinued: true,
      isInStock: false,
    },
  });

  return softDeletedProduct;
}
// --------------------restore soft delete----------------------

/**
 * Restore a previously soft-deleted product
 * @param productId ID of the product to restore
 * @returns Restored product
 */

export async function restoreProduct(productId: string) {
  // Check if product exists and is deleted
  const deletedProduct = await db.product.findUnique({
    where: {
      id: productId,
      NOT: { deletedAt: null },
    },
  });

  if (!deletedProduct) {
    throw new Error("Product not found or not deleted");
  }

  // Restore the product
  const restoredProduct = await db.product.update({
    where: { id: productId },
    data: {
      deletedAt: null,
      isDiscontinued: false,
      isInStock: true,
    },
  });

  return restoredProduct;
}

// ---------------------PERMANENT DELETE SOFT DELETED------------------------------------

/**
 * Permanently delete soft-deleted products older than a specified date
 * @param olderThan Date threshold for permanent deletion
 * @returns Number of permanently deleted products
 */

export async function permanentlyDeleteSoftDeletedProducts(olderThan: Date) {
  const { count } = await db.product.deleteMany({
    where: {
      deletedAt: {
        not: null,
        lt: olderThan,
      },
    },
  });

  return count;
}

// ------------------------------Set up middleware to fine soft delete------------------------------

// Extended Prisma middleware to automatically filter out soft-deleted products
// export function setupSoftDeleteMiddleware(prisma: any) {
//   prisma.$use(async (params, next) => {
//     // Intercept findMany, findFirst, findUnique queries
//     if (
//       params.model === "Product" &&
//       ["findMany", "findFirst", "findUnique"].includes(params.action)
//     ) {
//       // If no deletedAt filter specified, add a default filter
//       if (!params.args.where?.deletedAt) {
//         params.args.where = {
//           ...params.args.where,
//           deletedAt: null,
//         };
//       }
//     }

//     return next(params);
//   });
// }

// -----------------------------delete product with all associate tables----------------------------------
/**
 * Delete a product and its associated data
 * @param productId ID of the product to delete
 * @returns Deleted product details
 */
// export async function deleteProduct(productId: string) {
//   // Check if product exists
//   const existingProduct = await db.product.findUnique({
//     where: { id: productId },
//     include: {
//       productImages: true,
//       variants: true,
//     },
//   });

//   if (!existingProduct) {
//     throw new Error("Product not found");
//   }

//   // Delete images from Cloudinary first
//   await Promise.all(
//     existingProduct.productImages.map(async (image) => {
//       try {
//         // Extract public ID from the image URL
//         const publicId = image.url.split("/").pop()?.split(".")[0];
//         if (publicId) {
//           await ImageUploadService.deleteImage(publicId);
//         }
//       } catch (error) {
//         console.error(`Failed to delete image ${image.url}:`, error);
//       }
//     })
//   );

//   // Delete product in a transaction to ensure data integrity
//   const deletedProduct = await db.productVariant.deleteMany({
//     where: { productId },
//   });

//   await db.productImage.deleteMany({
//     where: { productId },
//   });

//   // Delete product from categories (many-to-many relationship)
//   await db.product.update({
//     where: { id: productId },
//     data: {
//       categories: {
//         disconnect: await db.category.findMany({
//           where: { product: { some: { id: productId } } },
//           select: { id: true },
//         }),
//       },
//     },
//   });

//   // Finally, delete the product
//   return await db.product.delete({
//     where: { id: productId },
//   });

//   return deletedProduct;
// }
