import { ChatContainerProps } from "@/types/chat";
import ChatMessage from "./chat-message";
const ChatContainer: React.FC<ChatContainerProps> = ({ messages, title }) => {
  return (
    <div className="w-full max-w-3xl mx-auto p-6 flex flex-col space-y-8">
      {/* Tiêu đề (nếu có) */}
      {title && (
        <div className="text-center">
          <h2 className="text-2xl font-medium text-gray-800">{title}</h2>
        </div>
      )}

      {/* Danh sách tin nhắn */}
      <div className="flex flex-col space-y-4">
        {messages.map((message, index) => (
          <ChatMessage
            key={index}
            content={message.content}
            isUser={message.isUser}
          />
        ))}
      </div>
    </div>
  );
};

export default ChatContainer;
