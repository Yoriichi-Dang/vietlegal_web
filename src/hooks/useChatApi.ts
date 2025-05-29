import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
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

  // Fetch all chats
  const {
    data: chats = [],
    isLoading: isLoadingChats,
    error: chatsError,
    refetch: refetchChats,
  } = useQuery({
    queryKey: ["chats"],
    queryFn: async (): Promise<Chat[]> => {
      if (!isReady) return [];
      const response = await axiosAuth.get(CHAT_API.getChatIncludeMessages);
      return response.data;
    },
    enabled: isReady,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });

  // Fetch specific chat
  const fetchChat = async (chatId: string): Promise<Chat | null> => {
    if (!isReady || !chatId) return null;

    try {
      const response = await axiosAuth.get(CHAT_API.getChat(chatId));
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
      // Update the chats list
      queryClient.setQueryData(["chats"], (oldChats: Chat[] = []) => [
        newChat,
        ...oldChats,
      ]);

      // Cache the new chat
      queryClient.setQueryData(["chat", newChat.id], newChat);

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
      isFirstMessage,
    }: AddMessageRequest): Promise<ChatMessage> => {
      if (!isReady) throw new Error("Not authenticated");
      const response = await axiosAuth.post(CHAT_API.addMessage(chatId), {
        message: message,
        isFirstMessage: isFirstMessage,
      });
      return response.data;
    },
    onSuccess: (newMessage, { chatId }) => {
      // Update cached chat
      queryClient.setQueryData(
        ["chat", chatId],
        (oldChat: Chat | undefined) => {
          if (!oldChat) return oldChat;

          return {
            ...oldChat,
            messages: [...oldChat.messages, newMessage],
            updatedAt: new Date(),
          };
        }
      );

      // Update chats list with new updatedAt
      queryClient.setQueryData(["chats"], (oldChats: Chat[] = []) =>
        oldChats.map((chat) =>
          chat.id === chatId ? { ...chat, updatedAt: new Date() } : chat
        )
      );
    },
    onError: (error) => {
      console.error("Error adding message:", error);
      toast.error("Không thể gửi tin nhắn");
    },
  });

  return {
    // Data
    chats,
    isLoadingChats,
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
  };
};
