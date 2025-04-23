"use client";

import React, { useState, useRef, KeyboardEvent } from "react";
import { Plus, ChevronUp } from "lucide-react";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";
import DropDownAnimation, { DropdownItem } from "./dropdown-animation";
import Image from "next/image";

export default function ChatInput() {
  const [inputValue, setInputValue] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const [model, setModel] = useState("model");

  const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const value = e.target.value;
    setInputValue(value);

    // Reset error message khi người dùng tiếp tục nhập
    if (submitError) {
      setSubmitError(null);
    }

    // Auto-resize textarea
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputValue.trim() || isSubmitting) return;

    setIsSubmitting(true);
    setSubmitError(null);

    try {
      const messageData = {
        message: inputValue,
        model: model,
        timestamp: new Date().toISOString(),
      };

      const response = await fetch("/api/message", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(messageData),
      });

      // Kiểm tra content-type trước khi parse JSON
      const contentType = response.headers.get("content-type");

      if (!response.ok) {
        // Xử lý theo content-type
        if (contentType && contentType.includes("application/json")) {
          const errorData = await response.json();
          throw new Error(
            errorData.message || "Có lỗi xảy ra khi gửi tin nhắn"
          );
        } else {
          // Nếu không phải JSON, lấy text
          const errorText = await response.text();
          console.error("Server response:", errorText);
          throw new Error(
            `Lỗi HTTP ${response.status}: Vui lòng kiểm tra console để biết thêm chi tiết`
          );
        }
      }
      const result = await response.json();
      console.log(result.response); // "Hello! How can I help you today?"
      console.log(result.status); // "success"
      console.log(result.timestamp); // "2025-04-23T15:43:25.444Z"
      // Reset form
      setInputValue("");
      if (textareaRef.current) {
        textareaRef.current.style.height = "auto";
      }
    } catch (error) {
      console.error("Lỗi gửi tin nhắn:", error);
      setSubmitError(
        error instanceof Error
          ? error.message
          : "Có lỗi xảy ra khi gửi tin nhắn"
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  // Xử lý sự kiện nhấn phím
  const handleKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    // Nếu nhấn Enter và không giữ Shift
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault(); // Ngăn không cho xuống dòng mặc định
      handleSubmit(e); // Gọi hàm submit
    }
    // Nếu nhấn Shift+Enter thì sẽ xuống dòng bình thường (không cần xử lý gì thêm)
  };

  const toolItems: DropdownItem[] = [
    {
      id: "google-drive",
      name: "Connect to Google Drive",
      icon: (
        <svg
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M12 14L11.2929 14.7071L12 15.4142L12.7071 14.7071L12 14ZM12 4L12 14L13 14L13 4L12 4Z"
            fill="#4285F4"
          />
          <path
            d="M8 9L12 5L16 9"
            stroke="#4285F4"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path
            d="M6 20H18"
            stroke="#4285F4"
            strokeWidth="2"
            strokeLinecap="round"
          />
        </svg>
      ),
      action: () => console.log("Connect to Google Drive clicked"),
    },
    {
      id: "onedrive",
      name: "Connect to Microsoft OneDrive",
      icon: (
        <svg
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M12 14L11.2929 14.7071L12 15.4142L12.7071 14.7071L12 14ZM12 4L12 14L13 14L13 4L12 4Z"
            fill="#0078D4"
          />
          <path
            d="M8 9L12 5L16 9"
            stroke="#0078D4"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path
            d="M6 20H18"
            stroke="#0078D4"
            strokeWidth="2"
            strokeLinecap="round"
          />
        </svg>
      ),
      action: () => console.log("Connect to Microsoft OneDrive clicked"),
      leftIcon: (
        <svg
          width="16"
          height="16"
          viewBox="0 0 24 24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M9 18L15 12L9 6"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      ),
    },
    {
      id: "upload",
      name: "Upload from computer",
      icon: (
        <svg
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M12 14L11.2929 14.7071L12 15.4142L12.7071 14.7071L12 14ZM12 4L12 14L13 14L13 4L12 4Z"
            fill="#6B7280"
          />
          <path
            d="M8 9L12 5L16 9"
            stroke="#6B7280"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path
            d="M6 20H18"
            stroke="#6B7280"
            strokeWidth="2"
            strokeLinecap="round"
          />
        </svg>
      ),
      action: () => console.log("Upload from computer clicked"),
    },
  ];
  // Define model dropdown items
  const modelItems: DropdownItem[] = [
    {
      id: "gemma",
      name: "Gemma",
      icon: (
        <Image
          src="https://registry.npmmirror.com/@lobehub/icons-static-png/latest/files/dark/gemma-color.png"
          alt="GPT-4"
          width={25}
          height={25}
        />
      ),
      action: () => setModel("gemma"),
    },
    {
      id: "llama",
      name: "Llama",
      icon: (
        <Image
          src="https://static.vecteezy.com/system/resources/thumbnails/002/589/005/small/cute-llama-wild-animal-line-style-icon-free-vector.jpg"
          alt="Llama"
          width={25}
          height={25}
        />
      ),
      action: () => setModel("llama"),
    },
  ];

  return (
    <div className="w-full px-4 py-2">
      <div className="w-full bg-white dark:bg-zinc-900 p-4 rounded-3xl ring-2 ring-zinc-100 dark:ring-zinc-700/50 mx-auto shadow-2xl">
        {/* Form with textarea */}
        <form onSubmit={handleSubmit}>
          <div className="relative">
            <textarea
              ref={textareaRef}
              value={inputValue}
              onChange={handleInputChange}
              onKeyDown={handleKeyDown}
              placeholder="Enter your message here... (Press Enter to send, Shift+Enter for new line)"
              className={cn(
                "w-full border-0 rounded-2xl px-4 py-3 resize-none",
                "dark:text-white text-black placeholder-zinc-400",
                "focus:outline-none focus:ring-0",
                "min-h-[44px] max-h-[200px]"
              )}
              rows={1}
              disabled={isSubmitting}
            />

            {/* Hiển thị thông báo lỗi nếu có */}
            {submitError && (
              <div className="absolute -top-6 left-0 text-xs text-red-500">
                {submitError}
              </div>
            )}
          </div>

          {/* Buttons row */}
          <div className="flex items-center mt-2 justify-between">
            <div className="flex items-center gap-3">
              {/* Plus button with dropdown */}
              <DropDownAnimation
                items={toolItems}
                className="min-w-[280px]"
                itemClassName="transition-colors duration-150"
                titleIcon={<Plus size={18} />}
              />

              <DropDownAnimation
                items={modelItems}
                className="w-52"
                containerClassName="space-y-1"
                itemClassName="hover:bg-zinc-700/50"
                title={model}
                titleIcon={<ChevronUp size={18} />}
              />
            </div>

            <div className="flex items-center gap-1">
              <motion.button
                type="submit"
                disabled={!inputValue.trim() || isSubmitting}
                whileTap={
                  inputValue.trim() && !isSubmitting ? { scale: 0.95 } : {}
                }
                className={cn(
                  "p-3 rounded-full transition-colors relative",
                  inputValue.trim() && !isSubmitting
                    ? "bg-primary text-white hover:bg-primary/90"
                    : "dark:bg-zinc-800 bg-zinc-100 text-zinc-500 cursor-not-allowed"
                )}
              >
                {isSubmitting ? (
                  <span className="block w-5 h-5 border-2 border-t-transparent border-white rounded-full animate-spin"></span>
                ) : (
                  <svg
                    width="18"
                    height="18"
                    viewBox="0 0 24 24"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M12 19V5M12 5L5 12M12 5L19 12"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                )}
              </motion.button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
