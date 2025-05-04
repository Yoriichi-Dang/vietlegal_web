"use client";

import React, { useState, useEffect } from "react";
import { TypewriterEffect } from "@/components/ui/typewriter-effect";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface ChatMessageAnimatedProps {
  content: string;
  isUser: boolean;
  messageId: number | string;
  typingSpeed?: number;
  isLastMessage?: boolean;
  onComplete?: () => void;
}

const ChatMessageAnimated: React.FC<ChatMessageAnimatedProps> = ({
  content,
  isUser,
  messageId,
  typingSpeed = 30,
  isLastMessage = false,
  onComplete,
}) => {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  // Animation variants for the message container
  const messageVariants = {
    initial: {
      opacity: 0,
      y: 20,
    },
    animate: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.3,
        ease: "easeOut",
      },
    },
    exit: {
      opacity: 0,
      transition: { duration: 0.2 },
    },
  };

  return (
    <motion.div
      className={`w-full flex ${isUser ? "justify-end" : "justify-start"}`}
      initial="initial"
      animate="animate"
      exit="exit"
      variants={messageVariants}
      key={messageId}
      layout
    >
      <div
        className={cn(
          isUser
            ? "dark:bg-zinc-800 bg-gray-100 rounded-xl p-4 max-w-xl shadow-sm"
            : "p-4 max-w-xl"
        )}
      >
        {isUser ? (
          <p className="text-gray-800 dark:text-white text-base text-wrap whitespace-pre-wrap text-justify">
            {content}
          </p>
        ) : !isMounted ? (
          <div className="text-gray-800 dark:text-white text-wrap text-base">
            {content}
          </div>
        ) : (
          <TypewriterEffect
            content={content}
            typingSpeed={typingSpeed}
            showCursor={false}
            autoPlay={isLastMessage || content.length < 100} // Chỉ auto-play nếu là tin nhắn cuối cùng hoặc ngắn
            className="markdown-content"
            markdownClassName="text-gray-800 dark:text-white text-wrap text-base"
            onComplete={onComplete}
          />
        )}
      </div>
    </motion.div>
  );
};

export default ChatMessageAnimated;
