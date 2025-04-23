import { cn } from "@/lib/utils";
import { motion } from "framer-motion";
import NewChatIcon from "../icons/new-chat-icon";
import ToggleSidebarIcon from "../icons/toggle-sidebar-icon";
import MenuIcon from "../icons/menu-icon";
import { Search } from "lucide-react";
import { useEffect } from "react";
import { useState } from "react";
const SidebarTool = ({
  isCollapsed,
  toggleSidebar,
}: {
  isCollapsed: boolean;
  toggleSidebar: () => void;
}) => {
  const [isMobile, setIsMobile] = useState(false);

  // Kiểm tra kích thước màn hình khi component được render
  useEffect(() => {
    const checkIfMobile = () => {
      setIsMobile(window.innerWidth < 768); // 768px là điểm breakpoint cho thiết bị di động
    };

    // Kiểm tra lần đầu
    checkIfMobile();

    // Lắng nghe sự kiện resize của cửa sổ
    window.addEventListener("resize", checkIfMobile);

    // Cleanup
    return () => window.removeEventListener("resize", checkIfMobile);
  }, []);
  const newChatButtonVariants = {
    expanded: {
      left: isMobile ? "13rem" : "13rem",
      transition: {
        type: "spring",
        stiffness: 200,
        damping: 25,
        duration: 0.3,
      },
    },
    collapsed: {
      left: "3rem",
      transition: {
        type: "spring",
        stiffness: 200,
        damping: 25,
        duration: 0.3,
      },
    },
  };

  // Variants cho nút Search - chỉ hiển thị khi expanded
  const searchButtonVariants = {
    expanded: {
      left: isMobile ? "10.5rem" : "10.5rem",
      opacity: 1,
      transition: {
        type: "spring",
        stiffness: 200,
        damping: 25,
        duration: 0.3,
      },
    },
    collapsed: {
      left: "3rem",
      opacity: 0,
      transition: {
        type: "spring",
        stiffness: 200,
        damping: 25,
        duration: 0.2,
      },
    },
  };
  const buttonVariants = {
    hover: {
      scale: 1.05,
      transition: {
        type: "spring",
        stiffness: 400,
        damping: 25,
      },
    },
    tap: {
      scale: 0.95,
      transition: {
        type: "spring",
        stiffness: 400,
        damping: 25,
      },
    },
  };

  return (
    <>
      <motion.button
        variants={buttonVariants}
        whileHover="hover"
        whileTap="tap"
        onClick={toggleSidebar}
        className={cn(
          "absolute cursor-pointer z-10 p-1.5 rounded-md",
          "hover:bg-gray-200 dark:hover:bg-gray-800/50 flex items-center justify-center w-10 h-10",
          "text-gray-700 dark:text-gray-300",
          "top-2 transition-all duration-300"
        )}
        style={{ left: "0.5rem" }}
      >
        {isMobile ? <MenuIcon /> : <ToggleSidebarIcon />}
      </motion.button>

      {/* Search button - only visible when expanded */}
      <motion.button
        variants={searchButtonVariants}
        initial={false}
        animate={isCollapsed ? "collapsed" : "expanded"}
        whileHover="hover"
        whileTap="tap"
        className={cn(
          "absolute cursor-pointer z-10 p-1.5 rounded-md",
          "hover:bg-gray-200 dark:hover:bg-gray-800/50 flex items-center justify-center w-10 h-10",
          "text-gray-700 dark:text-gray-300",
          "top-2 transition-all duration-300"
        )}
        style={{ pointerEvents: isCollapsed ? "none" : "auto" }} // Disable interactions when collapsed
      >
        <Search size={20} />
      </motion.button>

      {/* NewChat button with smooth animation */}
      <motion.button
        variants={newChatButtonVariants}
        initial={false}
        animate={isCollapsed ? "collapsed" : "expanded"}
        whileHover="hover"
        whileTap="tap"
        className={cn(
          "absolute cursor-pointer z-10 p-1.5 rounded-md",
          "hover:bg-gray-200 dark:hover:bg-gray-800/50 flex items-center justify-center w-10 h-10",
          "text-gray-700 dark:text-gray-300",
          "top-2"
        )}
      >
        <NewChatIcon />
      </motion.button>
    </>
  );
};

export default SidebarTool;
