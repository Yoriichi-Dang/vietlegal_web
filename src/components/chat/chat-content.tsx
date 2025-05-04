"use client";
import ChatInput from "@/components/chat/chat-input";
import HeaderAvatar from "@/components/chat/header-avatar";
import Sidebar from "@/components/chat/sidebar";
import React, { useEffect, useRef, useState } from "react";
import ChatContainerAnimated from "@/components/chat/chat-container-animated";
import { useConversation } from "@/provider/conversation-provider";
import { motion, AnimatePresence } from "framer-motion";
import { useSession } from "next-auth/react";
import { usePathname } from "next/navigation";
import { useChatState } from "@/hooks/useChatState";

// Create a chat component that will consume the conversation context
const ChatContent = () => {
  const {
    messages: conversationMessages,
    activeConversation,
    sendMessage,
  } = useConversation();

  // Ref for the scrollable container
  const { data: session, status: sessionStatus } = useSession();
  const chatScrollRef = useRef<HTMLDivElement>(null);
  const [prevMessagesLength, setPrevMessagesLength] = useState(0);
  const [inputValue, setInputValue] = useState(""); // Để theo dõi giá trị input
  const [isLoading, setIsLoading] = useState(true); // State cho loading indicator
  const [isTypingComplete, setIsTypingComplete] = useState(true); // State để kiểm tra nếu đã hoàn tất hiệu ứng đánh máy
  const pathname = usePathname(); // Lấy path hiện tại

  // Sử dụng hook useChatState thay vì state cục bộ
  const { hasSubmittedFirstMessage, setHasSubmittedFirstMessage } =
    useChatState();

  // Kiểm tra xem có phải là cuộc trò chuyện mới không
  const isNewConversation =
    !activeConversation?.title ||
    activeConversation.title === "New Conversation" ||
    conversationMessages.length === 0;

  // Thêm useEffect để theo dõi khi conversationMessages thay đổi và cập nhật URL
  useEffect(() => {
    // Chỉ thực hiện khi có activeConversation và có id
    if (
      activeConversation?.id &&
      pathname === "/new" &&
      conversationMessages.length > 0
    ) {
      // Thay đổi URL mà không gây reload trang
      const newUrl = `/c/${activeConversation.id}`;
      window.history.pushState(
        { ...window.history.state, as: newUrl, url: newUrl },
        "",
        newUrl
      );
    }
  }, [activeConversation?.id, conversationMessages.length, pathname]);

  // Thiết lập loading
  useEffect(() => {
    // Đảm bảo tất cả component đã load xong
    let timeoutId: NodeJS.Timeout;

    if (sessionStatus !== "loading") {
      // Sử dụng thời gian tối thiểu để đảm bảo các component đã render
      timeoutId = setTimeout(() => {
        setIsLoading(false);
      }, 100); // Giảm thời gian chờ
    }

    return () => {
      if (timeoutId) clearTimeout(timeoutId);
    };
  }, [sessionStatus]);

  // Smooth scroll function using Web Animation API
  const scrollToBottom = () => {
    if (chatScrollRef.current) {
      const scrollElement = chatScrollRef.current;
      const scrollHeight = scrollElement.scrollHeight;

      // Using the Web Animation API for smooth scrolling
      scrollElement.animate(
        [{ scrollTop: scrollElement.scrollTop }, { scrollTop: scrollHeight }],
        {
          duration: 600, // Duration in milliseconds
          easing: "cubic-bezier(0.45, 0, 0.55, 1)", // Smooth easing function
          fill: "forwards",
        }
      );
    }
  };

  // Scroll to bottom when messages change (new message added)
  useEffect(() => {
    // Check if messages actually increased (a new message was added)
    if (conversationMessages.length > prevMessagesLength) {
      // Đánh dấu đã gửi tin nhắn đầu tiên
      if (!hasSubmittedFirstMessage && conversationMessages.length > 0) {
        setHasSubmittedFirstMessage(true);
      }

      // Set a small timeout to ensure DOM has updated
      setTimeout(scrollToBottom, 100);
      setPrevMessagesLength(conversationMessages.length);
    }
  }, [
    conversationMessages.length,
    prevMessagesLength,
    hasSubmittedFirstMessage,
  ]);

  // Xử lý khi hiệu ứng đánh máy hoàn tất
  const handleTypingComplete = () => {
    setIsTypingComplete(true);
  };

  // Xử lý gửi tin nhắn
  const handleSubmit = async (inputMsg: string) => {
    if (!inputMsg.trim() || !isTypingComplete) return;

    // Set state đã gửi tin nhắn đầu tiên
    setHasSubmittedFirstMessage(true);

    // Đặt trạng thái đang hiển thị hiệu ứng
    setIsTypingComplete(false);

    try {
      // Gửi tin nhắn trực tiếp, để hàm sendMessage xử lý việc tạo conversation nếu cần
      console.log("Sending message:", inputMsg);
      await sendMessage(inputMsg);
      setInputValue("");
    } catch (error) {
      console.error("Error sending message:", error);
      setIsTypingComplete(true);
    }
  };

  // Hiển thị loading spinner khi đang tải
  if (isLoading) {
    return (
      <div className="w-full h-screen flex items-center justify-center bg-white dark:bg-zinc-900">
        <div className="flex flex-col items-center">
          <div className="w-16 h-16 border-4 border-primary/30 border-t-primary rounded-full animate-spin"></div>
          <p className="mt-4 text-muted-foreground">Đang tải...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full h-screen flex relative overflow-hidden">
      <Sidebar />
      <main
        className="bg-white dark:bg-zinc-900 w-full h-full flex flex-col relative overflow-auto"
        ref={chatScrollRef}
      >
        {/* Hiển thị các tin nhắn khi đã có, hoặc sau khi gửi tin nhắn đầu tiên */}
        <AnimatePresence>
          {(conversationMessages.length > 0 || hasSubmittedFirstMessage) && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex-1 overflow-hidden relative"
            >
              <ChatContainerAnimated
                messages={conversationMessages}
                typingSpeed={20}
                onTypingComplete={handleTypingComplete}
              />
            </motion.div>
          )}
        </AnimatePresence>

        {/* Hiển thị ChatInput ở giữa màn hình khi chưa có tin nhắn */}
        <AnimatePresence>
          {isNewConversation && !hasSubmittedFirstMessage ? (
            <motion.div
              className="absolute top-0 left-0 right-0 bottom-0 flex flex-col items-center justify-center p-4"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 20 }}
              transition={{ duration: 0.5 }}
            >
              <motion.div
                className="mb-6 text-center"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2, duration: 0.5 }}
              >
                <h1 className="text-3xl font-bold mb-2 text-zinc-600 dark:text-white">
                  Xin chào {session && session?.user?.name}
                </h1>
                <p className="text-lg text-zinc-600 dark:text-white">
                  Hãy đặt câu hỏi để bắt đầu trò chuyện
                </p>
              </motion.div>

              <motion.div className="w-full max-w-2xl">
                <ChatInput
                  centered={true}
                  onSubmit={handleSubmit}
                  value={inputValue}
                  onChange={setInputValue}
                />
              </motion.div>
            </motion.div>
          ) : (
            <motion.div
              className="w-full md:px-32 px-6 z-10"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.3 }}
            >
              <div className="w-full bg-white dark:bg-zinc-900 pb-4 pt-2 mx-auto">
                <ChatInput
                  centered={false}
                  onSubmit={handleSubmit}
                  value={inputValue}
                  onChange={setInputValue}
                  disabled={!isTypingComplete}
                />
                {!isTypingComplete && (
                  <div className="text-center text-sm text-zinc-500 mt-2">
                    Đang hiển thị câu trả lời... Vui lòng đợi
                  </div>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </main>
      <HeaderAvatar />
    </div>
  );
};

export default ChatContent;
