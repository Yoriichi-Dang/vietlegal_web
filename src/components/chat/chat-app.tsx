"use client";

import type React from "react";
import { useState, useCallback, useEffect } from "react";
import {
  IconTemplate,
  IconFolder,
  IconMessageCircle,
  IconPlus,
  IconSparkles,
  IconSearch,
  IconTrash,
  IconEdit,
} from "@tabler/icons-react";
import { motion, AnimatePresence } from "motion/react";
import { cn } from "@/lib/utils";
import ChatInterface from "@/components/chat/chat-interface";
import { Logo } from "./logo";
import { LogoIcon } from "./logo";
import { useRouter } from "next/navigation";
import { useChat } from "@/provider/chat-provider";
import { useChatOperations } from "@/hooks/useChatOperations";
import { toast } from "sonner";

export default function ChatbotApp() {
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const [desktopSidebarOpen, setDesktopSidebarOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [editingChatId, setEditingChatId] = useState<string | null>(null);
  const [editTitle, setEditTitle] = useState("");

  const router = useRouter();

  const {
    chats,
    currentChat,
    isLoading,
    error,
    createNewChat,
    selectChat,
    updateChatTitle,
    deleteChat,
    refreshChats,
  } = useChat();

  const { startNewConversation } = useChatOperations();

  // Handle new chat creation
  const handleNewChat = useCallback(async () => {
    try {
      const newChat = await createNewChat({
        title: "New Chat",
      });

      if (newChat) {
        toast.success("Đã tạo cuộc trò chuyện mới");
        setMobileSidebarOpen(false);
      }
    } catch (error) {
      toast.error("Không thể tạo cuộc trò chuyện mới");
    }
  }, [createNewChat]);

  // Handle chat selection
  const handleSelectChat = useCallback(
    async (chatId: string) => {
      try {
        await selectChat(chatId);
        setMobileSidebarOpen(false);
      } catch (error) {
        toast.error("Không thể tải cuộc trò chuyện");
      }
    },
    [selectChat]
  );

  // Handle chat deletion
  const handleDeleteChat = useCallback(
    async (chatId: string, event: React.MouseEvent) => {
      event.stopPropagation();

      if (confirm("Bạn có chắc chắn muốn xóa cuộc trò chuyện này?")) {
        try {
          await deleteChat(chatId);
          toast.success("Đã xóa cuộc trò chuyện");
        } catch (error) {
          toast.error("Không thể xóa cuộc trò chuyện");
        }
      }
    },
    [deleteChat]
  );

  // Handle title editing
  const handleEditTitle = useCallback(
    (chatId: string, currentTitle: string, event: React.MouseEvent) => {
      event.stopPropagation();
      setEditingChatId(chatId);
      setEditTitle(currentTitle);
    },
    []
  );

  // Save title edit
  const handleSaveTitle = useCallback(
    async (chatId: string) => {
      if (
        editTitle.trim() &&
        editTitle !== chats.find((c) => c.id === chatId)?.title
      ) {
        try {
          await updateChatTitle(chatId, editTitle.trim());
          toast.success("Đã cập nhật tiêu đề");
        } catch (error) {
          toast.error("Không thể cập nhật tiêu đề");
        }
      }
      setEditingChatId(null);
      setEditTitle("");
    },
    [editTitle, chats, updateChatTitle]
  );

  // Cancel title edit
  const handleCancelEdit = useCallback(() => {
    setEditingChatId(null);
    setEditTitle("");
  }, []);

  // Filter chats based on search
  const filteredChats = chats.filter((chat) =>
    chat.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Utility links
  const utilityLinks = [
    {
      label: "New Chat",
      href: "#",
      icon: <IconPlus className="h-4 w-4 shrink-0" />,
      onClick: handleNewChat,
    },
    {
      label: "My projects",
      href: "/projects",
      icon: <IconFolder className="h-4 w-4 shrink-0" />,
    },
    {
      label: "Templates",
      href: "/template",
      icon: <IconTemplate className="h-4 w-4 shrink-0" />,
    },
  ];

  // Show error toast
  useEffect(() => {
    if (error) {
      toast.error(error);
    }
  }, [error]);

  const SidebarContent = ({ isDesktop = false }: { isDesktop?: boolean }) => (
    <div className="flex flex-col h-full w-full">
      {/* Logo Section */}
      <div className="flex items-center justify-center py-6 px-4">
        <motion.div
          animate={{
            scale: isDesktop && desktopSidebarOpen ? 1 : 1,
          }}
          transition={{
            duration: 0.2,
            ease: "easeInOut",
          }}
        >
          {isDesktop && desktopSidebarOpen ? <Logo /> : <LogoIcon />}
        </motion.div>
      </div>

      {/* Scrollable Content */}
      <div className="flex-1 overflow-y-auto scrollbar-hide">
        <AnimatePresence mode="wait">
          {(isDesktop && desktopSidebarOpen) || !isDesktop ? (
            <motion.div
              key="expanded"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{
                duration: 0.2,
                ease: "easeInOut",
              }}
              className="px-3 space-y-6"
            >
              {/* Search */}
              <div className="relative">
                <IconSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-neutral-500" />
                <input
                  type="text"
                  placeholder="Search chats..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full bg-neutral-800/50 text-neutral-200 placeholder-neutral-500 rounded-xl pl-10 pr-4 py-2.5 text-sm border border-neutral-700/50 focus:border-neutral-600 focus:bg-neutral-800 focus:outline-none transition-all duration-200"
                />
              </div>

              {/* Settings Section */}
              <div>
                <div className="px-2 mb-3">
                  <span className="text-xs text-neutral-500 uppercase tracking-wider font-medium">
                    Settings
                  </span>
                </div>
                <div className="space-y-1">
                  {utilityLinks.map((link, idx) => (
                    <motion.button
                      key={idx}
                      onClick={() => {
                        if (link.onClick) {
                          link.onClick();
                        } else {
                          router.push(link.href);
                        }
                      }}
                      disabled={isLoading && link.onClick === handleNewChat}
                      whileHover={{ x: 2 }}
                      transition={{ duration: 0.15 }}
                      className="w-full flex items-center gap-3 px-3 py-2.5 text-left text-neutral-400 hover:text-neutral-200 hover:bg-neutral-800/50 rounded-xl cursor-pointer transition-all duration-200 group disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <div className="text-neutral-500 group-hover:text-blue-400 transition-colors">
                        {isLoading && link.onClick === handleNewChat ? (
                          <div className="w-4 h-4 border-2 border-blue-400 border-t-transparent rounded-full animate-spin" />
                        ) : (
                          link.icon
                        )}
                      </div>
                      <span className="text-sm font-medium">{link.label}</span>
                    </motion.button>
                  ))}
                </div>
              </div>

              {/* Chats Section */}
              <div>
                <div className="px-2 mb-3 flex items-center justify-between">
                  <span className="text-xs text-neutral-500 uppercase tracking-wider font-medium">
                    Chats ({filteredChats.length})
                  </span>
                  <motion.button
                    onClick={refreshChats}
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    className="p-1.5 hover:bg-neutral-800 rounded-lg transition-colors cursor-pointer"
                    title="Refresh chats"
                  >
                    <motion.div
                      animate={{ rotate: isLoading ? 360 : 0 }}
                      transition={{
                        duration: 1,
                        repeat: isLoading ? Number.POSITIVE_INFINITY : 0,
                        ease: "linear",
                      }}
                    >
                      <IconPlus className="h-3.5 w-3.5 text-neutral-500 hover:text-neutral-300" />
                    </motion.div>
                  </motion.button>
                </div>

                {/* Loading state */}
                {isLoading && filteredChats.length === 0 && (
                  <div className="px-3 py-4 text-center">
                    <div className="w-6 h-6 border-2 border-blue-400 border-t-transparent rounded-full animate-spin mx-auto mb-2" />
                    <span className="text-xs text-neutral-500">
                      Loading chats...
                    </span>
                  </div>
                )}

                {/* Chat list */}
                <div className="space-y-1">
                  {filteredChats.map((chat) => (
                    <motion.div
                      key={chat.id}
                      whileHover={{ x: 2 }}
                      transition={{ duration: 0.15 }}
                      className={cn(
                        "w-full justify-between cursor-pointer flex items-center gap-3 px-3 py-2.5 text-left rounded-xl transition-all duration-200 group",
                        currentChat?.id === chat.id
                          ? "bg-neutral-800 text-neutral-200 shadow-sm"
                          : "text-neutral-400 hover:text-neutral-200 hover:bg-neutral-800/50"
                      )}
                    >
                      <div
                        className="flex items-center gap-3 flex-1 min-w-0"
                        onClick={() => handleSelectChat(chat.id)}
                      >
                        <IconMessageCircle
                          className={cn(
                            "h-4 w-4 shrink-0 transition-colors",
                            currentChat?.id === chat.id
                              ? "text-blue-400"
                              : "text-neutral-500 group-hover:text-blue-400"
                          )}
                        />

                        {editingChatId === chat.id ? (
                          <input
                            type="text"
                            value={editTitle}
                            onChange={(e) => setEditTitle(e.target.value)}
                            onBlur={() => handleSaveTitle(chat.id)}
                            onKeyDown={(e) => {
                              if (e.key === "Enter") {
                                handleSaveTitle(chat.id);
                              } else if (e.key === "Escape") {
                                handleCancelEdit();
                              }
                            }}
                            className="flex-1 bg-neutral-700 text-white text-sm px-2 py-1 rounded border-none outline-none focus:ring-1 focus:ring-blue-500"
                            autoFocus
                            onClick={(e) => e.stopPropagation()}
                          />
                        ) : (
                          <span className="text-sm font-medium truncate">
                            {chat.title}
                          </span>
                        )}
                      </div>

                      {/* Chat actions */}
                      <div className="flex items-center space-x-1 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button
                          onClick={(e) =>
                            handleEditTitle(chat.id, chat.title, e)
                          }
                          className="p-1 text-neutral-500 hover:text-blue-400 transition-colors rounded"
                          title="Edit title"
                        >
                          <IconEdit size={14} />
                        </button>
                        <button
                          onClick={(e) => handleDeleteChat(chat.id, e)}
                          className="p-1 text-neutral-500 hover:text-red-400 transition-colors rounded"
                          title="Delete chat"
                        >
                          <IconTrash size={14} />
                        </button>
                      </div>
                    </motion.div>
                  ))}
                </div>

                {/* Empty state */}
                {!isLoading && filteredChats.length === 0 && (
                  <div className="px-3 py-8 text-center">
                    <IconMessageCircle className="h-8 w-8 text-neutral-600 mx-auto mb-2" />
                    <p className="text-sm text-neutral-500 mb-2">
                      {searchQuery ? "No chats found" : "No chats yet"}
                    </p>
                    {!searchQuery && (
                      <button
                        onClick={handleNewChat}
                        className="text-xs text-blue-400 hover:text-blue-300 transition-colors"
                      >
                        Start your first conversation
                      </button>
                    )}
                  </div>
                )}
              </div>
            </motion.div>
          ) : (
            /* Collapsed state - only icons */
            <motion.div
              key="collapsed"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{
                duration: 0.2,
                ease: "easeInOut",
              }}
              className="px-3 space-y-3"
            >
              {utilityLinks.map((link, idx) => (
                <motion.button
                  key={idx}
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.95 }}
                  transition={{
                    duration: 0.15,
                    ease: "easeInOut",
                  }}
                  className="w-full p-3 rounded-xl hover:bg-neutral-800 transition-all duration-200 group flex items-center justify-center"
                  title={link.label}
                  onClick={() => {
                    if (link.onClick) {
                      link.onClick();
                    } else {
                      router.push(link.href);
                    }
                  }}
                >
                  <div className="text-neutral-500 group-hover:text-blue-400 transition-colors">
                    {link.icon}
                  </div>
                </motion.button>
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Bottom Section */}
      <div className="mt-auto">
        {/* Upgrade Section */}
        <AnimatePresence>
          {((isDesktop && desktopSidebarOpen) || !isDesktop) && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 20 }}
              transition={{
                duration: 0.2,
                ease: "easeInOut",
              }}
              className="p-3"
            >
              <div className="bg-gradient-to-br from-blue-600 via-blue-700 to-purple-700 rounded-xl p-4 shadow-lg">
                <div className="flex items-center gap-2 mb-2">
                  <IconSparkles className="h-4 w-4 text-white" />
                  <span className="text-sm font-semibold text-white">
                    Upgrade Plan
                  </span>
                </div>
                <p className="text-xs text-blue-100/90 leading-relaxed">
                  Unlock advanced legal AI features
                </p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* User Avatar for collapsed state */}
        <AnimatePresence>
          {isDesktop && !desktopSidebarOpen && (
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              transition={{
                duration: 0.2,
                ease: "easeInOut",
              }}
              className="p-3 flex justify-center"
            >
              <motion.div
                whileHover={{ scale: 1.1 }}
                transition={{ duration: 0.15 }}
                className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center cursor-pointer shadow-lg"
              >
                <span className="text-white font-bold text-sm">LW</span>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );

  return (
    <div className="flex h-screen w-full bg-neutral-900 overflow-hidden">
      {/* Desktop Sidebar */}
      <motion.div
        className="hidden md:flex bg-neutral-900 border-r border-neutral-800/50 shrink-0"
        animate={{
          width: desktopSidebarOpen ? "280px" : "72px",
        }}
        transition={{
          duration: 0.3,
          ease: "easeInOut",
        }}
        onMouseEnter={() => setDesktopSidebarOpen(true)}
        onMouseLeave={() => setDesktopSidebarOpen(false)}
      >
        <SidebarContent isDesktop={true} />
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
              <SidebarContent isDesktop={false} />
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
          onAddMessage={async (message) => {
            // This will be handled by the ChatInterface component
            // using the useChat hook context
          }}
        />
      </div>
    </div>
  );
}
