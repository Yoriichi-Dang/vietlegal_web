"use client";

import { useCallback } from "react";
import { useChat } from "@/provider/chat-provider";

/**
 * Custom hook for common chat operations
 * Provides convenient methods for chat interactions
 */
export const useChatOperations = () => {
  const {
    currentChat,
    createNewChat,
    selectChat,
    addMessage,
    updateChatTitle,
    deleteChat,
    isLoading,
    error,
  } = useChat();

  // Call AI API to get response
  const callAIAPI = useCallback(async (messages: any[]) => {
    const response = await fetch("/api/chat", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ messages }),
    });

    if (!response.ok) {
      throw new Error("Failed to get AI response");
    }

    // Handle streaming response
    const reader = response.body?.getReader();
    const decoder = new TextDecoder();
    let result = "";

    if (reader) {
      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        const chunk = decoder.decode(value);
        const lines = chunk.split("\n");

        for (const line of lines) {
          if (line.startsWith("0:")) {
            try {
              const data = JSON.parse(line.slice(2));
              if (data.type === "text-delta") {
                result += data.textDelta;
              }
            } catch (e) {
              // Ignore parsing errors
            }
          }
        }
      }
    }

    return result;
  }, []);

  // Start a new conversation with an initial message
  const startNewConversation = useCallback(
    async (initialMessage: string, attachments?: any[]) => {
      try {
        // 1. Prepare messages for AI API
        const messages = [
          {
            role: "user",
            content: initialMessage,
          },
        ];

        // 2. Call AI API first to get response
        const aiResponse = await callAIAPI(messages);

        // 3. Create new chat with title generated from initial message
        const chat = await createNewChat({
          title: generateTitleFromMessage(initialMessage),
        });

        if (chat) {
          // 4. Add the initial user message
          await addMessage({
            role: "user",
            content: initialMessage,
            attachments,
          });

          // 5. Add the AI response
          await addMessage({
            role: "assistant",
            content: aiResponse,
          });
        }

        return chat;
      } catch (error) {
        console.error("Error starting new conversation:", error);
        throw error;
      }
    },
    [createNewChat, addMessage, callAIAPI]
  );

  // Send a message to current chat or create new one
  const sendMessage = useCallback(
    async (content: string, attachments?: any[]) => {
      if (!currentChat) {
        // Create new chat if none exists
        return await startNewConversation(content, attachments);
      }

      try {
        // 1. Add user message to existing chat
        await addMessage({
          role: "user",
          content,
          attachments,
        });

        // 2. Prepare messages for AI API (include chat history)
        const messages = [
          ...(currentChat.messages || []).map((msg) => ({
            role: msg.role,
            content: msg.content,
          })),
          {
            role: "user",
            content,
          },
        ];

        // 3. Call AI API to get response
        const aiResponse = await callAIAPI(messages);

        // 4. Add AI response to chat
        await addMessage({
          role: "assistant",
          content: aiResponse,
        });
      } catch (error) {
        console.error("Error sending message:", error);
        throw error;
      }
    },
    [currentChat, startNewConversation, addMessage, callAIAPI]
  );

  // Add AI response to current chat (for manual use)
  const addAIResponse = useCallback(
    async (content: string) => {
      if (!currentChat) return;

      await addMessage({
        role: "assistant",
        content,
      });
    },
    [currentChat, addMessage]
  );

  // Regenerate last AI response
  const regenerateResponse = useCallback(
    async (messageIndex?: number) => {
      if (!currentChat || !currentChat.messages) return;

      try {
        // Find the last user message or use the specified index
        let userMessageIndex = messageIndex;
        if (userMessageIndex === undefined) {
          userMessageIndex = currentChat.messages
            .map((msg, idx) => ({ msg, idx }))
            .reverse()
            .find(({ msg }) => msg.role === "user")?.idx;
        }

        if (userMessageIndex === undefined) return;

        // Get all messages up to and including the user message
        const messagesForAI = currentChat.messages
          .slice(0, userMessageIndex + 1)
          .map((msg) => ({
            role: msg.role,
            content: msg.content,
          }));

        // Call AI API to get new response
        const aiResponse = await callAIAPI(messagesForAI);

        // Add the new AI response
        await addMessage({
          role: "assistant",
          content: aiResponse,
        });
      } catch (error) {
        console.error("Error regenerating response:", error);
        throw error;
      }
    },
    [currentChat, addMessage, callAIAPI]
  );

  // Rename current chat
  const renameCurrentChat = useCallback(
    async (newTitle: string) => {
      if (!currentChat) return;

      await updateChatTitle(currentChat.id, newTitle);
    },
    [currentChat, updateChatTitle]
  );

  // Delete current chat and clear selection
  const deleteCurrentChat = useCallback(async () => {
    if (!currentChat) return;

    await deleteChat(currentChat.id);
  }, [currentChat, deleteChat]);

  return {
    // State
    currentChat,
    isLoading,
    error,

    // Operations
    startNewConversation,
    sendMessage,
    addAIResponse,
    regenerateResponse,
    renameCurrentChat,
    deleteCurrentChat,
    selectChat,
  };
};

// Helper function to generate title from message
function generateTitleFromMessage(message: string): string {
  // Take first 50 characters and add ellipsis if longer
  const maxLength = 50;
  if (message.length <= maxLength) {
    return message;
  }

  return message.substring(0, maxLength).trim() + "...";
}
