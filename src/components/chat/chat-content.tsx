"use client";

import { AnimatePresence } from "motion/react";
import { useEffect, useRef, useState, useCallback } from "react";
import { toast } from "sonner";
import BeautifulCenterText from "./beauty-text";
import LoadingMessage from "./message/loading-message";
import ChatMessage from "./message/chat-message";
import type { Message } from "@ai-sdk/react";

type Props = {
  messages?: Message[];
  isLoading?: boolean;
  isStreaming?: boolean;
};

const ChatContent = ({
  messages = [],
  isLoading = false,
  isStreaming = false,
}: Props) => {
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [regeneratingIndex, setRegeneratingIndex] = useState<number | null>(
    null
  );
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const lastMessageContentRef = useRef<string>("");
  const isScrollingRef = useRef<boolean>(false);

  // Smooth scroll to bottom function
  const scrollToBottom = useCallback((force = false) => {
    if (isScrollingRef.current && !force) return;

    isScrollingRef.current = true;

    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({
        behavior: "smooth",
        block: "end",
      });
    }

    // Reset scrolling flag after animation
    setTimeout(() => {
      isScrollingRef.current = false;
    }, 300);
  }, []);

  // Auto scroll when messages change or loading state changes
  useEffect(() => {
    const timeoutId = setTimeout(() => scrollToBottom(), 50);
    return () => clearTimeout(timeoutId);
  }, [messages.length, isLoading, isStreaming, scrollToBottom]);

  // Auto scroll during streaming (when last message content changes)
  useEffect(() => {
    if (messages.length > 0) {
      const lastMessage = messages[messages.length - 1];
      const currentContent = lastMessage.content || "";

      // Check if the last message content has changed (streaming)
      if (currentContent !== lastMessageContentRef.current) {
        lastMessageContentRef.current = currentContent;

        // Only scroll if the last message is from assistant (being streamed)
        if (lastMessage.role === "assistant") {
          scrollToBottom();
        }
      }
    }
  }, [messages, scrollToBottom]);

  // Auto scroll when container size changes (for responsive)
  useEffect(() => {
    const scrollContainer = scrollContainerRef.current;
    if (!scrollContainer) return;

    const resizeObserver = new ResizeObserver(() => {
      scrollToBottom();
    });

    resizeObserver.observe(scrollContainer);
    return () => resizeObserver.disconnect();
  }, [scrollToBottom]);

  // Copy message content to clipboard
  const copyToClipboard = (content: string, messageId: string) => {
    navigator.clipboard.writeText(content).then(
      () => {
        setCopiedId(messageId);
        toast.success("Đã sao chép vào clipboard");
        setTimeout(() => setCopiedId(null), 2000);
      },
      () => {
        toast.error("Không thể sao chép");
      }
    );
  };

  // Regenerate response
  const handleRegenerate = async (messageIndex: number) => {
    const previousUserMessageIndex = messages
      .slice(0, messageIndex)
      .reverse()
      .findIndex((msg: Message) => msg.role === "user");

    if (previousUserMessageIndex !== -1) {
      try {
        setRegeneratingIndex(messageIndex);
        // Simulate regeneration
        await new Promise((resolve) => setTimeout(resolve, 2000));
        toast.success("Đã tạo lại phản hồi");
      } catch (error: any) {
        console.error("Error regenerating response:", error);
        toast.error("Không thể tạo lại phản hồi");
      } finally {
        setRegeneratingIndex(null);
      }
    }
  };

  // Show beautiful center text when no messages
  if (messages.length === 0 && !isLoading) {
    return <BeautifulCenterText />;
  }

  return (
    <div
      ref={scrollContainerRef}
      className="flex-1 px-4 md:px-6 pb-6 custom-scrollbar [scrollbar-gutter:stable] overflow-y-auto"
    >
      <div className="max-w-4xl mx-auto space-y-6 md:space-y-8 pt-4">
        <AnimatePresence>
          {messages.map((message: Message, index) => (
            <ChatMessage
              key={message.id || `message-${index}`}
              id={message.id || `message-${index}`}
              role={message.role as "user" | "assistant"}
              content={message.content || ""}
              experimental_attachments={message.experimental_attachments}
              index={index}
              onCopy={copyToClipboard}
              onRegenerate={handleRegenerate}
              isRegenerating={regeneratingIndex === index}
              copiedId={copiedId}
            />
          ))}

          {/* Loading message throughout the entire process until completion */}
          {isLoading && !isStreaming && (
            <LoadingMessage key="loading-message" />
          )}
        </AnimatePresence>

        {/* Invisible element to scroll to */}
        <div ref={messagesEndRef} className="h-1" />
      </div>
    </div>
  );
};

export default ChatContent;
