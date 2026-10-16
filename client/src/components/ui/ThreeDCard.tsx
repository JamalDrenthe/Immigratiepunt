import React, { useRef, useState, useCallback } from "react";
import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";

interface ThreeDCardProps {
  children: React.ReactNode;
  className?: string;
  depth?: number;
  glareEffect?: boolean;
}

export function ThreeDCard({
  children,
  className = "",
  depth = 14,
  glareEffect = true,
}: ThreeDCardProps) {
  const cardRef = useRef<HTMLDivElement>(null);
  const [isHovered, setIsHovered] = useState(false);

  // Motion values for smooth 60fps / 120fps physics
  const x = useMotionValue(0.5);
  const y = useMotionValue(0.5);

  const springConfig = { damping: 20, stiffness: 220, mass: 0.6 };
  const smoothX = useSpring(x, springConfig);
  const smoothY = useSpring(y, springConfig);

  const rotateX = useTransform(smoothY, [0, 1], [depth, -depth]);
  const rotateY = useTransform(smoothX, [0, 1], [-depth, depth]);
  const glareX = useTransform(smoothX, [0, 1], ["0%", "100%"]);
  const glareY = useTransform(smoothY, [0, 1], ["0%", "100%"]);

  const handleMouseMove = useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      if (!cardRef.current) return;
      const rect = cardRef.current.getBoundingClientRect();
      const relativeX = (e.clientX - rect.left) / rect.width;
      const relativeY = (e.clientY - rect.top) / rect.height;
      x.set(relativeX);
      y.set(relativeY);
    },
    [x, y]
  );

  const handleMouseEnter = () => {
    setIsHovered(true);
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
    x.set(0.5);
    y.set(0.5);
  };

  return (
    <div
      style={{ perspective: "1200px" }}
      className="inline-block w-full"
      onMouseMove={handleMouseMove}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <motion.div
        ref={cardRef}
        style={{
          rotateX,
          rotateY,
          transformStyle: "preserve-3d",
        }}
        animate={{
          scale: isHovered ? 1.02 : 1,
        }}
        transition={{ duration: 0.2 }}
        className={`relative overflow-hidden transition-shadow duration-300 will-change-transform ${className}`}
      >
        {children}

        {/* Dynamic glossy light reflection following the mouse in 3D */}
        {glareEffect && isHovered && (
          <motion.div
            style={{
              left: glareX,
              top: glareY,
              transform: "translate(-50%, -50%)",
            }}
            className="pointer-events-none absolute h-64 w-64 rounded-full bg-gradient-to-r from-white/20 to-transparent blur-2xl"
          />
        )}
      </motion.div>
    </div>
  );
}

interface ThreeDItemProps {
  children: React.ReactNode;
  className?: string;
  translateZ?: number;
}

export function ThreeDItem({
  children,
  className = "",
  translateZ = 20,
}: ThreeDItemProps) {
  return (
    <div
      style={{
        transform: `translateZ(${translateZ}px)`,
        transformStyle: "preserve-3d",
      }}
      className={`will-change-transform ${className}`}
    >
      {children}
    </div>
  );
}
