"use client";

import type React from "react";
import { useState } from "react";
import { motion } from "motion/react";
import { IconMenu2 } from "@tabler/icons-react";
import UserAvatarMenu from "./user-avatar-menu";
import ChatInput from "./chat-input";
import ChatContent from "./chat-content";
import { toast } from "sonner";

export interface AttachedFile {
  id: string;
  name: string;
  type: string;
  size: number;
  url: string;
}

interface ChatInterfaceProps {
  onToggleSidebar: () => void;
  showMenuButton?: boolean;
  currentChat?: { id: string; title: string } | null;
  onAddMessage?: (message: any) => Promise<void>;
}

export default function ChatInterface({
  onToggleSidebar,
  showMenuButton = true,
  currentChat,
}: ChatInterfaceProps) {
  const [attachedFiles, setAttachedFiles] = useState<AttachedFile[]>([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [messages, setMessages] = useState<any[]>([]);

  // Handle file upload
  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (!files) return;

    Array.from(files).forEach((file) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        const newFile: AttachedFile = {
          id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
          name: file.name,
          type: file.type,
          size: file.size,
          url: e.target?.result as string,
        };
        setAttachedFiles((prev) => [...prev, newFile]);
      };
      reader.readAsDataURL(file);
    });

    // Reset input
    event.target.value = "";
  };

  // Remove file
  const removeFile = (fileId: string) => {
    setAttachedFiles((prev) => prev.filter((file) => file.id !== fileId));
  };

  // Handle input change
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInput(e.target.value);
  };

  // Handle form submit
  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!input.trim() && attachedFiles.length === 0) return;

    setIsLoading(true);

    try {
      // Add user message
      const userMessage = {
        id: Date.now().toString(),
        role: "user" as const,
        content: input.trim(),
        experimental_attachments:
          attachedFiles.length > 0
            ? attachedFiles.map((file) => ({
                name: file.name,
                contentType: file.type,
                url: file.url,
              }))
            : undefined,
      };

      setMessages((prev) => [...prev, userMessage]);

      // Clear input and files
      setInput("");
      setAttachedFiles([]);

      // Simulate AI response
      setTimeout(() => {
        const aiMessage = {
          id: (Date.now() + 1).toString(),
          role: "assistant" as const,
          content: `Tôi đã nhận được tin nhắn của bạn: "${input.trim()}". Đây là phản hồi mẫu từ AI assistant về vấn đề pháp lý bạn đang quan tâm.`,
        };
        setMessages((prev) => [...prev, aiMessage]);
        setIsLoading(false);
      }, 2000);

      toast.success("Tin nhắn đã được gửi");
    } catch (error) {
      console.error("Error sending message:", error);
      toast.error("Không thể gửi tin nhắn");
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-full bg-neutral-900 w-full">
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
          <div className="flex items-center gap-2 bg-neutral-800 rounded-full px-3 py-1">
            <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
            <span className="text-sm">6/75</span>
          </div>
          <UserAvatarMenu />
        </div>
      </div>

      {/* Messages */}
      <ChatContent
        messages={messages}
        isLoading={isLoading}
        useSeedData={messages.length === 0}
      />

      {/* Input Area */}
      <ChatInput
        onSubmit={onSubmit}
        attachedFiles={attachedFiles}
        handleFileUpload={handleFileUpload}
        handleInputChange={handleInputChange}
        isLoading={isLoading}
        input={input}
        removeFile={removeFile}
      />
    </div>
  );
}
