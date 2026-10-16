import React from "react";
import { motion, HTMLMotionProps } from "framer-motion";

interface MotionRevealProps extends HTMLMotionProps<"div"> {
  children: React.ReactNode;
  delay?: number;
  direction?: "up" | "down" | "left" | "right" | "none";
  distance?: number;
  duration?: number;
  className?: string;
  once?: boolean;
}

export function MotionReveal({
  children,
  delay = 0,
  direction = "up",
  distance = 30,
  duration = 0.6,
  className = "",
  once = true,
  ...props
}: MotionRevealProps) {
  const getInitialPosition = () => {
    switch (direction) {
      case "up":
        return { y: distance, opacity: 0 };
      case "down":
        return { y: -distance, opacity: 0 };
      case "left":
        return { x: distance, opacity: 0 };
      case "right":
        return { x: -distance, opacity: 0 };
      default:
        return { opacity: 0 };
    }
  };

  return (
    <motion.div
      initial={getInitialPosition()}
      whileInView={{ x: 0, y: 0, opacity: 1 }}
      viewport={{ once, margin: "-40px" }}
      transition={{
        duration,
        delay,
        ease: [0.22, 1, 0.36, 1], // Custom smooth cubic-bezier
      }}
      className={className}
      {...props}
    >
      {children}
    </motion.div>
  );
}

export function MotionStaggerContainer({
  children,
  className = "",
  staggerDelay = 0.12,
  ...props
}: {
  children: React.ReactNode;
  className?: string;
  staggerDelay?: number;
} & HTMLMotionProps<"div">) {
  return (
    <motion.div
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-40px" }}
      variants={{
        hidden: {},
        visible: {
          transition: {
            staggerChildren: staggerDelay,
          },
        },
      }}
      className={className}
      {...props}
    >
      {children}
    </motion.div>
  );
}

export function MotionStaggerItem({
  children,
  className = "",
  ...props
}: {
  children: React.ReactNode;
  className?: string;
} & HTMLMotionProps<"div">) {
  return (
    <motion.div
      variants={{
        hidden: { opacity: 0, y: 24, scale: 0.98 },
        visible: {
          opacity: 1,
          y: 0,
          scale: 1,
          transition: {
            duration: 0.5,
            ease: [0.22, 1, 0.36, 1],
          },
        },
      }}
      className={className}
      {...props}
    >
      {children}
    </motion.div>
  );
}
