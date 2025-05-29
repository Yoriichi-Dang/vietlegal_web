"use client";

import type React from "react";

import { useState, useRef } from "react";
import { motion } from "framer-motion";
import { X, Upload, File, Video, Music, FileText, Check } from "lucide-react";
import { Button } from "@/components/ui/button";

interface UploadFileModalProps {
  onClose: () => void;
  onUpload: (files: File[]) => void;
}

interface UploadFile {
  id: string;
  file: File;
  progress: number;
  status: "pending" | "uploading" | "completed" | "error";
}

export default function UploadFileModal({
  onClose,
  onUpload,
}: UploadFileModalProps) {
  const [uploadFiles, setUploadFiles] = useState<UploadFile[]>([]);
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = (files: FileList | null) => {
    if (!files) return;

    const newFiles: UploadFile[] = Array.from(files).map((file, index) => ({
      id: `${Date.now()}-${index}`,
      file,
      progress: 0,
      status: "pending",
    }));

    setUploadFiles((prev) => [...prev, ...newFiles]);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    handleFileSelect(e.dataTransfer.files);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const simulateUpload = (fileId: string) => {
    setUploadFiles((prev) =>
      prev.map((f) => (f.id === fileId ? { ...f, status: "uploading" } : f))
    );

    let progress = 0;
    const interval = setInterval(() => {
      progress += Math.random() * 30;
      if (progress >= 100) {
        progress = 100;
        clearInterval(interval);
        setUploadFiles((prev) =>
          prev.map((f) =>
            f.id === fileId ? { ...f, progress: 100, status: "completed" } : f
          )
        );
      } else {
        setUploadFiles((prev) =>
          prev.map((f) => (f.id === fileId ? { ...f, progress } : f))
        );
      }
    }, 500);
  };

  const handleUploadAll = () => {
    uploadFiles.forEach((file) => {
      if (file.status === "pending") {
        simulateUpload(file.id);
      }
    });

    // Simulate completion and call onUpload
    setTimeout(() => {
      const files = uploadFiles.map((uf) => uf.file);
      onUpload(files);
    }, 3000);
  };

  const removeFile = (fileId: string) => {
    setUploadFiles((prev) => prev.filter((f) => f.id !== fileId));
  };

  const getFileIcon = (file: File) => {
    const type = file.type;
    if (type.startsWith("image/")) return FileText;
    if (type.startsWith("video/")) return Video;
    if (type.startsWith("audio/")) return Music;
    if (type.includes("text") || type.includes("document")) return FileText;
    return File;
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return (
      Number.parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i]
    );
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
        className="bg-neutral-800 rounded-lg border border-neutral-700 w-full max-w-2xl max-h-[80vh] flex flex-col"
      >
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-neutral-700">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-green-500/20 rounded-lg flex items-center justify-center">
              <Upload className="w-5 h-5 text-green-400" />
            </div>
            <div>
              <h2 className="text-white text-lg font-semibold">Tải Lên Tệp</h2>
              <p className="text-neutral-400 text-sm">
                Kéo thả hoặc chọn tệp để tải lên
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

        {/* Upload Area */}
        <div className="p-6 flex-1 overflow-hidden flex flex-col">
          <div
            onDrop={handleDrop}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
              isDragging
                ? "border-blue-500 bg-blue-500/10"
                : "border-neutral-600 hover:border-neutral-500"
            }`}
          >
            <Upload className="w-12 h-12 text-neutral-400 mx-auto mb-4" />
            <p className="text-white font-medium mb-2">Kéo thả tệp vào đây</p>
            <p className="text-neutral-400 text-sm mb-4">hoặc</p>
            <Button
              onClick={() => fileInputRef.current?.click()}
              className="bg-blue-600 hover:bg-blue-700 text-white"
            >
              Chọn Tệp
            </Button>
            <input
              ref={fileInputRef}
              type="file"
              multiple
              onChange={(e) => handleFileSelect(e.target.files)}
              className="hidden"
            />
          </div>

          {/* File List */}
          {uploadFiles.length > 0 && (
            <div className="mt-6 flex-1 overflow-y-auto">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-white font-medium">
                  Tệp đã chọn ({uploadFiles.length})
                </h3>
                <Button
                  onClick={handleUploadAll}
                  size="sm"
                  className="bg-green-600 hover:bg-green-700 text-white"
                  disabled={uploadFiles.every((f) => f.status !== "pending")}
                >
                  Tải lên tất cả
                </Button>
              </div>

              <div className="space-y-3">
                {uploadFiles.map((uploadFile) => {
                  const IconComponent = getFileIcon(uploadFile.file);

                  return (
                    <div
                      key={uploadFile.id}
                      className="bg-neutral-700 rounded-lg p-4"
                    >
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center space-x-3">
                          <IconComponent className="w-5 h-5 text-blue-400" />
                          <div>
                            <div className="text-white font-medium text-sm">
                              {uploadFile.file.name}
                            </div>
                            <div className="text-neutral-400 text-xs">
                              {formatFileSize(uploadFile.file.size)}
                            </div>
                          </div>
                        </div>

                        <div className="flex items-center space-x-2">
                          {uploadFile.status === "completed" && (
                            <Check className="w-5 h-5 text-green-400" />
                          )}
                          {uploadFile.status === "pending" && (
                            <Button
                              onClick={() => simulateUpload(uploadFile.id)}
                              size="sm"
                              variant="outline"
                              className="border-neutral-600 text-neutral-300 hover:text-white"
                            >
                              Tải lên
                            </Button>
                          )}
                          <Button
                            onClick={() => removeFile(uploadFile.id)}
                            size="sm"
                            variant="outline"
                            className="border-red-600 text-red-400 hover:bg-red-600 hover:text-white"
                          >
                            <X className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>

                      {uploadFile.status === "uploading" && (
                        <div className="w-full bg-neutral-600 rounded-full h-2">
                          <div
                            className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                            style={{ width: `${uploadFile.progress}%` }}
                          />
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end space-x-3 p-6 border-t border-neutral-700">
          <Button
            onClick={onClose}
            variant="outline"
            className="border-neutral-600 text-neutral-300 hover:text-white hover:bg-neutral-700"
          >
            Đóng
          </Button>
        </div>
      </motion.div>
    </motion.div>
  );
}
