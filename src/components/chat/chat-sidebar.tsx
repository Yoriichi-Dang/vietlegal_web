"use client";

import type React from "react";
import { useState, useCallback, useMemo, memo } from "react";
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
import { useRouter } from "next/navigation";

interface Chat {
  id: string;
  title: string;
}

interface ChatSidebarProps {
  chats: Chat[];
  currentChat: Chat | null;
  onNewChat: () => void;
  onSelectChat: (chatId: string) => void;
  onDeleteChat: (chatId: string) => void;
  onUpdateChatTitle: (chatId: string, title: string) => void;
  isCreatingChat: boolean;
  newlyCreatedChatId: string | null;
  isDesktop?: boolean;
  isOpen?: boolean;
  onToggle?: () => void;
}

// Memoized Chat Item Component
const ChatItem = memo(
  ({
    chat,
    isCurrentChat,
    isNewChat,
    onSelect,
    onDelete,
    onEditTitle,
  }: {
    chat: Chat;
    isCurrentChat: boolean;
    isNewChat: boolean;
    onSelect: () => void;
    onDelete: (e: React.MouseEvent) => void;
    onEditTitle: (title: string) => void;
  }) => {
    const [isEditing, setIsEditing] = useState(false);
    const [editTitle, setEditTitle] = useState(chat.title);

    const handleSave = useCallback(() => {
      if (editTitle.trim() && editTitle !== chat.title) {
        onEditTitle(editTitle.trim());
      }
      setIsEditing(false);
    }, [editTitle, chat.title, onEditTitle]);

    const handleCancel = useCallback(() => {
      setEditTitle(chat.title);
      setIsEditing(false);
    }, [chat.title]);

    const handleEdit = useCallback(
      (e: React.MouseEvent) => {
        e.stopPropagation();
        setIsEditing(true);
        setEditTitle(chat.title);
      },
      [chat.title]
    );

    return (
      <motion.div
        layout
        initial={
          isNewChat
            ? {
                opacity: 0,
                scale: 0.95,
                y: -8,
              }
            : false
        }
        animate={{
          opacity: 1,
          scale: 1,
          y: 0,
        }}
        exit={{
          opacity: 0,
          scale: 0.95,
          x: -10,
          transition: { duration: 0.15 },
        }}
        transition={{
          duration: isNewChat ? 0.3 : 0.2,
          ease: "easeOut",
        }}
        whileHover={{ x: 2 }}
        className={cn(
          "w-full justify-between cursor-pointer flex items-center gap-3 px-3 py-2.5 text-left rounded-xl transition-all duration-200 group",
          isCurrentChat
            ? "bg-neutral-800 text-neutral-200 shadow-sm"
            : "text-neutral-400 hover:text-neutral-200 hover:bg-neutral-800/50",
          isNewChat && "ring-1 ring-blue-500/40 bg-blue-900/10"
        )}
      >
        <div
          className="flex items-center gap-3 flex-1 min-w-0"
          onClick={onSelect}
        >
          <motion.div
            animate={
              isNewChat
                ? {
                    scale: [1, 1.1, 1],
                  }
                : {}
            }
            transition={{ duration: 0.4, delay: 0.1 }}
          >
            <IconMessageCircle
              className={cn(
                "h-4 w-4 shrink-0 transition-colors",
                isCurrentChat || isNewChat
                  ? "text-blue-400"
                  : "text-neutral-500 group-hover:text-blue-400"
              )}
            />
          </motion.div>

          {isEditing ? (
            <input
              type="text"
              value={editTitle}
              onChange={(e) => setEditTitle(e.target.value)}
              onBlur={handleSave}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  handleSave();
                } else if (e.key === "Escape") {
                  handleCancel();
                }
              }}
              className="flex-1 bg-neutral-700 text-white text-sm px-2 py-1 rounded border-none outline-none focus:ring-1 focus:ring-blue-500"
              autoFocus
              onClick={(e) => e.stopPropagation()}
            />
          ) : (
            <motion.span
              className="text-sm font-medium truncate"
              animate={
                isNewChat
                  ? {
                      color: ["#a3a3a3", "#60a5fa", "#e5e5e5"],
                    }
                  : {}
              }
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              {chat.title}
            </motion.span>
          )}
        </div>

        {/* Chat actions */}
        <div className="flex items-center space-x-1 opacity-0 group-hover:opacity-100 transition-opacity">
          <button
            onClick={handleEdit}
            className="p-1 text-neutral-500 hover:text-blue-400 transition-colors rounded"
            title="Edit title"
          >
            <IconEdit size={14} />
          </button>
          <button
            onClick={onDelete}
            className="p-1 text-neutral-500 hover:text-red-400 transition-colors rounded"
            title="Delete chat"
          >
            <IconTrash size={14} />
          </button>
        </div>
      </motion.div>
    );
  }
);

ChatItem.displayName = "ChatItem";

