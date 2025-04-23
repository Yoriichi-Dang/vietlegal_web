"use client";

import React, { useState, useRef } from "react";
import { Plus, Mic, ChevronUp } from "lucide-react";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";
import DropDownAnimation, { DropdownItem } from "./dropdown-animation";
import Image from "next/image";

export default function ChatInput() {
  const [inputValue, setInputValue] = useState("");
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const [model, setModel] = useState("model");
  const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setInputValue(e.target.value);

    // Auto-resize textarea
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (inputValue.trim()) {
      console.log("Submitting:", inputValue);
      setInputValue("");

      // Reset height
      if (textareaRef.current) {
        textareaRef.current.style.height = "auto";
      }
    }
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
      <div className="w-full bg-zinc-900 p-4 rounded-2xl ring-2 ring-zinc-700/50 max-w-3xl mx-auto shadow-2xl">
        {/* Form with textarea */}
        <form onSubmit={handleSubmit}>
          <textarea
            ref={textareaRef}
            value={inputValue}
            onChange={handleInputChange}
            placeholder="Enter your message here..."
            className={cn(
              "w-full bg-zinc-800 border-0 rounded-2xl px-4 py-3 resize-none",
              "text-white placeholder-zinc-400",
              "focus:outline-none focus:ring-0",
              "min-h-[44px] max-h-[200px]"
            )}
            rows={1}
          />

          {/* Buttons row */}
          <div className="flex items-center mt-2 justify-between">
            <div className="flex items-center gap-2">
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
              {/* Microphone button */}
              <motion.button
                type="button"
                whileTap={{ scale: 0.95 }}
                className={cn(
                  "p-2 rounded-full bg-zinc-800 text-zinc-400",
                  "hover:bg-zinc-700 transition-colors"
                )}
              >
                <Mic size={18} />
              </motion.button>

              {/* Up arrow button - active only when there is input */}
              <motion.button
                type="submit"
                disabled={!inputValue.trim()}
                whileTap={inputValue.trim() ? { scale: 0.95 } : {}}
                className={cn(
                  "p-2 rounded-full transition-colors",
                  inputValue.trim()
                    ? "bg-primary text-white hover:bg-primary/90"
                    : "bg-zinc-800 text-zinc-500 cursor-not-allowed"
                )}
              >
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
              </motion.button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
