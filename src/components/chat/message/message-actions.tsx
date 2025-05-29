"use client";

import {
  IconCopy,
  IconThumbUp,
  IconThumbDown,
  IconVolume,
  IconRefresh,
} from "@tabler/icons-react";
import { cn } from "@/lib/utils";
import type { MessageActionProps } from "./types";

export default function MessageActions({
  messageId,
  content,
  index,
  onCopy,
  onRegenerate,
  isRegenerating,
  copiedId,
}: MessageActionProps) {
  const handleCopy = () => {
    if (onCopy) {
      onCopy(content, messageId);
    }
  };

  const handleRegenerate = () => {
    if (onRegenerate) {
      onRegenerate(index);
    }
  };

  return (
    <div className="flex items-center gap-1 md:gap-2 mt-3 md:mt-4">
      <button
        className="p-2 text-neutral-500 hover:text-neutral-300 hover:bg-neutral-800 rounded-lg transition-colors"
        onClick={handleCopy}
        title="Sao chép"
      >
        <IconCopy
          className={cn(
            "h-3 w-3 md:h-4 md:w-4",
            copiedId === messageId && "text-green-500"
          )}
        />
      </button>
      <button
        className="p-2 text-neutral-500 hover:text-neutral-300 hover:bg-neutral-800 rounded-lg transition-colors"
        title="Thích"
      >
        <IconThumbUp className="h-3 w-3 md:h-4 md:w-4" />
      </button>
      <button
        className="p-2 text-neutral-500 hover:text-neutral-300 hover:bg-neutral-800 rounded-lg transition-colors"
        title="Không thích"
      >
        <IconThumbDown className="h-3 w-3 md:h-4 md:w-4" />
      </button>
      <button
        className="p-2 text-neutral-500 hover:text-neutral-300 hover:bg-neutral-800 rounded-lg transition-colors"
        title="Đọc to"
      >
        <IconVolume className="h-3 w-3 md:h-4 md:w-4" />
      </button>
      <button
        className="p-2 text-neutral-500 hover:text-neutral-300 hover:bg-neutral-800 rounded-lg transition-colors disabled:opacity-50"
        onClick={handleRegenerate}
        disabled={isRegenerating}
        title="Tạo lại phản hồi"
      >
        <IconRefresh
          className={cn(
            "h-3 w-3 md:h-4 md:w-4",
            isRegenerating && "animate-spin text-blue-500"
          )}
        />
      </button>
    </div>
  );
}
