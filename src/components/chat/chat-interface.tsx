"use client";

import type React from "react";
import { useRef, useState } from "react";
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
import { Attachment } from "ai";
import { v4 as uuidv4 } from "uuid";
interface ChatInterfaceProps {
  onToggleSidebar: () => void;
  showMenuButton?: boolean;
}

export const MAX_FILE_SIZE = 5 * 1024 * 1024; // 10MB

export default function ChatInterface({
  onToggleSidebar,
  showMenuButton = true,
}: ChatInterfaceProps) {
  const [attachedFiles, setAttachedFiles] = useState<ChatAttachment[]>([]);
  const { addMessage, currentChat, isAddingMessage, updateChatTitle } =
    useChatProvider();
  const chatContainerRef = useRef<HTMLDivElement>(null);
  const [isUploading, setIsUploading] = useState(false);

  const { messages, status, input, handleInputChange, handleSubmit } =
    useChatAI({
      initialMessages:
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
        }) || [],
      onFinish: async (message) => {
        if (currentChat?.id) {
          await addMessage(currentChat?.id, {
            sender_type: "model",
            message_type: "text",
            model_id: MODEL.id.toString(),
            content: message.content,
          });
        }
      },
    });

  // Handle file upload
  // Sửa handleFileUpload để lưu cả File object
  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (!files) return;
    setIsUploading(true);
    Array.from(files).forEach(async (file) => {
      const { fileUrl } = await uploadFile(file);
      const newFile: ChatAttachment = {
        id: uuidv4(),
        file_name: file.name,
        file_type: file.type,
        file_size: file.size,
        file_url: fileUrl,
      };
      setAttachedFiles((prev) => [...prev, newFile]);
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
      return { failure: data.failure };
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
  // Handle form submit
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
      toast.error("Vui lòng nhập tin nhắn ");
      return;
    }

    try {
      // Add user message to database first
      const userMessage: ChatMessage = {
        sender_type: "user",
        message_type: "text",
        content: input.trim(),
        attachments: attachedFiles,
      };

      if (!currentChat?.messages || currentChat?.messages.length === 0) {
        await updateChatTitle(currentChat?.id || "", input.trim().slice(0, 20));
      }

      // Convert ChatAttachment[] to Attachment[] for AI SDK
      const aiAttachments = convertToAIAttachments(attachedFiles);

      // Create options object
      const submitOptions: any = {};

      // Only add attachments if there are any
      if (aiAttachments.length > 0) {
        submitOptions.experimental_attachments = aiAttachments;
      }

      // Submit with options
      handleSubmit(e, submitOptions);

      await addMessage(currentChat?.id || "", userMessage);
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
        isLoading={status === "submitted" || isAddingMessage || isUploading}
        input={input}
        removeFile={removeFile}
      />
    </div>
  );
}
