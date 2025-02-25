import type { TProduct } from "@/types/product";

export type SortOption = "featured" | "newest" | "price-asc" | "price-desc";

export const sortsProducts = (products: TProduct[], sortBy: SortOption) => {
  const sortedProducts = [...products];
  switch (sortBy) {
    case "price-asc":
      return sortedProducts.sort((a, b) => a.price - b.price);
    case "price-desc":
      return sortedProducts.sort((a, b) => b.price - a.price);
    case "newest":
      return sortedProducts.sort((a, b) => a.id - b.id);
    case "featured":
      return sortedProducts;
    default:
      return sortedProducts;
  }
};
