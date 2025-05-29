"use client";

import type { MessageAttachment } from "./types";
import FileAttachmentList from "./file-attachment-list";

interface UserMessageProps {
  id: string;
  content: string;
  attachments?: MessageAttachment[];
}

export default function UserMessage({
  id,
  content,
  attachments,
}: UserMessageProps) {
  return (
    <div className="max-w-[85%] md:max-w-[80%] lg:max-w-[70%]">
      <div className="bg-blue-600 text-white rounded-2xl px-2 md:px-4 py-2 md:py-3 ml-auto">
        <p className="text-base md:text-lg leading-relaxed">{content}</p>
        {attachments && attachments.length > 0 && (
          <FileAttachmentList attachments={attachments} variant="user" />
        )}
      </div>
    </div>
  );
}
