"use client";

import { motion } from "motion/react";
import { cn } from "@/lib/utils";
import AssistantMessage from "./assistant-message";
import UserMessage from "./user-message";
import type { MessageAttachment } from "./types";

export interface ChatMessageProps {
  id: string;
  role: "user" | "assistant" | "system";
  content: string;
  experimental_attachments?: MessageAttachment[];
  index: number;
  onCopy?: (content: string, messageId: string) => void;
  onRegenerate?: (messageIndex: number) => void;
  isRegenerating?: boolean;
  copiedId?: string | null;
}

export default function ChatMessage({
  id,
  role,
  content,
  experimental_attachments,
  index,
  onCopy,
  onRegenerate,
  isRegenerating,
  copiedId,
}: ChatMessageProps) {
  return (
    <motion.div
      key={id}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: index * 0.1 }}
      className={cn(
        "flex gap-3 md:gap-4",
        role === "user" ? "justify-end" : "justify-start"
      )}
    >
      {role === "user" ? (
        <UserMessage
          id={id}
          content={content}
          attachments={experimental_attachments}
        />
      ) : (
        <AssistantMessage
          id={id}
          content={content}
          index={index}
          onCopy={onCopy}
          onRegenerate={onRegenerate}
          isRegenerating={isRegenerating}
          copiedId={copiedId}
        />
      )}
    </motion.div>
  );
}
