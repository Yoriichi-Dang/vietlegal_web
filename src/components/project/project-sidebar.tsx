"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import {
  Scale,
  FileText,
  Calculator,
  Shield,
  Folder,
  Star,
  Share2,
  Trash2,
  Plus,
  ChevronDown,
  ChevronRight,
} from "lucide-react";
import { toast } from "sonner";
import { useState } from "react";

interface ProjectSidebarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  setSelectedItem?: (item: any) => void;
  setShowFileViewer?: (show: boolean) => void;
}

export default function ProjectSidebar({
  activeTab,
  setActiveTab,
  setSelectedItem = () => {},
  setShowFileViewer = () => {},
}: ProjectSidebarProps) {
  const [expandedCategories, setExpandedCategories] = useState<string[]>([
    "main",
    "collections",
  ]);

  const toggleCategory = (category: string) => {
    if (expandedCategories.includes(category)) {
      setExpandedCategories(expandedCategories.filter((c) => c !== category));
    } else {
      setExpandedCategories([...expandedCategories, category]);
    }
  };

  const menuItems = [
    { icon: FileText, label: "Tất cả nội dung", id: "recent", count: 24 },
    { icon: Star, label: "Đã đánh dấu", id: "starred", count: 8 },
    { icon: Share2, label: "Đã chia sẻ", id: "shared", count: 12 },
    { icon: Trash2, label: "Thùng rác", id: "trash", count: 3 },
  ];

  const categories = [
    { icon: Calculator, label: "Thuế", count: 12, color: "text-blue-400" },
    { icon: Shield, label: "Bảo hiểm", count: 8, color: "text-green-400" },
    { icon: Scale, label: "Pháp lý", count: 15, color: "text-purple-400" },
  ];

  const collections = [
    { icon: Folder, label: "Hồ sơ thuế", count: 12 },
    { icon: Folder, label: "Tài liệu bảo hiểm", count: 8 },
    { icon: Folder, label: "Tư vấn pháp lý", count: 15 },
    { icon: Folder, label: "Mẫu văn bản", count: 6 },
  ];

  const recentItems = [
    { icon: FileText, label: "Báo cáo thuế Q4.xlsx", time: "2 giờ trước" },
    { icon: FileText, label: "Hợp đồng bảo hiểm.docx", time: "Hôm qua" },
    { icon: FileText, label: "Phân tích luật mới.pdf", time: "3 ngày trước" },
    { icon: FileText, label: "Mẫu đơn khiếu nại.docx", time: "1 tuần trước" },
  ];

  return (
    <motion.aside
      initial={{ x: -300 }}
      animate={{ x: 0 }}
      className="w-64 bg-neutral-900 border-r border-neutral-700 flex flex-col h-screen"
    >
      {/* Logo */}
      <div className="p-6 border-b border-neutral-700">
        <Link href="/" className="flex items-center space-x-2">
          <Scale className="w-8 h-8 text-blue-500" />
          <span className="text-white font-bold text-lg">LegalWise AI</span>
        </Link>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4 overflow-y-auto custom-scrollbar">
        {/* Main Navigation */}
        <div className="space-y-1 mb-6">
          <div className="px-2 mb-3">
            <span className="text-xs text-neutral-500 uppercase tracking-wider font-medium">
              Trang chủ
            </span>
          </div>
          {menuItems.map((item, index) => (
            <motion.div
              key={item.label}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <button
                onClick={() => setActiveTab(item.id)}
                className={`flex items-center justify-between w-full space-x-3 px-3 py-2 rounded-lg transition-colors ${
                  activeTab === item.id
                    ? "bg-blue-600 text-white"
                    : "text-neutral-300 hover:text-white hover:bg-neutral-800"
                }`}
              >
                <div className="flex items-center space-x-3">
                  <item.icon className="w-5 h-5" />
                  <span className="text-sm font-medium">{item.label}</span>
                </div>
                <span className="text-xs bg-neutral-700 px-2 py-1 rounded-full">
                  {item.count}
                </span>
              </button>
            </motion.div>
          ))}
        </div>

        {/* Categories */}
        <div className="mb-6">
          <div className="px-2 mb-3 flex items-center justify-between">
            <button
              onClick={() => toggleCategory("main")}
              className="flex items-center text-xs text-neutral-500 uppercase tracking-wider font-medium hover:text-neutral-300"
            >
              <span>Danh mục</span>
              {expandedCategories.includes("main") ? (
                <ChevronDown className="w-4 h-4 ml-1" />
              ) : (
                <ChevronRight className="w-4 h-4 ml-1" />
              )}
            </button>
            <button className="p-1 text-neutral-500 hover:text-neutral-300 rounded-full">
              <Plus className="w-3 h-3" />
            </button>
          </div>

          {expandedCategories.includes("main") && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="space-y-1"
            >
              {categories.map((category, index) => (
                <motion.div
                  key={category.label}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  onClick={() => {
                    setActiveTab(category.label.toLowerCase());
                    // Thông báo khi click
                    toast.success(`Đã chọn danh mục: ${category.label}`);
                  }}
                  className="flex items-center justify-between px-3 py-2 rounded-lg text-neutral-300 hover:text-white hover:bg-neutral-800 transition-colors cursor-pointer"
                >
                  <div className="flex items-center space-x-3">
                    <category.icon className={`w-4 h-4 ${category.color}`} />
                    <span className="text-sm">{category.label}</span>
                  </div>
                  <span className="text-xs text-neutral-500">
                    {category.count}
                  </span>
                </motion.div>
              ))}
            </motion.div>
          )}
        </div>

        {/* Collections */}
        <div className="mb-6">
          <div className="px-2 mb-3 flex items-center justify-between">
            <button
              onClick={() => toggleCategory("collections")}
              className="flex items-center text-xs text-neutral-500 uppercase tracking-wider font-medium hover:text-neutral-300"
            >
              <span>Bộ sưu tập</span>
              {expandedCategories.includes("collections") ? (
                <ChevronDown className="w-4 h-4 ml-1" />
              ) : (
                <ChevronRight className="w-4 h-4 ml-1" />
              )}
            </button>
            <button className="p-1 text-neutral-500 hover:text-neutral-300 rounded-full">
              <Plus className="w-3 h-3" />
            </button>
          </div>

          {expandedCategories.includes("collections") && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="space-y-1"
            >
              {collections.map((collection, index) => (
                <motion.div
                  key={collection.label}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  onClick={() => {
                    setActiveTab(
                      collection.label.toLowerCase().replace(/\s+/g, "-")
                    );
                    // Thông báo khi click
                    toast.success(`Đã chọn bộ sưu tập: ${collection.label}`);
                  }}
                  className="flex items-center justify-between px-3 py-2 rounded-lg text-neutral-300 hover:text-white hover:bg-neutral-800 transition-colors cursor-pointer"
                >
                  <div className="flex items-center space-x-3">
                    <collection.icon className="w-4 h-4 text-yellow-400" />
                    <span className="text-sm">{collection.label}</span>
                  </div>
                  <span className="text-xs text-neutral-500">
                    {collection.count}
                  </span>
                </motion.div>
              ))}
            </motion.div>
          )}
        </div>

        {/* Recent Items */}
        <div className="mb-6">
          <div className="px-2 mb-3 flex items-center justify-between">
            <button
              onClick={() => toggleCategory("recent")}
              className="flex items-center text-xs text-neutral-500 uppercase tracking-wider font-medium hover:text-neutral-300"
            >
              <span>Gần đây</span>
              {expandedCategories.includes("recent") ? (
                <ChevronDown className="w-4 h-4 ml-1" />
              ) : (
                <ChevronRight className="w-4 h-4 ml-1" />
              )}
            </button>
          </div>

          {expandedCategories.includes("recent") && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="space-y-1"
            >
              {recentItems.map((item, index) => (
                <motion.div
                  key={item.label}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  onClick={() => {
                    // Mở file viewer modal khi click vào file gần đây
                    const fileItem = {
                      id: `file-${index}`,
                      name: item.label,
                      type: "file",
                      fileType: item.label.split(".").pop() || "unknown",
                      icon: "FileText",
                      lastModified: item.time,
                      shared: false,
                      starred: false,
                      owner: "Bạn",
                      permissions: "read" as const,
                      content: `Nội dung của file ${item.label}...`,
                    };
                    setSelectedItem(fileItem);
                    setShowFileViewer(true);
                    // Thông báo khi click
                    toast.success(`Đang mở: ${item.label}`);
                  }}
                  className="px-3 py-2 rounded-lg text-neutral-300 hover:text-white hover:bg-neutral-800 transition-colors cursor-pointer"
                >
                  <div className="flex items-center space-x-3">
                    <item.icon className="w-4 h-4 text-neutral-400" />
                    <div className="flex-1 min-w-0">
                      <div className="text-sm truncate">{item.label}</div>
                      <div className="text-xs text-neutral-500">
                        {item.time}
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          )}
        </div>
      </nav>

      {/* Footer */}
      <div className="p-4 border-t border-neutral-700">
        <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg p-3">
          <div className="flex items-center space-x-2 mb-2">
            <div className="w-2 h-2 bg-white rounded-full"></div>
            <span className="text-white text-sm font-medium">Nâng cấp Pro</span>
          </div>
          <p className="text-blue-100 text-xs">Mở khóa tính năng AI nâng cao</p>
        </div>
      </div>
    </motion.aside>
  );
}