// Memoized Utility Links Component
const UtilityLinks = memo(
  ({
    onNewChat,
    isCreatingChat,
  }: {
    onNewChat: () => void;
    isCreatingChat: boolean;
  }) => {
    const router = useRouter();

    const utilityLinks = useMemo(
      () => [
        {
          label: "New Chat",
          href: "#",
          icon: isCreatingChat ? (
            <motion.div
              animate={{ rotate: 360 }}
              transition={{
                duration: 1,
                repeat: Number.POSITIVE_INFINITY,
                ease: "linear",
              }}
            >
              <IconPlus className="h-4 w-4 shrink-0" />
            </motion.div>
          ) : (
            <IconPlus className="h-4 w-4 shrink-0" />
          ),
          onClick: onNewChat,
          disabled: isCreatingChat,
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
      ],
      [isCreatingChat, onNewChat]
    );

    return (
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
              disabled={link.disabled}
              whileHover={!link.disabled ? { x: 2 } : {}}
              transition={{ duration: 0.15 }}
              className={cn(
                "w-full flex items-center gap-3 px-3 py-2.5 text-left rounded-xl cursor-pointer transition-all duration-200 group",
                link.disabled
                  ? "text-neutral-600 cursor-not-allowed"
                  : "text-neutral-400 hover:text-neutral-200 hover:bg-neutral-800/50"
              )}
            >
              <div
                className={cn(
                  "transition-colors",
                  link.disabled
                    ? "text-neutral-600"
                    : "text-neutral-500 group-hover:text-blue-400"
                )}
              >
                {link.icon}
              </div>
              <span className="text-sm font-medium">{link.label}</span>
            </motion.button>
          ))}
        </div>
      </div>
    );
  }
);

UtilityLinks.displayName = "UtilityLinks";

// Memoized Chat List Component
const ChatList = memo(
  ({
    chats,
    currentChat,
    newlyCreatedChatId,
    onSelectChat,
    onDeleteChat,
    onUpdateChatTitle,
    onNewChat,
    searchQuery,
  }: {
    chats: Chat[];
    currentChat: Chat | null;
    newlyCreatedChatId: string | null;
    onSelectChat: (chatId: string) => void;
    onDeleteChat: (chatId: string) => void;
    onUpdateChatTitle: (chatId: string, title: string) => void;
    onNewChat: () => void;
    searchQuery: string;
  }) => {
    const handleSelectChat = useCallback(
      (chatId: string) => {
        onSelectChat(chatId);
      },
      [onSelectChat]
    );

    const handleDeleteChat = useCallback(
      (chatId: string, event: React.MouseEvent) => {
        event.stopPropagation();
        if (confirm("Bạn có chắc chắn muốn xóa cuộc trò chuyện này?")) {
          onDeleteChat(chatId);
        }
      },
      [onDeleteChat]
    );

    const handleUpdateTitle = useCallback(
      (chatId: string, title: string) => {
        onUpdateChatTitle(chatId, title);
      },
      [onUpdateChatTitle]
    );

    // Filter chats based on search
    const filteredChats = useMemo(
      () =>
        chats.filter((chat) =>
          chat.title.toLowerCase().includes(searchQuery.toLowerCase())
        ),
      [chats, searchQuery]
    );

    if (filteredChats.length === 0) {
      return (
        <div className="px-3 py-8 text-center">
          <IconMessageCircle className="h-8 w-8 text-neutral-600 mx-auto mb-2" />
          <p className="text-sm text-neutral-500 mb-2">
            {searchQuery ? "No chats found" : "No chats yet"}
          </p>
          {!searchQuery && (
            <button
              onClick={onNewChat}
              className="text-xs text-blue-400 hover:text-blue-300 transition-colors"
            >
              Start your first conversation
            </button>
          )}
        </div>
      );
    }

    return (
      <div className="space-y-1">
        <AnimatePresence mode="popLayout">
          {filteredChats.map((chat) => (
            <ChatItem
              key={chat.id}
              chat={chat}
              isCurrentChat={currentChat?.id === chat.id}
              isNewChat={newlyCreatedChatId === chat.id}
              onSelect={() => handleSelectChat(chat.id)}
              onDelete={(e) => handleDeleteChat(chat.id, e)}
              onEditTitle={(title) => handleUpdateTitle(chat.id, title)}
            />
          ))}
        </AnimatePresence>
      </div>
    );
  }
);

ChatList.displayName = "ChatList";

// Thay đổi phần CollapsedUtilityLinks để chỉ hiển thị icon mà không có text
// Tìm component CollapsedUtilityLinks và thay thế bằng đoạn code sau:

