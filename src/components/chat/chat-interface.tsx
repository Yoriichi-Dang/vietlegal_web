"use client";

import type React from "react";
import { useEffect, useRef, useState } from "react";
import { motion } from "motion/react";
import UserAvatarMenu from "./user-avatar-menu";
import ChatInput from "./chat-input";
import ChatContent from "./chat-content";
import ResearchPanel from "./research-panel";
import ThinkingAnimation from "./thinking-animation";
import { toast } from "sonner";
import type { ChatAttachment, ChatMessage } from "@/types/chat";
import { useChat as useChatProvider } from "@/provider/chat-provider";
import { useChat as useChatAI } from "@ai-sdk/react";
import { MODEL } from "@/constants/model";
import { Attachment } from "ai";
import { v4 as uuidv4 } from "uuid";
import { IconSparkles, IconMenu2 } from "@tabler/icons-react";
interface ChatInterfaceProps {
  onToggleSidebar: () => void;
  showMenuButton?: boolean;
}

export const MAX_FILE_SIZE = 5 * 1024 * 1024; // 10MB

export default function ChatInterface({
  onToggleSidebar,
  showMenuButton = true,
}: ChatInterfaceProps) {
  const [attachedFiles, setAttachedFiles] = useState<ChatAttachment[]>([]);
  const [showResearchPanel, setShowResearchPanel] = useState(false);
  const [showThinking, setShowThinking] = useState(false);
  const {
    addMessage,
    currentChat,
    isAddingMessage,
    updateChatTitle,
    createNewChat,
  } = useChatProvider();
  const [isFirstMessageNewChat, setIsFirstMessageNewChat] =
    useState<boolean>(false);
  const [newChatId, setNewChatId] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);
  const chatContainerRef = useRef<HTMLDivElement>(null);
  const [isUploading, setIsUploading] = useState(false);
  const { messages, status, input, handleInputChange, handleSubmit } =
    useChatAI({
      initialMessages:
        (currentChat &&
          currentChat?.messages?.map((message) => {
            const attachments: Attachment[] | undefined =
              message.attachments?.map((attachment: any) => {
                return {
                  name: attachment.file_name,
                  contentType: attachment.file_type,
                  url: attachment.file_path as string,
                };
              });
            return {
              id: message.id!,
              role: message.sender_type === "user" ? "user" : "assistant",
              content: message.content || "",
              experimental_attachments: attachments,
            };
          })) ||
        [],
      onFinish: async (message) => {
        // Hide thinking animation
        setShowThinking(false);

        // Auto-show research panel after AI response for research queries
        if (shouldShowResearchPanel(message.content)) {
          setTimeout(() => setShowResearchPanel(true), 500);
        }

        if (!currentChat) {
          setMessage(message.content);
          return;
        }
        await addMessage(currentChat.id, {
          sender_type: "model",
          message_type: "text",
          model_id: MODEL.id.toString(),
          content: message.content,
        });
      },
    });
  useEffect(() => {
    if (isFirstMessageNewChat && newChatId && message) {
      addMessage(newChatId, {
        sender_type: "model",
        message_type: "text",
        model_id: MODEL.id.toString(),
        content: message,
      });
      setIsFirstMessageNewChat(false);
    }
  }, [isFirstMessageNewChat, newChatId, message, addMessage]);
  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (!files) return;
    setIsUploading(true);
    Array.from(files).forEach(async (file) => {
      const { fileUrl } = await uploadFile(file);
      const newFile: ChatAttachment = {
        id: uuidv4(),
        file_name: file.name,
        file_type: file.type,
        file_size: file.size,
        file_url: fileUrl,
      };
      setAttachedFiles((prev) => [...prev, newFile]);
      setIsUploading(false);
    });

    event.target.value = "";
  };
  const deleteFile = async (fileKey: string) => {
    try {
      const response = await fetch("/api/delete-file", {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ fileKey }),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error);
      }

      return result;
    } catch (error) {
      console.error("Delete error:", error);
      throw error;
    }
  };
  // Remove file
  const removeFile = async (fileId: string) => {
    const fileKey = attachedFiles
      .find((file) => file.id === fileId)
      ?.file_url?.split("/")
      .pop();
    if (fileKey) {
      setAttachedFiles((prev) => {
        const filtered = prev.filter((file) => file.id !== fileId);
        return filtered;
      });
      await deleteFile(fileKey);
      toast.success("File deleted successfully");
    }
  };
  const computeSHA256 = async (file: File) => {
    const buffer = await file.arrayBuffer();
    const hashBuffer = await crypto.subtle.digest("SHA-256", buffer);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    const hashHex = hashArray
      .map((b) => b.toString(16).padStart(2, "0"))
      .join("");
    return hashHex;
  };
  const uploadFile = async (file: File) => {
    const response = await fetch("/api/signed-url", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        fileType: file.type,
        fileSize: file.size,
        checksum: await computeSHA256(file),
        fileName: file.name,
      }),
    });
    const data = await response.json();

    if (!response.ok) {
      return { failure: data.failure };
    }
    await fetch(data.success.url, {
      method: "PUT",
      headers: {
        "Content-Type": file.type,
      },
      body: file,
    });
    const fileUrl = data.success.url.split("?")[0];
    return { fileUrl, id: data.success.id };
  };
  // Handle form submit
  // Helper function to convert ChatAttachment to Attachment
  const convertToAIAttachments = (
    chatAttachments: ChatAttachment[]
  ): Attachment[] => {
    return chatAttachments
      .filter((file) => file.file_url) // Only include files with valid URLs
      .map((file) => ({
        name: file.file_name,
        contentType: file.file_type,
        url: file.file_url!,
      }));
  };

  // Check if message should trigger research panel
  const shouldShowResearchPanel = (message: string) => {
    const researchKeywords = [
      "nghiên cứu",
      "research",
      "tìm hiểu",
      "phân tích",
      "điều tra",
      "luật",
      "quy định",
      "văn bản",
      "pháp luật",
      "thuế",
      "báo cáo",
      "tổng hợp",
      "thống kê",
      "dữ liệu",
      "bảo hiểm",
      "so sánh",
      "đánh giá",
      "xu hướng",
      "thị trường",
      "chính sách",
    ];
    const messageLower = message.toLowerCase();
    return researchKeywords.some((keyword) => messageLower.includes(keyword));
  };

  // Handle form submit
  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (input.trim() === "") {
      toast.error("Vui lòng nhập tin nhắn ");
      return;
    }

    // Auto-show thinking animation for relevant queries
    if (shouldShowResearchPanel(input.trim())) {
      setShowThinking(true);
    }

    const userMessage: ChatMessage = {
      sender_type: "user",
      message_type: "text",
      content: input.trim(),
      attachments: attachedFiles,
    };
    const aiAttachments = convertToAIAttachments(attachedFiles);
    const submitOptions: any = {
      body: {
        chat_id: currentChat?.id || "",
        files: attachedFiles.map((file) => ({
          file_id: file.id,
          file_url: file.file_url!,
        })),
      },
    };
    if (aiAttachments.length > 0) {
      submitOptions.experimental_attachments = aiAttachments;
    }
    handleSubmit(e, submitOptions);
    try {
      if (currentChat) {
        if (!currentChat.messages) {
          await updateChatTitle(
            currentChat?.id || "",
            input.trim().slice(0, 20)
          );
        }
        await addMessage(currentChat?.id || "", userMessage);
      } else {
        // new chat
        const newChat = await createNewChat({
          title: input.trim().slice(0, 20),
        });
        if (newChat) {
          setIsFirstMessageNewChat(true);
          window.history.replaceState({}, "", `/c/${newChat.id}`);
          await addMessage(newChat.id, userMessage);
          setNewChatId(newChat.id);
        }
      }
      //   // // Submit with options
      //   if (!currentChat) {
      //     const newChat = await createNewChat({
      //       title: input.trim().slice(0, 20),
      //     });
      //     if (newChat) {
      //       window.history.replaceState({}, "", `/c/${newChat.id}`);
      //       await addMessage(newChat.id, userMessage);
      //       handleSubmit(e, submitOptions);
      //     }
      //   } else {
      //     handleSubmit(e, submitOptions);
      //     await addMessage(currentChat?.id || "", userMessage);
      //   }
      if (attachedFiles.length > 0) setAttachedFiles([]);
    } catch (error) {
      console.error("Error sending message:", error);
      toast.error("Không thể gửi tin nhắn");
    }
  };

  return (
    <div
      ref={chatContainerRef}
      className="flex flex-col h-full bg-neutral-900 w-full"
    >
      {/* Header */}
      <div className="flex items-center justify-between p-4 md:p-6 pb-4">
        {/* Left side - Menu button (only on mobile) */}
        {showMenuButton && (
          <motion.button
            onClick={onToggleSidebar}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="p-2 text-neutral-400 hover:text-white hover:bg-neutral-800 rounded-lg transition-all duration-200 md:hidden"
          >
            <IconMenu2 className="h-6 w-6" />
          </motion.button>
        )}

        {/* Center - Chat title */}
        <div className="hidden md:flex flex-1 justify-center">
          {currentChat && (
            <div className="text-neutral-300 font-medium">
              {currentChat.title}
            </div>
          )}
        </div>

        {/* Right side - Controls */}
        <div className="flex items-center gap-3 text-neutral-400">
          {/* Research Panel Toggle Button */}
          <motion.button
            onClick={() => setShowResearchPanel(!showResearchPanel)}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className={`p-2 rounded-lg transition-all duration-200 ${
              showResearchPanel
                ? "text-blue-400 bg-blue-500/20"
                : "text-neutral-400 hover:text-white hover:bg-neutral-800"
            }`}
            title="Toggle Research Panel"
          >
            <IconSparkles className="h-5 w-5" />
          </motion.button>

          <UserAvatarMenu />
        </div>
      </div>

      {/* Main Content Area - Chat + Sidebar */}
      <div className="flex flex-1 overflow-hidden">
        {/* Chat Messages Area */}
        <div
          className={`flex flex-col transition-all duration-300 ${
            showResearchPanel ? "w-[50%]" : "w-full"
          }`}
        >
          <ChatContent
            messages={messages || []}
            isLoading={status === "submitted"}
            isStreaming={status === "streaming"}
          />

          {/* Thinking Animation */}
          {showThinking && (
            <div className="px-4 md:px-6 pb-4">
              <div className="max-w-4xl mx-auto">
                <ThinkingAnimation
                  isVisible={showThinking}
                  onComplete={() => {
                    setShowThinking(false);
                    setTimeout(() => setShowResearchPanel(true), 500);
                  }}
                />
              </div>
            </div>
          )}

          {/* Input Area - Inside Chat Area */}

          <ChatInput
            onSubmit={onSubmit}
            attachedFiles={attachedFiles}
            handleFileUpload={handleFileUpload}
            handleInputChange={handleInputChange}
            isLoading={status === "submitted" || isAddingMessage || isUploading}
            input={input}
            removeFile={removeFile}
          />
        </div>

        {/* Research Panel */}
        <ResearchPanel
          isOpen={showResearchPanel}
          onClose={() => setShowResearchPanel(false)}
          title="Tổng hợp về bảo hiểm"
          showSourcesUsed={true}
          showTable={true}
          markdownContent={`
## Tổng quan về thị trường bảo hiểm Việt Nam

### A. Định nghĩa và vai trò của bảo hiểm trong nền kinh tế

Bảo hiểm, trong bối cảnh kinh tế Việt Nam, được định nghĩa là một hoạt động kinh doanh cốt lõi nhằm gia định và đa dạng hóa rủi ro. Mô hình này hoạt động dựa trên nguyên tắc tập hợp rủi ro từ các cá nhân hoặc tổ chức riêng lẻ và phân phối lại chúng trên một danh mục đầu tư lớn hơn, qua đó giảm thiểu tác động của các sự kiện bất ngờ đối với từng chủ thể.

### B. Phân loại các loại hình bảo hiểm tại Việt Nam

Hệ thống bảo hiểm tại Việt Nam được cấu trúc một cách chặt chẽ, phân chia thành hai loại hình chính để đáp ứng các nhu cầu khác nhau:

1. **Bảo hiểm nhân thọ**: Tập trung vào việc bảo vệ tính mạng và sức khỏe con người
2. **Bảo hiểm phi nhân thọ**: Bao gồm bảo hiểm tài sản, trách nhiệm dân sự, và các rủi ro khác

### C. Thách thức và cơ hội của ngành bảo hiểm

Thị trường bảo hiểm Việt Nam, mặc dù có tiềm năng lớn, đang phải đối mặt với nhiều thách thức đáng kể, đồng thời cũng mở ra những cơ hội phát triển mới.
          `}
        />
      </div>
    </div>
  );
}
