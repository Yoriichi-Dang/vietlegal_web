import { ChatContainerProps } from "@/types/chat";
import ChatMessage from "./chat-message";
import { AnimatePresence } from "framer-motion";

const ChatContainer: React.FC<ChatContainerProps> = ({ messages }) => {
  return (
    <div className="w-full h-full flex flex-col custom-scrollbar [scrollbar-gutter:stable] overflow-y-auto">
      <div className="flex-1 flex flex-col mt-10 space-y-2 w-full max-w-[1000px] mx-auto pb-24">
        <AnimatePresence initial={false}>
          {messages.map((message, index) => (
            <div
              key={message.id || index}
              className="flex justify-center items-center w-full py-2"
            >
              <div className="md:max-w-3xl sm:max-w-full w-full">
                <ChatMessage
                  content={message.content}
                  isUser={message.isUser}
                  messageId={message.id || index}
                />
              </div>
            </div>
          ))}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default ChatContainer;
