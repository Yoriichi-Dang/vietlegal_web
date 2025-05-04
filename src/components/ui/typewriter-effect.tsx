"use client";

import React, { useEffect, useState, useRef } from "react";
import ReactMarkdown from "react-markdown";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { vscDarkPlus } from "react-syntax-highlighter/dist/cjs/styles/prism";
import remarkGfm from "remark-gfm";
import rehypeRaw from "rehype-raw";
import remarkMath from "remark-math";
import rehypeKatex from "rehype-katex";
import "katex/dist/katex.min.css";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface TypewriterEffectProps {
  content: string;
  className?: string;
  markdownClassName?: string;
  typingSpeed?: number;
  startDelay?: number;
  showCursor?: boolean;
  onComplete?: () => void;
  autoPlay?: boolean;
}

// Define a type for the code component props
interface CodeComponentProps {
  inline?: boolean;
  className?: string;
  children: React.ReactNode;
}

// Hiệu ứng con trỏ nhấp nháy
const BlinkingCursor = ({ className }: { className?: string }) => {
  return (
    <motion.span
      className={cn(
        "inline-block h-4 w-[1px] ml-[1px] bg-gray-600 dark:bg-gray-400",
        className
      )}
      animate={{ opacity: [1, 0, 1] }}
      transition={{ duration: 0.8, repeat: Infinity, repeatType: "loop" }}
    >
      |
    </motion.span>
  );
};

