"use client";

import type React from "react";

import { cn } from "@/lib/utils";
import { cva, type VariantProps } from "class-variance-authority";
import { motion } from "framer-motion";
import { forwardRef } from "react";

// Định nghĩa các variants cho spinner
const spinnerVariants = cva(
  "inline-block text-primary border-current rounded-full animate-spin",
  {
    variants: {
      variant: {
        default: "border-t-transparent",
        dots: "border-none flex items-center justify-center gap-1",
        bars: "border-none flex items-center justify-center gap-1",
        pulse: "border-none",
        wave: "border-none flex items-center justify-center",
        circle: "border-none",
      },
      size: {
        xs: "w-3 h-3 border-[2px]",
        sm: "w-4 h-4 border-2",
        md: "w-6 h-6 border-2",
        lg: "w-8 h-8 border-[3px]",
        xl: "w-12 h-12 border-4",
      },
      thickness: {
        thin: "border",
        default: "",
        thick: "border-[3px]",
        extraThick: "border-4",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "md",
      thickness: "default",
    },
  }
);

export interface SpinnerProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof spinnerVariants> {
  label?: string;
  color?: string;
  secondaryColor?: string;
  speed?: "slow" | "default" | "fast";
}

const Spinner = forwardRef<HTMLDivElement, SpinnerProps>(
  (
    {
      className,
      variant,
      size,
      thickness,
      label = "Đang tải...",
      color,
      secondaryColor,
      speed = "default",
      ...props
    },
    ref
  ) => {
    // Xác định tốc độ animation
    const speedValue = {
      slow: 2,
      default: 1,
      fast: 0.5,
    };

    // Style cho màu sắc tùy chỉnh
    const customStyle = {
      "--spinner-color": color,
      "--spinner-secondary-color": secondaryColor,
    } as React.CSSProperties;

    // Render spinner dựa trên variant
    const renderSpinner = () => {
      switch (variant) {
        case "dots":
          return (
            <div className={cn(spinnerVariants({ variant, size, className }))}>
              {[0, 1, 2].map((i) => (
                <motion.div
                  key={i}
                  className={cn(
                    "rounded-full",
                    {
                      "w-1 h-1": size === "xs",
                      "w-1.5 h-1.5": size === "sm",
                      "w-2 h-2": size === "md",
                      "w-2.5 h-2.5": size === "lg",
                      "w-3 h-3": size === "xl",
                    },
                    color ? "bg-[var(--spinner-color)]" : "bg-current"
                  )}
                  animate={{
                    y: ["0%", "-100%", "0%"],
                  }}
                  transition={{
                    duration: speedValue[speed] * 1.2,
                    ease: "easeInOut",
                    repeat: Number.POSITIVE_INFINITY,
                    delay: i * 0.15,
                  }}
                />
              ))}
            </div>
          );

        case "bars":
          return (
            <div className={cn(spinnerVariants({ variant, size, className }))}>
              {[0, 1, 2, 3, 4].map((i) => (
                <motion.div
                  key={i}
                  className={cn(
                    "rounded-sm",
                    {
                      "w-0.5 h-2": size === "xs",
                      "w-0.5 h-3": size === "sm",
                      "w-1 h-4": size === "md",
                      "w-1 h-6": size === "lg",
                      "w-1.5 h-8": size === "xl",
                    },
                    color ? "bg-[var(--spinner-color)]" : "bg-current"
                  )}
                  animate={{
                    scaleY: [1, 1.5, 1],
                  }}
                  transition={{
                    duration: speedValue[speed],
                    ease: "easeInOut",
                    repeat: Number.POSITIVE_INFINITY,
                    delay: i * 0.1,
                  }}
                />
              ))}
            </div>
          );

        case "pulse":
          return (
            <motion.div
              className={cn(
                spinnerVariants({ variant, size, className }),
                "rounded-full",
                color ? "bg-[var(--spinner-color)]" : "bg-primary/80"
              )}
              animate={{
                scale: [1, 1.2, 1],
                opacity: [0.6, 1, 0.6],
              }}
              transition={{
                duration: speedValue[speed] * 1.5,
                ease: "easeInOut",
                repeat: Number.POSITIVE_INFINITY,
              }}
            />
          );

        case "wave":
          return (
            <div className={cn(spinnerVariants({ variant, size, className }))}>
              {[0, 1, 2, 3, 4].map((i) => (
                <motion.div
                  key={i}
                  className={cn(
                    "rounded-full",
                    {
                      "w-1 h-1": size === "xs",
                      "w-1.5 h-1.5": size === "sm",
                      "w-2 h-2": size === "md",
                      "w-2.5 h-2.5": size === "lg",
                      "w-3 h-3": size === "xl",
                    },
                    color ? "bg-[var(--spinner-color)]" : "bg-current"
                  )}
                  animate={{
                    y: ["0%", "-100%", "0%"],
                    opacity: [0.6, 1, 0.6],
                  }}
                  transition={{
                    duration: speedValue[speed] * 1.2,
                    ease: "easeInOut",
                    repeat: Number.POSITIVE_INFINITY,
                    delay: i * 0.1,
                    times: [0, 0.5, 1],
                  }}
                />
              ))}
            </div>
          );

        case "circle":
          return (
            <div className="relative">
              <motion.div
                className={cn(
                  spinnerVariants({ variant, size, className }),
                  "rounded-full",
                  color
                    ? "border-2 border-[var(--spinner-secondary-color)] border-t-[var(--spinner-color)]"
                    : "border-2 border-gray-300 border-t-primary"
                )}
                animate={{
                  rotate: 360,
                }}
                transition={{
                  duration: speedValue[speed],
                  ease: "linear",
                  repeat: Number.POSITIVE_INFINITY,
                }}
                style={{
                  width:
                    size === "xs"
                      ? "0.75rem"
                      : size === "sm"
                      ? "1rem"
                      : size === "md"
                      ? "1.5rem"
                      : size === "lg"
                      ? "2rem"
                      : "3rem",
                  height:
                    size === "xs"
                      ? "0.75rem"
                      : size === "sm"
                      ? "1rem"
                      : size === "md"
                      ? "1.5rem"
                      : size === "lg"
                      ? "2rem"
                      : "3rem",
                }}
              />
            </div>
          );

        default:
          return (
            <div
              className={cn(
                spinnerVariants({ variant, size, thickness, className }),
                color
                  ? "border-[var(--spinner-secondary-color)] border-t-[var(--spinner-color)]"
                  : ""
              )}
            />
          );
      }
    };

    return (
      <div
        ref={ref}
        role="status"
        aria-label={label}
        className="inline-flex flex-col items-center justify-center"
        style={customStyle}
        {...props}
      >
        {renderSpinner()}
        {label && <span className="sr-only">{label}</span>}
      </div>
    );
  }
);

Spinner.displayName = "Spinner";

export { Spinner };
