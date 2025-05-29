"use client";
import React from "react";
import { ChatProvider } from "@/provider/chat-provider";
const HomeLayout = ({ children }: { children: React.ReactNode }) => {
  return <ChatProvider>{children}</ChatProvider>;
};

export default HomeLayout;
