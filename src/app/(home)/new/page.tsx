"use client";

import ChatbotApp from "@/components/chat/chat-app";
import { ConversationProvider } from "@/provider/conversation-provider";
const Page = () => {
  return (
    <ConversationProvider>
      <ChatbotApp />
    </ConversationProvider>
  );
};

export default Page;
