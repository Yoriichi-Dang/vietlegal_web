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
  createConversation: () => Promise<void>;
  saveMessageInActiveConversation: () => Promise<void>;
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
      const conversations = response.data.map((conversation: Conversation) => ({
        ...conversation,
        messages: conversation.messages.map((message: Message) => ({
          ...message,
          is_saved: true,
        })),
      }));
      setConversations(conversations);
      setIsLoading(false);
      return conversations;
    },
    enabled: isReady,
    staleTime: 25 * 60 * 1000, // 25 phút
    refetchOnWindowFocus: false,
  });

  useEffect(() => {
    if (activeConversation) {
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

  const updateConversation = useCallback(
    async (conversation: Conversation) => {
      console.log("updateConversation");
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
        is_saved: false,
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
          is_saved: false,
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
    if (isReady) {
      await axiosAuth
        .post(url, {
          title: "New Conversation",
        })
        .then((response) => {
          setConversations([response.data, ...conversations]);
          setActiveConversation(response.data);
        });
    }
  }, [conversations, axiosAuth, isReady]);
  const saveMessageInActiveConversation = useCallback(async () => {
    if (
      isReady &&
      activeConversation &&
      activeConversation.messages &&
      activeConversation.messages.length > 0
    ) {
      const url = getConversationMessageApiUrl(
        activeConversation.id
      ).saveAllMessagesInConversation;
      const messages = activeConversation.messages
        .filter((message) => message.is_saved === false)
        .map((message) => ({
          content: message.content,
          sender_type: message.sender_type,
          model_id: message.model_id || null,
          message_type: message.message_type,
          attachments: message.attachments || null,
        }));
      if (messages && messages.length > 0) {
        await axiosAuth
          .post(url, {
            messages: messages,
          })
          .then(() => {
            console.log("saveMessageInActiveConversation success");
          })
          .catch((error) => {
            console.error("saveMessageInActiveConversation error", error);
          });
        setConversations((prev) =>
          prev.map((conv) =>
            conv.id === activeConversation?.id
              ? {
                  ...conv,
                  messages: conv.messages?.map((message) => ({
                    ...message,
                    is_saved: true,
                  })),
                }
              : conv
          )
        );
        setActiveConversation((prev: Conversation | null) => {
          if (prev) {
            return {
              ...prev,
              messages: prev.messages?.map((message) => ({
                ...message,
                is_saved: true,
              })),
            };
          }
          return null;
        });
      }
    }
  }, [activeConversation, axiosAuth, isReady]);
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
        isSendingMessage,
        setIsSendingMessage,
        saveMessageInActiveConversation,
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
