"use client";
import { EllipsisVertical, Settings, Upload, LogOut } from "lucide-react";
import React, { useState, useRef } from "react";
import Image from "next/image";
import { AnimatePresence, motion } from "framer-motion";
import { cn } from "@/lib/utils";
import useOutsideClick from "@/hooks/useOutsideClick"; // Using your existing hook

const HeaderAvatar = () => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Use your existing useOutsideClick hook
  useOutsideClick(
    dropdownRef,
    () => {
      if (isDropdownOpen) setIsDropdownOpen(false);
    },
    isDropdownOpen
  );

  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  // Animation variants for dropdown
  const dropdownVariants = {
    hidden: {
      opacity: 0,
      scale: 0.95,
      transition: {
        duration: 0.1,
        ease: "easeInOut",
      },
    },
    visible: {
      opacity: 1,
      scale: 1,
      transition: {
        duration: 0.1,
        ease: "easeInOut",
      },
    },
  };

  return (
    <div className="absolute top-1 right-6 flex items-center gap-2">
      <button className="cursor-pointer hover:bg-gray-200 dark:hover:bg-zinc-700/50 p-2 rounded-md">
        <EllipsisVertical />
      </button>
      <div className="relative" ref={dropdownRef}>
        <div
          className="cursor-pointer rounded-full p-1 overflow-hidden hover:bg-zinc-700"
          onClick={toggleDropdown}
        >
          <Image
            className="rounded-full"
            src="https://scontent.fdad3-5.fna.fbcdn.net/v/t39.30808-6/321458393_689078906262854_8283041181478027070_n.jpg?_nc_cat=111&ccb=1-7&_nc_sid=6ee11a&_nc_eui2=AeH4XpGlr5asUaBieRnWiOH4rYuxCQAUBJOti7EJABQEkxqsH7ignctBNlMoTdAc6KBBdhQHfEdDxIN1dMkxHI3t&_nc_ohc=6xJ9gg97UnIQ7kNvwEmlMj9&_nc_oc=AdmdvWIzcUu4-9uD3uGeko_a1LBnTyFdU8CEXjP-o5gnVoFbaiSVoAra8j8SFVkifRE&_nc_zt=23&_nc_ht=scontent.fdad3-5.fna&_nc_gid=RUxi4nTW1p__TgOp262YWg&oh=00_AfEdFyrwlieNgydtCbL6O-_U_fllnD5IZ1Goood7-99XOg&oe=680E8841"
            alt="avatar"
            width={40}
            height={40}
          />
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
                "absolute right-0 top-12 w-40 rounded-md",
                "bg-white dark:bg-zinc-800 shadow-lg ring-1 dark:ring-zinc-700",
                "z-50 overflow-hidden"
              )}
            >
              <div className="flex flex-col text-white text-sm">
                {/* Share Button */}
                <button className="flex items-center gap-3 px-4 py-3  hover:bg-zinc-700 text-left">
                  <Upload size={18} />
                  <span>Share</span>
                </button>

                <div className="h-px bg-zinc-800 my-1"></div>

                {/* Menu Items */}

                <button className="flex items-center gap-3 px-4 py-3 hover:bg-zinc-700 text-left">
                  <Settings size={18} />
                  <span>Settings</span>
                </button>

                <div className="h-px bg-zinc-800 my-1"></div>

                <button className="flex items-center gap-3 px-4 py-3 hover:bg-zinc-700 text-left">
                  <svg
                    width="18"
                    height="18"
                    viewBox="0 0 24 24"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                    className="text-white"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M20 14V7a2 2 0 00-2-2H6a2 2 0 00-2 2v7"></path>
                    <path d="M20 14H4"></path>
                    <path d="M12 9v2"></path>
                    <path d="M8 19h8a2 2 0 002-2v-3H6v3a2 2 0 002 2z"></path>
                  </svg>
                  <span>Upgrade Plan</span>
                </button>

                <div className="h-px bg-zinc-800 my-1"></div>

                <button className="flex items-center gap-3 px-4 py-3 hover:bg-zinc-700 text-left">
                  <LogOut size={18} />
                  <span>Log out</span>
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default HeaderAvatar;
