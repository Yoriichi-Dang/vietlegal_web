"use client";

import React, { useState, useEffect } from "react";
import { TypewriterEffect } from "@/components/ui/typewriter-effect";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeKatex from "rehype-katex";
import rehypeRaw from "rehype-raw";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { vscDarkPlus } from "react-syntax-highlighter/dist/cjs/styles/prism";

interface ChatMessageAnimatedProps {
  content: string;
  senderType: "user" | "model" | "system";
  messageId: number | string;
  typingSpeed?: number;
  isLastMessage?: boolean;
  onComplete?: () => void;
}

const ChatMessageAnimated: React.FC<ChatMessageAnimatedProps> = ({
  content,
  senderType,
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

  // Custom components cho ReactMarkdown
  const components = {
    code({ inline, className, children, ...props }: any) {
      const match = /language-(\w+)/.exec(className || "");
      const language = match ? match[1] : "";
      const codeContent = String(children).replace(/\n$/, "");

      if (!inline && match) {
        // Hiển thị code block với SyntaxHighlighter để có highlight cú pháp
        return (
          <div className="relative group my-4">
            <div className="absolute right-2 top-2 opacity-0 group-hover:opacity-100 transition-opacity flex gap-2 z-10">
              <button
                onClick={() => navigator.clipboard.writeText(codeContent)}
                className="bg-gray-700/70 hover:bg-gray-700/90 text-white text-xs py-1 px-2 rounded"
              >
                Copy
              </button>
            </div>
            <div className="text-left">
              {language && (
                <div className="text-xs text-gray-500 dark:text-gray-400 mb-1 px-4 py-1 border-b dark:border-zinc-700 border-zinc-200">
                  {language}
                </div>
              )}
              <SyntaxHighlighter
                language={language}
                style={vscDarkPlus as any}
                customStyle={{
                  margin: 0,
                  borderRadius: "0.5rem",
                  fontSize: "0.9rem",
                  lineHeight: "1.5",
                  padding: "1rem",
                }}
                showLineNumbers={
                  language === "javascript" ||
                  language === "python" ||
                  language === "java" ||
                  language === "cpp"
                }
                wrapLines={true}
                PreTag="div"
                useInlineStyles={true}
              >
                {codeContent}
              </SyntaxHighlighter>
            </div>
          </div>
        );
      }

      // Inline code
      return (
        <code
          className={className || "bg-zinc-200 dark:bg-zinc-700 px-1 rounded"}
          {...props}
        >
          {children}
        </code>
      );
    },
  };

  return (
    <motion.div
      className={`w-full flex ${
        senderType === "user" ? "justify-end" : "justify-start"
      }`}
      initial="initial"
      animate="animate"
      exit="exit"
      variants={messageVariants}
      key={messageId}
      layout
    >
      <div
        className={cn(
          senderType === "user"
            ? "dark:bg-zinc-800 bg-gray-100 rounded-xl p-4 max-w-xl shadow-sm"
            : "p-4 max-w-xl"
        )}
      >
        {senderType === "user" ? (
          <div className="markdown-content text-gray-800 dark:text-white text-base text-wrap whitespace-pre-wrap text-justify">
            <ReactMarkdown
              remarkPlugins={[remarkGfm]}
              rehypePlugins={[rehypeRaw, rehypeKatex]}
              components={components}
            >
              {content}
            </ReactMarkdown>
          </div>
        ) : !isMounted ? (
          <div className="text-gray-800 dark:text-white text-wrap text-base markdown-content">
            <ReactMarkdown
              remarkPlugins={[remarkGfm]}
              rehypePlugins={[rehypeRaw, rehypeKatex]}
              components={components}
            >
              {content}
            </ReactMarkdown>
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
