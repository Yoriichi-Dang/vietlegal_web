"use client";

import {
  IconFile,
  IconPhoto,
  IconFileText,
  IconVideo,
  IconX,
} from "@tabler/icons-react";
import { motion } from "motion/react";

interface FileAttachment {
  name: string;
  contentType: string;
  url: string;
}

interface FileAttachmentListProps {
  attachments: FileAttachment[];
  onRemove?: (index: number) => void;
  showRemove?: boolean;
}

const getFileIcon = (type: string) => {
  if (type.startsWith("image/")) return <IconPhoto className="h-4 w-4" />;
  if (type.startsWith("video/")) return <IconVideo className="h-4 w-4" />;
  if (type.includes("pdf") || type.includes("document"))
    return <IconFileText className="h-4 w-4" />;
  return <IconFile className="h-4 w-4" />;
};

export default function FileAttachmentList({
  attachments,
  onRemove,
  showRemove = false,
}: FileAttachmentListProps) {
  if (!attachments || attachments.length === 0) return null;

  return (
    <div className="flex flex-wrap gap-2 mt-2">
      {attachments.map((attachment, index) => (
        <motion.div
          key={index}
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          className="flex items-center gap-2 bg-neutral-800 rounded-lg px-3 py-2 text-sm border border-neutral-700"
        >
          <div className="text-blue-400">
            {getFileIcon(attachment.contentType)}
          </div>
          <span className="text-neutral-200 max-w-[150px] truncate">
            {attachment.name}
          </span>
          {showRemove && onRemove && (
            <button
              onClick={() => onRemove(index)}
              className="text-neutral-400 hover:text-red-400 transition-colors"
            >
              <IconX className="h-3 w-3" />
            </button>
          )}
        </motion.div>
      ))}
    </div>
  );
}
