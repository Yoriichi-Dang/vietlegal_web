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

  // Fetch messages when selecting a conversation
  const handleSetActiveConversation = async (conversation: Conversation) => {
    setIsLoading(true);
    setActiveConversation(conversation);

    try {
      // Simulate API call to fetch messages for this conversation
      await new Promise((resolve) => setTimeout(resolve, 300));

      // Get messages for this conversation từ fetched data
      // Trong tương lai, sẽ fetch từ API thay vì sử dụng dữ liệu mẫu
      // const conversationData = conversations[conversation.id] || [];
      // Fix lỗi TypeScript bằng cách sử dụng cách tiếp cận khác
      const conversationData: Message[] = []; // Đặt mảng rỗng cho messages ban đầu
      // Trong tương lai, sẽ fetch messages từ API
      // fetch(`/api/conversations/${conversation.id}/messages`)
      // .then(res => res.json())
      // .then(data => setMessages(data))

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

        // Thêm conversation mới vào danh sách ngay lập tức để đảm bảo nó xuất hiện trong sidebar
        // Chỉ làm điều này khi là tin nhắn đầu tiên của người dùng (khi chưa có activeConversation)
        setConversations((prev) => {
          console.log(
            "[DEBUG - sendMessage] Adding new conversation to list temporarily:",
            newConv.id
          );
          // Thêm conversation mới vào đầu danh sách
          return [newConv, ...prev];
        });

        // Sử dụng conversation mới tạo thay vì dựa vào activeConversation đã được cập nhật
        await handleSendMessageToApi(newConv.id, content);
      } else {
        // Nếu đã có activeConversation, sử dụng nó
        console.log(
          "[DEBUG - sendMessage] Using existing conversation:",
          activeConversation.id,
          "with title:",
          activeConversation.title
        );
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

      // Tính số lượng tin nhắn trước khi thêm tin nhắn mới
      const currentMessageCount = messages.length;

      // Add to messages
      setMessages((prev) => [...prev, userMessage]);

      // Kiểm tra xem đây có phải là tin nhắn đầu tiên không
      // Một conversation được xem là mới nếu chưa có message và title vẫn là mặc định
      const isFirstMessage =
        (activeConversation?.title === "New Conversation" ||
          !activeConversation?.title) &&
        currentMessageCount === 0;

      console.log(
        "[DEBUG - handleSendMessageToApi] Sending message - isFirstMessage:",
        isFirstMessage,
        "title:",
        activeConversation?.title,
        "messages.length:",
        currentMessageCount,
        "conversation ID:",
        conversationId
      );

      // 2. Create message data for API
      const messageData = {
        message: content,
        model: "gpt-4o-mini", // Default model
        timestamp: new Date().toISOString(),
        conversationId,
        isFirstMessage, // Thêm flag để API biết đây là tin nhắn đầu tiên
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
      console.log("[DEBUG - handleSendMessageToApi] API response:", result);

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
      if (isFirstMessage && activeConversation) {
        // Sử dụng title được đề xuất từ API nếu có, nếu không thì sử dụng phương pháp cũ
        let newTitle = "New Conversation";

        if (result.title) {
          newTitle = result.title;
          console.log(
            "[DEBUG - handleSendMessageToApi] Using title from API:",
            newTitle
          );
        } else {
          newTitle =
            content.substring(0, 30) + (content.length > 30 ? "..." : "");
          console.log(
            "[DEBUG - handleSendMessageToApi] Using fallback title:",
            newTitle
          );
        }

        console.log(
          "[DEBUG - handleSendMessageToApi] Updating conversation title to:",
          newTitle
        );

        const updatedConversation = {
          ...activeConversation,
          title: newTitle,
          updatedAt: new Date(),
        };

        // Cập nhật active conversation trước
        setActiveConversation(updatedConversation);
        console.log("Active conversation updated with title:", newTitle);

        // Thêm một trễ nhỏ trước khi cập nhật danh sách conversation để đảm bảo UI cập nhật
        setTimeout(() => {
          // Cập nhật danh sách conversations và thêm conversation vào danh sách
          setConversations((prev) => {
            // Kiểm tra xem conversation đã tồn tại trong danh sách chưa
            const existingIndex = prev.findIndex(
              (conv) => conv.id === updatedConversation.id
            );

            console.log(
              "Checking if conversation exists in list. Existing index:",
              existingIndex
            );
            console.log(
              "Current conversations in list:",
              prev.map((c) => ({ id: c.id, title: c.title }))
            );

            if (existingIndex >= 0) {
              // Nếu đã tồn tại, cập nhật nó
              const updated = [...prev];
              updated[existingIndex] = updatedConversation;
              console.log(
                "Updated existing conversation in list:",
                updated.map((c) => ({ id: c.id, title: c.title }))
              );
              return updated;
            } else {
              // Nếu chưa tồn tại, thêm mới vào đầu danh sách
              console.log(
                "Adding new conversation to list with ID:",
                updatedConversation.id
              );
              const newList = [updatedConversation, ...prev];
              console.log(
                "New conversations list:",
                newList.map((c) => ({ id: c.id, title: c.title }))
              );
              return newList;
            }
          });

          console.log(
            "Conversation list updated with:",
            updatedConversation.id,
            updatedConversation.title
          );

          // Thêm một lần cập nhật thứ hai để đảm bảo state đã được áp dụng
          setTimeout(() => {
            setConversations((prev) => {
              console.log(
                "Performing second update check for conversation list"
              );
              // Kiểm tra xem conversation đã thực sự được thêm vào danh sách chưa
              const existingConv = prev.find(
                (conv) => conv.id === updatedConversation.id
              );

              if (!existingConv) {
                console.log(
                  "Conversation still not in list, forcing update:",
                  updatedConversation.id
                );
                return [updatedConversation, ...prev];
              }

              // Nếu đã tồn tại nhưng title chưa được cập nhật đúng
              if (existingConv.title !== updatedConversation.title) {
                console.log("Conversation title needs update, forcing update");
                return prev.map((conv) =>
                  conv.id === updatedConversation.id
                    ? updatedConversation
                    : conv
                );
              }

              console.log(
                "Conversation is properly updated, no changes needed"
              );
              return prev;
            });
          }, 300);
        }, 200); // Tăng Delay lên 200ms

        console.log("Conversation update scheduled:", updatedConversation);
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
    setActiveConversation: handleSetActiveConversation,
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
