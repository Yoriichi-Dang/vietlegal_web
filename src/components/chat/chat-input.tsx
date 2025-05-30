"use client";

import type React from "react";
import { useRef } from "react";
import {
  IconPaperclip,
  IconSend,
  IconX,
  IconFile,
  IconPhoto,
  IconFileText,
  IconVideo,
} from "@tabler/icons-react";
import { motion, AnimatePresence } from "motion/react";

export interface AttachedFile {
  id: string;
  name: string;
  type: string;
  size: number;
  url: string;
}

const formatFileSize = (bytes: number) => {
  if (bytes === 0) return "0 Bytes";
  const k = 1024;
  const sizes = ["Bytes", "KB", "MB", "GB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return (
    Number.parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i]
  );
};

const getFileIcon = (type: string) => {
  if (type.startsWith("image/")) return <IconPhoto className="h-4 w-4" />;
  if (type.startsWith("video/")) return <IconVideo className="h-4 w-4" />;
  if (type.includes("pdf") || type.includes("document"))
    return <IconFileText className="h-4 w-4" />;
  return <IconFile className="h-4 w-4" />;
};

type Props = {
  onSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
  attachedFiles: AttachedFile[];
  handleFileUpload: (event: React.ChangeEvent<HTMLInputElement>) => void;
  handleInputChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  isLoading: boolean;
  input: string;
  removeFile: (fileId: string) => void;
};

