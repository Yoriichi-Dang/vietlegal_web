"use client";

import { Message } from "@/types/chat";
import ChatMessageAnimated from "./chat-message-animated";
import { AnimatePresence } from "framer-motion";

interface ChatContainerAnimatedProps {
  messages: Message[];
  typingSpeed?: number;
  onTypingComplete?: () => void;
}

const ChatContainerAnimated: React.FC<ChatContainerAnimatedProps> = ({
  messages,
  typingSpeed = 30,
  onTypingComplete,
}) => {
  return (
    <div className="w-full h-full flex flex-col custom-scrollbar [scrollbar-gutter:stable] overflow-y-auto">
      <div className="flex-1 flex flex-col mt-16 space-y-2 w-full max-w-[1000px] mx-auto pb-24">
        <AnimatePresence initial={false}>
          {messages.map((message, index) => (
            <div
              key={message.id || index}
              className="flex justify-center items-center w-full py-2"
            >
              <div className="md:max-w-3xl sm:max-w-full w-full">
                <ChatMessageAnimated
                  content={message.content || ""}
                  senderType={message.sender_type}
                  messageId={message.id || index}
                  typingSpeed={typingSpeed}
                  isLastMessage={
                    index === messages.length - 1 &&
                    message.sender_type !== "user"
                  }
                  onComplete={
                    index === messages.length - 1 &&
                    message.sender_type !== "user"
                      ? onTypingComplete
                      : undefined
                  }
                />
              </div>
            </div>
          ))}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default ChatContainerAnimated;
