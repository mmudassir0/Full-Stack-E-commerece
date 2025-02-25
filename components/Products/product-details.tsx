"use client";
import { TProduct } from "@/types/product";
import Image from "next/image";
import React from "react";
import { Button } from "../ui/button";
import { Minus, Plus, ShoppingCart } from "lucide-react";
import { useCart } from "@/hooks/use-cart";

type ProductDetailsPRops = {
  product: TProduct;
};

const ProductDetails = ({ product }: ProductDetailsPRops) => {
  const { addItem } = useCart();

  const [selectedColor, setSelectedColor] = React.useState(product.colors[0]);
  const [selectedSize, setSelectedSize] = React.useState(product.sizes[0]);
  const [quantity, setQuantity] = React.useState(1);

  const handleAddToCart = () => {
    console.log("clicked handler", quantity, selectedColor, selectedSize);
    addItem({
      ...product,
      quantity,
      selectedColor,
      selectedSize,
    });
  };
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="relative aspect-square">
          <Image
            alt="image"
            src={product.image}
            fill
            className="object-cover rounded-lg"
          />
        </div>
        <div className="space-y-8">
          <div>
            <h1 className="text-4xl font-bold ">{product.title}</h1>
          </div>
          <div className="flex items-center gap-4">
            <span className="text-3xl font-bold ">${product.price}</span>
            {product.originalPrice && (
              <span className="text-xl text-muted-foreground line-through">
                ${product.originalPrice}
              </span>
            )}
          </div>
          <div className="space-y-8">
            <div>
              <label className="text-sm font-medium">Color</label>
              <div className="flex flex-wrap gap-2 mt-2">
                {product.colors.map((color) => {
                  return (
                    <Button
                      key={color}
                      variant={selectedColor === color ? "default" : "outline"}
                      onClick={() => setSelectedColor(color)}
                    >
                      {color}
                    </Button>
                  );
                })}
              </div>
            </div>
            <div>
              <label className="text-sm font-medium">Size</label>
              <div className="flex flex-wrap gap-2 mt-2">
                {product.sizes.map((size) => {
                  return (
                    <Button
                      key={size}
                      variant={selectedSize === size ? "default" : "outline"}
                      onClick={() => setSelectedSize(size)}
                    >
                      {size}
                    </Button>
                  );
                })}
              </div>
            </div>
            <div>
              <label className="text-sm font-medium">Quantity</label>
              <div className="flex flex-wrap gap-2 items-center mt-2">
                <Button
                  variant={"outline"}
                  size={"icon"}
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                >
                  <Minus className="h-4 w-4" />
                </Button>
                <span className="w-12 text-center">{quantity}</span>
                <Button
                  variant={"outline"}
                  size={"icon"}
                  onClick={() => setQuantity(quantity + 1)}
                >
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>
          <Button
            className="w-full"
            size={"lg"}
            onClick={() => {
              handleAddToCart();
            }}
          >
            <ShoppingCart className="h-5 w-5 mr-2" /> Add to Cart
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ProductDetails;
