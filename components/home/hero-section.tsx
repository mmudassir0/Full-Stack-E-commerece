"use client";

import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";
import { ArrowRight } from "lucide-react";

const slides = [
  {
    image:
      "https://images.unsplash.com/photo-1483985988355-763728e1935b?ixlib=rb-4.0.3&auto=format&fit=crop&w=2340&q=80",
    title: "Summer Collection 2024",
    subtitle: "Discover the latest trends in fashion",
  },
  {
    image:
      "https://images.unsplash.com/photo-1469334031218-e382a71b716b?ixlib=rb-4.0.3&auto=format&fit=crop&w=2340&q=80",
    title: "New Arrivals",
    subtitle: "Explore our premium selection",
  },
  {
    image:
      "https://images.unsplash.com/photo-1731484395148-b1d7f2af7d54?q=80&w=1974&auto=format&fit=crop&ixlib=rb-4.0.3",
    title: "Summer Collection 2024",
    subtitle: "Discover the latest trends in fashion",
  },
  {
    image:
      "https://images.unsplash.com/photo-1623082574085-157d955f1d35?q=80&w=1974&auto=format&fit=crop&ixlib=rb-4.0.3",
    title: "New Arrivals",
    subtitle: "Explore our premium selection",
  },
];

export default function HeroSection() {
  const [currentSlide, setCurrentSlide] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="relative h-[80vh] overflow-hidden">
      {slides.map((slide, index) => {
        return (
          <div
            key={index}
            className={`absolute inset-0 transition-opacity duration-1000 ${
              currentSlide === index
                ? "opacity-100 pointer-events-auto"
                : "opacity-0 pointer-events-none"
            }`}
            style={{
              backgroundImage: `url('${slide.image}')`,
              backgroundSize: "cover",
              backgroundPosition: "center",
            }}
          >
            <div className="absolute inset-0 bg-black/30" />
            <div className="container relative mx-auto px-4 h-full flex items-center">
              <div className="text-white max-w-xl">
                <h1 className="text-6xl font-bold mb-6">{slide.title}</h1>
                <p className="text-xl mb-8">{slide.subtitle}</p>
                <Button
                  size={"lg"}
                  className="bg-white text-black hover:bg-gray-100 group"
                >
                  Shop Now
                  <ArrowRight className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-1" />
                </Button>
              </div>
            </div>
          </div>
        );
      })}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex space-x-2">
        {slides.map((_, index) => {
          return (
            <button
              key={index}
              className={`w-2 h-2 bg-white rounded-full transition-all ${
                currentSlide === index ? "bg-white w-8" : "bg-white/50"
              }`}
              onClick={() => {
                setCurrentSlide(index);
              }}
            />
          );
        })}
      </div>
    </div>
  );
}