const CollapsedUtilityLinks = memo(
  ({
    onNewChat,
    isCreatingChat,
  }: {
    onNewChat: () => void;
    isCreatingChat: boolean;
  }) => {
    const router = useRouter();

    const utilityLinks = useMemo(
      () => [
        {
          label: "New Chat",
          href: "#",
          icon: isCreatingChat ? (
            <motion.div
              animate={{ rotate: 360 }}
              transition={{
                duration: 1,
                repeat: Number.POSITIVE_INFINITY,
                ease: "linear",
              }}
            >
              <IconPlus className="h-5 w-5" />
            </motion.div>
          ) : (
            <IconPlus className="h-5 w-5" />
          ),
          onClick: onNewChat,
          disabled: isCreatingChat,
        },
        {
          label: "My projects",
          href: "/projects",
          icon: <IconFolder className="h-5 w-5" />,
        },
        {
          label: "Templates",
          href: "/template",
          icon: <IconTemplate className="h-5 w-5" />,
        },
      ],
      [isCreatingChat, onNewChat]
    );

    return (
      <div className="flex flex-col items-center gap-6 mt-6">
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
            disabled={link.disabled}
            whileHover={!link.disabled ? { scale: 1.1 } : {}}
            whileTap={!link.disabled ? { scale: 0.95 } : {}}
            transition={{ duration: 0.15 }}
            className={cn(
              "flex items-center justify-center p-2 rounded-xl cursor-pointer transition-all duration-200",
              link.disabled
                ? "text-neutral-600 cursor-not-allowed"
                : "text-neutral-400 hover:text-neutral-200"
            )}
            title={link.label}
          >
            <div
              className={cn(
                "transition-colors",
                link.disabled
                  ? "text-neutral-600"
                  : "text-neutral-500 hover:text-blue-400"
              )}
            >
              {link.icon}
            </div>
          </motion.button>
        ))}
      </div>
    );
  }
);

CollapsedUtilityLinks.displayName = "CollapsedUtilityLinks";

// Main Sidebar Content Component
const SidebarContent = memo(
  ({
    chats,
    currentChat,
    onNewChat,
    onSelectChat,
    onDeleteChat,
    onUpdateChatTitle,
    isCreatingChat,
    newlyCreatedChatId,
    isDesktop = false,
    isOpen = true,
  }: ChatSidebarProps) => {
    const [searchQuery, setSearchQuery] = useState("");

    return (
      <div className="flex flex-col h-full w-full">
        {/* Logo Section */}
        <div className="flex items-center justify-center py-6">
          <motion.div
            animate={{
              scale: 1,
            }}
            transition={{
              duration: 0.2,
              ease: "easeInOut",
            }}
            className="flex items-center justify-center"
          >
            {(isDesktop && isOpen) || !isDesktop ? (
              // Expanded state - show full logo with text
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 bg-indigo-600 rounded-2xl flex items-center justify-center shadow-lg">
                  <span className="text-white font-bold text-sm">LW</span>
                </div>
                <div className="flex flex-col">
                  <span className="text-white font-bold text-lg">
                    LegalWise
                  </span>
                  <span className="text-blue-400 text-sm font-medium">AI</span>
                </div>
              </div>
            ) : (
              // Collapsed state - show only icon
              <div className="h-12 w-12 bg-indigo-600 rounded-2xl flex items-center justify-center shadow-lg">
                <span className="text-white font-bold text-lg">LW</span>
              </div>
            )}
          </motion.div>
        </div>

        {/* Scrollable Content */}
        <div className="flex-1 overflow-y-auto scrollbar-hide">
          <AnimatePresence mode="wait">
            {(isDesktop && isOpen) || !isDesktop ? (
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
                <UtilityLinks
                  onNewChat={onNewChat}
                  isCreatingChat={isCreatingChat}
                />

                {/* Chats Section */}
                <div>
                  <div className="px-2 mb-3 flex items-center justify-between">
                    <span className="text-xs text-neutral-500 uppercase tracking-wider font-medium">
                      Chats
                    </span>
                  </div>

                  <ChatList
                    chats={chats}
                    currentChat={currentChat}
                    newlyCreatedChatId={newlyCreatedChatId}
                    onSelectChat={onSelectChat}
                    onDeleteChat={onDeleteChat}
                    onUpdateChatTitle={onUpdateChatTitle}
                    onNewChat={onNewChat}
                    searchQuery={searchQuery}
                  />
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
                className="flex flex-col items-center"
              >
                <CollapsedUtilityLinks
                  onNewChat={onNewChat}
                  isCreatingChat={isCreatingChat}
                />
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Bottom Section */}
        <div className="mt-auto">
          {/* Upgrade Section */}
          <AnimatePresence>
            {((isDesktop && isOpen) || !isDesktop) && (
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
            {isDesktop && !isOpen && (
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
                  whileHover={{ scale: 1.05 }}
                  transition={{ duration: 0.15 }}
                  className="w-10 h-10 bg-gradient-to-br from-indigo-600 to-purple-700 rounded-full flex items-center justify-center cursor-pointer shadow-lg"
                >
                  <span className="text-white font-bold text-sm">N</span>
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    );
  }
);

SidebarContent.displayName = "SidebarContent";

// Main Chat Sidebar Component
export const ChatSidebar = memo((props: ChatSidebarProps) => {
  return <SidebarContent {...props} />;
});

ChatSidebar.displayName = "ChatSidebar";

export default ChatSidebar;
