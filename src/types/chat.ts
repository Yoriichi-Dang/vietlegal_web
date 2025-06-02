// types/chat.ts

export interface AIModel {
  model_id: string;
  name: string;
  provider: string;
  description: string;
  created_at?: Date;
  updated_at?: Date;
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
// types/chat.ts
export interface ChatAttachment {
  id?: string;
  file_name: string;
  file_type: string;
  file_size: number;
  file_url?: string;
  originalFile?: File;
}
export type ChatMessage = {
  id?: string;
  sender_type: "user" | "model" | "system";
  message_type: "text" | "image" | "file";
  model_id?: string;
  content?: string;
  created_at?: Date;
  updated_at?: Date;
  attachments?: ChatAttachment[];
};

export interface Chat {
  id: string;
  title: string;
  isArchived: boolean;
  messages: ChatMessage[];
  created_at?: Date;
  updated_at?: Date;
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
  isFetchedChats: boolean;
  isLoadingChats: boolean;
  isErrorChats: boolean;
  error: string | null;
  isCreatingChat: boolean;
  isUpdatingTitle: boolean;
  isDeletingChat: boolean;
  isAddingMessage: boolean;
  hasBeenReady: boolean;

  // Actions
  createNewChat: (data?: CreateChatRequest) => Promise<Chat | null>;
  deleteChat: (chatId: string) => Promise<void>;
  selectChat: (chatId: string) => Promise<void>;
  addMessage: (
    chatId: string,
    message: Omit<ChatMessage, "id" | "createdAt" | "updatedAt">
  ) => Promise<void>;
  updateChatTitle: (chatId: string, title: string) => Promise<void>;
  deleteAllChats: () => Promise<void>;
}
