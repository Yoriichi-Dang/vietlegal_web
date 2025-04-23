// Types cho ứng dụng chat

// Type cho một tin nhắn
export interface Message {
  content: string; // Nội dung tin nhắn
  isUser: boolean; // true nếu tin nhắn từ người dùng, false nếu từ chatbot
  timestamp?: Date; // Thời gian gửi tin nhắn (tùy chọn)
  id?: string | number; // ID duy nhất cho tin nhắn (tùy chọn)
}

// Props cho ChatMessage component
export interface ChatMessageProps {
  content: string;
  isUser: boolean;
}

// Props cho ChatContainer component
export interface ChatContainerProps {
  messages: Message[];
  title?: string;
}

// Có thể mở rộng thêm các types khác nếu cần
// Ví dụ: type cho người dùng, loại tin nhắn, v.v.
export interface User {
  id: string;
  name: string;
  avatar?: string;
}

// Ví dụ: type cho toàn bộ cuộc hội thoại
export interface Conversation {
  id: string;
  title?: string;
  messages: Message[];
  participants: User[];
  createdAt: Date;
  updatedAt: Date;
}
