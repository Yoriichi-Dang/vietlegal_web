"use client";
import ChatContent from "@/components/chat/chat-content";
import ConversationProvider from "@/provider/conversation-provider";
const Page = () => {
  return (
    <ConversationProvider>
      <ChatContent />
    </ConversationProvider>
  );
};

export default Page;
