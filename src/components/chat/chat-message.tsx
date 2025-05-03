"use client";

import React from "react";
import ReactMarkdown from "react-markdown";
import { useEffect, useState } from "react";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { vscDarkPlus } from "react-syntax-highlighter/dist/cjs/styles/prism";
import remarkGfm from "remark-gfm";
import rehypeRaw from "rehype-raw";
import remarkMath from "remark-math";
import rehypeKatex from "rehype-katex";
import "katex/dist/katex.min.css";
import { motion } from "framer-motion";

interface ChatMessageProps {
  content: string;
  isUser: boolean;
  messageId: number | string;
}

// Define a type for the code component props
interface CodeComponentProps {
  inline?: boolean;
  className?: string;
  children: React.ReactNode;
}

const ChatMessage: React.FC<ChatMessageProps> = ({
  content,
  isUser,
  messageId,
}) => {
  // Add hydration state to ensure markup is consistent client-side
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
        className={`${
          isUser
            ? "dark:bg-zinc-800 bg-gray-100 rounded-xl p-4 max-w-xl shadow-sm"
            : "p-4 max-w-xl"
        }`}
      >
        {isUser ? (
          <p className="text-gray-800 dark:text-white text-base text-wrap whitespace-pre-wrap text-justify">
            {content}
          </p>
        ) : isMounted ? (
          <div className="text-gray-800 dark:text-white text-wrap text-base markdown-content">
            <ReactMarkdown
              remarkPlugins={[remarkGfm, remarkMath]}
              rehypePlugins={[rehypeRaw, rehypeKatex]}
              components={{
                code: (props: any) => {
                  const { inline, className, children, ...rest } =
                    props as CodeComponentProps;
                  const match = /language-(\w+)/.exec(className || "");
                  const language = match ? match[1] : "";

                  return !inline && language ? (
                    <div className="relative group my-4">
                      <div className="absolute right-2 top-2 opacity-0 group-hover:opacity-100 transition-opacity flex gap-2 z-10">
                        <button
                          onClick={() =>
                            navigator.clipboard.writeText(
                              String(children).replace(/\n$/, "")
                            )
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
                        >
                          {String(children).replace(/\n$/, "")}
                        </SyntaxHighlighter>
                      </div>
                    </div>
                  ) : (
                    <code
                      className="bg-gray-100 dark:bg-zinc-800 px-1.5 py-0.5 rounded font-mono text-sm"
                      {...rest}
                    >
                      {children}
                    </code>
                  );
                },
                // Cải thiện hiển thị cho các phần tử khác
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
              {content}
            </ReactMarkdown>
          </div>
        ) : (
          <div className="text-gray-800 dark:text-white text-wrap text-base">
            {content}
          </div>
        )}
      </div>
    </motion.div>
  );
};

export default ChatMessage;
