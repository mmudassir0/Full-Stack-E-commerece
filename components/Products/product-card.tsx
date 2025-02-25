import React from "react";

import { Card, CardContent } from "@/components/ui/card";
import { Button } from "../ui/button";
import Image from "next/image";
// import { Eye, ShoppingCart } from "lucide-react";
import { Badge } from "../ui/badge";
import { TProduct } from "@/types/product";
import Link from "next/link";

type ProductCardProps = {
  product: TProduct;
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const ProductCard = ({ product }: ProductCardProps) => {
  const discount = product.originalPrice
    ? Math.floor(
        ((product.originalPrice - product.price) / product.originalPrice) * 100
      )
    : "";
  return (
    <Card className={`group overflow-hidden min-w-80`}>
      <div className={`relative`}>
        <div className="aspect-square overflow-hidden">
          <Image
            src={product.image}
            alt="name"
            fill
            sizes="full"
            priority
            className="object-cover w-full h-full transition-transform duration-300 group-hover:scale-110"
          />
        </div>
        {product.originalPrice && (
          <Badge className="absolute top-2 left-2 bg-red-500">
            {discount}% Off
          </Badge>
        )}
        {/* <div className="absolute botton-2 left-2 right-2 flex justify-center gap-2 opacity-0 transition-opacity group-hover:opacity-100">
          <Button variant={"secondary"} size={"sm"}>
            <Eye className="w-4 h-4 mr-2" />
            Quick View
          </Button>
        </div> */}
      </div>
      <CardContent className={`p-4 pt-8 `}>
        <div className="flex items-center justify-between gap-2 mb-4">
          <div className="font-semibold line-clamp-2">{product.title}</div>
          <div className="space-x-2">
            <span className="text-lg font-bold">{product.price}</span>

            <span className="text-sm text-muted-foreground line-through">
              {product.originalPrice}
            </span>
          </div>
        </div>
        <Link href={`/collections/men/${product.id}`}>
          <Button className="w-full">View Details</Button>
        </Link>
      </CardContent>
    </Card>
  );
};

export default ProductCard;
