"use client";

import MarkdownContent from "./markdown-content";
import MessageActions from "./message-actions";

interface AssistantMessageProps {
  id: string;
  content: string;
  index: number;
  onCopy?: (content: string, messageId: string) => void;
  onRegenerate?: (messageIndex: number) => void;
  isRegenerating?: boolean;
  copiedId?: string | null;
}

export default function AssistantMessage({
  id,
  content,
  index,
  onCopy,
  onRegenerate,
  isRegenerating,
  copiedId,
}: AssistantMessageProps) {
  return (
    <div className="max-w-[95%] md:max-w-[90%] lg:max-w-[80%]">
      <div className="text-neutral-100 space-y-4">
        <MarkdownContent content={content} />
        <MessageActions
          messageId={id}
          content={content}
          index={index}
          onCopy={onCopy}
          onRegenerate={onRegenerate}
          isRegenerating={isRegenerating}
          copiedId={copiedId}
        />
      </div>
    </div>
  );
}
