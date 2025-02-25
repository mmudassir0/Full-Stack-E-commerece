"use client";
import React from "react";
import { useCart } from "@/hooks/use-cart";
import Link from "next/link";
import { Button } from "../ui/button";
import { ArrowLeft, Minus, Plus, Trash2 } from "lucide-react";
import Image from "next/image";

const ProductCart = () => {
  const { items, removeItem, updateQuantity, getTotalPrice, getTotlaItems } =
    useCart();

  if (items.length === 0) {
    return (
      <div className="container mx-auto px-4 py-16 text-center min-h-[560px] flex items-center justify-center">
        <div>
          <h1 className="text-2xl font-bold mb-4">Your cart is empty</h1>
          <p className="text-muted-foreground mb-8">
            Look like you have not added any items to your cart yet
          </p>
          <Link href={"/collections/men"}>
            <Button>
              <ArrowLeft className="h-4 w-4 mr-2" />
              Continue Shopping
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-8">Shopping Cart</h1>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <div className="space-y-4">
            {items.map((item) => {
              return (
                <div key={item.id} className="flex gap-4 p-4 border rounded-lg">
                  <div className="relative h-24 w-24 flex-shrink-0">
                    <Image
                      alt="image"
                      src={item.image}
                      fill
                      className="object-cover rounded"
                    />
                  </div>
                  <div className="flex-1">
                    <div className="flex justify-between">
                      <div>
                        <h3 className="font-semibold">{item.title}</h3>
                        <p className="text-muted-foreground">
                          {item.selectedColor} , {item.selectedSize}
                        </p>
                      </div>
                      <Button
                        variant={"outline"}
                        size={"icon"}
                        onClick={() => {
                          removeItem(item.id);
                        }}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                    <div className="flex justify-between items-center mt-4">
                      <div className=" flex items-center gap-4">
                        <Button
                          variant={"outline"}
                          size={"icon"}
                          className="rounded-full "
                          onClick={() =>
                            updateQuantity(
                              item.id,
                              Math.max(1, item.quantity - 1)
                            )
                          }
                        >
                          <Minus className="h-4 w-4" />
                        </Button>
                        <span className="w-8 text-center">{item.quantity}</span>
                        <Button
                          variant={"outline"}
                          size={"icon"}
                          className="rounded-full "
                          onClick={() =>
                            updateQuantity(item.id, item.quantity + 1)
                          }
                        >
                          <Plus className="h-4 w-4" />
                        </Button>
                      </div>
                      <div>
                        <h2 className="text-xl font-bold">${item.price}</h2>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
        <div className="lg:col-span-1">
          <div className="sticky top-8 p-6 border rounded-lg space-y-4">
            <h2 className="text-lg font-semibold">Order Summery</h2>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span>Items({getTotlaItems()})</span>
                <span>$({getTotalPrice()})</span>
              </div>
              <div className="flex justify-between">
                <span>Shipping</span>
                <span>Free</span>
              </div>
            </div>
            <div className="border-t pt-4">
              <div className="flex justify-between font-semibold">
                <span>Total</span>
                <span>$({getTotalPrice()})</span>
              </div>
            </div>
            <Button className="w-full" size={"lg"}>
              Proceed to Checkout
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductCart;
