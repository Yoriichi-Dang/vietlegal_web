"use client";
import { useState, useCallback, useMemo, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import ChatInterface from "@/components/chat/chat-interface";
import ChatSidebar from "@/components/chat/chat-sidebar";
import { toast } from "sonner";
import { useChat } from "@/provider/chat-provider";
import { Spinner } from "../ui/spinner";
import { usePathname } from "next/navigation";

// Mock data for demonstration

export default function ChatbotApp() {
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const [desktopSidebarOpen, setDesktopSidebarOpen] = useState(false);

  const {
    chats,
    currentChat,
    createNewChat,
    isFetchedChats,
    isLoadingChats,
    isCreatingChat,
    deleteChat,
    updateChatTitle,
    selectChat,
    hasBeenReady,
  } = useChat();
  const pathname = usePathname();
  const chatId = pathname.includes("c") ? pathname.split("/").pop() : null;
  useEffect(() => {
    if (chatId && hasBeenReady && isFetchedChats) {
      selectChat(chatId);
    }
  }, [chatId, selectChat, isFetchedChats, hasBeenReady]);
  // Handle new chat creation with animation
  const handleNewChat = useCallback(async () => {
    if (isCreatingChat) return;
    try {
      // Start creating animation
      const newChat = await createNewChat();
      if (newChat) {
        window.history.replaceState({}, "", `/c/${newChat.id}`);
        toast.success("Đã tạo cuộc trò chuyện mới");
      } else {
        toast.error("Không thể tạo cuộc trò chuyện mới");
      }
      if (window.innerWidth < 768) {
        setMobileSidebarOpen(false);
      }
      // Clear animation state after animation completes
    } catch (error: any) {
      console.log(error);
      toast.error("Không thể tạo cuộc trò chuyện mới");
    }
  }, [isCreatingChat, createNewChat]);

  // Handle chat selection
  const handleSelectChat = useCallback(
    async (chatId: string) => {
      await selectChat(chatId);
      setMobileSidebarOpen(false);
    },
    [selectChat]
  );

  // Handle chat deletion
  const handleDeleteChat = useCallback(
    (id: string) => {
      try {
        deleteChat(id);
        if (currentChat?.id === id) {
          window.history.replaceState({}, "", "/new");
        }
        toast.success("Đã xóa cuộc trò chuyện");
      } catch (error: any) {
        console.log(error);
        toast.error("Không thể xóa cuộc trò chuyện");
      }
    },
    [deleteChat, currentChat]
  );

  // Handle chat title update
  const handleUpdateChatTitle = useCallback(
    (chatId: string, title: string) => {
      try {
        updateChatTitle(chatId, title);
        toast.success("Đã cập nhật tiêu đề");
      } catch (error: any) {
        console.log(error);
        toast.error("Không thể cập nhật tiêu đề");
      }
    },
    [updateChatTitle]
  );

  // Memoized sidebar props to prevent unnecessary re-renders
  const sidebarProps = useMemo(
    () => ({
      chats,
      currentChat,
      onNewChat: handleNewChat,
      onSelectChat: handleSelectChat,
      onDeleteChat: handleDeleteChat,
      onUpdateChatTitle: handleUpdateChatTitle,
      isCreatingChat,
      newlyCreatedChatId: currentChat?.id || null,
    }),
    [
      chats,
      currentChat,
      handleNewChat,
      handleSelectChat,
      handleDeleteChat,
      handleUpdateChatTitle,
      isCreatingChat,
    ]
  );
  const shouldShowLoading = !hasBeenReady || isLoadingChats || !chats.length;
  if (shouldShowLoading) {
    return (
      <div className="flex h-screen w-full bg-neutral-900 overflow-hidden items-center justify-center">
        <Spinner size={"xl"} />
      </div>
    );
  }

  return (
    <div className="flex h-screen w-full bg-neutral-900 overflow-hidden">
      {/* Desktop Sidebar */}
      <motion.div
        className="hidden md:flex bg-neutral-900 border-r border-neutral-800/50 shrink-0"
        animate={{
          width: desktopSidebarOpen ? "280px" : "70px",
        }}
        transition={{
          duration: 0.3,
          ease: "easeInOut",
        }}
        onMouseEnter={() => setDesktopSidebarOpen(true)}
        onMouseLeave={() => setDesktopSidebarOpen(false)}
      >
        <ChatSidebar
          {...sidebarProps}
          isDesktop={true}
          isOpen={desktopSidebarOpen}
        />
      </motion.div>

      {/* Mobile Sidebar Overlay */}
      <AnimatePresence>
        {mobileSidebarOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{
                duration: 0.3,
                ease: "easeInOut",
              }}
              onClick={() => setMobileSidebarOpen(false)}
              className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40 md:hidden"
            />

            {/* Mobile Sidebar */}
            <motion.div
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{
                duration: 0.3,
                ease: "easeInOut",
              }}
              className="fixed left-0 top-0 h-full w-80 bg-neutral-900 border-r border-neutral-800 z-50 shadow-2xl md:hidden"
            >
              <ChatSidebar {...sidebarProps} isDesktop={false} />
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Main Content */}
      <div className="flex-1 flex flex-col w-full h-full">
        <ChatInterface
          onToggleSidebar={() => setMobileSidebarOpen(!mobileSidebarOpen)}
          showMenuButton={true}
        />
      </div>
    </div>
  );
}
