"use client";

import { AnimatePresence } from "motion/react";
import { useState } from "react";
import { toast } from "sonner";
import { useChatOperations } from "@/hooks/useChatOperations";
import BeautifulCenterText from "./beauty-text";
import ChatMessage from "./message/chat-message";
import LoadingMessage from "./message/loading-message";
import type { MessageAttachment } from "./message/types";
import { chatSeedData } from "@/data/chat-seed-data";

interface MessageProps {
  id: string;
  role: "user" | "assistant" | "system";
  content: string;
  experimental_attachments?: MessageAttachment[];
}

type Props = {
  messages?: MessageProps[];
  isLoading?: boolean;
  useSeedData?: boolean;
};

const ChatContent = ({
  messages = [],
  isLoading = false,
  useSeedData = false,
}: Props) => {
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [regeneratingIndex, setRegeneratingIndex] = useState<number | null>(
    null
  );
  const { regenerateResponse } = useChatOperations();

  // Sử dụng seed data nếu được yêu cầu và không có messages
  const displayMessages =
    useSeedData && messages.length === 0 ? chatSeedData : messages;

  // Copy message content to clipboard
  const copyToClipboard = (content: string, messageId: string) => {
    navigator.clipboard.writeText(content).then(
      () => {
        setCopiedId(messageId);
        toast.success("Đã sao chép vào clipboard");
        setTimeout(() => setCopiedId(null), 2000);
      },
      () => {
        toast.error("Không thể sao chép");
      }
    );
  };

  // Regenerate response
  const handleRegenerate = async (messageIndex: number) => {
    const previousUserMessageIndex = displayMessages
      .slice(0, messageIndex)
      .reverse()
      .findIndex((msg) => msg.role === "user");

    if (previousUserMessageIndex !== -1) {
      const userMessageIndex = messageIndex - previousUserMessageIndex - 1;

      try {
        setRegeneratingIndex(messageIndex);
        await regenerateResponse(userMessageIndex);
        toast.success("Đã tạo lại phản hồi");
      } catch (error) {
        toast.error("Không thể tạo lại phản hồi");
      } finally {
        setRegeneratingIndex(null);
      }
    }
  };

  // Hiển thị text đẹp khi chưa có tin nhắn
  if (displayMessages.length === 0 && !isLoading) {
    return <BeautifulCenterText />;
  }

  return (
    <div className="flex-1 px-4 md:px-6 pb-6 custom-scrollbar [scrollbar-gutter:stable] overflow-y-auto">
      <div className="max-w-4xl mx-auto space-y-6 md:space-y-8 pt-4">
        <AnimatePresence>
          {displayMessages.map((message, index) => (
            <ChatMessage
              key={message.id}
              id={message.id}
              role={message.role}
              content={message.content}
              experimental_attachments={message.experimental_attachments}
              index={index}
              onCopy={copyToClipboard}
              onRegenerate={handleRegenerate}
              isRegenerating={regeneratingIndex === index}
              copiedId={copiedId}
            />
          ))}
        </AnimatePresence>

        {isLoading && <LoadingMessage />}
      </div>
    </div>
  );
};

export default ChatContent;
