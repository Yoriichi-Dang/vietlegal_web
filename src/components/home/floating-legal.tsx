"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { FileText, Calculator, Shield, Scale } from "lucide-react";

const icons = [FileText, Calculator, Shield, Scale];

// Predefined positions to avoid hydration mismatch
const generatePositions = (count: number, width: number, height: number) => {
  const positions = [];
  for (let i = 0; i < count; i++) {
    // Use index-based calculation for consistent positions
    const seed = i * 0.618033988749; // Golden ratio for better distribution
    positions.push({
      x: [
        (seed * width) % width,
        ((seed + 0.3) * width) % width,
        ((seed + 0.6) * width) % width,
      ],
      y: [
        ((seed + 0.2) * height) % height,
        ((seed + 0.5) * height) % height,
        ((seed + 0.8) * height) % height,
      ],
      duration: 15 + (i % 5) * 2, // Varied but consistent duration
    });
  }
  return positions;
};

export function FloatingLegal({ count = 6 }) {
  const [dimensions, setDimensions] = useState({ width: 1200, height: 800 });
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);

    // Update dimensions only on client side
    setDimensions({
      width: window.innerWidth,
      height: window.innerHeight,
    });

    const handleResize = () => {
      setDimensions({
        width: window.innerWidth,
        height: window.innerHeight,
      });
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Don't render until mounted to avoid hydration mismatch
  if (!isMounted) {
    return <div className="relative w-full h-full" />;
  }

  const positions = generatePositions(
    count,
    dimensions.width,
    dimensions.height
  );

  return (
    <div className="relative w-full h-full">
      {Array.from({ length: count }).map((_, i) => {
        const IconComponent = icons[i % icons.length];
        const position = positions[i];

        return (
          <motion.div
            key={i}
            className="absolute"
            initial={{
              x: position.x[0],
              y: position.y[0],
            }}
            animate={{
              x: position.x,
              y: position.y,
              rotate: [0, 180, 360],
            }}
            transition={{
              duration: position.duration,
              repeat: Number.POSITIVE_INFINITY,
              ease: "linear",
            }}
          >
            <div className="relative w-16 h-16 bg-white/5 backdrop-blur-sm rounded-lg border border-white/10 flex items-center justify-center transform hover:scale-110 transition-transform">
              <IconComponent className="w-8 h-8 text-blue-400/50" />
            </div>
          </motion.div>
        );
      })}
    </div>
  );
}
