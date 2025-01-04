"use client";

import { useEffect, useState } from "react";

export function AuthBackground() {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({
        x: (e.clientX / window.innerWidth) * 100,
        y: (e.clientY / window.innerHeight) * 100,
      });
    };

    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  return (
    <div className="fixed inset-0 -z-10 overflow-hidden">
      {/* Animated gradient background */}
      <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/20 via-purple-500/20 to-pink-500/20 animate-gradient" />

      {/* Floating orbs */}
      <div
        className="absolute top-1/4 -left-20 w-96 h-96 bg-blue-400/30 rounded-full mix-blend-multiply filter blur-3xl animate-blob"
        style={{
          transform: `translate(${mousePosition.x / 30}px, ${
            mousePosition.y / 30
          }px)`,
        }}
      />
      <div
        className="absolute -bottom-32 left-1/2 w-96 h-96 bg-purple-400/30 rounded-full mix-blend-multiply filter blur-3xl animate-blob animation-delay-2000"
        style={{
          transform: `translate(${mousePosition.x / -25}px, ${
            mousePosition.y / -25
          }px)`,
        }}
      />
      <div
        className="absolute top-1/3 -right-20 w-96 h-96 bg-pink-400/30 rounded-full mix-blend-multiply filter blur-3xl animate-blob animation-delay-4000"
        style={{
          transform: `translate(${mousePosition.x / 20}px, ${
            mousePosition.y / 20
          }px)`,
        }}
      />

      {/* Glassmorphism overlay */}
      <div className="absolute inset-0 backdrop-blur-[100px]" />
    </div>
  );
}
