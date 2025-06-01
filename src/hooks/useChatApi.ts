import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { useRef } from "react";
import useAxiosAuth from "./useAxiosAuth";
import type {
  Chat,
  CreateChatRequest,
  UpdateChatTitleRequest,
  AddMessageRequest,
  ChatMessage,
} from "@/types/chat";
import CHAT_API from "@/constants/chat";

export const useChatApi = () => {
  const { axiosAuth, isReady } = useAxiosAuth();
  const queryClient = useQueryClient();

  // Track if we've ever been ready to prevent refetch on isReady changes
  const hasBeenReadyRef = useRef(false);

  // Once ready, stay ready
  if (isReady && !hasBeenReadyRef.current) {
    hasBeenReadyRef.current = true;
  }

  // Fetch all chats
  const {
    data: chats = [],
    isFetched: isFetchedChats,
    isLoading: isLoadingChats,
    isError: isErrorChats,
    error: chatsError,
    refetch: refetchChats,
  } = useQuery({
    queryKey: ["chats"],
    queryFn: async (): Promise<Chat[]> => {
      if (!isReady) return [];
      const response = await axiosAuth.get(CHAT_API.getChatIncludeMessages);
      return response.data;
    },
    // Chỉ enable khi lần đầu ready, không refetch khi isReady thay đổi
    enabled: hasBeenReadyRef.current,
    staleTime: 5 * 60 * 1000, // 5 minutes
    refetchOnWindowFocus: false,
    refetchOnMount: true,
    refetchOnReconnect: true,
  });

  // Fetch specific chat
  const fetchChat = async (chatId: string): Promise<Chat | null> => {
    if (!isReady || !chatId) return null;

    try {
      // Kiểm tra trong cache trước
      const cachedChats = queryClient.getQueryData<Chat[]>(["chats"]);
      const cachedChat = cachedChats?.find((chat: Chat) => chat.id === chatId);

      if (cachedChat) {
        return cachedChat;
      }

      // Nếu không có trong cache thì fetch từ API
      const response = await axiosAuth.get<Chat>(CHAT_API.getChat(chatId));
      return response.data;
    } catch (error) {
      console.error("Error fetching chat:", error);
      toast.error("Không thể tải cuộc trò chuyện");
      return null;
    }
  };

  // Create new chat mutation
  const createChatMutation = useMutation({
    mutationFn: async (data: CreateChatRequest): Promise<Chat> => {
      if (!isReady) throw new Error("Not authenticated");

      const response = await axiosAuth.post(CHAT_API.createChat, {
        title: data.title || "Cuộc trò chuyện mới",
      });
      return response.data;
    },
    onSuccess: (newChat) => {
      console.log("newChat", newChat);
      // Update the chats list
      queryClient.setQueryData(["chats"], (oldChats: Chat[] = []) => [
        newChat,
        ...oldChats,
      ]);

      // Cache the new chat

      toast.success("Đã tạo cuộc trò chuyện mới");
    },
    onError: (error) => {
      console.error("Error creating chat:", error);
      toast.error("Không thể tạo cuộc trò chuyện mới");
    },
  });

  // Update chat title mutation
  const updateTitleMutation = useMutation({
    mutationFn: async ({
      chatId,
      title,
    }: UpdateChatTitleRequest): Promise<Chat> => {
      if (!isReady) throw new Error("Not authenticated");

      const response = await axiosAuth.patch(CHAT_API.updateChat(chatId), {
        title,
      });
      return response.data;
    },
    onSuccess: (updatedChat) => {
      // Update chats list
      queryClient.setQueryData(["chats"], (oldChats: Chat[] = []) =>
        oldChats.map((chat) =>
          chat.id === updatedChat.id
            ? { ...chat, title: updatedChat.title }
            : chat
        )
      );

      // Update cached chat
      queryClient.setQueryData(["chat", updatedChat.id], updatedChat);

      toast.success("Đã cập nhật tiêu đề");
    },
    onError: (error) => {
      console.error("Error updating title:", error);
      toast.error("Không thể cập nhật tiêu đề");
    },
  });

  // Delete chat mutation
  const deleteChatMutation = useMutation({
    mutationFn: async (chatId: string): Promise<void> => {
      if (!isReady) throw new Error("Not authenticated");

      await axiosAuth.delete(CHAT_API.deleteChat(chatId));
    },
    onSuccess: (_, chatId) => {
      // Remove from chats list
      queryClient.setQueryData(["chats"], (oldChats: Chat[] = []) =>
        oldChats.filter((chat) => chat.id !== chatId)
      );

      // Remove cached chat
      queryClient.removeQueries({ queryKey: ["chat", chatId] });

      toast.success("Đã xóa cuộc trò chuyện");
    },
    onError: (error) => {
      console.error("Error deleting chat:", error);
      toast.error("Không thể xóa cuộc trò chuyện");
    },
  });

  // Add message mutation
  const addMessageMutation = useMutation({
    mutationFn: async ({
      chatId,
      message,
    }: AddMessageRequest): Promise<ChatMessage> => {
      if (!isReady) throw new Error("Not authenticated");
      const body: any = {
        content: message.content,
        sender_type: message.sender_type,
        message_type: message.message_type,
      };
      if (message.attachments) {
        body.attachments = message.attachments.map((attachment) => ({
          file_name: attachment.file_name,
          file_type: attachment.file_type,
          file_size: attachment.file_size,
          file_path: attachment.file_url,
        }));
      }
      if (message.model_id) {
        body.model_id = message.model_id;
      }
      const response = await axiosAuth.post(CHAT_API.addMessage(chatId), body);
      return response.data;
    },
    onSuccess: (newMessage, { chatId }) => {
      // Update cached chat
      queryClient.setQueryData(["chats"], (oldChats: Chat[] = []) => {
        return oldChats.map((chat) => {
          if (chat.id === chatId) {
            return {
              ...chat,
              messages: [...(chat.messages || []), newMessage],
            };
          }
          return chat;
        });
      });
    },
    onError: (error) => {
      console.error("Error adding message:", error);
      toast.error("Không thể gửi tin nhắn");
    },
  });

  return {
    // Data
    chats,
    // Chỉ trả về isLoadingChats từ useQuery, không kết hợp với isReady
    isFetchedChats,
    isLoadingChats,
    isErrorChats,
    chatsError,

    // Functions
    fetchChat,
    refetchChats,

    // Mutations
    createChat: createChatMutation.mutateAsync,
    updateTitle: updateTitleMutation.mutateAsync,
    deleteChat: deleteChatMutation.mutateAsync,
    addMessage: addMessageMutation.mutateAsync,

    // Loading states
    isCreatingChat: createChatMutation.isPending,
    isUpdatingTitle: updateTitleMutation.isPending,
    isDeletingChat: deleteChatMutation.isPending,
    isAddingMessage: addMessageMutation.isPending,

    // Thêm isReady để component có thể kiểm tra nếu cần
    isReady,
    hasBeenReady: hasBeenReadyRef.current,
  };
};
