// types/chat.ts

export interface AIModel {
  model_id: string;
  name: string;
  provider: string;
  description: string;
  created_at?: Date;
  updated_at?: Date;
}

export interface Attachment {
  id: string;
  file_name: string;
  file_path: string;
  file_type: string;
  file_size: number;
  message_id: string;
  created_at?: Date;
  updated_at?: Date;
}

export interface Message {
  id?: string;
  model_id?: string;
  conversation_id?: string;
  sender_type: "user" | "model" | "system";
  content?: string;
  message_type: "text" | "image" | "file" | "audio";
  attachments?: Attachment[];
  model?: AIModel;
  created_at?: Date;
  updated_at?: Date;
  is_saved?: boolean | null;
}

export interface Conversation {
  id: string;
  title?: string;
  is_archived: boolean;
  user_id: string;
  messages: Message[];
  created_at?: Date;
  updated_at?: Date;
}

// Response types for API calls
export interface ConversationsResponse {
  conversations: Conversation[];
  total: number;
  page: number;
  limit: number;
}

export interface ConversationResponse {
  conversation: Conversation;
  messages: Message[];
}

// Request types for API calls
export interface CreateMessageRequest {
  conversation_id: string;
  content?: string;
  model_id?: string;
  message_type?: "text" | "image" | "file" | "audio";
}

export interface CreateConversationRequest {
  title?: string;
}

export interface UpdateConversationRequest {
  title?: string;
  is_archived?: boolean;
}
export interface ChatAttachment {
  id: string;
  file_name: string;
  file_type: string;
  file_size: number;
  file_path: string;
}
export type ChatMessage = {
  id?: string;
  senderType: "user" | "model" | "system";
  messageType: "text" | "image" | "file";
  model?: AIModel;
  content?: string;
  createdAt?: Date;
  updatedAt?: Date;
  attachments?: ChatAttachment[];
};

export interface Chat {
  id: string;
  title: string;
  isArchived: boolean;
  messages: ChatMessage[];
  createdAt?: Date;
  updatedAt?: Date;
  isActive?: boolean;
}

export interface CreateChatRequest {
  title?: string;
}

export interface UpdateChatTitleRequest {
  chatId: string;
  title: string;
}

export interface AddMessageRequest {
  chatId: string;
  message: Omit<ChatMessage, "id" | "createdAt" | "updatedAt">;
}

export interface ChatContextType {
  // State
  chats: Chat[];
  currentChat: Chat | null;
  isLoadingChats: boolean;
  error: string | null;
  isCreatingChat: boolean;
  isUpdatingTitle: boolean;
  isDeletingChat: boolean;
  isAddingMessage: boolean;

  // Actions
  createNewChat: (data?: CreateChatRequest) => Promise<Chat | null>;
  selectChat: (chatId: string) => Promise<void>;
  addMessage: (
    chatId: string,
    message: Omit<ChatMessage, "id" | "createdAt" | "updatedAt">
  ) => Promise<void>;
}
