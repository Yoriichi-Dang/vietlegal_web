"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import {
  X,
  Star,
  Share2,
  Download,
  Edit,
  Trash2,
  Plus,
  Folder,
  File,
  Calendar,
  User,
} from "lucide-react";
import type { ProjectItem } from "@/types/project";

interface ProjectDetailViewProps {
  project: ProjectItem;
  onClose: () => void;
}

export default function ProjectDetailView({
  project,
  onClose,
}: ProjectDetailViewProps) {
  const [activeTab, setActiveTab] = useState("overview");
  const [isStarred, setIsStarred] = useState(project.starred);

  // Mock data for project details
  const projectFiles = [
    {
      id: "1",
      name: "Báo cáo phân tích.pdf",
      type: "pdf",
      size: "2.4 MB",
      lastModified: "2 ngày trước",
      author: "Nguyễn Văn A",
    },
    {
      id: "2",
      name: "Dữ liệu thuế.xlsx",
      type: "excel",
      size: "1.8 MB",
      lastModified: "3 ngày trước",
      author: "Trần Thị B",
    },
    {
      id: "3",
      name: "Hướng dẫn quy trình.docx",
      type: "word",
      size: "856 KB",
      lastModified: "1 tuần trước",
      author: "Lê Văn C",
    },
  ];

  const projectActivity = [
    {
      id: "1",
      action: "Tạo dự án",
      user: "Nguyễn Văn A",
      time: "2 tuần trước",
      type: "create",
    },
    {
      id: "2",
      action: "Thêm tài liệu báo cáo",
      user: "Trần Thị B",
      time: "1 tuần trước",
      type: "upload",
    },
    {
      id: "3",
      action: "Chia sẻ với team",
      user: "Nguyễn Văn A",
      time: "5 ngày trước",
      type: "share",
    },
    {
      id: "4",
      action: "Cập nhật dữ liệu",
      user: "Lê Văn C",
      time: "2 ngày trước",
      type: "edit",
    },
  ];

  const collaborators = [
    {
      id: "1",
      name: "Nguyễn Văn A",
      email: "nguyenvana@example.com",
      role: "Quản trị",
      avatar: "NA",
    },
    {
      id: "2",
      name: "Trần Thị B",
      email: "tranthib@example.com",
      role: "Chỉnh sửa",
      avatar: "TB",
    },
    {
      id: "3",
      name: "Lê Văn C",
      email: "levanc@example.com",
      role: "Xem",
      avatar: "LC",
    },
  ];

  const tabs = [
    { id: "overview", label: "Tổng Quan", icon: Folder },
    { id: "files", label: "Tài Liệu", icon: File },
    { id: "activity", label: "Hoạt Động", icon: Calendar },
    { id: "collaborators", label: "Cộng Tác", icon: User },
  ];

  const toggleStar = () => {
    setIsStarred(!isStarred);
  };

  const getFileIcon = (type: string) => {
    switch (type) {
      case "pdf":
        return "📄";
      case "excel":
        return "📊";
      case "word":
        return "📝";
      default:
        return "📄";
    }
  };

  const getActivityIcon = (type: string) => {
    switch (type) {
      case "create":
        return "🎉";
      case "upload":
        return "📤";
      case "share":
        return "🔗";
      case "edit":
        return "✏️";
      default:
        return "📝";
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="bg-neutral-800 rounded-xl w-full max-w-4xl max-h-[90vh] overflow-hidden flex flex-col"
      >
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-neutral-700">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-blue-600 rounded-lg flex items-center justify-center">
              <span className="text-white text-lg">📊</span>
            </div>
            <div>
              <h2 className="text-xl font-semibold text-white">
                {project.name}
              </h2>
              <p className="text-neutral-400 text-sm">{project.items}</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={toggleStar}
              className={`p-2 rounded-lg transition-colors ${
                isStarred
                  ? "text-yellow-400 hover:text-yellow-300"
                  : "text-neutral-400 hover:text-white"
              }`}
            >
              <Star className={`w-5 h-5 ${isStarred ? "fill-current" : ""}`} />
            </button>
            <button className="p-2 text-neutral-400 hover:text-white transition-colors">
              <Share2 className="w-5 h-5" />
            </button>
            <button className="p-2 text-neutral-400 hover:text-white transition-colors">
              <Download className="w-5 h-5" />
            </button>
            <button className="p-2 text-neutral-400 hover:text-white transition-colors">
              <Edit className="w-5 h-5" />
            </button>
            <button className="p-2 text-red-400 hover:text-red-300 transition-colors">
              <Trash2 className="w-5 h-5" />
            </button>
            <button
              onClick={onClose}
              className="p-2 text-neutral-400 hover:text-white transition-colors ml-2"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex items-center gap-6 px-6 border-b border-neutral-700">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 py-4 px-2 text-sm font-medium transition-colors relative ${
                  activeTab === tab.id
                    ? "text-white border-b-2 border-blue-500"
                    : "text-neutral-400 hover:text-white"
                }`}
              >
                <Icon className="w-4 h-4" />
                {tab.label}
              </button>
            );
          })}
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6">
          {activeTab === "overview" && (
            <div className="space-y-6">
              {/* Project Info */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div>
                    <h3 className="text-lg font-semibold text-white mb-2">
                      Thông Tin Dự Án
                    </h3>
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span className="text-neutral-400">Tạo bởi:</span>
                        <span className="text-white">{project.owner}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-neutral-400">Ngày tạo:</span>
                        <span className="text-white">
                          {project.createdAt?.toLocaleDateString("vi-VN")}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-neutral-400">Cập nhật:</span>
                        <span className="text-white">
                          {project.lastModified}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-neutral-400">Quyền:</span>
                        <span className="text-white capitalize">
                          {project.permissions}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Tags */}
                  {project.tags && project.tags.length > 0 && (
                    <div>
                      <h4 className="text-white font-medium mb-2">Thẻ</h4>
                      <div className="flex flex-wrap gap-2">
                        {project.tags.map((tag, index) => (
                          <span
                            key={index}
                            className="px-2 py-1 bg-blue-600/20 text-blue-400 rounded text-xs"
                          >
                            #{tag}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                <div>
                  <h3 className="text-lg font-semibold text-white mb-2">
                    Mô Tả
                  </h3>
                  <p className="text-neutral-300">
                    {project.description || "Chưa có mô tả cho dự án này."}
                  </p>
                </div>
              </div>

              {/* Quick Stats */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="bg-neutral-700 rounded-lg p-4">
                  <div className="text-2xl font-bold text-white">12</div>
                  <div className="text-neutral-400 text-sm">Tài liệu</div>
                </div>
                <div className="bg-neutral-700 rounded-lg p-4">
                  <div className="text-2xl font-bold text-white">3</div>
                  <div className="text-neutral-400 text-sm">Cộng tác viên</div>
                </div>
                <div className="bg-neutral-700 rounded-lg p-4">
                  <div className="text-2xl font-bold text-white">24</div>
                  <div className="text-neutral-400 text-sm">Hoạt động</div>
                </div>
                <div className="bg-neutral-700 rounded-lg p-4">
                  <div className="text-2xl font-bold text-white">15.2</div>
                  <div className="text-neutral-400 text-sm">MB</div>
                </div>
              </div>
            </div>
          )}

          {activeTab === "files" && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-white">
                  Tài Liệu Dự Án
                </h3>
                <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors">
                  <Plus className="w-4 h-4" />
                  Thêm Tài Liệu
                </button>
              </div>
              <div className="space-y-2">
                {projectFiles.map((file) => (
                  <div
                    key={file.id}
                    className="flex items-center justify-between p-4 bg-neutral-700 rounded-lg hover:bg-neutral-600 transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <span className="text-2xl">{getFileIcon(file.type)}</span>
                      <div>
                        <div className="text-white font-medium">
                          {file.name}
                        </div>
                        <div className="text-neutral-400 text-sm">
                          {file.size} • {file.lastModified} • {file.author}
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <button className="p-2 text-neutral-400 hover:text-white transition-colors">
                        <Download className="w-4 h-4" />
                      </button>
                      <button className="p-2 text-neutral-400 hover:text-white transition-colors">
                        <Share2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === "activity" && (
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-white">
                Hoạt Động Gần Đây
              </h3>
              <div className="space-y-3">
                {projectActivity.map((activity) => (
                  <div
                    key={activity.id}
                    className="flex items-start gap-3 p-4 bg-neutral-700 rounded-lg"
                  >
                    <span className="text-xl">
                      {getActivityIcon(activity.type)}
                    </span>
                    <div className="flex-1">
                      <div className="text-white">
                        <span className="font-medium">{activity.user}</span>{" "}
                        {activity.action}
                      </div>
                      <div className="text-neutral-400 text-sm">
                        {activity.time}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === "collaborators" && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-white">
                  Cộng Tác Viên
                </h3>
                <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors">
                  <Plus className="w-4 h-4" />
                  Mời Cộng Tác
                </button>
              </div>
              <div className="space-y-2">
                {collaborators.map((collaborator) => (
                  <div
                    key={collaborator.id}
                    className="flex items-center justify-between p-4 bg-neutral-700 rounded-lg"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center text-white font-medium">
                        {collaborator.avatar}
                      </div>
                      <div>
                        <div className="text-white font-medium">
                          {collaborator.name}
                        </div>
                        <div className="text-neutral-400 text-sm">
                          {collaborator.email}
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="text-neutral-400 text-sm">
                        {collaborator.role}
                      </span>
                      <button className="p-2 text-neutral-400 hover:text-white transition-colors">
                        <Edit className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </motion.div>
    </div>
  );
}
