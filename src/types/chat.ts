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
