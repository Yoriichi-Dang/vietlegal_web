"use client";

import { AnimatePresence } from "motion/react";
import { useState } from "react";
import { toast } from "sonner";
import BeautifulCenterText from "./beauty-text";
import ChatMessage from "./message/chat-message";
import LoadingMessage from "./message/loading-message";
import type { MessageAttachment } from "./message/types";

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

// Sample seed data for demonstration
const chatSeedData: MessageProps[] = [
  {
    id: "1",
    role: "user",
    content: "Tôi muốn tìm hiểu về quy định thuế thu nhập cá nhân mới nhất.",
  },
  {
    id: "2",
    role: "assistant",
    content:
      "Tôi sẽ giúp bạn tìm hiểu về quy định thuế thu nhập cá nhân mới nhất. Theo Luật Thuế thu nhập cá nhân được sửa đổi, bổ sung năm 2020, có một số điểm quan trọng sau:\n\n**1. Mức giảm trừ gia cảnh:**\n- Bản thân: 11 triệu đồng/tháng\n- Người phụ thuộc: 4,4 triệu đồng/tháng/người\n\n**2. Biểu thuế lũy tiến từng phần:**\n- Đến 5 triệu: 5%\n- Trên 5 triệu đến 10 triệu: 10%\n- Trên 10 triệu đến 18 triệu: 15%\n- Trên 18 triệu đến 32 triệu: 20%\n- Trên 32 triệu đến 52 triệu: 25%\n- Trên 52 triệu đến 80 triệu: 30%\n- Trên 80 triệu: 35%\n\nBạn có muốn tôi giải thích chi tiết về phần nào không?",
  },
];

const ChatContent = ({
  messages = [],
  isLoading = false,
  useSeedData = false,
}: Props) => {
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [regeneratingIndex, setRegeneratingIndex] = useState<number | null>(
    null
  );

  // Use seed data if requested and no messages
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
      try {
        setRegeneratingIndex(messageIndex);
        // Simulate regeneration
        await new Promise((resolve) => setTimeout(resolve, 2000));
        toast.success("Đã tạo lại phản hồi");
      } catch (error: any) {
        console.error("Error regenerating response:", error);
        toast.error("Không thể tạo lại phản hồi");
      } finally {
        setRegeneratingIndex(null);
      }
    }
  };

  // Show beautiful center text when no messages
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
