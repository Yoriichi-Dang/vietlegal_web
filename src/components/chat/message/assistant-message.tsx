"use client";

import { motion } from "motion/react";
import { IconRobot } from "@tabler/icons-react";
import MarkdownContent from "./markdown-content";
import MessageActions from "./message-actions";

interface AssistantMessageProps {
  content: string;
  messageId: string;
  onCopy: (content: string, messageId: string) => void;
  onRegenerate: (messageIndex: number) => void;
  messageIndex: number;
  isRegenerating: boolean;
  copiedId: string | null;
}

export default function AssistantMessage({
  content,
  messageId,
  onCopy,
  onRegenerate,
  messageIndex,
  isRegenerating,
  copiedId,
}: AssistantMessageProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex gap-3 group"
    >
      {/* Avatar */}
      <div className="flex-shrink-0 w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
        <IconRobot className="h-4 w-4 text-white" />
      </div>

      {/* Message content */}
      <div className="flex-1 min-w-0">
        <div className="bg-neutral-800 rounded-2xl px-4 py-3 relative">
          <MarkdownContent content={content} />

          {/* Message actions */}
          <MessageActions
            content={content}
            messageId={messageId}
            onCopy={onCopy}
            onRegenerate={() => onRegenerate(messageIndex)}
            isRegenerating={isRegenerating}
            copiedId={copiedId}
          />
        </div>
      </div>
    </motion.div>
  );
}
