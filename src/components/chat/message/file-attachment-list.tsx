"use client";

import Image from "next/image";
import {
  IconPhoto,
  IconFileText,
  IconVideo,
  IconDownload,
  IconEye,
  IconFileTypePdf,
  IconFileTypeDoc,
  IconFileTypeXls,
  IconMusic,
} from "@tabler/icons-react";
import { useState } from "react";
import type { MessageAttachment } from "./types";

interface FileAttachmentListProps {
  attachments: MessageAttachment[];
  variant?: "user" | "assistant";
}

const getFileIcon = (contentType: string, fileName: string) => {
  const ext = fileName.split(".").pop()?.toLowerCase();

  if (contentType.startsWith("image/"))
    return <IconPhoto className="h-4 w-4 text-green-500" />;
  if (contentType.startsWith("video/"))
    return <IconVideo className="h-4 w-4 text-red-500" />;
  if (contentType.startsWith("audio/"))
    return <IconMusic className="h-4 w-4 text-purple-500" />;

  // PDF files
  if (contentType.includes("pdf") || ext === "pdf")
    return <IconFileTypePdf className="h-4 w-4 text-red-600" />;

  // Word documents
  if (
    contentType.includes("word") ||
    contentType.includes("document") ||
    ["doc", "docx"].includes(ext || "")
  )
    return <IconFileTypeDoc className="h-4 w-4 text-blue-600" />;

  // Excel files
  if (
    contentType.includes("sheet") ||
    ["xls", "xlsx", "csv"].includes(ext || "")
  )
    return <IconFileTypeXls className="h-4 w-4 text-green-600" />;

  return <IconFileText className="h-4 w-4 text-gray-500" />;
};

const getFileSize = (url: string): string => {
  // Simulate file size based on file type (in real app, this would come from server)
  const fileName = url.split("/").pop() || "";
  const ext = fileName.split(".").pop()?.toLowerCase();

  if (ext === "pdf") return "2.4 MB";
  if (["doc", "docx"].includes(ext || "")) return "1.2 MB";
  if (["xls", "xlsx"].includes(ext || "")) return "856 KB";
  if (["jpg", "jpeg", "png"].includes(ext || "")) return "1.8 MB";
  if (ext === "mp4") return "15.6 MB";
  return "1.1 MB";
};

const getFileDescription = (contentType: string, fileName: string): string => {
  const ext = fileName.split(".").pop()?.toLowerCase();

  if (contentType.startsWith("image/")) return "Hình ảnh";
  if (contentType.startsWith("video/")) return "Video";
  if (contentType.includes("pdf") || ext === "pdf") return "Tài liệu PDF";
  if (contentType.includes("word") || ["doc", "docx"].includes(ext || ""))
    return "Tài liệu Word";
  if (contentType.includes("sheet") || ["xls", "xlsx"].includes(ext || ""))
    return "Bảng tính Excel";
  if (
    contentType.includes("presentation") ||
    ["ppt", "pptx"].includes(ext || "")
  )
    return "Bản trình bày";
  return "Tài liệu";
};

const isImage = (contentType: string) => contentType.startsWith("image/");
const isVideo = (contentType: string) => contentType.startsWith("video/");
const isPDF = (contentType: string, fileName: string) =>
  contentType.includes("pdf") || fileName.toLowerCase().endsWith(".pdf");
const isDocument = (contentType: string, fileName: string) => {
  const ext = fileName.split(".").pop()?.toLowerCase();
  return (
    contentType.includes("word") ||
    contentType.includes("document") ||
    ["doc", "docx", "xls", "xlsx", "ppt", "pptx"].includes(ext || "")
  );
};

