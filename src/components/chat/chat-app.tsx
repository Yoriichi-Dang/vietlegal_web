"use client";
import { useState, useCallback, useMemo } from "react";
import { motion, AnimatePresence } from "motion/react";
import ChatInterface from "@/components/chat/chat-interface";
import ChatSidebar from "@/components/chat/chat-sidebar";
import { toast } from "sonner";

interface Chat {
  id: string;
  title: string;
}

// Mock data for demonstration
const mockChats: Chat[] = [
  { id: "1", title: "Legal Contract Review" },
  { id: "2", title: "Tax Law Questions" },
  { id: "3", title: "Insurance Claims" },
];

export default function ChatbotApp() {
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const [desktopSidebarOpen, setDesktopSidebarOpen] = useState(false);
  const [currentChat, setCurrentChat] = useState<Chat | null>(null);
  const [chats, setChats] = useState<Chat[]>(mockChats);
  const [newlyCreatedChatId, setNewlyCreatedChatId] = useState<string | null>(
    null
  );
  const [isCreatingChat, setIsCreatingChat] = useState(false);

  // Handle new chat creation with animation
  const handleNewChat = useCallback(async () => {
    if (isCreatingChat) return;

    try {
      const newChat: Chat = {
        id: Date.now().toString(),
        title: "New Chat",
      };

      // Start creating animation
      setIsCreatingChat(true);
      setNewlyCreatedChatId(newChat.id);

      // Add new chat to the beginning of the list
      setChats((prev) => [newChat, ...prev]);
      setCurrentChat(newChat);

      // Close mobile sidebar if on mobile
      if (window.innerWidth < 768) {
        setMobileSidebarOpen(false);
      }

      toast.success("Đã tạo cuộc trò chuyện mới");

      // Clear animation state after animation completes
      setTimeout(() => {
        setNewlyCreatedChatId(null);
        setIsCreatingChat(false);
      }, 600);
    } catch (error: any) {
      console.log(error);
      toast.error("Không thể tạo cuộc trò chuyện mới");
      setNewlyCreatedChatId(null);
      setIsCreatingChat(false);
    }
  }, [isCreatingChat]);

  // Handle chat selection
  const handleSelectChat = useCallback(
    (chatId: string) => {
      const chat = chats.find((c) => c.id === chatId);
      if (chat) {
        setCurrentChat(chat);
        setMobileSidebarOpen(false);
      }
    },
    [chats]
  );

  // Handle chat deletion
  const handleDeleteChat = useCallback(
    (chatId: string) => {
      try {
        setChats((prev) => prev.filter((c) => c.id !== chatId));
        if (currentChat?.id === chatId) {
          setCurrentChat(null);
        }
        toast.success("Đã xóa cuộc trò chuyện");
      } catch (error: any) {
        console.log(error);
        toast.error("Không thể xóa cuộc trò chuyện");
      }
    },
    [currentChat]
  );

  // Handle chat title update
  const handleUpdateChatTitle = useCallback(
    (chatId: string, title: string) => {
      try {
        setChats((prev) =>
          prev.map((chat) => (chat.id === chatId ? { ...chat, title } : chat))
        );
        if (currentChat?.id === chatId) {
          setCurrentChat({ ...currentChat, title });
        }
        toast.success("Đã cập nhật tiêu đề");
      } catch (error: any) {
        console.log(error);
        toast.error("Không thể cập nhật tiêu đề");
      }
    },
    [currentChat]
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
      newlyCreatedChatId,
    }),
    [
      chats,
      currentChat,
      handleNewChat,
      handleSelectChat,
      handleDeleteChat,
      handleUpdateChatTitle,
      isCreatingChat,
      newlyCreatedChatId,
    ]
  );

  return (
    <div className="flex h-screen w-full bg-neutral-900 overflow-hidden">
      {/* Desktop Sidebar */}
      <motion.div
        className="hidden md:flex bg-neutral-900 border-r border-neutral-800/50 shrink-0"
        animate={{
          width: desktopSidebarOpen ? "280px" : "60px",
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
          currentChat={currentChat}
        />
      </div>
    </div>
  );
}
