"use client";
import { useConversation } from "@/provider/conversation-provider";
import { getConversationMessageApiUrl } from "@/utils/config";
import { useEffect } from "react";
import { useSession } from "next-auth/react";
import useAxiosAuth from "@/hooks/useAxiosAuth";

const useSaveMessagesOnUnload = () => {
  const { activeConversation } = useConversation();
  const { data: session } = useSession();
  const { isReady } = useAxiosAuth();

  useEffect(() => {
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      // Kiểm tra xem có tin nhắn cần lưu không và đã có session chưa
      if (
        isReady &&
        session?.user?.accessToken &&
        activeConversation &&
        activeConversation.messages &&
        activeConversation.messages.length > 0
      ) {
        const unsavedMessages = activeConversation.messages
          .filter((message) => message.is_saved === false)
          .map((message) => ({
            content: message.content,
            sender_type: message.sender_type,
            model_id: message.model_id || null,
            message_type: message.message_type,
            attachments: message.attachments || null,
          }));

        if (unsavedMessages && unsavedMessages.length > 0) {
          // Lấy URL từ cùng hàm getConversationMessageApiUrl
          const url = getConversationMessageApiUrl(
            activeConversation.id
          ).saveAllMessagesInConversation;

          // Chuẩn bị dữ liệu để gửi
          const data = {
            messages: unsavedMessages,
          };

          // Tạo blob từ dữ liệu
          const blob = new Blob([JSON.stringify(data)], {
            type: "application/json",
          });

          // Thêm token xác thực vào URL
          const urlWithToken = `${url}?token=${encodeURIComponent(
            session.user.accessToken
          )}`;

          // Sử dụng sendBeacon với blob
          const success = navigator.sendBeacon(urlWithToken, blob);

          console.log("SendBeacon result:", success ? "success" : "failed");

          // Lưu vào localStorage để phục hồi khi cần
          try {
            localStorage.setItem(
              `unsaved_messages_${activeConversation.id}`,
              JSON.stringify(unsavedMessages)
            );
          } catch (error) {
            console.error("Failed to save messages to localStorage", error);
          }
        }
      }
    };

    window.addEventListener("beforeunload", handleBeforeUnload);

    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload);
    };
  }, [activeConversation, isReady, session]);

  return null;
};

export default useSaveMessagesOnUnload;
