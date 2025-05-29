"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { X, Folder, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface CreateFolderModalProps {
  onClose: () => void;
  onCreateFolder: (
    name: string,
    description: string,
    isPrivate: boolean
  ) => void;
}

export default function CreateFolderModal({
  onClose,
  onCreateFolder,
}: CreateFolderModalProps) {
  const [folderName, setFolderName] = useState("");
  const [description, setDescription] = useState("");
  const [isPrivate, setIsPrivate] = useState(false);

  const handleCreate = () => {
    if (folderName.trim()) {
      onCreateFolder(folderName, description, isPrivate);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
    >
      <motion.div
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.95, opacity: 0 }}
        className="bg-neutral-800 rounded-lg border border-neutral-700 w-full max-w-md"
      >
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-neutral-700">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-yellow-500/20 rounded-lg flex items-center justify-center">
              <Folder className="w-5 h-5 text-yellow-400" />
            </div>
            <div>
              <h2 className="text-white text-lg font-semibold">
                Tạo Thư Mục Mới
              </h2>
              <p className="text-neutral-400 text-sm">
                Tạo thư mục để tổ chức tài liệu
              </p>
            </div>
          </div>
          <Button
            onClick={onClose}
            variant="outline"
            size="icon"
            className="border-neutral-600 text-neutral-400 hover:text-white"
          >
            <X className="w-4 h-4" />
          </Button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-4">
          <div>
            <Label htmlFor="folderName" className="text-white">
              Tên thư mục *
            </Label>
            <Input
              id="folderName"
              value={folderName}
              onChange={(e) => setFolderName(e.target.value)}
              placeholder="Nhập tên thư mục..."
              className="mt-1 bg-neutral-700 border-neutral-600 text-white"
              autoFocus
            />
          </div>

          <div>
            <Label htmlFor="description" className="text-white">
              Mô tả (tùy chọn)
            </Label>
            <textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Mô tả ngắn về thư mục..."
              className="mt-1 w-full px-3 py-2 bg-neutral-700 border border-neutral-600 rounded-md text-white placeholder:text-neutral-400 focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
              rows={3}
            />
          </div>

          <div className="flex items-center space-x-2">
            <input
              type="checkbox"
              id="isPrivate"
              checked={isPrivate}
              onChange={(e) => setIsPrivate(e.target.checked)}
              className="rounded border-neutral-600 bg-neutral-700 text-blue-500"
            />
            <Label htmlFor="isPrivate" className="text-white">
              Thư mục riêng tư
            </Label>
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end space-x-3 p-6 border-t border-neutral-700">
          <Button
            onClick={onClose}
            variant="outline"
            className="border-neutral-600 text-neutral-300 hover:text-white hover:bg-neutral-700"
          >
            Hủy
          </Button>
          <Button
            onClick={handleCreate}
            disabled={!folderName.trim()}
            className="bg-blue-600 hover:bg-blue-700 text-white disabled:opacity-50"
          >
            <Plus className="w-4 h-4 mr-2" />
            Tạo Thư Mục
          </Button>
        </div>
      </motion.div>
    </motion.div>
  );
}
