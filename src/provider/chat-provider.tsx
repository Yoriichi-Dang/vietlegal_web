"use client";

import type React from "react";
import { createContext, useContext, useState, useCallback } from "react";
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
    createChat: apiCreateChat,
    addMessage: apiAddMessage,
    isCreatingChat,
    isUpdatingTitle,
    isDeletingChat,
    isAddingMessage,
  } = useChatApi();
  const createNewChat = useCallback(
    async (data?: CreateChatRequest) => {
      try {
        setError(null);
        const newChat = await apiCreateChat(data || {});
        setCurrentChat({
          id: newChat.id,
          title: newChat.title,
          messages: [],
          createdAt: new Date(),
          updatedAt: new Date(),
          isActive: true,
          isArchived: true,
        });
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
  const selectChat = useCallback(
    async (chatId: string) => {
      try {
        setError(null);
        const chat = await fetchChat(chatId);
        setCurrentChat(chat);
      } catch (error) {
        const errorMessage =
          error instanceof Error
            ? error.message
            : "Không thể chọn cuộc trò chuyện";
        setError(errorMessage);
      }
    },
    [fetchChat]
  );
  const addMessage = useCallback(
    async (
      chatId: string,
      message: Omit<ChatMessage, "id" | "createdAt" | "updatedAt">
    ) => {
      const response = await apiAddMessage({
        chatId,
        message,
      });
      if (response) {
        setCurrentChat((prev) =>
          prev ? { ...prev, messages: [...prev.messages, response] } : null
        );
      }
    },
    [apiAddMessage]
  );

  // // Update chat title
  // const updateChatTitle = useCallback(
  //   async (chatId: string, title: string): Promise<void> => {
  //     try {
  //       setError(null);
  //       await apiUpdateTitle({ chatId, title });

  //       // Update current chat if it's the one being updated
  //       if (currentChat?.id === chatId) {
  //         setCurrentChat((prev) => (prev ? { ...prev, title } : null));
  //       }
  //     } catch (error) {
  //       const errorMessage =
  //         error instanceof Error ? error.message : "Không thể cập nhật tiêu đề";
  //       setError(errorMessage);
  //     }
  //   },
  //   [currentChat?.id, apiUpdateTitle]
  // );

  // // Delete chat
  // const deleteChat = useCallback(
  //   async (chatId: string): Promise<void> => {
  //     try {
  //       setError(null);
  //       await apiDeleteChat(chatId);

  //       // Clear current chat if it's the one being deleted
  //       if (currentChat?.id === chatId) {
  //         setCurrentChat(null);
  //       }
  //     } catch (error) {
  //       const errorMessage =
  //         error instanceof Error
  //           ? error.message
  //           : "Không thể xóa cuộc trò chuyện";
  //       setError(errorMessage);
  //     }
  //   },
  //   [currentChat?.id, apiDeleteChat]
  // );

  // // Clear current chat
  // const clearCurrentChat = useCallback(() => {
  //   setCurrentChat(null);
  //   setError(null);
  // }, []);

  // // Get chat by ID
  // const getChatById = useCallback(
  //   (chatId: string): Chat | undefined => {
  //     return chats.find((chat) => chat.id === chatId);
  //   },
  //   [chats]
  // );

  // // Refresh chats
  // const refreshChats = useCallback(async (): Promise<void> => {
  //   try {
  //     setError(null);
  //     await refetchChats();
  //   } catch (error) {
  //     const errorMessage =
  //       error instanceof Error
  //         ? error.message
  //         : "Không thể tải danh sách cuộc trò chuyện";
  //     setError(errorMessage);
  //   }
  // }, [refetchChats]);

  // // Memoized context value
  // const contextValue = useMemo<ChatContextType>(
  //   () => ({
  //     // State
  //     chats,
  //     currentChat,
  //     isLoading,
  //     error,
  //     isInitialized,

  //     // Actions
  //     createNewChat,
  //     selectChat,
  //     addMessage,
  //     updateChatTitle,
  //     deleteChat,
  //     clearCurrentChat,

  //     // Utils
  //     getChatById,
  //     refreshChats,
  //   }),
  //   [
  //     chats,
  //     currentChat,
  //     isLoading,
  //     error,
  //     isInitialized,
  //     createNewChat,
  //     selectChat,
  //     addMessage,
  //     updateChatTitle,
  //     deleteChat,
  //     clearCurrentChat,
  //     getChatById,
  //     refreshChats,
  //   ]
  // );

  // // Don't render children until initialization is complete
  // if (!isInitialized) {
  //   return null;
  // }

  return (
    <ChatContext.Provider
      value={{
        chats,
        currentChat,
        isLoadingChats,
        error,
        isCreatingChat,
        isUpdatingTitle,
        isDeletingChat,
        isAddingMessage,
        createNewChat,
        selectChat,
        addMessage,
      }}
    >
      {children}
    </ChatContext.Provider>
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
