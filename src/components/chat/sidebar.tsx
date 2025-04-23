"use client";

import React, { useState, useEffect } from "react";
import { cn } from "@/lib/utils";
import { ScrollArea } from "@/components/ui/scroll-area";
import { MessageSquare, Globe, BookOpen, Clock } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import NewChatIcon from "../icons/new-chat-icon";
import ToggleSidebarIcon from "../icons/toggle-sidebar-icon";
import MenuIcon from "../icons/menu-icon";
import { useTheme } from "@/provider/theme-provider";

const Sidebar = () => {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const { resolvedTheme } = useTheme(); // Sử dụng hook để lấy theme hiện tại
  const isDarkTheme = resolvedTheme === "dark";

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

  const toggleSidebar = () => {
    setIsCollapsed(!isCollapsed);
  };

  const sidebarVariants = {
    expanded: {
      width: "16rem",
      transition: {
        type: "spring",
        stiffness: 200,
        damping: 25,
        duration: 0.3,
      },
    },
    collapsed: {
      width: "0",
      transition: {
        type: "spring",
        stiffness: 200,
        damping: 25,
        duration: 0.3,
      },
    },
  };

  // Variants cho nút NewChat để di chuyển mượt mà
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

  const fadeInVariants = {
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
        staggerChildren: 0.05,
        delayChildren: 0.1,
      },
    },
    exit: {
      opacity: 0,
      x: -20,
      transition: {
        type: "spring",
        stiffness: 200,
        damping: 25,
        staggerChildren: 0.05,
        staggerDirection: -1,
      },
    },
  };

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

  // Sample data for the sidebar items
  const recentItems = [
    {
      id: 1,
      name: "Thần số học Đặng Hoàng Nguyên",
      icon: <MessageSquare size={14} />,
    },
    { id: 2, name: "Mỗ tả bạn thân", icon: <MessageSquare size={14} /> },
    {
      id: 3,
      name: "Công cụ generate file tự động",
      icon: <MessageSquare size={14} />,
    },
    { id: 4, name: "Dịch cụm từ tiếng Anh", icon: <MessageSquare size={14} /> },
  ];

  const olderItems = [
    { id: 5, name: "Công ty Arm", icon: <MessageSquare size={14} /> },
    { id: 6, name: "MCP trong AI", icon: <MessageSquare size={14} /> },
    { id: 7, name: "Tìm hiểu về Hyperloop", icon: <MessageSquare size={14} /> },
    {
      id: 8,
      name: "Kernel trong hệ điều hành",
      icon: <MessageSquare size={14} />,
    },
    { id: 9, name: "Giới hạn tốc độ", icon: <MessageSquare size={14} /> },
    {
      id: 10,
      name: "House in Takasugian Decision",
      icon: <MessageSquare size={14} />,
    },
    { id: 11, name: "Hello and Response", icon: <MessageSquare size={14} /> },
    { id: 12, name: "Da Nang Description", icon: <MessageSquare size={14} /> },
    { id: 13, name: "Trở lý AI pháp lý", icon: <MessageSquare size={14} /> },
    { id: 14, name: "Crawl data to Qdrant", icon: <MessageSquare size={14} /> },
    { id: 15, name: "Tạo SSH key GitHub", icon: <MessageSquare size={14} /> },
    {
      id: 16,
      name: "Tạo server FastAPI WebSocket",
      icon: <MessageSquare size={14} />,
    },
    { id: 17, name: "SSO là gì", icon: <MessageSquare size={14} /> },
  ];

  const mainNavItems = [
    { id: "chatgpt", name: "ChatGPT", icon: <MessageSquare size={14} /> },
    { id: "explore", name: "Explore GPTs", icon: <Globe size={14} /> },
    { id: "library", name: "Library", icon: <BookOpen size={14} /> },
  ];

  return (
    <div className="flex h-screen relative">
      {/* Toggle button - always visible outside of sidebar */}
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

      {/* NewChat button with smooth animation */}
      {
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
      }

      {/* Main sidebar content */}
      <motion.div
        variants={sidebarVariants}
        initial={false}
        animate={isCollapsed ? "collapsed" : "expanded"}
        className={cn(
          "h-screen flex flex-col relative overflow-hidden",
          "bg-gray-100 dark:bg-gray-900",
          "text-gray-800 dark:text-white",
          "transition-all duration-500 ease-in-out shadow-lg"
        )}
      >
        {/* Main content */}
        <AnimatePresence mode="wait">
          {!isCollapsed && (
            <motion.div
              variants={fadeInVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
              className="flex-1 flex flex-col pt-14"
            >
              {/* Main Navigation */}
              <motion.div variants={itemVariants} className="px-2 py-2">
                {mainNavItems.map((item, index) => (
                  <motion.div
                    key={item.id}
                    variants={itemVariants}
                    custom={index}
                    className={cn(
                      "flex items-center space-x-3 px-2 py-1.5 rounded-md cursor-pointer text-sm",
                      "hover:bg-gray-200 dark:hover:bg-gray-800"
                    )}
                  >
                    <span className="text-gray-500 dark:text-gray-400">
                      {item.icon}
                    </span>
                    <span>{item.name}</span>
                  </motion.div>
                ))}
              </motion.div>

              {/* Scrollable area for recent chats */}
              <ScrollArea className="flex-1">
                <motion.div variants={itemVariants} className="px-2">
                  <motion.div
                    variants={itemVariants}
                    className="text-[11px] text-gray-500 dark:text-gray-400 font-medium px-2 py-1.5"
                  >
                    Previous 7 Days
                  </motion.div>
                  {recentItems.map((item, index) => (
                    <motion.div
                      key={item.id}
                      variants={itemVariants}
                      custom={index}
                      className={cn(
                        "flex items-center space-x-3 px-2 py-1.5 rounded-md cursor-pointer group relative",
                        "hover:bg-gray-200 dark:hover:bg-gray-800"
                      )}
                    >
                      <span className="text-gray-500 dark:text-gray-400 flex-shrink-0">
                        {item.icon}
                      </span>
                      <div className="relative w-full overflow-hidden">
                        <span className="text-sm block truncate">
                          {item.name}
                        </span>
                        {/* Dynamic gradient overlay based on theme */}
                        <div
                          className="absolute top-0 right-0 h-full w-10 pointer-events-none bg-gradient-to-r from-transparent"
                          style={{
                            background: isDarkTheme
                              ? "linear-gradient(to right, rgba(17, 24, 39, 0), rgba(17, 24, 39, 1))"
                              : "linear-gradient(to right, rgba(243, 244, 246, 0), rgba(243, 244, 246, 1))",
                          }}
                        ></div>
                      </div>
                    </motion.div>
                  ))}

                  <motion.div
                    variants={itemVariants}
                    className="text-[11px] text-gray-500 dark:text-gray-400 font-medium px-2 py-1.5 mt-3"
                  >
                    Previous 30 Days
                  </motion.div>
                  {olderItems.map((item, index) => (
                    <motion.div
                      key={item.id}
                      variants={itemVariants}
                      custom={index}
                      className={cn(
                        "flex items-center space-x-3 px-2 py-1.5 rounded-md cursor-pointer group relative",
                        "hover:bg-gray-200 dark:hover:bg-gray-800"
                      )}
                    >
                      <span className="text-gray-500 dark:text-gray-400 flex-shrink-0">
                        {item.icon}
                      </span>
                      <div className="relative w-full overflow-hidden">
                        <span className="text-sm block truncate">
                          {item.name}
                        </span>
                        {/* Dynamic gradient overlay based on theme */}
                        <div
                          className="absolute top-0 right-0 h-full w-10 pointer-events-none bg-gradient-to-r from-transparent"
                          style={{
                            background: isDarkTheme
                              ? "linear-gradient(to right, rgba(17, 24, 39, 0), rgba(17, 24, 39, 1))"
                              : "linear-gradient(to right, rgba(243, 244, 246, 0), rgba(243, 244, 246, 1))",
                          }}
                        ></div>
                      </div>
                    </motion.div>
                  ))}
                </motion.div>
              </ScrollArea>

              {/* Bottom section for upgrade */}
              <motion.div
                variants={itemVariants}
                className="p-2 border-t border-gray-200 dark:border-gray-800"
              >
                <motion.div
                  variants={itemVariants}
                  className={cn(
                    "flex items-center space-x-3 text-xs px-2 py-1.5 rounded-md cursor-pointer",
                    "hover:bg-gray-200 dark:hover:bg-gray-800"
                  )}
                >
                  <Clock
                    size={14}
                    className="text-gray-500 dark:text-gray-400"
                  />
                  <span>Upgrade plan</span>
                </motion.div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  );
};

export default Sidebar;
