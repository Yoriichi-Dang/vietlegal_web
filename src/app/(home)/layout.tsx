"use client";
import React from "react";
import { ChatProvider } from "@/provider/chat-provider";
import DemoThinkingButton from "@/components/demo-thinking-button";

const HomeLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <ChatProvider>
      {children}
      <DemoThinkingButton />
    </ChatProvider>
  );
};

export default HomeLayout;
