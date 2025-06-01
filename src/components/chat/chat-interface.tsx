"use client";

import type React from "react";
import { useEffect, useRef, useState } from "react";
import { motion } from "motion/react";
import { IconMenu2 } from "@tabler/icons-react";
import UserAvatarMenu from "./user-avatar-menu";
import ChatInput from "./chat-input";
import ChatContent from "./chat-content";
import { toast } from "sonner";
import type { ChatAttachment, ChatMessage } from "@/types/chat";
import { useChat as useChatProvider } from "@/provider/chat-provider";
import { useChat as useChatAI } from "@ai-sdk/react";
import { MODEL } from "@/constants/model";
import type { Attachment } from "ai";
import { v4 as uuidv4 } from "uuid";

interface ChatInterfaceProps {
  onToggleSidebar: () => void;
  showMenuButton?: boolean;
}

export const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB

export default function ChatInterface({
  onToggleSidebar,
  showMenuButton = true,
}: ChatInterfaceProps) {
  const [attachedFiles, setAttachedFiles] = useState<ChatAttachment[]>([]);
  const {
    addMessage,
    currentChat,
    isAddingMessage,
    updateChatTitle,
    createNewChat,
  } = useChatProvider();
  const chatContainerRef = useRef<HTMLDivElement>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [pendingUserMessage, setPendingUserMessage] =
    useState<ChatMessage | null>(null);
  const [pendingAIMessage, setPendingAIMessage] = useState<any | null>(null);
  const [newChatId, setNewChatId] = useState<string | null>(null);
  const [isProcessingMessage, setIsProcessingMessage] = useState(false);
  const { messages, status, input, handleInputChange, handleSubmit } =
    useChatAI({
      id: currentChat?.id || newChatId || undefined,
      initialMessages:
        (currentChat &&
          currentChat?.messages?.map((message) => {
            const attachments: Attachment[] | undefined =
              message.attachments?.map((attachment: any) => {
                return {
                  name: attachment.file_name,
                  contentType: attachment.file_type,
                  url: attachment.file_path as string,
                };
              });
            return {
              id: message.id!,
              role: message.sender_type === "user" ? "user" : "assistant",
              content: message.content || "",
              experimental_attachments: attachments,
            };
          })) ||
        [],
      onFinish: async (message) => {
        // Store AI response
        const aiMessage: Omit<ChatMessage, "id" | "createdAt" | "updatedAt"> = {
          sender_type: "model" as const,
          message_type: "text",
          model_id: MODEL.id.toString(),
          content: message.content,
        };

        // If we have a current chat ID, add message directly
        if (currentChat?.id) {
          try {
            await addMessage(currentChat.id, aiMessage);
          } catch (error) {
            console.error("Error adding AI message to existing chat:", error);
            toast.error("Không thể lưu phản hồi");
          }
        }
        // If we have a new chat ID but currentChat hasn't updated yet
        else if (newChatId) {
          try {
            await addMessage(newChatId, aiMessage);
          } catch (error) {
            console.error("Error adding AI message to new chat:", error);
            toast.error("Không thể lưu phản hồi");
          }
        }
        // Store for later processing
        else {
          console.log("Storing AI message for later processing");
          setPendingAIMessage(aiMessage);
        }
      },
    });

  // Process pending messages when chat ID becomes available
  useEffect(() => {
    const processPendingMessages = async () => {
      // Skip if already processing or no pending messages
      if (isProcessingMessage || (!pendingUserMessage && !pendingAIMessage))
        return;

      // Get the effective chat ID (either current or new)
      const effectiveChatId = currentChat?.id || newChatId;
      if (!effectiveChatId) return;

      setIsProcessingMessage(true);
      try {
        // Process user message first
        if (pendingUserMessage) {
          await addMessage(effectiveChatId, pendingUserMessage);
          setPendingUserMessage(null);
        }

        // Then process AI message
        if (pendingAIMessage) {
          await addMessage(effectiveChatId, pendingAIMessage);
          setPendingAIMessage(null);
        }
      } catch (error) {
        console.error("Error processing pending messages:", error);
        toast.error("Không thể lưu tin nhắn");
      } finally {
        setIsProcessingMessage(false);
      }
    };

    processPendingMessages();
  }, [
    currentChat?.id,
    newChatId,
    pendingUserMessage,
    pendingAIMessage,
    addMessage,
    isProcessingMessage,
  ]);

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (!files) return;
    setIsUploading(true);

    const uploadPromises = Array.from(files).map(async (file) => {
      try {
        const { fileUrl } = await uploadFile(file);
        const newFile: ChatAttachment = {
          id: uuidv4(),
          file_name: file.name,
          file_type: file.type,
          file_size: file.size,
          file_url: fileUrl,
        };
        return newFile;
      } catch (error) {
        console.error("Upload error:", error);
        toast.error(`Không thể upload file ${file.name}`);
        return null;
      }
    });

    Promise.all(uploadPromises).then((results) => {
      const successfulUploads = results.filter(
        (file) => file !== null
      ) as ChatAttachment[];
      setAttachedFiles((prev) => [...prev, ...successfulUploads]);
      setIsUploading(false);
    });

    event.target.value = "";
  };

  const deleteFile = async (fileKey: string) => {
    try {
      const response = await fetch("/api/delete-file", {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ fileKey }),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error);
      }

      return result;
    } catch (error) {
      console.error("Delete error:", error);
      throw error;
    }
  };

  // Remove file
  const removeFile = async (fileId: string) => {
    try {
      const fileKey = attachedFiles
        .find((file) => file.id === fileId)
        ?.file_url?.split("/")
        .pop();
      if (fileKey) {
        setAttachedFiles((prev) => {
          const filtered = prev.filter((file) => file.id !== fileId);
          return filtered;
        });
        await deleteFile(fileKey);
        toast.success("File deleted successfully");
      }
    } catch (error) {
      console.error("Error removing file:", error);
      toast.error("Không thể xóa file");
    }
  };

  const computeSHA256 = async (file: File) => {
    const buffer = await file.arrayBuffer();
    const hashBuffer = await crypto.subtle.digest("SHA-256", buffer);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    const hashHex = hashArray
      .map((b) => b.toString(16).padStart(2, "0"))
      .join("");
    return hashHex;
  };

  const uploadFile = async (file: File) => {
    const response = await fetch("/api/signed-url", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        fileType: file.type,
        fileSize: file.size,
        checksum: await computeSHA256(file),
        fileName: file.name,
      }),
    });
    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.failure || "Upload failed");
    }

    await fetch(data.success.url, {
      method: "PUT",
      headers: {
        "Content-Type": file.type,
      },
      body: file,
    });

    const fileUrl = data.success.url.split("?")[0];
    return { fileUrl, id: data.success.id };
  };

  // Helper function to convert ChatAttachment to Attachment
  const convertToAIAttachments = (
    chatAttachments: ChatAttachment[]
  ): Attachment[] => {
    return chatAttachments
      .filter((file) => file.file_url) // Only include files with valid URLs
      .map((file) => ({
        name: file.file_name,
        contentType: file.file_type,
        url: file.file_url!,
      }));
  };

  // Handle form submit
  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (input.trim() === "") {
      toast.error("Vui lòng nhập tin nhắn");
      return;
    }

    try {
      // Prepare user message
      const userMessage: ChatMessage = {
        sender_type: "user",
        message_type: "text",
        content: input.trim(),
        attachments: attachedFiles,
      };

      // Convert ChatAttachment[] to Attachment[] for AI SDK
      const aiAttachments = convertToAIAttachments(attachedFiles);

      // Create options object
      const submitOptions: any = {};

      // Only add attachments if there are any
      if (aiAttachments.length > 0) {
        submitOptions.experimental_attachments = aiAttachments;
      }

      // Handle case when no current chat exists
      if (!currentChat?.id) {
        const newChat = await createNewChat({
          title: input.trim().slice(0, 20),
        });

        if (newChat?.id) {
          setNewChatId(newChat.id);

          // Update URL
          window.history.replaceState({}, "", `/c/${newChat.id}`);

          // Try to add message directly
          try {
            await addMessage(newChat.id, userMessage);
          } catch (error) {
            console.error(
              "Error adding user message to new chat, storing for later:",
              error
            );
            setPendingUserMessage(userMessage);
          }

          // Submit to AI
          handleSubmit(e, submitOptions);
        } else {
          throw new Error("Không thể tạo cuộc trò chuyện mới");
        }
      } else {
        // Already have currentChat.id
        if (!currentChat.messages?.length) {
          await updateChatTitle(currentChat.id, input.trim().slice(0, 20));
        }

        // Add user message first
        try {
          await addMessage(currentChat.id, userMessage);
        } catch (error) {
          console.error("Error adding user message to existing chat:", error);
          toast.error("Không thể gửi tin nhắn");
          return; // Don't proceed if we can't add the user message
        }

        // Then submit to AI
        handleSubmit(e, submitOptions);
      }

      // Clear attachments
      setAttachedFiles([]);
    } catch (error) {
      console.error("Error sending message:", error);
      toast.error("Không thể gửi tin nhắn");
    }
  };

  return (
    <div
      ref={chatContainerRef}
      className="flex flex-col h-full bg-neutral-900 w-full"
    >
      {/* Header */}
      <div className="flex items-center justify-between p-4 md:p-6 pb-4">
        {/* Left side - Menu button (only on mobile) */}
        {showMenuButton && (
          <motion.button
            onClick={onToggleSidebar}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="p-2 text-neutral-400 hover:text-white hover:bg-neutral-800 rounded-lg transition-all duration-200 md:hidden"
          >
            <IconMenu2 className="h-6 w-6" />
          </motion.button>
        )}

        {/* Center - Chat title */}
        <div className="hidden md:flex flex-1 justify-center">
          {currentChat && (
            <div className="text-neutral-300 font-medium">
              {currentChat.title}
            </div>
          )}
        </div>

        {/* Right side - User info */}
        <div className="flex items-center gap-3 text-neutral-400">
          <UserAvatarMenu />
        </div>
      </div>

      {/* Messages */}
      <ChatContent
        messages={messages || []}
        isLoading={status === "submitted"}
        isStreaming={status === "streaming"}
      />

      {/* Input Area */}
      <ChatInput
        onSubmit={onSubmit}
        attachedFiles={attachedFiles}
        handleFileUpload={handleFileUpload}
        handleInputChange={handleInputChange}
        isLoading={
          status === "submitted" ||
          isAddingMessage ||
          isUploading ||
          isProcessingMessage
        }
        input={input}
        removeFile={removeFile}
      />
    </div>
  );
}
