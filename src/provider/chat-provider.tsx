"use client";

import type React from "react";
import {
  createContext,
  useContext,
  useState,
  useCallback,
  useMemo,
} from "react";
import { useChatApi } from "@/hooks/useChatApi";
import type {
  Chat,
  ChatMessage,
  CreateChatRequest,
  ChatContextType,
} from "@/types/chat";

const ChatContext = createContext<ChatContextType | undefined>(undefined);

interface ChatProviderProps {
  children: React.ReactNode;
}

export const ChatProvider: React.FC<ChatProviderProps> = ({ children }) => {
  const [currentChat, setCurrentChat] = useState<Chat | null>(null);
  const [error, setError] = useState<string | null>(null);

  const {
    chats,
    isLoadingChats,
    fetchChat,
    refetchChats,
    createChat: apiCreateChat,
    updateTitle: apiUpdateTitle,
    deleteChat: apiDeleteChat,
    addMessage: apiAddMessage,
    isCreatingChat,
    isUpdatingTitle,
    isDeletingChat,
    isAddingMessage,
  } = useChatApi();

  // Memoized loading state
  const isLoading = useMemo(() => {
    return (
      isLoadingChats ||
      isCreatingChat ||
      isUpdatingTitle ||
      isDeletingChat ||
      isAddingMessage
    );
  }, [
    isLoadingChats,
    isCreatingChat,
    isUpdatingTitle,
    isDeletingChat,
    isAddingMessage,
  ]);

  // Create new chat
  const createNewChat = useCallback(
    async (data?: CreateChatRequest): Promise<Chat | null> => {
      try {
        setError(null);
        //gen title from first message

        const newChat = await apiCreateChat(data || {});
        setCurrentChat(newChat);
        return newChat;
      } catch (error) {
        const errorMessage =
          error instanceof Error
            ? error.message
            : "Không thể tạo cuộc trò chuyện";
        setError(errorMessage);
        return null;
      }
    },
    [apiCreateChat]
  );

  // Select and fetch chat
  const selectChat = useCallback(
    async (chatId: string): Promise<void> => {
      try {
        setError(null);

        // Check if chat is already loaded
        if (currentChat?.id === chatId) {
          return;
        }

        // Try to find in cached chats first
        const cachedChat = chats.find((chat) => chat.id === chatId);
        if (cachedChat && cachedChat.messages?.length > 0) {
          setCurrentChat(cachedChat);
          return;
        }

        // Fetch full chat data
        const chat = await fetchChat(chatId);
        if (chat) {
          setCurrentChat(chat);
        } else {
          setError("Không tìm thấy cuộc trò chuyện");
        }
      } catch (error) {
        const errorMessage =
          error instanceof Error
            ? error.message
            : "Không thể tải cuộc trò chuyện";
        setError(errorMessage);
      }
    },
    [currentChat?.id, chats, fetchChat]
  );

  // Add message to current chat
  const addMessage = useCallback(
    async (
      message: Omit<ChatMessage, "id" | "createdAt" | "updatedAt">
    ): Promise<void> => {
      if (!currentChat) {
        setError("Không có cuộc trò chuyện nào được chọn");
        return;
      }

      try {
        setError(null);

        // Optimistically update UI
        const tempMessage: ChatMessage = {
          ...message,
        };

        setCurrentChat((prev) =>
          prev
            ? {
                ...prev,
                messages: [...prev.messages, tempMessage],
                updatedAt: new Date(),
              }
            : null
        );
        const isFirstMessage =
          !currentChat || currentChat.messages.length === 0;

        // Send to API
        await apiAddMessage({
          chatId: currentChat.id,
          message,
          isFirstMessage,
        });
      } catch (error) {
        // Revert optimistic update on error
        setCurrentChat((prev) =>
          prev
            ? {
                ...prev,
                messages: prev.messages.filter(
                  (msg) => !msg.id?.startsWith("temp-")
                ),
              }
            : null
        );

        const errorMessage =
          error instanceof Error ? error.message : "Không thể gửi tin nhắn";
        setError(errorMessage);
      }
    },
    [currentChat, apiAddMessage]
  );

  // Update chat title
  const updateChatTitle = useCallback(
    async (chatId: string, title: string): Promise<void> => {
      try {
        setError(null);
        await apiUpdateTitle({ chatId, title });

        // Update current chat if it's the one being updated
        if (currentChat?.id === chatId) {
          setCurrentChat((prev) => (prev ? { ...prev, title } : null));
        }
      } catch (error) {
        const errorMessage =
          error instanceof Error ? error.message : "Không thể cập nhật tiêu đề";
        setError(errorMessage);
      }
    },
    [currentChat?.id, apiUpdateTitle]
  );

  // Delete chat
  const deleteChat = useCallback(
    async (chatId: string): Promise<void> => {
      try {
        setError(null);
        await apiDeleteChat(chatId);

        // Clear current chat if it's the one being deleted
        if (currentChat?.id === chatId) {
          setCurrentChat(null);
        }
      } catch (error) {
        const errorMessage =
          error instanceof Error
            ? error.message
            : "Không thể xóa cuộc trò chuyện";
        setError(errorMessage);
      }
    },
    [currentChat?.id, apiDeleteChat]
  );

  // Clear current chat
  const clearCurrentChat = useCallback(() => {
    setCurrentChat(null);
    setError(null);
  }, []);

  // Get chat by ID
  const getChatById = useCallback(
    (chatId: string): Chat | undefined => {
      return chats.find((chat) => chat.id === chatId);
    },
    [chats]
  );

  // Refresh chats
  const refreshChats = useCallback(async (): Promise<void> => {
    try {
      setError(null);
      await refetchChats();
    } catch (error) {
      const errorMessage =
        error instanceof Error
          ? error.message
          : "Không thể tải danh sách cuộc trò chuyện";
      setError(errorMessage);
    }
  }, [refetchChats]);

  // Memoized context value
  const contextValue = useMemo<ChatContextType>(
    () => ({
      // State
      chats,
      currentChat,
      isLoading,
      error,

      // Actions
      createNewChat,
      selectChat,
      addMessage,
      updateChatTitle,
      deleteChat,
      clearCurrentChat,

      // Utils
      getChatById,
      refreshChats,
    }),
    [
      chats,
      currentChat,
      isLoading,
      error,
      createNewChat,
      selectChat,
      addMessage,
      updateChatTitle,
      deleteChat,
      clearCurrentChat,
      getChatById,
      refreshChats,
    ]
  );

  return (
    <ChatContext.Provider value={contextValue}>{children}</ChatContext.Provider>
  );
};

// Custom hook to use chat context
export const useChat = (): ChatContextType => {
  const context = useContext(ChatContext);
  if (context === undefined) {
    throw new Error("useChat must be used within a ChatProvider");
  }
  return context;
};

// Export types for convenience
export type { Chat, ChatMessage, CreateChatRequest, ChatContextType };
