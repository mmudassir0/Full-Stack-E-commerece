import React from "react";
import { Card, CardContent } from "../ui/card";
import Image from "next/image";
import { Badge } from "../ui/badge";

const categories = [
  {
    name: "Women's Fashion",
    image:
      "https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?ixlib=rb-4.0.3&auto=format&fit=crop&w=2340&q=80",
    items: "2.5k+ Items",
    tag: "Trending",
  },
  {
    name: "Men's Collection",
    image:
      "https://images.unsplash.com/photo-1516257984-b1b4d707412e?ixlib=rb-4.0.3&auto=format&fit=crop&w=2340&q=80",
    items: "2k+ Items",
    tag: "Popular",
  },
  {
    name: "Accessories",
    image:
      "https://images.unsplash.com/photo-1523170335258-f5ed11844a49?ixlib=rb-4.0.3&auto=format&fit=crop&w=2340&q=80",
    items: "1.5k+ Items",
    tag: "New",
  },
];

const FeatureCategory = () => {
  return (
    <div className="py-16 bg-gray-100">
      <div className="container mx-auto px-4">
        <div className="max-w-2xl mx-auto mb-16 text-center">
          <h2 className="text-4xl font-bold mb-4">Shop BY Category</h2>
          <p className="text-muted-foreground">
            Discover our wide selection of products across various categories
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {categories.map((category, index) => {
            return (
              <Card key={index} className="overflow-hidden cursor-pointer">
                <CardContent className="p-0">
                  <div className="relative h-[400px] overflow-hidden">
                    <Image
                      src={category.image}
                      alt={category.name}
                      fill
                      className="object-cover transition-transform duration-500 hover:scale-110"
                    />
                    <div className="absolute inset-0 pointer-events-none bg-gradient-to-t from-black/70 via-black/20 to-transparent flex flex-col justify-end p-6">
                      <Badge className="w-fit mb-3">{category.tag}</Badge>
                      <h3 className="text-2xl text-white font-semibold mb-2">
                        {category.name}
                      </h3>
                      <p className="text-white/80">{category.items}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default FeatureCategory;