export default function FileAttachmentList({
  attachments,
  variant = "user",
}: FileAttachmentListProps) {
  const [imageErrors, setImageErrors] = useState<Set<number>>(new Set());
  const isUserMessage = variant === "user";

  const handleImageError = (index: number) => {
    setImageErrors((prev) => new Set([...prev, index]));
  };

  return (
    <div className="mt-3 space-y-3">
      {attachments.map((attachment, idx) => {
        const fileSize = getFileSize(attachment.url);
        const fileDescription = getFileDescription(
          attachment.contentType,
          attachment.name
        );
        const hasImageError = imageErrors.has(idx);

        // Render images
        if (isImage(attachment.contentType) && !hasImageError) {
          return (
            <div key={idx} className="relative group">
              <div className="relative overflow-hidden rounded-lg border border-gray-300 dark:border-gray-600">
                <Image
                  src={attachment.url || "/placeholder.svg"}
                  alt={attachment.name}
                  width={400}
                  height={300}
                  className="max-w-full h-auto object-cover"
                  unoptimized
                  onError={() => handleImageError(idx)}
                />
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors">
                  <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity flex gap-1">
                    <button
                      className="p-1.5 bg-black/70 text-white rounded-lg hover:bg-black/90 transition-colors"
                      onClick={() => window.open(attachment.url, "_blank")}
                      title="Xem ảnh"
                    >
                      <IconEye className="h-3 w-3" />
                    </button>
                    <button
                      className="p-1.5 bg-black/70 text-white rounded-lg hover:bg-black/90 transition-colors"
                      onClick={() => {
                        const link = document.createElement("a");
                        link.href = attachment.url;
                        link.download = attachment.name;
                        link.click();
                      }}
                      title="Tải xuống"
                    >
                      <IconDownload className="h-3 w-3" />
                    </button>
                  </div>
                </div>
              </div>
              <div
                className={`mt-2 text-xs ${
                  isUserMessage ? "text-blue-100" : "text-neutral-400"
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="font-medium truncate">
                    {attachment.name}
                  </span>
                  <span className="ml-2 opacity-75">{fileSize}</span>
                </div>
                <div className="flex items-center gap-1 mt-1">
                  {getFileIcon(attachment.contentType, attachment.name)}
                  <span>{fileDescription}</span>
                </div>
              </div>
            </div>
          );
        }

        // Render videos
        if (isVideo(attachment.contentType)) {
          return (
            <div key={idx} className="relative">
              <div className="relative overflow-hidden rounded-lg border border-gray-300 dark:border-gray-600">
                <video
                  src={attachment.url}
                  controls
                  className="max-w-full h-auto"
                  preload="metadata"
                  poster="/placeholder.svg?height=200&width=300&text=Video"
                >
                  Trình duyệt không hỗ trợ video.
                </video>
              </div>
              <div
                className={`mt-2 text-xs ${
                  isUserMessage ? "text-blue-100" : "text-neutral-400"
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="font-medium truncate">
                    {attachment.name}
                  </span>
                  <span className="ml-2 opacity-75">{fileSize}</span>
                </div>
                <div className="flex items-center gap-1 mt-1">
                  {getFileIcon(attachment.contentType, attachment.name)}
                  <span>{fileDescription}</span>
                </div>
              </div>
            </div>
          );
        }

        // Render PDF files with preview info
        if (isPDF(attachment.contentType, attachment.name)) {
          return (
            <div
              key={idx}
              className={`group relative overflow-hidden rounded-lg border transition-all duration-200 cursor-pointer hover:shadow-md ${
                isUserMessage
                  ? "bg-blue-500/10 border-blue-400/30 hover:bg-blue-500/20"
                  : "bg-neutral-800/50 border-neutral-700 hover:bg-neutral-800/70"
              }`}
              onClick={() => window.open(attachment.url, "_blank")}
            >
              <div className="p-4">
                <div className="flex items-start gap-3">
                  <div className="flex-shrink-0">
                    {getFileIcon(attachment.contentType, attachment.name)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4
                      className={`font-medium text-sm truncate ${
                        isUserMessage ? "text-blue-100" : "text-neutral-200"
                      }`}
                    >
                      {attachment.name}
                    </h4>
                    <p
                      className={`text-xs mt-1 ${
                        isUserMessage ? "text-blue-200" : "text-neutral-400"
                      }`}
                    >
                      {fileDescription} • {fileSize}
                    </p>
                    <div
                      className={`text-xs mt-2 ${
                        isUserMessage ? "text-blue-200" : "text-neutral-500"
                      }`}
                    >
                      📄 Tài liệu PDF có thể chứa văn bản, hình ảnh và biểu đồ
                    </div>
                  </div>
                  <div className="flex-shrink-0 flex flex-col gap-1">
                    <button
                      className={`p-1.5 rounded-lg transition-colors ${
                        isUserMessage
                          ? "hover:bg-blue-400/20 text-blue-200"
                          : "hover:bg-neutral-700 text-neutral-400"
                      }`}
                      onClick={(e) => {
                        e.stopPropagation();
                        window.open(attachment.url, "_blank");
                      }}
                      title="Xem PDF"
                    >
                      <IconEye className="h-4 w-4" />
                    </button>
                    <button
                      className={`p-1.5 rounded-lg transition-colors ${
                        isUserMessage
                          ? "hover:bg-blue-400/20 text-blue-200"
                          : "hover:bg-neutral-700 text-neutral-400"
                      }`}
                      onClick={(e) => {
                        e.stopPropagation();
                        const link = document.createElement("a");
                        link.href = attachment.url;
                        link.download = attachment.name;
                        link.click();
                      }}
                      title="Tải xuống"
                    >
                      <IconDownload className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          );
        }

        // Render Word/Excel/PowerPoint documents with detailed info
        if (isDocument(attachment.contentType, attachment.name)) {
          const ext = attachment.name.split(".").pop()?.toLowerCase();
          let documentInfo = "";

          if (["doc", "docx"].includes(ext || "")) {
            documentInfo =
              "📝 Tài liệu văn bản với định dạng, hình ảnh và bảng biểu";
          } else if (["xls", "xlsx"].includes(ext || "")) {
            documentInfo = "📊 Bảng tính với dữ liệu, công thức và biểu đồ";
          } else if (["ppt", "pptx"].includes(ext || "")) {
            documentInfo = "🎯 Bản trình bày với slide, hình ảnh và hiệu ứng";
          }

          return (
            <div
              key={idx}
              className={`group relative overflow-hidden rounded-lg border transition-all duration-200 cursor-pointer hover:shadow-md ${
                isUserMessage
                  ? "bg-blue-500/10 border-blue-400/30 hover:bg-blue-500/20"
                  : "bg-neutral-800/50 border-neutral-700 hover:bg-neutral-800/70"
              }`}
              onClick={() => window.open(attachment.url, "_blank")}
            >
              <div className="p-4">
                <div className="flex items-start gap-3">
                  <div className="flex-shrink-0">
                    {getFileIcon(attachment.contentType, attachment.name)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4
                      className={`font-medium text-sm truncate ${
                        isUserMessage ? "text-blue-100" : "text-neutral-200"
                      }`}
                    >
                      {attachment.name}
                    </h4>
                    <p
                      className={`text-xs mt-1 ${
                        isUserMessage ? "text-blue-200" : "text-neutral-400"
                      }`}
                    >
                      {fileDescription} • {fileSize}
                    </p>
                    <div
                      className={`text-xs mt-2 ${
                        isUserMessage ? "text-blue-200" : "text-neutral-500"
                      }`}
                    >
                      {documentInfo}
                    </div>
                  </div>
                  <div className="flex-shrink-0 flex flex-col gap-1">
                    <button
                      className={`p-1.5 rounded-lg transition-colors ${
                        isUserMessage
                          ? "hover:bg-blue-400/20 text-blue-200"
                          : "hover:bg-neutral-700 text-neutral-400"
                      }`}
                      onClick={(e) => {
                        e.stopPropagation();
                        window.open(attachment.url, "_blank");
                      }}
                      title="Mở tài liệu"
                    >
                      <IconEye className="h-4 w-4" />
                    </button>
                    <button
                      className={`p-1.5 rounded-lg transition-colors ${
                        isUserMessage
                          ? "hover:bg-blue-400/20 text-blue-200"
                          : "hover:bg-neutral-700 text-neutral-400"
                      }`}
                      onClick={(e) => {
                        e.stopPropagation();
                        const link = document.createElement("a");
                        link.href = attachment.url;
                        link.download = attachment.name;
                        link.click();
                      }}
                      title="Tải xuống"
                    >
                      <IconDownload className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          );
        }

        // Render other files (fallback)
        return (
          <div
            key={idx}
            className={`flex items-center gap-3 p-3 rounded-lg border transition-colors cursor-pointer hover:bg-opacity-80 ${
              isUserMessage
                ? "bg-blue-500/20 border-blue-400/30 text-blue-100"
                : "bg-neutral-800/50 border-neutral-700 text-neutral-300"
            }`}
            onClick={() => window.open(attachment.url, "_blank")}
          >
            <div className="flex-shrink-0">
              {getFileIcon(attachment.contentType, attachment.name)}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium truncate">{attachment.name}</p>
              <p
                className={`text-xs ${
                  isUserMessage ? "text-blue-200" : "text-neutral-500"
                }`}
              >
                {fileDescription} • {fileSize}
              </p>
            </div>
            <IconDownload className="h-4 w-4 opacity-60 flex-shrink-0" />
          </div>
        );
      })}
    </div>
  );
}
