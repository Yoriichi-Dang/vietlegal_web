"use client";
import UserMessage from "./user-message";
import AssistantMessage from "./assistant-message";
import { Attachment } from "@ai-sdk/ui-utils";

interface ChatMessageProps {
  id: string;
  role: "user" | "assistant" | "system";
  content: string;
  experimental_attachments?: Attachment[];
  index: number;
  onCopy: (content: string, messageId: string) => void;
  copiedId: string | null;
  onRegenerate: (messageIndex: number) => void;
  isRegenerating: boolean;
}

export default function ChatMessage({
  id,
  role,
  content,
  experimental_attachments,
  index,
  onCopy,
  copiedId,
  onRegenerate,
  isRegenerating,
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
        experimental_attachments={experimental_attachments}
      />
    );
  }

  return null;
}
