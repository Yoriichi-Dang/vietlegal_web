"use client";

import React, { useState, useEffect } from "react";
import { cn } from "@/lib/utils";
import { ScrollArea } from "@/components/ui/scroll-area";
import { MessageSquare, Clock } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import SidebarTool from "./sidebar-tool";
import SidebarChatItem from "./sidebar-chat-item";
import { useWindowSize } from "@/hooks/useWindowSize";

const Sidebar = () => {
  const [isCollapsed, setIsCollapsed] = useState(true); // Bắt đầu với sidebar đóng
  const [activeDropdownId, setActiveDropdownId] = useState<string | null>(null);
  const [isMounted, setIsMounted] = useState(false);
  const [manuallyOpened, setManuallyOpened] = useState(false); // Theo dõi việc mở thủ công
  const { width } = useWindowSize();

  // Biến để kiểm tra xem có phải là màn hình nhỏ không
  const isSmallScreen = width < 750;

  // Đánh dấu component đã mount
  useEffect(() => {
    setIsMounted(true);
  }, []);

  // Xử lý việc mở/đóng sidebar
  const toggleSidebar = () => {
    const newState = !isCollapsed;
    setIsCollapsed(newState);

    // Đánh dấu là đã được mở thủ công nếu sidebar đang được mở
    if (!newState && isSmallScreen) {
      setManuallyOpened(true);
    } else if (newState) {
      // Reset lại trạng thái khi đóng
      setManuallyOpened(false);
    }
  };

  // Tự động điều chỉnh sidebar dựa trên kích thước màn hình
  useEffect(() => {
    if (!isMounted) return;

    if (isSmallScreen) {
      // Chỉ tự động đóng nếu chưa được mở thủ công
      if (!manuallyOpened) {
        setIsCollapsed(true);
      }
    } else {
      // Luôn mở trên màn hình lớn
      setIsCollapsed(false);
      setManuallyOpened(false); // Reset lại trạng thái
    }
  }, [width, isSmallScreen, isMounted, manuallyOpened]);

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

  const fadeInVariants = {
    hidden: {
      opacity: 0,
      x: -20,
      transition: {
        type: "spring",
        stiffness: 300,
        damping: 20,
      },
    },
    visible: {
      opacity: 1,
      x: 0,
      transition: {
        type: "spring",
        stiffness: 300,
        damping: 20,
        staggerChildren: 0.02,
        delayChildren: 0,
      },
    },
    exit: {
      opacity: 0,
      x: -20,
      transition: {
        type: "spring",
        stiffness: 300,
        damping: 20,
        staggerChildren: 0.02,
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
        stiffness: 300,
        damping: 20,
      },
    },
    visible: {
      opacity: 1,
      x: 0,
      transition: {
        type: "spring",
        stiffness: 300,
        damping: 20,
      },
    },
    exit: {
      opacity: 0,
      x: -20,
      transition: {
        type: "spring",
        stiffness: 300,
        damping: 20,
      },
    },
  };

  // Sample data for the sidebar items
  const recentItems = [
    {
      id: 1,
      name: "Thần số học Đặng Hoàng Nguyên dep trai so 1 mat troi",
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
    { id: 8, name: "Tìm hiểu về Hyperloop", icon: <MessageSquare size={14} /> },
    {
      id: 9,
      name: "Kernel trong hệ điều hành",
      icon: <MessageSquare size={14} />,
    },
    { id: 10, name: "Giới hạn tốc độ", icon: <MessageSquare size={14} /> },
    {
      id: 11,
      name: "House in Takasugian Decision",
      icon: <MessageSquare size={14} />,
    },
    { id: 12, name: "Hello and Response", icon: <MessageSquare size={14} /> },
    { id: 13, name: "Da Nang Description", icon: <MessageSquare size={14} /> },
    { id: 14, name: "Trở lý AI pháp lý", icon: <MessageSquare size={14} /> },
    { id: 15, name: "Crawl data to Qdrant", icon: <MessageSquare size={14} /> },
    { id: 16, name: "Tạo SSH key GitHub", icon: <MessageSquare size={14} /> },
    {
      id: 17,
      name: "Tạo server FastAPI WebSocket để chat",
      icon: <MessageSquare size={14} />,
    },
    { id: 18, name: "SSO là gì", icon: <MessageSquare size={14} /> },
    {
      id: 19,
      name: "Machine Learning cơ bản",
      icon: <MessageSquare size={14} />,
    },
    {
      id: 20,
      name: "Học React từ cơ bản đến nâng cao",
      icon: <MessageSquare size={14} />,
    },
    { id: 21, name: "Docker và Kubernetes", icon: <MessageSquare size={14} /> },
    {
      id: 22,
      name: "Microservice Architecture",
      icon: <MessageSquare size={14} />,
    },
    { id: 23, name: "GraphQL vs REST API", icon: <MessageSquare size={14} /> },
  ];

  // Điều kiện hiển thị overlay: đã mount + màn hình nhỏ + không đóng + đã mở thủ công
  const showOverlay =
    isMounted && isSmallScreen && !isCollapsed && manuallyOpened;

  return (
    <>
      {/* Overlay chỉ hiển thị khi thỏa mãn tất cả điều kiện */}
      {showOverlay && (
        <div
          className="fixed inset-0 bg-black/50 z-30 backdrop-blur-sm"
          onClick={toggleSidebar}
        />
      )}

      <nav className="flex h-screen relative z-40">
        {/* Toggle button - always visible outside of sidebar */}
        <SidebarTool isCollapsed={isCollapsed} toggleSidebar={toggleSidebar} />

        {/* Main sidebar content */}
        <motion.div
          variants={sidebarVariants}
          initial={false}
          animate={isCollapsed ? "collapsed" : "expanded"}
          className={cn(
            "h-screen flex flex-col relative overflow-hidden",
            "bg-white dark:bg-black",
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
                className="flex flex-col h-screen pt-14"
              >
                {/* Scrollable content area */}
                <div className="overflow-hidden">
                  <ScrollArea className="h-[calc(100vh-60px)]">
                    <div className="px-3">
                      <motion.div
                        variants={itemVariants}
                        className="text-xs text-gray-500 dark:text-gray-400 font-medium px-3 pt-3 pb-2"
                      >
                        Previous 7 Days
                      </motion.div>
                      {recentItems.map((item) => (
                        <SidebarChatItem
                          key={item.id}
                          id={item.id.toString()}
                          name={item.name}
                          activeDropdownId={activeDropdownId}
                          setActiveDropdownId={setActiveDropdownId}
                        />
                      ))}

                      <motion.div
                        variants={itemVariants}
                        className="text-xs text-gray-500 dark:text-gray-400 font-medium px-3 pt-3 pb-2"
                      >
                        Previous 30 Days
                      </motion.div>
                      {olderItems.map((item) => (
                        <SidebarChatItem
                          key={item.id}
                          id={item.id.toString()}
                          name={item.name}
                          activeDropdownId={activeDropdownId}
                          setActiveDropdownId={setActiveDropdownId}
                        />
                      ))}

                      {/* Bottom section for upgrade */}
                      <div className="p-2 border-t border-gray-200 dark:border-gray-800 my-4">
                        <div
                          className={cn(
                            "flex items-center gap-3 py-3 px-3 rounded-md cursor-pointer",
                            "hover:bg-gray-100 dark:hover:bg-zinc-800"
                          )}
                          onClick={() => setActiveDropdownId(null)} // Close any open dropdown when clicking upgrade plan
                        >
                          <Clock
                            size={14}
                            className="text-gray-500 dark:text-gray-400"
                          />
                          <span className="text-sm font-normal">
                            Upgrade plan
                          </span>
                        </div>
                      </div>
                    </div>
                  </ScrollArea>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </nav>
    </>
  );
};

export default Sidebar;
