"use client";
import ChatContent from "@/components/chat/chat-content";
import ConversationProvider from "@/provider/conversation-provider";
import { useParams } from "next/navigation";
import { useEffect } from "react";
import { useConversation } from "@/provider/conversation-provider";

// Wrapper component để sử dụng useConversation hook
const ConversationWrapper = () => {
  const params = useParams();
  const conversationId = params.id as string;
  const { loadConversation, isLoading } = useConversation();

  useEffect(() => {
    if (conversationId) {
      console.log("Loading conversation with ID:", conversationId);
      loadConversation(conversationId);
    }
  }, [conversationId, loadConversation]);

  if (isLoading) {
    return (
      <div className="w-full h-screen flex items-center justify-center bg-white dark:bg-zinc-900">
        <div className="flex flex-col items-center">
          <div className="w-16 h-16 border-4 border-primary/30 border-t-primary rounded-full animate-spin"></div>
          <p className="mt-4 text-muted-foreground">
            Đang tải cuộc trò chuyện...
          </p>
        </div>
      </div>
    );
  }

  return <ChatContent />;
};

// Main component
const ConversationPage = () => {
  return (
    <ConversationProvider>
      <ConversationWrapper />
    </ConversationProvider>
  );
};

export default ConversationPage;
