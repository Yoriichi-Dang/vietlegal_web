"use client";

import React, {
  createContext,
  useContext,
  useState,
  useCallback,
  Dispatch,
  SetStateAction,
  useEffect,
} from "react";
import { Conversation, Message } from "@/types/chat";
import { getConversationMessageApiUrl } from "@/utils/config";
import useAxiosAuth from "@/hooks/useAxiosAuth";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
// Define context type
interface ConversationContextType {
  conversations: Conversation[];
  activeConversation: Conversation | null;
  setActiveConversation: Dispatch<SetStateAction<Conversation | null>>;
  isLoading: boolean;
  setIsLoading: Dispatch<SetStateAction<boolean>>;
  isSendingMessage: boolean;
  setIsSendingMessage: Dispatch<SetStateAction<boolean>>;
  sendMessage: (
    message: string,
    modelId: string,
    isFirstMessage: boolean
  ) => Promise<void>;
  deleteConversation: (conversationId: string) => Promise<void>;
  updateConversation: (conversation: Conversation) => Promise<void>;
  getConversationById: (conversationId: string) => Promise<void>;
  createConversation: () => Promise<void>;
}

// Create context with default values
const ConversationContext = createContext<ConversationContextType | undefined>(
  undefined
);

export const ConversationProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const { axiosAuth, isReady } = useAxiosAuth();
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [activeConversation, setActiveConversation] =
    useState<Conversation | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSendingMessage, setIsSendingMessage] = useState(false);
  useQuery({
    queryKey: ["conversations"],
    queryFn: async () => {
      const url = getConversationMessageApiUrl().getAllConversations;
      const response = await axiosAuth.get(url);
      setConversations(response.data);
      setIsLoading(false);
      return response.data;
    },
    enabled: isReady,
    staleTime: 25 * 60 * 1000, // 25 phút
    refetchOnWindowFocus: false,
  });
  useEffect(() => {
    if (activeConversation) {
      // Cập nhật conversation trong danh sách conversations khi active conversation thay đổi
      setConversations((prevConversations) =>
        prevConversations.map((conv) =>
          conv.id === activeConversation.id ? activeConversation : conv
        )
      );
    }
  }, [activeConversation]);
  const addMessageToActiveConversation = useCallback(
    (message: Message) => {
      setActiveConversation((prev: Conversation | null) => {
        if (prev) {
          return { ...prev, messages: [...(prev.messages || []), message] };
        }
        return null;
      });
    },
    [setActiveConversation]
  );
  const getConversationById = useCallback(
    async (conversationId: string) => {
      const url =
        getConversationMessageApiUrl(conversationId).getConversationById;
      await axiosAuth
        .get(url)
        .then((response) => {
          setActiveConversation(response.data);
        })
        .finally(() => {
          console.log("activeConversation", activeConversation);
        });
    },
    [axiosAuth]
  );
  const updateConversation = useCallback(
    async (conversation: Conversation) => {
      if (!conversation || !conversation.id) {
        console.error("Không thể cập nhật: conversation hoặc id không tồn tại");
        return;
      }

      const url = getConversationMessageApiUrl(
        conversation.id
      ).updateConversation;

      try {
        if (!isReady) return;
        await axiosAuth
          .patch(url, {
            title: conversation.title,
            is_archived: conversation.is_archived,
          })
          .then(() => {
            // Cập nhật danh sách conversations
            setConversations((prev) =>
              prev.map((conv) =>
                conv.id === conversation.id ? conversation : conv
              )
            );
          });
      } catch (error) {
        console.error("Lỗi khi cập nhật conversation:", error);
      }
    },
    [axiosAuth, isReady]
  );
  const sendMessage = useCallback(
    async (message: string, modelId: string, isFirstMessage: boolean) => {
      setIsSendingMessage(true);

      addMessageToActiveConversation({
        conversation_id: activeConversation?.id,
        sender_type: "user",
        message_type: "text",
        content: message,
      });

      const body = {
        message: message,
        isFirstMessage: isFirstMessage,
      };

      try {
        const response = await axios.post("/api/message", body);
        const newMessage: Message = {
          conversation_id: activeConversation?.id,
          sender_type: "model",
          model_id: modelId,
          message_type: "text",
          content: response.data.response,
        };

        let updatedConversation: Conversation | null = null;

        // Cập nhật active conversation
        setActiveConversation((prev: Conversation | null) => {
          if (prev) {
            // Tạo conversation đã cập nhật
            const updated = isFirstMessage
              ? {
                  ...prev,
                  title: response.data.title,
                  messages: [...(prev.messages || []), newMessage],
                }
              : {
                  ...prev,
                  messages: [...(prev.messages || []), newMessage],
                };

            // Lưu lại để có thể gọi updateConversation
            updatedConversation = updated;
            return updated;
          }
          return null;
        });

        // Nếu là tin nhắn đầu tiên, cập nhật conversation title trong database
        if (isFirstMessage && updatedConversation) {
          await updateConversation(updatedConversation);
        }
      } catch (error) {
        console.error("error", error);
      } finally {
        setIsSendingMessage(false);
      }
    },
    [addMessageToActiveConversation, activeConversation, updateConversation]
  );
  const deleteConversation = useCallback(
    async (conversationId: string) => {
      const url =
        getConversationMessageApiUrl(conversationId).deleteConversation;
      await axiosAuth
        .delete(url)
        .then(() => {
          setConversations(
            conversations.filter(
              (conversation) => conversation.id !== conversationId
            )
          );
        })
        .catch((error) => {
          console.log(error);
        });
    },
    [axiosAuth, conversations]
  );

  const createConversation = useCallback(async () => {
    const url = getConversationMessageApiUrl().createConversation;
    await axiosAuth
      .post(url, {
        title: "New Conversation",
      })
      .then((response) => {
        setConversations([response.data, ...conversations]);
        setActiveConversation(response.data);
      });
  }, [conversations, axiosAuth]);

  return (
    <ConversationContext.Provider
      value={{
        conversations,
        activeConversation,
        setActiveConversation,
        isLoading,
        setIsLoading,
        sendMessage,
        deleteConversation,
        updateConversation,
        createConversation,
        getConversationById,
        isSendingMessage,
        setIsSendingMessage,
      }}
    >
      {children}
    </ConversationContext.Provider>
  );
};

// Custom hook to use conversation context
export const useConversation = () => {
  const context = useContext(ConversationContext);
  if (!context) {
    throw new Error(
      "useConversation must be used within a ConversationProvider"
    );
  }
  return context;
};

export default ConversationProvider;
