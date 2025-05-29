"use client";

import type React from "react";

import { useState } from "react";
import { motion } from "framer-motion";
import { X, Plus, Trash2, Mail, Copy, Check } from "lucide-react";
import type { ProjectItem } from "@/types/project";

interface ShareModalProps {
  item: ProjectItem | null;
  selectedItems: string[];
  onClose: () => void;
  onShare: (emails: string[], permission: "read" | "write" | "admin") => void;
}

export default function ShareModal({
  item,
  selectedItems,
  onClose,
  onShare,
}: ShareModalProps) {
  const [emails, setEmails] = useState<string[]>([]);
  const [currentEmail, setCurrentEmail] = useState("");
  const [permission, setPermission] = useState<"read" | "write" | "admin">(
    "read"
  );
  const [isLoading, setIsLoading] = useState(false);
  const [linkCopied, setLinkCopied] = useState(false);

  const isMultipleItems = selectedItems.length > 0;

  const addEmail = () => {
    if (
      currentEmail &&
      isValidEmail(currentEmail) &&
      !emails.includes(currentEmail)
    ) {
      setEmails([...emails, currentEmail]);
      setCurrentEmail("");
    }
  };

  const removeEmail = (emailToRemove: string) => {
    setEmails(emails.filter((email) => email !== emailToRemove));
  };

  const isValidEmail = (email: string) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (emails.length === 0) return;

    setIsLoading(true);
    try {
      await new Promise((resolve) => setTimeout(resolve, 1000)); // Simulate API call
      onShare(emails, permission);
    } finally {
      setIsLoading(false);
    }
  };

  const copyShareLink = async () => {
    const shareLink = `${window.location.origin}/shared/${
      item?.id || "multiple"
    }`;
    try {
      await navigator.clipboard.writeText(shareLink);
      setLinkCopied(true);
      setTimeout(() => setLinkCopied(false), 2000);
    } catch (err) {
      console.error("Failed to copy link:", err);
    }
  };

  const permissionOptions = [
    {
      value: "read",
      label: "Chỉ xem",
      description: "Có thể xem và tải xuống",
    },
    {
      value: "write",
      label: "Chỉnh sửa",
      description: "Có thể xem, tải xuống và chỉnh sửa",
    },
    {
      value: "admin",
      label: "Quản trị",
      description: "Toàn quyền quản lý",
    },
  ];

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="bg-neutral-800 rounded-xl p-6 w-full max-w-lg max-h-[90vh] overflow-y-auto"
      >
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold text-white">
            Chia Sẻ{" "}
            {isMultipleItems ? `${selectedItems.length} mục` : item?.name}
          </h2>
          <button
            onClick={onClose}
            className="text-neutral-400 hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Share Link */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-neutral-300 mb-2">
            Liên Kết Chia Sẻ
          </label>
          <div className="flex items-center gap-2">
            <div className="flex-1 px-3 py-2 bg-neutral-700 border border-neutral-600 rounded-lg text-neutral-400 text-sm">
              {`${window.location.origin}/shared/${item?.id || "multiple"}`}
            </div>
            <button
              onClick={copyShareLink}
              className="px-3 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors flex items-center gap-2"
            >
              {linkCopied ? (
                <Check className="w-4 h-4" />
              ) : (
                <Copy className="w-4 h-4" />
              )}
              {linkCopied ? "Đã sao" : "Sao chép"}
            </button>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Email Input */}
          <div>
            <label className="block text-sm font-medium text-neutral-300 mb-2">
              Chia Sẻ Với Người Dùng
            </label>
            <div className="flex items-center gap-2 mb-3">
              <div className="flex-1 relative">
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-neutral-400 w-4 h-4" />
                <input
                  type="email"
                  value={currentEmail}
                  onChange={(e) => setCurrentEmail(e.target.value)}
                  onKeyPress={(e) =>
                    e.key === "Enter" && (e.preventDefault(), addEmail())
                  }
                  placeholder="Nhập email..."
                  className="w-full pl-10 pr-3 py-2 bg-neutral-700 border border-neutral-600 rounded-lg text-white placeholder-neutral-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              <button
                type="button"
                onClick={addEmail}
                disabled={!currentEmail || !isValidEmail(currentEmail)}
                className="px-3 py-2 bg-green-600 hover:bg-green-700 disabled:bg-neutral-600 disabled:cursor-not-allowed text-white rounded-lg transition-colors"
              >
                <Plus className="w-4 h-4" />
              </button>
            </div>

            {/* Email List */}
            {emails.length > 0 && (
              <div className="space-y-2">
                {emails.map((email, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between p-2 bg-neutral-700 rounded-lg"
                  >
                    <span className="text-white text-sm">{email}</span>
                    <button
                      type="button"
                      onClick={() => removeEmail(email)}
                      className="text-red-400 hover:text-red-300 transition-colors"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Permission Level */}
          <div>
            <label className="block text-sm font-medium text-neutral-300 mb-3">
              Quyền Truy Cập
            </label>
            <div className="space-y-2">
              {permissionOptions.map((option) => (
                <button
                  key={option.value}
                  type="button"
                  onClick={() => setPermission(option.value as any)}
                  className={`w-full p-3 rounded-lg border-2 transition-all duration-200 text-left ${
                    permission === option.value
                      ? "border-blue-500 bg-blue-500/10"
                      : "border-neutral-600 hover:border-neutral-500"
                  }`}
                >
                  <div className="font-medium text-white">{option.label}</div>
                  <div className="text-sm text-neutral-400 mt-1">
                    {option.description}
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-2 text-neutral-400 hover:text-white transition-colors"
            >
              Hủy
            </button>
            <button
              type="submit"
              disabled={emails.length === 0 || isLoading}
              className="flex-1 bg-blue-600 hover:bg-blue-700 disabled:bg-neutral-600 disabled:cursor-not-allowed text-white px-4 py-2 rounded-lg transition-colors flex items-center justify-center gap-2"
            >
              {isLoading ? (
                <>
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Đang chia sẻ...
                </>
              ) : (
                "Chia Sẻ"
              )}
            </button>
          </div>
        </form>
      </motion.div>
    </div>
  );
}
