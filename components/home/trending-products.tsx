import React from "react";
import { Card, CardContent, CardFooter } from "../ui/card";
import Image from "next/image";
import { Button } from "../ui/button";
import { ShoppingCart } from "lucide-react";
import { Badge } from "../ui/badge";

const products = [
  {
    id: 1,
    name: "Classic White Sneakers",
    price: 89.99,
    image:
      "https://images.unsplash.com/photo-1549298916-b41d501d3772?ixlib=rb-4.0.3&auto=format&fit=crop&w=2340&q=80",
    tag: "Best Seller",
  },
  {
    id: 2,
    name: "Denim Jacket",
    price: 129.99,
    image:
      "https://images.unsplash.com/photo-1576995853123-5a10305d93c0?ixlib=rb-4.0.3&auto=format&fit=crop&w=2340&q=80",
    tag: "New",
  },
  {
    id: 3,
    name: "Summer Dress",
    price: 79.99,
    image:
      "https://images.unsplash.com/photo-1515372039744-b8f02a3ae446?ixlib=rb-4.0.3&auto=format&fit=crop&w=2340&q=80",
    tag: "Trending",
  },
  {
    id: 4,
    name: "Leather Watch",
    price: 199.99,
    image:
      "https://images.unsplash.com/photo-1524592094714-0f0654e20314?ixlib=rb-4.0.3&auto=format&fit=crop&w=2340&q=80",
    tag: "Limited",
  },
];

const TrendingProducts = () => {
  return (
    <div className="py-20">
      <div className="container mx-auto px-4">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <h1 className="text-4xl font-bold mb-4">Trending Now</h1>
          <p className="text-muted-foreground">
            Discover our most popular products loved by customers
          </p>
        </div>
        <div className="grid grid-col-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {products.map((product) => {
            return (
              <Card key={product.id} className="overflow-hidden cursor-pointer">
                <CardContent className="p-0">
                  <div className="relative h-[300px] overflow-hidden group">
                    <div className="h-72 ">
                      <Image
                        alt={product.name}
                        src={product.image}
                        fill
                        className=" object-cover w-full h-full inset-0 bg-cover bg-center transition-transform duration-500 group-hover:scale-110"
                      />
                    </div>
                    <div className="absolute top-4 left-4">
                      <Badge className="bg-white text-black">
                        {product.tag}
                      </Badge>
                    </div>
                  </div>
                </CardContent>
                <CardFooter className="flex flex-col items-start p-6">
                  <h3 className="text-lg font-semibold mb-2">{product.name}</h3>
                  <div className="flex items-center justify-between w-full">
                    <span className="text-xl font-bold">${product.price}</span>
                    <Button size={"sm"} className="group">
                      <ShoppingCart className="w-4 h-4 mr-2 transition-transform group-hover:scale-110" />
                      <span className="text-base">Add to cart</span>
                    </Button>
                  </div>
                </CardFooter>
              </Card>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default TrendingProducts;
