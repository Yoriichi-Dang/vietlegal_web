"use client";

import { motion } from "motion/react";
import Image from "next/image";
import {
  IconFile,
  IconPhoto,
  IconFileText,
  IconVideo,
  IconDownload,
} from "@tabler/icons-react";
import { Attachment } from "ai";

interface UserMessageProps {
  content: string;
  experimental_attachments?: Attachment[];
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
      className="flex flex-col items-end gap-2"
    >
      {/* Attachments - Separate from message content */}
      {experimental_attachments && experimental_attachments.length > 0 && (
        <div className="max-w-[80%] w-fit bg-neutral-800 rounded-xl p-3 border border-neutral-700 shadow-md">
          <div className="space-y-3">
            {experimental_attachments.map((attachment, index) => {
              // Handle image attachments
              if (attachment.contentType?.startsWith("image/")) {
                return (
                  <div key={index} className="relative">
                    <div className="relative rounded-lg overflow-hidden bg-neutral-900">
                      <Image
                        src={
                          attachment.url ||
                          "/placeholder.svg?height=200&width=300&query=image"
                        }
                        alt={attachment.name || "Image attachment"}
                        width={300}
                        height={200}
                        className="w-full h-auto object-cover rounded-lg hover:scale-[1.02] transition-transform"
                        style={{ maxHeight: "200px" }}
                      />
                    </div>
                    <div className="mt-2 flex items-center justify-between">
                      <span className="text-sm text-neutral-300 truncate max-w-[180px]">
                        {attachment.name}
                      </span>
                      <a
                        href={attachment.url}
                        download={attachment.name}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="p-1 text-neutral-400 hover:text-blue-400 transition-colors rounded-full hover:bg-neutral-700"
                      >
                        <IconDownload className="h-4 w-4" />
                      </a>
                    </div>
                  </div>
                );
              }

              // Handle video attachments
              if (attachment.contentType?.startsWith("video/")) {
                return (
                  <div
                    key={index}
                    className="relative rounded-lg overflow-hidden bg-neutral-900 p-3"
                  >
                    <div className="flex items-center gap-3">
                      <div className="bg-neutral-700 p-2 rounded-lg">
                        <IconVideo className="h-6 w-6 text-blue-400" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-neutral-200 truncate">
                          {attachment.name}
                        </p>
                      </div>
                      <a
                        href={attachment.url}
                        download={attachment.name}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="p-1 text-neutral-400 hover:text-blue-400 transition-colors rounded-full hover:bg-neutral-700"
                      >
                        <IconDownload className="h-4 w-4" />
                      </a>
                    </div>
                  </div>
                );
              }

              // Handle document/text attachments
              return (
                <div
                  key={index}
                  className="relative rounded-lg overflow-hidden bg-neutral-900 p-3"
                >
                  <div className="flex items-center gap-3">
                    <div className="bg-neutral-700 p-2 rounded-lg">
                      {getFileIcon(attachment.contentType || "")}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-neutral-200 truncate">
                        {attachment.name}
                      </p>
                    </div>
                    <a
                      href={attachment.url}
                      download={attachment.name}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-1 text-neutral-400 hover:text-blue-400 transition-colors rounded-full hover:bg-neutral-700"
                    >
                      <IconDownload className="h-4 w-4" />
                    </a>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Message content - Original styling */}
      <div className="max-w-[80%] bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-2xl px-4 py-3">
        <div className="text-sm leading-relaxed whitespace-pre-wrap">
          {content}
        </div>
      </div>
    </motion.div>
  );
}
