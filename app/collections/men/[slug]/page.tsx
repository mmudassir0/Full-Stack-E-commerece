import ProductDetails from "@/components/Products/product-details";
import { products } from "@/lib/products";

export default async function Page({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const slug = (await params).slug;
  const product = products.find((p) => p.id === Number(slug));

  if (!product) {
    return <div>Product not found</div>;
  }
  return <ProductDetails product={product} />;
}