const ChatInput = ({
  onSubmit,
  attachedFiles,
  handleFileUpload,
  handleInputChange,
  isLoading,
  input,
  removeFile,
}: Props) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  return (
    <div className="px-4 md:px-6 pb-4 md:pb-6">
      <div className="max-w-4xl mx-auto">
        {/* Attached Files */}
        <AnimatePresence>
          {attachedFiles.length > 0 && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="mb-3 md:mb-4 flex flex-wrap gap-2"
            >
              {attachedFiles.map((file) => (
                <motion.div
                  key={file.id}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.8 }}
                  className="flex items-center gap-2 bg-gradient-to-r from-neutral-800 to-neutral-700 rounded-xl px-3 md:px-4 py-2 text-sm border border-neutral-600 shadow-lg"
                >
                  <div className="text-blue-400">{getFileIcon(file.type)}</div>
                  <span className="text-neutral-200 max-w-[100px] md:max-w-[150px] truncate font-medium">
                    {file.name}
                  </span>
                  <span className="text-neutral-400 text-xs">
                    ({formatFileSize(file.size)})
                  </span>
                  <button
                    onClick={() => removeFile(file.id)}
                    className="text-neutral-400 hover:text-red-400 transition-colors ml-1 hover:scale-110 transform"
                  >
                    <IconX className="h-4 w-4" />
                  </button>
                </motion.div>
              ))}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Enhanced Input Form */}
        <form onSubmit={onSubmit} className="relative">
          <div className="relative bg-gradient-to-r from-neutral-800/80 to-neutral-700/80 backdrop-blur-xl rounded-2xl border border-neutral-600/50 shadow-2xl overflow-hidden">
            {/* Animated border gradient */}
            <div className="absolute inset-0 bg-gradient-to-r from-blue-500/20 via-purple-500/20 to-blue-500/20 opacity-0 hover:opacity-100 transition-opacity duration-500 pointer-events-none" />

            <div className="relative flex items-center p-1 md:p-2">
              {/* Left Actions */}
              <div className="flex items-center gap-1 pl-1 md:pl-2">
                <input
                  ref={fileInputRef}
                  type="file"
                  multiple
                  onChange={handleFileUpload}
                  className="hidden"
                  accept="image/*,video/*,.pdf,.doc,.docx,.txt"
                />
                <motion.button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="p-2 md:p-3 text-neutral-400 hover:text-blue-400 transition-all duration-200 rounded-xl hover:bg-neutral-700/50 group relative overflow-hidden"
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-blue-500/10 to-purple-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-200" />
                  <IconPaperclip className="h-4 w-4 md:h-5 md:w-5 relative z-10" />
                </motion.button>
              </div>

              {/* Input Field */}
              <div className="flex-1 relative mx-2 md:mx-3">
                <input
                  value={input}
                  onChange={handleInputChange}
                  placeholder="Ask me something..."
                  disabled={isLoading}
                  className="w-full bg-transparent text-neutral-100 placeholder-neutral-400 py-3 md:py-4 px-2 md:px-4 focus:outline-none text-sm md:text-base font-medium disabled:opacity-70 transition-opacity"
                  onKeyDown={(e) => {
                    if (e.key === "Enter" && !e.shiftKey) {
                      e.preventDefault();
                      onSubmit(e as any);
                    }
                  }}
                />

                {/* Animated underline */}
                <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-transparent via-blue-500 to-transparent opacity-0 focus-within:opacity-100 transition-opacity duration-300" />
              </div>

              {/* Send Button */}
              <div className="pr-1 md:pr-2">
                <motion.button
                  type="submit"
                  disabled={
                    (!input.trim() && attachedFiles.length === 0) || isLoading
                  }
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="relative p-2 md:p-3 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 disabled:from-neutral-700 disabled:to-neutral-600 text-white rounded-xl transition-all duration-200 shadow-lg hover:shadow-xl disabled:shadow-none group overflow-hidden min-w-[40px] min-h-[40px] md:min-w-[48px] md:min-h-[48px] flex items-center justify-center"
                >
                  {/* Animated background */}
                  <div className="absolute inset-0 bg-gradient-to-r from-blue-400 to-purple-400 opacity-0 group-hover:opacity-20 transition-opacity duration-200" />

                  <AnimatePresence mode="wait">
                    {isLoading ? (
                      <motion.div
                        key="loading"
                        initial={{ opacity: 0, rotate: 0 }}
                        animate={{ opacity: 1, rotate: 360 }}
                        exit={{ opacity: 0 }}
                        transition={{
                          rotate: {
                            duration: 1,
                            repeat: Number.POSITIVE_INFINITY,
                            ease: "linear",
                          },
                          opacity: { duration: 0.2 },
                        }}
                        className="relative z-10"
                      >
                        <div className="w-4 h-4 md:w-5 md:h-5 border-2 border-white/30 border-t-white rounded-full" />
                      </motion.div>
                    ) : (
                      <motion.div
                        key="send"
                        initial={{ opacity: 0, x: 5 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -5 }}
                        transition={{ duration: 0.2 }}
                        className="relative z-10"
                      >
                        <IconSend className="h-4 w-4 md:h-5 md:w-5" />
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.button>
              </div>
            </div>

            {/* Loading progress bar */}
            <AnimatePresence>
              {isLoading && (
                <motion.div
                  initial={{ scaleX: 0 }}
                  animate={{ scaleX: 1 }}
                  exit={{ scaleX: 0 }}
                  transition={{ duration: 0.3 }}
                  className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-blue-500 via-purple-500 to-blue-500 origin-left"
                />
              )}
            </AnimatePresence>
          </div>

          {/* Floating suggestions (hidden on mobile for space) */}
          {!input && !isLoading && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="absolute -top-12 md:-top-16 left-0 right-0 hidden md:flex justify-center"
            >
              <div className="flex gap-2 items-center bg-neutral-800/90 backdrop-blur-sm rounded-xl px-4 py-2 border border-neutral-700/50">
                <span className="text-neutral-400 text-sm">Try:</span>
                <button className="text-blue-400 text-sm hover:text-blue-300 transition-colors">
                  "Help me with..."
                </button>
                <span className="text-neutral-600">•</span>
                <button className="text-purple-400 text-sm hover:text-purple-300 transition-colors">
                  "Explain..."
                </button>
              </div>
            </motion.div>
          )}
        </form>
      </div>
    </div>
  );
};

export default ChatInput;
