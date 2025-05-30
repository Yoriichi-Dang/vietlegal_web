"use client";

import { IconCopy, IconRefresh, IconCheck } from "@tabler/icons-react";
import { motion } from "motion/react";

interface MessageActionsProps {
  content: string;
  messageId: string;
  onCopy: (content: string, messageId: string) => void;
  onRegenerate: () => void;
  isRegenerating: boolean;
  copiedId: string | null;
}

export default function MessageActions({
  content,
  messageId,
  onCopy,
  onRegenerate,
  isRegenerating,
  copiedId,
}: MessageActionsProps) {
  return (
    <div className="flex items-center gap-2 mt-3 opacity-0 group-hover:opacity-100 transition-opacity">
      {/* Copy button */}
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => onCopy(content, messageId)}
        className="p-2 text-neutral-400 hover:text-neutral-200 transition-colors rounded-lg hover:bg-neutral-700"
        title="Copy message"
      >
        {copiedId === messageId ? (
          <IconCheck className="h-4 w-4 text-green-400" />
        ) : (
          <IconCopy className="h-4 w-4" />
        )}
      </motion.button>

      {/* Regenerate button */}
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={onRegenerate}
        disabled={isRegenerating}
        className="p-2 text-neutral-400 hover:text-neutral-200 transition-colors rounded-lg hover:bg-neutral-700 disabled:opacity-50"
        title="Regenerate response"
      >
        <motion.div
          animate={{ rotate: isRegenerating ? 360 : 0 }}
          transition={{
            duration: 1,
            repeat: isRegenerating ? Number.POSITIVE_INFINITY : 0,
            ease: "linear",
          }}
        >
          <IconRefresh className="h-4 w-4" />
        </motion.div>
      </motion.button>
    </div>
  );
}
