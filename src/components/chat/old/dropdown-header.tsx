"use client";

import React, { useState, useRef, ReactNode } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import useOutsideClick from "@/hooks/useOutsideClick";

// Định nghĩa các type cho dropdown
export interface DropdownItem {
  icon: ReactNode;
  label: string;
  onClick: () => void;
}
export interface DropdownProps {
  children: ReactNode;
  items: DropdownItem[];
  align?: "right" | "left" | "center";
  width?: string;
  onOpen?: () => void;
  onClose?: () => void;
  className?: string;
  triggerClassName?: string;
}

const Dropdown: React.FC<DropdownProps> = ({
  children,
  items,
  align = "right",
  width = "w-40",
  onOpen,
  onClose,
  className = "",
  triggerClassName = "cursor-pointer rounded-full p-1 overflow-hidden hover:bg-zinc-700",
}) => {
  const [isDropdownOpen, setIsDropdownOpen] = useState<boolean>(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Sử dụng hook useOutsideClick để đóng dropdown khi click bên ngoài
  useOutsideClick(
    dropdownRef,
    () => {
      if (isDropdownOpen) {
        setIsDropdownOpen(false);
        if (onClose) onClose();
      }
    },
    isDropdownOpen
  );

  // Định nghĩa animation variants
  const dropdownVariants = {
    hidden: {
      opacity: 0,
      scale: 0.95,
      transition: {
        duration: 0.1,
      },
    },
    visible: {
      opacity: 1,
      scale: 1,
      transition: {
        duration: 0.1,
      },
    },
  };

  // Toggle dropdown
  const toggleDropdown = (): void => {
    const newState = !isDropdownOpen;
    setIsDropdownOpen(newState);

    if (newState && onOpen) {
      onOpen();
    } else if (!newState && onClose) {
      onClose();
    }
  };

  // Xác định class position dựa vào align
  const getPositionClass = (): string => {
    switch (align) {
      case "left":
        return "left-0";
      case "center":
        return "left-1/2 -translate-x-1/2";
      case "right":
      default:
        return "right-0";
    }
  };

  return (
    <div className={cn("relative", className)} ref={dropdownRef}>
      {/* Trigger Button */}
      <div className={triggerClassName} onClick={toggleDropdown}>
        {children}
      </div>

      {/* Dropdown Menu */}
      <AnimatePresence>
        {isDropdownOpen && (
          <motion.div
            initial="hidden"
            animate="visible"
            exit="hidden"
            variants={dropdownVariants}
            className={cn(
              "absolute top-12",
              getPositionClass(),
              width,
              "rounded-md",
              "bg-white dark:bg-zinc-800 shadow-lg ring-1 ring-zinc-200 dark:ring-zinc-700",
              "z-50 overflow-hidden"
            )}
          >
            <div className="flex flex-col text-white text-sm">
              {items.map((item, index) => (
                <React.Fragment key={index}>
                  <button
                    className="cursor-pointer text-black dark:text-white flex items-center gap-3 px-4 py-3 hover:bg-zinc-100 dark:hover:bg-zinc-700 text-left"
                    onClick={() => {
                      item.onClick();
                      setIsDropdownOpen(false);
                    }}
                  >
                    {item.icon}
                    <span>{item.label}</span>
                  </button>
                </React.Fragment>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Dropdown;
