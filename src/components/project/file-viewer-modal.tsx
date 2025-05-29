"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import {
  X,
  Download,
  Share2,
  Edit,
  Star,
  Trash2,
  Eye,
  FileText,
  ImageIcon,
  Video,
  Music,
  File,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import type { ProjectItem } from "@/types/project";

interface FileViewerModalProps {
  item: ProjectItem;
  onClose: () => void;
}

export default function FileViewerModal({
  item,
  onClose,
}: FileViewerModalProps) {
  const [isStarred, setIsStarred] = useState(item.starred);

  const getFileIcon = () => {
    if (item.type === "folder") return FileText;

    switch (item.fileType) {
      case "image":
        return Image;
      case "video":
        return Video;
      case "audio":
        return Music;
      default:
        return File;
    }
  };

  const renderPreview = () => {
    if (item.type === "folder") {
      return (
        <div className="flex items-center justify-center h-64 bg-neutral-700 rounded-lg">
          <div className="text-center">
            <FileText className="w-16 h-16 text-yellow-400 mx-auto mb-4" />
            <p className="text-white font-medium">Thư mục</p>
            <p className="text-neutral-400 text-sm">{item.items}</p>
          </div>
        </div>
      );
    }

    if (item.fileType === "image") {
      return (
        <div className="bg-neutral-700 rounded-lg p-4">
          <div className="aspect-video bg-neutral-600 rounded flex items-center justify-center">
            <ImageIcon className="w-16 h-16 text-purple-400" />
          </div>
        </div>
      );
    }

    if (item.fileType === "video") {
      return (
        <div className="bg-neutral-700 rounded-lg p-4">
          <div className="aspect-video bg-neutral-600 rounded flex items-center justify-center">
            <Video className="w-16 h-16 text-pink-400" />
          </div>
        </div>
      );
    }

    if (item.content) {
      return (
        <div className="bg-neutral-700 rounded-lg p-4">
          <div className="bg-neutral-600 rounded p-4 max-h-64 overflow-y-auto">
            <pre className="text-neutral-300 text-sm whitespace-pre-wrap">
              {item.content}
            </pre>
          </div>
        </div>
      );
    }

    return (
      <div className="flex items-center justify-center h-64 bg-neutral-700 rounded-lg">
        <div className="text-center">
          <File className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <p className="text-white font-medium">Không thể xem trước</p>
          <p className="text-neutral-400 text-sm">Tải xuống để xem nội dung</p>
        </div>
      </div>
    );
  };

  const IconComponent = getFileIcon();

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
        className="bg-neutral-800 rounded-lg border border-neutral-700 w-full max-w-4xl max-h-[90vh] flex flex-col"
      >
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-neutral-700">
          <div className="flex items-center space-x-3">
            <IconComponent className="w-8 h-8 text-blue-400" />
            <div>
              <h2 className="text-white text-lg font-semibold">{item.name}</h2>
              <div className="flex items-center space-x-4 text-sm text-neutral-400">
                <span>Loại: {item.type}</span>
                {item.size && <span>Kích thước: {item.size}</span>}
                <span>Sửa đổi: {item.lastModified}</span>
              </div>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <Button
              onClick={() => setIsStarred(!isStarred)}
              variant="outline"
              size="icon"
              className={`border-neutral-600 ${
                isStarred
                  ? "text-yellow-400 hover:text-yellow-300"
                  : "text-neutral-400 hover:text-white"
              }`}
            >
              <Star className={`w-4 h-4 ${isStarred ? "fill-current" : ""}`} />
            </Button>

            <Button
              variant="outline"
              size="icon"
              className="border-neutral-600 text-neutral-400 hover:text-white"
            >
              <Share2 className="w-4 h-4" />
            </Button>

            <Button
              variant="outline"
              size="icon"
              className="border-neutral-600 text-neutral-400 hover:text-white"
            >
              <Download className="w-4 h-4" />
            </Button>

            <Button
              variant="outline"
              size="icon"
              className="border-neutral-600 text-neutral-400 hover:text-white"
            >
              <Edit className="w-4 h-4" />
            </Button>

            <Button
              variant="outline"
              size="icon"
              className="border-red-600 text-red-400 hover:bg-red-600 hover:text-white"
            >
              <Trash2 className="w-4 h-4" />
            </Button>

            <Button
              onClick={onClose}
              variant="outline"
              size="icon"
              className="border-neutral-600 text-neutral-400 hover:text-white"
            >
              <X className="w-4 h-4" />
            </Button>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 p-6 overflow-y-auto">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Preview */}
            <div className="lg:col-span-2">
              <h3 className="text-white font-medium mb-4 flex items-center">
                <Eye className="w-4 h-4 mr-2" />
                Xem trước
              </h3>
              {renderPreview()}
            </div>

            {/* Details */}
            <div className="space-y-6">
              <div>
                <h3 className="text-white font-medium mb-4">
                  Thông tin chi tiết
                </h3>
                <div className="space-y-3 text-sm">
                  <div className="flex justify-between">
                    <span className="text-neutral-400">Tên:</span>
                    <span className="text-white">{item.name}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-neutral-400">Loại:</span>
                    <span className="text-white capitalize">{item.type}</span>
                  </div>
                  {item.size && (
                    <div className="flex justify-between">
                      <span className="text-neutral-400">Kích thước:</span>
                      <span className="text-white">{item.size}</span>
                    </div>
                  )}
                  {item.items && (
                    <div className="flex justify-between">
                      <span className="text-neutral-400">Nội dung:</span>
                      <span className="text-white">{item.items}</span>
                    </div>
                  )}
                  <div className="flex justify-between">
                    <span className="text-neutral-400">Sửa đổi:</span>
                    <span className="text-white">{item.lastModified}</span>
                  </div>
                  {item.owner && (
                    <div className="flex justify-between">
                      <span className="text-neutral-400">Chủ sở hữu:</span>
                      <span className="text-white">{item.owner}</span>
                    </div>
                  )}
                  <div className="flex justify-between">
                    <span className="text-neutral-400">Quyền:</span>
                    <span className="text-white capitalize">
                      {item.permissions}
                    </span>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="text-white font-medium mb-4">Trạng thái</h3>
                <div className="space-y-2">
                  <div className="flex items-center space-x-2">
                    <div
                      className={`w-2 h-2 rounded-full ${
                        item.starred ? "bg-yellow-400" : "bg-neutral-600"
                      }`}
                    />
                    <span className="text-sm text-neutral-400">
                      Đã đánh dấu
                    </span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div
                      className={`w-2 h-2 rounded-full ${
                        item.shared ? "bg-green-400" : "bg-neutral-600"
                      }`}
                    />
                    <span className="text-sm text-neutral-400">Đã chia sẻ</span>
                  </div>
                </div>
              </div>

              {item.tags && item.tags.length > 0 && (
                <div>
                  <h3 className="text-white font-medium mb-4">Tags</h3>
                  <div className="flex flex-wrap gap-2">
                    {item.tags.map((tag, index) => (
                      <span
                        key={index}
                        className="px-2 py-1 bg-neutral-700 text-neutral-300 text-xs rounded"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}
