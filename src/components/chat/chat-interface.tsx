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
import { IconMenu2, IconSparkles } from "@tabler/icons-react";

interface ChatInterfaceProps {
  onToggleSidebar: () => void;
  showMenuButton?: boolean;
}

export const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB

export default function ChatInterface({
  onToggleSidebar,
  showMenuButton = true,
}: ChatInterfaceProps) {
  const [attachedFiles, setAttachedFiles] = useState<ChatAttachment[]>([]);

  // State để lưu research content từ agent
  const [researchContent, setResearchContent] = useState<string>("");
  const [isSearching, setIsSearching] = useState(false); //search data
  const [isCompletedSearching, setIsCompletedSearching] = useState(false); //completed searching
  const [isResearchStreaming, setIsResearchStreaming] = useState(false);
  const [completeResearchStream, setCompleteResearchStream] = useState(false);
  const [showResearchPanel, setShowResearchPanel] = useState(false);
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
  const [dataLength, setDataLength] = useState(0);
  const [searchesResult, setSearchesResult] = useState<any[]>([]);

  const { messages, status, input, handleInputChange, handleSubmit, data } =
    useChatAI({
      experimental_throttle: 130,
      streamProtocol: "data",
      api: "http://localhost:8000/chat/stream",
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
      onError: (err) => {
        toast.error(`Error during chat: ${err.message}`);
        setIsResearchStreaming(false);
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

  // Xử lý data stream từ FastAPI
  useEffect(() => {
    if (data && Array.isArray(data) && data.length > 0) {
      const newDatas: any[] = data.slice(dataLength);
      if (newDatas.length > 0) {
        setDataLength(data.length);
        newDatas.forEach((newData) => {
          if (newData.type === "tool_call") {
            if (newData.toolName === "start_search") {
              setIsSearching(true);
            } else if (newData.toolName === "complete_search") {
              setSearchesResult(newData.data);
              setIsSearching(false);
              setIsCompletedSearching(true);
            }
          } else if (newData.type === "agent_update") {
            if (
              newData.agent_send_to === "researcher_agent" &&
              newData.action === "transfer_to_researcher_agent"
            ) {
              if (!isResearchStreaming) {
                setIsCompletedSearching(false);
                setIsResearchStreaming(true);
              }
              setResearchContent((prev) => prev + newData.content);
            } else if (
              newData.agent_send_to === "supervisor_agent" &&
              newData.action === "write_report"
            ) {
              setIsResearchStreaming(false);
              setCompleteResearchStream(true);
            }
          }
        });
      }
    }
  }, [
    data,
    dataLength,
    isResearchStreaming,
    isCompletedSearching,
    isSearching,
  ]);

  // Reset khi bắt đầu chat mới
  useEffect(() => {
    if (status === "submitted") {
      setResearchContent("");
      setSearchesResult([]);
      setIsResearchStreaming(false);
      setCompleteResearchStream(false); // Reset to false when starting new request
    }
  }, [status]);

  // Stop streaming when status changes from streaming to ready
  useEffect(() => {
    if (status === "ready" && isResearchStreaming) {
      setIsResearchStreaming(false);
    }
  }, [status, isResearchStreaming]);

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

  const convertToAIAttachments = (
    chatAttachments: ChatAttachment[]
  ): Attachment[] => {
    return chatAttachments
      .filter((file) => file.file_url)
      .map((file) => ({
        name: file.file_name,
        contentType: file.file_type,
        url: file.file_url!,
      }));
  };

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (input.trim() === "") {
      toast.error("Vui lòng nhập tin nhắn ");
      return;
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
        question: input.trim(),
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

        <div className="hidden md:flex flex-1 justify-center">
          {currentChat && (
            <div className="text-neutral-300 font-medium flex items-center gap-2">
              {currentChat.title}
            </div>
          )}
        </div>

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

      {/* Main Content Area */}
      <div className="flex flex-1 overflow-hidden">
        {/* Chat Messages Area */}
        <div
          className={`flex flex-col transition-all duration-300 ${
            isResearchStreaming ? "w-[50%]" : "w-full"
          }`}
        >
          <ChatContent
            messages={messages || []}
            isLoading={status === "submitted" || status === "streaming"}
            isStreaming={completeResearchStream}
          />

          {(isSearching || isCompletedSearching || isResearchStreaming) && (
            <div className="px-4 md:px-6 pb-4">
              <div className="max-w-4xl mx-auto">
                <ThinkingAnimation
                  isVisible={
                    isSearching || isCompletedSearching || isResearchStreaming
                  }
                  isSearching={isSearching}
                  isCompletedSearching={isCompletedSearching}
                  isTransferToResearcher={isResearchStreaming}
                />
              </div>
            </div>
          )}

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
          isOpen={isResearchStreaming || showResearchPanel}
          onClose={() => setShowResearchPanel(false)}
          title={
            isResearchStreaming
              ? "Research Agent (Streaming...)"
              : "Research Panel"
          }
          sources={searchesResult.map((search) => ({
            title: search.title,
            url: search.url,
            status: "completed",
          }))}
          markdownContent={researchContent}
        />
      </div>
    </div>
  );
}
