"use client";

import { motion } from "framer-motion";
import {
  FileText,
  Calculator,
  Shield,
  MessageCircle,
  Scale,
  Users,
  Star,
  Clock,
  Settings,
} from "lucide-react";

interface TemplateSidebarProps {
  selectedCategory: string;
  setSelectedCategory: (category: string) => void;
  onQuickAccess?: (action: string) => void;
}

export default function TemplateSidebar({
  selectedCategory,
  setSelectedCategory,
  onQuickAccess,
}: TemplateSidebarProps) {
  const categories = [
    { id: "all", name: "Tất cả Template", icon: FileText, count: 24 },
    { id: "tax", name: "Luật Thuế", icon: Calculator, count: 8 },
    { id: "insurance", name: "Bảo Hiểm", icon: Shield, count: 6 },
    { id: "consultation", name: "Tư Vấn", icon: MessageCircle, count: 5 },
    { id: "legal", name: "Pháp Lý", icon: Scale, count: 3 },
    { id: "analysis", name: "Phân Tích", icon: Users, count: 2 },
  ];

  const quickAccess = [
    { id: "recent", name: "Gần đây", icon: Clock },
    { id: "favorites", name: "Yêu thích", icon: Star },
    { id: "settings", name: "Cài đặt", icon: Settings },
  ];

  return (
    <motion.aside
      initial={{ x: -300 }}
      animate={{ x: 0 }}
      className="w-64 h-screen bg-neutral-900 border-r border-neutral-700 flex flex-col justify-between"
    >
      {/* Top Section - Categories and Quick Access */}
      <div className="flex-1 overflow-y-auto">
        {/* Categories */}
        <div className="p-4">
          <h3 className="text-neutral-400 text-xs font-semibold uppercase tracking-wider mb-3">
            Danh Mục
          </h3>
          <div className="space-y-1">
            {categories.map((category, index) => (
              <motion.button
                key={category.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                onClick={() => setSelectedCategory(category.id)}
                className={`w-full flex items-center justify-between px-3 py-2 rounded-lg transition-colors ${
                  selectedCategory === category.id
                    ? "bg-blue-600 text-white"
                    : "text-neutral-300 hover:text-white hover:bg-neutral-800"
                }`}
              >
                <div className="flex items-center space-x-3">
                  <category.icon className="w-4 h-4" />
                  <span className="text-sm font-medium">{category.name}</span>
                </div>
                <span className="text-xs bg-neutral-700 px-2 py-1 rounded-full">
                  {category.count}
                </span>
              </motion.button>
            ))}
          </div>
        </div>

        {/* Quick Access */}
        <div className="p-4 border-t border-neutral-700">
          <h3 className="text-neutral-400 text-xs font-semibold uppercase tracking-wider mb-3">
            Truy Cập Nhanh
          </h3>
          <div className="space-y-1">
            {quickAccess.map((item, index) => (
              <motion.button
                key={item.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: (index + 6) * 0.1 }}
                onClick={() => {
                  console.log(`Clicked on ${item.id}`); // Debug log
                  onQuickAccess?.(item.id);
                }}
                className="w-full flex items-center space-x-3 px-3 py-2 rounded-lg text-neutral-300 hover:text-white hover:bg-neutral-800 transition-colors cursor-pointer"
              >
                <item.icon className="w-4 h-4" />
                <span className="text-sm">{item.name}</span>
              </motion.button>
            ))}
          </div>
        </div>
      </div>

      {/* Bottom Section - Usage Stats */}
      <div className="p-4 border-t border-neutral-700 flex-shrink-0">
        <div className="bg-neutral-800 rounded-lg p-3">
          <h4 className="text-white text-sm font-medium mb-2">
            Thống Kê Sử Dụng
          </h4>
          <div className="space-y-2 text-xs">
            <div className="flex justify-between text-neutral-400">
              <span>Templates đã tạo:</span>
              <span className="text-white">24</span>
            </div>
            <div className="flex justify-between text-neutral-400">
              <span>Lần sử dụng:</span>
              <span className="text-white">1,247</span>
            </div>
            <div className="flex justify-between text-neutral-400">
              <span>Template active:</span>
              <span className="text-green-400">12</span>
            </div>
          </div>
        </div>
      </div>
    </motion.aside>
  );
}
