import React, { useState, useRef, Dispatch, SetStateAction } from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { MoreVertical, Trash, Edit, Share } from "lucide-react";
import useOutsideClick from "@/hooks/useOutsideClick";
import { useConversation } from "@/provider/conversation-provider";

type Props = {
  id: string;
  name: string;
  activeDropdownId: string | null;
  setActiveDropdownId: Dispatch<SetStateAction<string | null>>;
};

const SidebarChatItem = ({
  id,
  name,
  activeDropdownId,
  setActiveDropdownId,
}: Props) => {
  const [showContextMenu, setShowContextMenu] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const { activeConversation, getConversationById } = useConversation();

  const isDropdownOpen = activeDropdownId === id;
  const isActive = activeConversation?.id === id;

  const itemVariants = {
    hidden: {
      opacity: 0,
      x: -20,
      transition: {
        type: "spring",
        stiffness: 200,
        damping: 25,
      },
    },
    visible: {
      opacity: 1,
      x: 0,
      transition: {
        type: "spring",
        stiffness: 200,
        damping: 25,
      },
    },
    exit: {
      opacity: 0,
      x: -20,
      transition: {
        type: "spring",
        stiffness: 200,
        damping: 25,
      },
    },
  };

  // Use the custom hook to handle outside clicks
  useOutsideClick(
    [dropdownRef, buttonRef],
    () => {
      if (isDropdownOpen) {
        setActiveDropdownId(null);
      }
    },
    isDropdownOpen
  );

  const handleContextMenu = (e: React.MouseEvent) => {
    e.preventDefault();
    setShowContextMenu(true);
  };

  const handleMoreClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (isDropdownOpen) {
      setActiveDropdownId(null);
    } else {
      setActiveDropdownId(id);
    }
  };

  const handleAction = (action: string, e: React.MouseEvent) => {
    e.stopPropagation();
    // Handle different actions
    console.log(`${action} action for chat: ${id}`);
    setActiveDropdownId(null);
  };

  const handleItemClick = () => {
    // Close any open dropdown when clicking on another item
    // if (activeDropdownId && activeDropdownId !== id) {
    //   setActiveDropdownId(null);
    // }
    getConversationById(id);
    if (typeof window !== "undefined") {
      const newUrl = `/c/${id}`;
      window.history.pushState(
        { ...window.history.state, as: newUrl, url: newUrl },
        "",
        newUrl
      );
      console.log("Updated URL to:", newUrl);
    }
  };

  return (
    <motion.div
      variants={itemVariants}
      className={cn(
        "flex items-center gap-3 py-2 px-3 rounded-md cursor-pointer group relative",
        "hover:bg-gray-100 dark:hover:bg-zinc-800",
        isDropdownOpen ? "bg-gray-100 dark:bg-zinc-800" : "",
        isActive ? "bg-gray-200 dark:bg-zinc-700" : ""
      )}
      onContextMenu={handleContextMenu}
      onMouseEnter={() => setShowContextMenu(true)}
      onMouseLeave={() => !isDropdownOpen && setShowContextMenu(false)}
      onClick={handleItemClick}
    >
      <div className="flex-1 overflow-hidden">
        <p className="text-sm font-normal truncate">{name}</p>
      </div>

      {/* Button container with fixed width to prevent layout shifts */}
      <div className="w-6 h-6 flex-shrink-0 flex items-center justify-center">
        {/* Three dots button - visible on hover/context menu or when dropdown is open */}
        {(showContextMenu || isDropdownOpen) && (
          <button
            ref={buttonRef}
            onClick={handleMoreClick}
            className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300 p-1 rounded-md hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
          >
            <MoreVertical size={16} />
          </button>
        )}
      </div>

      {/* Dropdown menu */}
      {isDropdownOpen && (
        <div
          ref={dropdownRef}
          className="absolute right-0 top-full mt-1 w-36 rounded-md bg-white dark:bg-zinc-900 shadow-lg ring-1 ring-black ring-opacity-5 z-50"
        >
          <div className="py-1">
            <button
              onClick={(e) => handleAction("rename", e)}
              className="flex items-center w-full px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-zinc-700"
            >
              <Edit size={16} className="mr-2" />
              Rename
            </button>
            <button
              onClick={(e) => handleAction("share", e)}
              className="flex items-center w-full px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-zinc-700"
            >
              <Share size={16} className="mr-2" />
              Share
            </button>
            <button
              onClick={(e) => handleAction("delete", e)}
              className="flex items-center w-full px-4 py-2 text-sm text-red-600 dark:text-red-400 hover:bg-gray-100 dark:hover:bg-zinc-700"
            >
              <Trash size={16} className="mr-2" />
              Delete
            </button>
          </div>
        </div>
      )}
    </motion.div>
  );
};

export default SidebarChatItem;
