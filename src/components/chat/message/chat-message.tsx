"use client";
import UserMessage from "./user-message";
import AssistantMessage from "./assistant-message";
import type { MessageAttachment } from "./types";

interface ChatMessageProps {
  id: string;
  role: "user" | "assistant" | "system";
  content: string;
  experimental_attachments?: MessageAttachment[];
  index: number;
  onCopy: (content: string, messageId: string) => void;
  onRegenerate: (messageIndex: number) => void;
  isRegenerating: boolean;
  copiedId: string | null;
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
  if (role === "user") {
    return (
      <UserMessage
        content={content}
        experimental_attachments={experimental_attachments}
      />
    );
  }

  if (role === "assistant") {
    return (
      <AssistantMessage
        content={content}
        messageId={id}
        onCopy={onCopy}
        onRegenerate={onRegenerate}
        messageIndex={index}
        isRegenerating={isRegenerating}
        copiedId={copiedId}
      />
    );
  }

  return null;
}
