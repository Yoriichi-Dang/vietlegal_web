"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { Message, Conversation } from "@/types/chat";

// Define context type
interface ConversationContextType {
  conversations: Conversation[];
  activeConversation: Conversation | null;
  messages: Message[];
  isLoading: boolean;
  setActiveConversation: (conversation: Conversation) => void;
  sendMessage: (content: string) => Promise<void>;
  createNewConversation: (title?: string) => Promise<Conversation>;
}

// Create context with default values
const ConversationContext = createContext<ConversationContextType | undefined>(
  undefined
);

// Sample data for conversations (simulate API response)
const sampleConversations: Conversation[] = [
  {
    id: "1",
    title: "Thần số học Đặng Hoàng Nguyên",
    messages: [],
    participants: [{ id: "user-1", name: "User" }],
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: "2",
    title: "Mô tả bạn thân",
    messages: [],
    participants: [{ id: "user-1", name: "User" }],
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: "3",
    title: "Công cụ generate file tự động",
    messages: [],
    participants: [{ id: "user-1", name: "User" }],
    createdAt: new Date(),
    updatedAt: new Date(),
  },
];

// Sample messages by conversation (simulate API response)
const conversationMessages: Record<string, Message[]> = {
  "1": [
    {
      id: 1,
      content: "Giải thích cho tôi về thần số học",
      isUser: true,
      timestamp: new Date(Date.now() - 3600000),
    },
    {
      id: 2,
      content:
        "Thần số học là một hệ thống tin rằng con số có ý nghĩa đặc biệt và có thể ảnh hưởng đến cuộc sống con người...",
      isUser: false,
      timestamp: new Date(Date.now() - 3500000),
    },
  ],
  "2": [
    {
      id: 3,
      content:
        "Minh mixes casual streetwear with a touch of retro flair, often throwing on a bomber jacket over a simple tee and topping it off with his signature messy hair and confident smile.",
      isUser: true,
      timestamp: new Date(Date.now() - 2600000),
    },
    {
      id: 4,
      content: "Dưới đây là bản dịch tiếng Việt của đoạn bạn yêu cầu:",
      isUser: false,
      timestamp: new Date(Date.now() - 2500000),
    },
    {
      id: 5,
      content:
        "Minh kết hợp phong cách đường phố giản dị với chút hơi hướng cổ điển, thường khoác áo khoác bomber bên ngoài áo phông đơn giản và hoàn thiện với mái tóc rối đặc trưng cùng nụ cười tự tin.",
      isUser: false,
      timestamp: new Date(Date.now() - 2400000),
    },
  ],
  "3": [
    {
      id: 6,
      content: "Giúp tôi tạo một tool tự động sinh file config",
      isUser: true,
      timestamp: new Date(Date.now() - 1600000),
    },
    {
      id: 7,
      content:
        "Để tạo một công cụ tự động sinh file config, bạn có thể sử dụng các phương pháp sau...",
      isUser: false,
      timestamp: new Date(Date.now() - 1500000),
    },
  ],
};

export const ConversationProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [activeConversation, setActiveConversation] =
    useState<Conversation | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  // Simulate API fetch on mount
  useEffect(() => {
    const fetchConversations = async () => {
      // Simulate API delay
      setIsLoading(true);
      await new Promise((resolve) => setTimeout(resolve, 500));

      // Set sample conversations
      setConversations(sampleConversations);
      setIsLoading(false);
    };

    fetchConversations();
  }, []);

  // Fetch messages when selecting a conversation
  const handleSetActiveConversation = async (conversation: Conversation) => {
    setIsLoading(true);
    setActiveConversation(conversation);

    try {
      // Simulate API call to fetch messages for this conversation
      await new Promise((resolve) => setTimeout(resolve, 300));

      // Get messages for this conversation from sample data
      const conversationData = conversationMessages[conversation.id] || [];
      setMessages(conversationData);
    } catch (error) {
      console.error("Error fetching messages:", error);
    } finally {
      setIsLoading(false);
    }
  };

  // Create a new conversation
  const createNewConversation = async (
    title?: string
  ): Promise<Conversation> => {
    setIsLoading(true);

    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 300));

      // Create new conversation with generated ID
      const newId = String(Date.now());
      const newConversation: Conversation = {
        id: newId,
        title: title || "New Conversation",
        messages: [],
        participants: [{ id: "user-1", name: "User" }],
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      // Update conversations list
      setConversations((prev) => [newConversation, ...prev]);

      // Set as active
      setActiveConversation(newConversation);
      setMessages([]);

      return newConversation;
    } catch (error) {
      console.error("Error creating conversation:", error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  // Send a message in the active conversation
  const sendMessage = async (content: string) => {
    if (!content.trim() || isLoading) return;

    setIsLoading(true);

    try {
      // If no active conversation, create one
      if (!activeConversation) {
        const newConv = await createNewConversation("New Conversation");
        await handleSendMessageToApi(newConv.id, content);
      } else {
        await handleSendMessageToApi(activeConversation.id, content);
      }
    } catch (error) {
      console.error("Error sending message:", error);
    } finally {
      setIsLoading(false);
    }
  };

  // Handle sending message to API
  const handleSendMessageToApi = async (
    conversationId: string,
    content: string
  ) => {
    try {
      // 1. Create user message
      const userMessageId = Date.now();
      const userMessage: Message = {
        id: userMessageId,
        content,
        isUser: true,
        timestamp: new Date(),
      };

      // Add to messages
      setMessages((prev) => [...prev, userMessage]);

      // 2. Create message data for API
      const messageData = {
        message: content,
        model: "gpt-4o-mini", // Default model
        timestamp: new Date().toISOString(),
        conversationId,
      };

      // 3. Send to API
      const response = await fetch("/api/message", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(messageData),
      });

      if (!response.ok) {
        throw new Error(`API Error: ${response.status}`);
      }

      // 4. Parse response
      const result = await response.json();
      // 5. Create assistant message
      const assistantMessage: Message = {
        id: userMessageId + 1,
        content: result.response || "Sorry, I couldn't process your request.",
        isUser: false,
        timestamp: new Date(),
      };

      // 6. Add to messages
      setMessages((prev) => [...prev, assistantMessage]);

      // 7. Update conversation if it's new
      if (activeConversation?.title === "New Conversation") {
        const updatedConversation = {
          ...activeConversation,
          title: content.substring(0, 30) + (content.length > 30 ? "..." : ""),
          updatedAt: new Date(),
        };

        setActiveConversation(updatedConversation);
        setConversations((prev) =>
          prev.map((conv) =>
            conv.id === updatedConversation.id ? updatedConversation : conv
          )
        );
      }
    } catch (error) {
      console.error("Error handling message:", error);
      // Add error message to chat
      setMessages((prev) => [
        ...prev,
        {
          id: Date.now(),
          content: "Error: Could not get a response. Please try again.",
          isUser: false,
          timestamp: new Date(),
        },
      ]);
    }
  };

  const contextValue = {
    conversations,
    activeConversation,
    messages,
    isLoading,
    setActiveConversation: handleSetActiveConversation,
    sendMessage,
    createNewConversation,
  };

  return (
    <ConversationContext.Provider value={contextValue}>
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
