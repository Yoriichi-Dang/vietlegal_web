"use client";

import type React from "react";

import { useState } from "react";
import { motion } from "framer-motion";
import { X, Calculator, Shield, Scale, Users, FileText } from "lucide-react";

interface CreateProjectModalProps {
  onClose: () => void;
  onCreateProject: (name: string, description: string, type: string) => void;
}

export default function CreateProjectModal({
  onClose,
  onCreateProject,
}: CreateProjectModalProps) {
  const [projectName, setProjectName] = useState("");
  const [description, setDescription] = useState("");
  const [selectedType, setSelectedType] = useState("tax");
  const [isLoading, setIsLoading] = useState(false);

  const projectTypes = [
    {
      id: "tax",
      name: "Dự Án Thuế",
      description: "Phân tích và tư vấn về thuế",
      icon: Calculator,
      color: "bg-blue-500",
    },
    {
      id: "insurance",
      name: "Dự Án Bảo Hiểm",
      description: "Tư vấn về bảo hiểm xã hội",
      icon: Shield,
      color: "bg-green-500",
    },
    {
      id: "legal",
      name: "Dự Án Pháp Lý",
      description: "Tư vấn pháp luật chung",
      icon: Scale,
      color: "bg-purple-500",
    },
    {
      id: "consultation",
      name: "Dự Án Tư Vấn",
      description: "Tư vấn tổng hợp",
      icon: Users,
      color: "bg-orange-500",
    },
    {
      id: "document",
      name: "Dự Án Tài Liệu",
      description: "Quản lý tài liệu",
      icon: FileText,
      color: "bg-indigo-500",
    },
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!projectName.trim()) return;

    setIsLoading(true);
    try {
      await new Promise((resolve) => setTimeout(resolve, 1000)); // Simulate API call
      onCreateProject(projectName, description, selectedType);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="bg-neutral-800 rounded-xl p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto"
      >
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold text-white">Tạo Dự Án Mới</h2>
          <button
            onClick={onClose}
            className="text-neutral-400 hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Project Name */}
          <div>
            <label className="block text-sm font-medium text-neutral-300 mb-2">
              Tên Dự Án *
            </label>
            <input
              type="text"
              value={projectName}
              onChange={(e) => setProjectName(e.target.value)}
              placeholder="Nhập tên dự án..."
              className="w-full px-3 py-2 bg-neutral-700 border border-neutral-600 rounded-lg text-white placeholder-neutral-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              required
            />
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-medium text-neutral-300 mb-2">
              Mô Tả
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Mô tả ngắn về dự án..."
              rows={3}
              className="w-full px-3 py-2 bg-neutral-700 border border-neutral-600 rounded-lg text-white placeholder-neutral-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
            />
          </div>

          {/* Project Type */}
          <div>
            <label className="block text-sm font-medium text-neutral-300 mb-3">
              Loại Dự Án *
            </label>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {projectTypes.map((type) => {
                const Icon = type.icon;
                return (
                  <button
                    key={type.id}
                    type="button"
                    onClick={() => setSelectedType(type.id)}
                    className={`p-4 rounded-lg border-2 transition-all duration-200 text-left ${
                      selectedType === type.id
                        ? "border-blue-500 bg-blue-500/10"
                        : "border-neutral-600 hover:border-neutral-500"
                    }`}
                  >
                    <div className="flex items-start gap-3">
                      <div className={`p-2 rounded-lg ${type.color}`}>
                        <Icon className="w-4 h-4 text-white" />
                      </div>
                      <div className="flex-1">
                        <h3 className="font-medium text-white">{type.name}</h3>
                        <p className="text-sm text-neutral-400 mt-1">
                          {type.description}
                        </p>
                      </div>
                    </div>
                  </button>
                );
              })}
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
              disabled={!projectName.trim() || isLoading}
              className="flex-1 bg-blue-600 hover:bg-blue-700 disabled:bg-neutral-600 disabled:cursor-not-allowed text-white px-4 py-2 rounded-lg transition-colors flex items-center justify-center gap-2"
            >
              {isLoading ? (
                <>
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Đang tạo...
                </>
              ) : (
                "Tạo Dự Án"
              )}
            </button>
          </div>
        </form>
      </motion.div>
    </div>
  );
}
