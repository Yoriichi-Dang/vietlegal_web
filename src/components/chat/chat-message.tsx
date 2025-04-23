import React from "react";
import { ChatMessageProps } from "@/types/chat";

const ChatMessage: React.FC<ChatMessageProps> = ({ content, isUser }) => {
  return (
    <div
      className={`w-full flex ${isUser ? "justify-end" : "justify-start"} mb-8`}
    >
      <div
        className={`max-w-xl dark:bg-neutral-800 rounded-xl p-4 ${
          isUser ? "bg-white shadow-sm text-right" : "bg-gray-100 "
        }`}
      >
        <p className="text-gray-800 dark:text-white text-base whitespace-pre-wrap text-justify">
          {content}
        </p>
      </div>
    </div>
  );
};
export default ChatMessage;
