import React, { useRef, useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";

export type DropdownItem = {
  id: string | number;
  name: string;
  icon?: React.ReactNode;
  action: () => void;
  leftIcon?: React.ReactNode;
};

type DropDownAnimationProps = {
  items: DropdownItem[];
  className?: string;
  containerClassName?: string;
  itemClassName?: string;
  title?: string;
  titleIcon?: React.ReactNode;
  disabled?: boolean;
};

const DropDownAnimation = ({
  items,
  className,
  containerClassName,
  itemClassName,
  title,
  titleIcon,
  disabled = false,
}: DropDownAnimationProps) => {
  const dropdownRef = useRef<HTMLDivElement>(null);
  const [showDropdown, setShowDropdown] = useState(false);

  const toggleDropdown = () => {
    if (!disabled) {
      setShowDropdown(!showDropdown);
    }
  };

  // Handle click outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setShowDropdown(false);
      }
    };

    if (showDropdown) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [showDropdown]);

  const dropdownVariants = {
    hidden: {
      opacity: 0,
      y: 10,
      scale: 0.95,
      transition: {
        duration: 0.2,
        ease: "easeInOut",
      },
    },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: {
        duration: 0.2,
        ease: "easeOut",
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, x: -10 },
    visible: (custom: number) => ({
      opacity: 1,
      x: 0,
      transition: {
        delay: custom * 0.05,
        duration: 0.2,
      },
    }),
  };

  return (
    <div className="relative">
      <motion.button
        type="button"
        whileTap={disabled ? undefined : { scale: 0.95 }}
        onClick={toggleDropdown}
        disabled={disabled}
        className={cn(
          "flex items-center p-2 gap-1 rounded-full ring-2 ring-zinc-100 dark:ring-zinc-700/50 bg-white dark:bg-zinc-800 text-zinc-400",
          "hover:bg-zinc-100 dark:hover:bg-zinc-700/50 transition-colors",
          disabled && "opacity-50 cursor-not-allowed"
        )}
      >
        {title && <span className="text-xs font-medium">{title}</span>}
        {titleIcon}
      </motion.button>
      <AnimatePresence>
        {showDropdown && !disabled && (
          <motion.div
            ref={dropdownRef}
            initial="hidden"
            animate="visible"
            exit="hidden"
            variants={dropdownVariants}
            className={cn(
              "absolute left-0 bottom-full mb-2 w-64 bg-white dark:bg-zinc-800 rounded-xl shadow-lg p-2 z-50 border border-gray-200 dark:border-gray-700 origin-bottom-left",
              className
            )}
          >
            <div className={cn("flex flex-col", containerClassName)}>
              {items.map((item, index) => (
                <motion.div
                  key={item.id}
                  custom={index}
                  variants={itemVariants}
                  className={cn(
                    "flex items-center gap-3 p-3 hover:bg-gray-100 dark:hover:bg-zinc-700 rounded-lg cursor-pointer",
                    itemClassName
                  )}
                  onClick={() => {
                    item.action();
                    setShowDropdown(false);
                  }}
                >
                  <div className="flex-shrink-0">{item.icon}</div>
                  <span className="text-sm text-gray-800 dark:text-gray-200">
                    {item.name}
                  </span>
                  {item.leftIcon && (
                    <span className="ml-auto text-gray-400">
                      {item.leftIcon}
                    </span>
                  )}
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default DropDownAnimation;