// Hook để sử dụng TypewriterEffect trong các component khác
export const useTypewriter = (
  content: string,
  {
    typingSpeed = 40,
    startDelay = 0,
    autoPlay = true,
    onComplete,
  }: {
    typingSpeed?: number;
    startDelay?: number;
    autoPlay?: boolean;
    onComplete?: () => void;
  } = {}
) => {
  const [displayedContent, setDisplayedContent] = useState("");
  const [isTyping, setIsTyping] = useState(autoPlay);
  const [isComplete, setIsComplete] = useState(false);
  const fullContentRef = useRef(content);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Update reference when content changes
  useEffect(() => {
    fullContentRef.current = content;
    // If content changes, reset and restart typing
    if (autoPlay) {
      setDisplayedContent("");
      setIsComplete(false);
      setIsTyping(true);
    }
  }, [content, autoPlay]);

  // Effect to handle the typewriter animation
  useEffect(() => {
    if (!isTyping) return;

    // Clear any existing timeouts
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    // If we're just starting, add a delay
    const initialDelay = displayedContent === "" ? startDelay : 0;

    // Calculate how much content we've typed so far
    const currentLength = displayedContent.length;

    // Check if we're done typing
    if (currentLength >= fullContentRef.current.length) {
      setIsTyping(false);
      setIsComplete(true);
      if (onComplete) onComplete();
      return;
    }

    // Function to type the next character
    const typeNextCharacter = () => {
      setDisplayedContent((prevContent) => {
        // Get the next chunk to type (one character)
        const nextChar = fullContentRef.current.charAt(prevContent.length);
        return prevContent + nextChar;
      });
    };

    // Set the timeout for the next character
    timeoutRef.current = setTimeout(
      typeNextCharacter,
      initialDelay || typingSpeed
    );

    // Cleanup
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, [displayedContent, isTyping, typingSpeed, startDelay, onComplete]);

  // Function to manually start typing if autoPlay is false
  const startTyping = () => {
    if (!isTyping && !isComplete) {
      setIsTyping(true);
    }
  };

  // Skip to the end of typing animation
  const skipToEnd = () => {
    setDisplayedContent(fullContentRef.current);
    setIsTyping(false);
    setIsComplete(true);
    if (onComplete) onComplete();
  };

  return {
    displayedContent,
    isTyping,
    isComplete,
    startTyping,
    skipToEnd,
  };
};

export const TypewriterEffect: React.FC<TypewriterEffectProps> = ({
  content,
  className,
  markdownClassName,
  typingSpeed = 40,
  startDelay = 0,
  showCursor = true,
  onComplete,
  autoPlay = true,
}) => {
  const { displayedContent, isTyping, isComplete, skipToEnd } = useTypewriter(
    content,
    { typingSpeed, startDelay, autoPlay, onComplete }
  );

  return (
    <div className={cn("relative", className)}>
      <div
        className={cn("text-gray-800 dark:text-white", markdownClassName)}
        onClick={!isComplete ? skipToEnd : undefined}
      >
        <ReactMarkdown
          remarkPlugins={[remarkGfm, remarkMath]}
          rehypePlugins={[rehypeRaw, rehypeKatex]}
          components={{
            code: (props: any) => {
              const { inline, className, children, ...rest } =
                props as CodeComponentProps;
              const match = /language-(\w+)/.exec(className || "");
              const language = match ? match[1] : "";

              // Lấy nội dung code và loại bỏ dấu xuống dòng cuối cùng nếu có
              const codeContent = String(children).replace(/\n$/, "");

              // Xử lý hiển thị code block
              if (!inline && language) {
                return (
                  <div className="relative group my-4">
                    <div className="absolute right-2 top-2 opacity-0 group-hover:opacity-100 transition-opacity flex gap-2 z-10">
                      <button
                        onClick={() =>
                          navigator.clipboard.writeText(codeContent)
                        }
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

              // Xử lý inline code
              return (
                <code
                  className="bg-gray-100 dark:bg-zinc-800 px-1.5 py-0.5 rounded font-mono text-sm"
                  {...rest}
                >
                  {children}
                </code>
              );
            },
            // Define styling for markdown elements
            h1: ({ ...props }) => (
              <h1 className="text-2xl font-bold mt-6 mb-4" {...props} />
            ),
            h2: ({ ...props }) => (
              <h2 className="text-xl font-bold mt-5 mb-3" {...props} />
            ),
            h3: ({ ...props }) => (
              <h3 className="text-lg font-bold mt-4 mb-2" {...props} />
            ),
            h4: ({ ...props }) => (
              <h4 className="text-base font-bold mt-3 mb-1" {...props} />
            ),
            p: ({ ...props }) => (
              <p className="mb-4 last:mb-0 leading-relaxed" {...props} />
            ),
            ul: ({ ...props }) => (
              <ul className="list-disc pl-6 mb-4 space-y-1" {...props} />
            ),
            ol: ({ ...props }) => (
              <ol className="list-decimal pl-6 mb-4 space-y-1" {...props} />
            ),
            li: ({ ...props }) => <li className="mb-1" {...props} />,
            a: ({ ...props }) => (
              <a
                className="text-blue-600 dark:text-blue-400 hover:underline font-medium break-words"
                target="_blank"
                rel="noopener noreferrer"
                {...props}
              />
            ),
            blockquote: ({ ...props }) => (
              <blockquote
                className="border-l-4 border-gray-300 dark:border-gray-500 pl-4 py-1 my-4 text-gray-600 dark:text-gray-300 italic"
                {...props}
              />
            ),
            table: ({ ...props }) => (
              <div className="overflow-x-auto my-4 rounded-lg">
                <table
                  className="min-w-full divide-y divide-gray-200 dark:divide-gray-700 overflow-hidden"
                  {...props}
                />
              </div>
            ),
            thead: ({ ...props }) => (
              <thead className="bg-gray-50 dark:bg-zinc-800" {...props} />
            ),
            tr: ({ ...props }) => (
              <tr
                className="even:bg-gray-50 dark:even:bg-zinc-800/50"
                {...props}
              />
            ),
            th: ({ ...props }) => (
              <th
                className="px-4 py-3 text-left text-sm font-medium text-gray-700 dark:text-gray-300"
                {...props}
              />
            ),
            td: ({ ...props }) => (
              <td className="px-4 py-3 text-sm" {...props} />
            ),
            hr: ({ ...props }) => (
              <hr
                className="my-6 border-gray-200 dark:border-gray-700"
                {...props}
              />
            ),
            img: ({ ...props }) => (
              <img
                className="max-w-full h-auto rounded-lg my-4 shadow-sm"
                {...props}
                alt={props.alt || "image"}
              />
            ),
          }}
        >
          {displayedContent}
        </ReactMarkdown>
        {isTyping && showCursor && <BlinkingCursor />}
      </div>
    </div>
  );
};

// Simple version just for text with minimal styling
export const SimpleTypewriterEffect: React.FC<{
  text: string;
  className?: string;
  typingSpeed?: number;
  startDelay?: number;
  onComplete?: () => void;
}> = ({ text, className, typingSpeed = 40, startDelay = 0, onComplete }) => {
  const { displayedContent: displayedText, isTyping } = useTypewriter(text, {
    typingSpeed,
    startDelay,
    onComplete,
  });

  return (
    <div className={cn("font-mono", className)}>
      <span>{displayedText}</span>
      {isTyping && (
        <motion.span
          className="inline-block bg-gray-700 dark:bg-gray-300 w-[2px] h-4 ml-1"
          animate={{ opacity: [1, 0, 1] }}
          transition={{ duration: 0.8, repeat: Infinity }}
        />
      )}
    </div>
  );
};

export default TypewriterEffect;
