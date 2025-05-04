"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { Message, Conversation } from "@/types/chat";

// Define context type
interface ConversationContextType {
  conversations: Conversation[];
  activeConversation: Conversation | null;
  messages: Message[];
  isLoading: boolean;
  setActiveConversation: React.Dispatch<
    React.SetStateAction<Conversation | null>
  >;
  sendMessage: (content: string) => Promise<void>;
  createNewConversation: (title?: string) => Promise<Conversation>;
  loadConversation: (id: string) => Promise<void>;
}

// Create context with default values
const ConversationContext = createContext<ConversationContextType | undefined>(
  undefined
);

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
      setConversations([]);
      setIsLoading(false);
    };

    fetchConversations();
  }, []);

  const createNewConversation = async (
    title?: string
  ): Promise<Conversation> => {
    setIsLoading(true);
    console.log(
      "[DEBUG - createNewConversation] Creating new conversation with title:",
      title
    );

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

      console.log(
        "[DEBUG - createNewConversation] New conversation created with ID:",
        newId
      );

      // Set as active

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
      console.log(
        "[DEBUG] Before creating - activeConversation:",
        activeConversation
      );

      // Nếu không có activeConversation, tạo một conversation mới
      if (!activeConversation) {
        console.log(
          "[DEBUG - sendMessage] No active conversation, creating a new one"
        );
        const newConv = await createNewConversation("New Conversation");
        console.log(
          "[DEBUG - sendMessage] Created new conversation with ID:",
          newConv.id,
          "and title:",
          newConv.title
        );

        // Đặt active conversation trước khi gửi tin nhắn
        console.log("[DEBUG] Setting active conversation:", newConv);
        setActiveConversation(newConv);

        // Thêm conversation mới vào danh sách ngay lập tức để đảm bảo nó xuất hiện trong sidebar
        setConversations((prev) => {
          console.log(
            "[DEBUG - sendMessage] Adding new conversation to list temporarily:",
            newConv.id
          );
          // Thêm conversation mới vào đầu danh sách
          return [newConv, ...prev];
        });

        // Lưu ID của conversation mới tạo và sử dụng nó để gửi tin nhắn
        const newConvId = newConv.id;

        // Gửi tin nhắn và lấy về kết quả trực tiếp
        const result = await handleSendMessageToApiAndGetResult(
          newConvId,
          content,
          true
        );

        // Nếu có kết quả, cập nhật title
        if (result && result.title) {
          console.log("[DEBUG] Got API result with title:", result.title);

          // Tạo phiên bản mới của conversation với title mới
          const updatedConv = {
            ...newConv,
            title: result.title,
            updatedAt: new Date(),
          };

          // Đặt active conversation với title mới
          setActiveConversation(updatedConv);

          // Cập nhật conversation trong danh sách
          setConversations((prevList) => {
            return prevList.map((conv) =>
              conv.id === newConvId ? updatedConv : conv
            );
          });

          // Ghi log xác nhận
          console.log(
            "[DEBUG] Updated conversation with new title:",
            result.title
          );
        }
      } else {
        // Nếu đã có activeConversation, sử dụng nó
        console.log(
          "[DEBUG - sendMessage] Using existing conversation:",
          activeConversation.id,
          "with title:",
          activeConversation.title
        );

        const existingConvId = activeConversation.id;
        // Kiểm tra xem đây có phải tin nhắn đầu tiên không
        const isFirstMessage =
          (activeConversation.title === "New Conversation" ||
            !activeConversation.title) &&
          messages.length === 0;

        // Gửi tin nhắn và lấy về kết quả trực tiếp
        const result = await handleSendMessageToApiAndGetResult(
          existingConvId,
          content,
          isFirstMessage
        );

        // Nếu có kết quả, và đây là tin nhắn đầu tiên, cập nhật title
        if (result && result.title && isFirstMessage) {
          console.log(
            "[DEBUG] Got API result with title for existing conversation:",
            result.title
          );

          // Tạo phiên bản mới của conversation với title mới
          const updatedConv = {
            ...activeConversation,
            title: result.title,
            updatedAt: new Date(),
          };

          // Đặt active conversation với title mới
          setActiveConversation(updatedConv);

          // Cập nhật conversation trong danh sách
          setConversations((prevList) => {
            return prevList.map((conv) =>
              conv.id === existingConvId ? updatedConv : conv
            );
          });

          // Ghi log xác nhận
          console.log(
            "[DEBUG] Updated existing conversation with new title:",
            result.title
          );
        }
      }
    } catch (error) {
      console.error("Error sending message:", error);
    } finally {
      setIsLoading(false);
    }
  };

  // Hàm mới để gửi tin nhắn và trả về kết quả API
  const handleSendMessageToApiAndGetResult = async (
    conversationId: string,
    content: string,
    isFirstMessage: boolean
  ) => {
    try {
      const userMessageId = Date.now();
      const userMessage: Message = {
        id: userMessageId,
        content,
        isUser: true,
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, userMessage]);

      // 2. Create message data for API
      const messageData = {
        message: content,
        model: "gpt-4o-mini", // Default model
        timestamp: new Date().toISOString(),
        conversationId,
        isFirstMessage,
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

      // Trả về kết quả từ API để xử lý bên ngoài
      return result;
    } catch (error) {
      console.error("Error sending message to API:", error);
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
      return null;
    }
  };

  // Load a specific conversation by ID
  const loadConversation = async (id: string) => {
    console.log("Loading conversation with ID:", id);
    setIsLoading(true);

    try {
      // Trong tương lai sẽ gọi API để lấy dữ liệu conversation
      // const response = await fetch(`/api/conversations/${id}`);
      // const data = await response.json();

      // Tạm thời, tìm conversation trong state hiện tại
      const conversation = conversations.find((conv) => conv.id === id);

      if (conversation) {
        // Nếu tìm thấy, đặt làm active conversation
        setActiveConversation(conversation);

        // Giả lập lấy messages
        // Trong tương lai sẽ gọi API để lấy messages
        const messages: Message[] = []; // Tạm thời để trống, sau sẽ gọi API
        setMessages(messages);

        console.log("Loaded conversation:", conversation);
      } else {
        // Nếu không tìm thấy, có thể tạo mới hoặc hiển thị thông báo lỗi
        console.error("Conversation not found with ID:", id);
        // Có thể chuyển hướng hoặc tạo mới tùy vào yêu cầu
      }
    } catch (error) {
      console.error("Error loading conversation:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const contextValue = {
    conversations,
    activeConversation,
    messages,
    isLoading,
    setActiveConversation,
    sendMessage,
    createNewConversation,
    loadConversation,
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
