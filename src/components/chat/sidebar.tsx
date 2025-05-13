"use client";

import React, { useState, useEffect } from "react";
import { cn } from "@/lib/utils";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Clock } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import SidebarTool from "./sidebar-tool";
import SidebarChatItem from "./sidebar-chat-item";
import { useWindowSize } from "@/hooks/useWindowSize";
import { useConversation } from "@/provider/conversation-provider";

const Sidebar = () => {
  const [isCollapsed, setIsCollapsed] = useState(true); // Bắt đầu với sidebar đóng
  const [activeDropdownId, setActiveDropdownId] = useState<string | null>(null);
  const [manuallyOpened, setManuallyOpened] = useState(false); // Theo dõi việc mở thủ công
  const { width } = useWindowSize();
  const { conversations } = useConversation(); // Lấy danh sách conversations từ provider
  // Biến để kiểm tra xem có phải là màn hình nhỏ không
  const isSmallScreen = width < 750;

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
  }, [width, isSmallScreen, manuallyOpened]);

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

  // Phân chia cuộc trò chuyện thành các nhóm dựa trên thời gian
  const now = new Date();
  const oneWeekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);

  // Cuộc trò chuyện trong 7 ngày gần đây
  const recentConversations = conversations.filter(
    (conv) => new Date(conv.created_at) >= oneWeekAgo
  );

  // Cuộc trò chuyện cũ hơn 7 ngày
  const olderConversations = conversations.filter(
    (conv) => new Date(conv.created_at) < oneWeekAgo
  );

  // Điều kiện hiển thị overlay: đã mount + màn hình nhỏ + không đóng + đã mở thủ công
  const showOverlay = isSmallScreen && !isCollapsed && manuallyOpened;

  return (
    <>
      {/* Thêm refreshKey vào component key để buộc render lại khi conversations thay đổi */}
      <div>
        {/* Overlay chỉ hiển thị khi thỏa mãn tất cả điều kiện */}
        {showOverlay && (
          <div
            className="fixed inset-0 z-10 bg-black/50 backdrop-blur-sm w-full h-full"
            onClick={toggleSidebar}
          />
        )}

        <nav className="h-screen">
          {/* Toggle button - always visible outside of sidebar */}
          <SidebarTool
            isCollapsed={isCollapsed}
            toggleSidebar={toggleSidebar}
          />

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
                        {recentConversations.length > 0 ? (
                          recentConversations.map((item) => (
                            <SidebarChatItem
                              key={item.id}
                              id={item.id}
                              name={item.title || "New Conversation"}
                              activeDropdownId={activeDropdownId}
                              setActiveDropdownId={setActiveDropdownId}
                            />
                          ))
                        ) : (
                          <div className="text-sm text-gray-500 dark:text-gray-400 px-3 py-2">
                            No recent conversations
                          </div>
                        )}

                        {olderConversations.length > 0 && (
                          <>
                            <motion.div
                              variants={itemVariants}
                              className="text-xs text-gray-500 dark:text-gray-400 font-medium px-3 pt-3 pb-2"
                            >
                              Previous 30 Days
                            </motion.div>
                            {olderConversations.map((item) => (
                              <SidebarChatItem
                                key={item.id}
                                id={item.id}
                                name={item.title || "New Conversation"}
                                activeDropdownId={activeDropdownId}
                                setActiveDropdownId={setActiveDropdownId}
                              />
                            ))}
                          </>
                        )}

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
      </div>
    </>
  );
};

export default Sidebar;
