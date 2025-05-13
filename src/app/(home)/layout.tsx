"use client";
import React from "react";
import ConversationProvider from "@/provider/conversation-provider";
const HomeLayout = ({ children }: { children: React.ReactNode }) => {
  return <ConversationProvider>{children}</ConversationProvider>;
};

export default HomeLayout;
