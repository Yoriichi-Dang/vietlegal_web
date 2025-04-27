"use client";
import ChatInput from "@/components/chat/chat-input";
import HeaderAvatar from "@/components/chat/header-avatar";
import Sidebar from "@/components/chat/sidebar";
import React, { useEffect, useRef, useState } from "react";
import ChatContainer from "@/components/chat/chat-container";
import { useConversation } from "@/provider/conversation-provider";

// Create a chat component that will consume the conversation context
const ChatContent = () => {
  const { messages: conversationMessages, activeConversation } =
    useConversation();

  // Ref for the scrollable container
  const chatScrollRef = useRef<HTMLDivElement>(null);
  const [prevMessagesLength, setPrevMessagesLength] = useState(0);

  // Smooth scroll function using Web Animation API
  const scrollToBottom = () => {
    if (chatScrollRef.current) {
      const scrollElement = chatScrollRef.current;
      const scrollHeight = scrollElement.scrollHeight;

      // Using the Web Animation API for smooth scrolling
      scrollElement.animate(
        [{ scrollTop: scrollElement.scrollTop }, { scrollTop: scrollHeight }],
        {
          duration: 600, // Duration in milliseconds
          easing: "cubic-bezier(0.45, 0, 0.55, 1)", // Smooth easing function
          fill: "forwards",
        }
      );
    }
  };

  // Scroll to bottom when messages change (new message added)
  useEffect(() => {
    // Check if messages actually increased (a new message was added)
    if (conversationMessages.length > prevMessagesLength) {
      // Set a small timeout to ensure DOM has updated
      setTimeout(scrollToBottom, 100);
      setPrevMessagesLength(conversationMessages.length);
    }
  }, [conversationMessages.length, prevMessagesLength]);

  // Initial scroll to bottom when component mounts
  useEffect(() => {
    setTimeout(scrollToBottom, 100);
    setPrevMessagesLength(conversationMessages.length);
  }, []);

  return (
    <div className="w-full h-screen flex relative overflow-hidden">
      <Sidebar />
      <main
        className="bg-white dark:bg-zinc-900 w-full h-full flex flex-col overflow-auto"
        ref={chatScrollRef}
      >
        <div className="flex-1 overflow-hidden relative">
          <ChatContainer
            messages={conversationMessages}
            title={activeConversation?.title || "New Conversation"}
          />
        </div>
        <div className="w-full md:px-32 px-6 z-10">
          <div className="w-full bg-white dark:bg-zinc-900 pb-4 pt-2 mx-auto">
            <ChatInput />
          </div>
        </div>
      </main>
      <HeaderAvatar />
    </div>
  );
};

export default ChatContent;
