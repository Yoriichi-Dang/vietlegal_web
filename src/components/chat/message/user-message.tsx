"use client";

import { motion } from "motion/react";
import {
  IconFile,
  IconPhoto,
  IconFileText,
  IconVideo,
} from "@tabler/icons-react";
import type { MessageAttachment } from "./types";

interface UserMessageProps {
  content: string;
  experimental_attachments?: MessageAttachment[];
}

const getFileIcon = (type: string) => {
  if (type.startsWith("image/")) return <IconPhoto className="h-4 w-4" />;
  if (type.startsWith("video/")) return <IconVideo className="h-4 w-4" />;
  if (type.includes("pdf") || type.includes("document"))
    return <IconFileText className="h-4 w-4" />;
  return <IconFile className="h-4 w-4" />;
};

export default function UserMessage({
  content,
  experimental_attachments,
}: UserMessageProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex justify-end"
    >
      <div className="max-w-[80%] bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-2xl px-4 py-3">
        {/* Attachments */}
        {experimental_attachments && experimental_attachments.length > 0 && (
          <div className="mb-3 space-y-2">
            {experimental_attachments.map((attachment, index) => (
              <div
                key={index}
                className="flex items-center gap-2 bg-white/10 rounded-lg px-3 py-2 text-sm"
              >
                <div className="text-white/80">
                  {getFileIcon(attachment.contentType)}
                </div>
                <span className="text-white/90 truncate">
                  {attachment.name}
                </span>
              </div>
            ))}
          </div>
        )}

        {/* Message content */}
        <div className="text-sm leading-relaxed whitespace-pre-wrap">
          {content}
        </div>
      </div>
    </motion.div>
  );
}
