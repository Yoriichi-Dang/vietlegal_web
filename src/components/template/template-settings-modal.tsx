"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import {
  X,
  Save,
  Settings,
  Database,
  Shield,
  Bell,
  Palette,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface TemplateSettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function TemplateSettingsModal({
  isOpen,
  onClose,
}: TemplateSettingsModalProps) {
  const [activeTab, setActiveTab] = useState("general");
  const [settings, setSettings] = useState({
    autoSave: true,
    notifications: true,
    darkMode: true,
    defaultCategory: "tax",
    maxTemplates: 100,
    backupEnabled: true,
    apiEndpoint: "",
    apiKey: "",
  });

  const handleSave = () => {
    console.log("Saving settings:", settings);
    onClose();
  };

  if (!isOpen) return null;

  const tabs = [
    { id: "general", label: "Chung", icon: Settings },
    { id: "database", label: "Cơ sở dữ liệu", icon: Database },
    { id: "security", label: "Bảo mật", icon: Shield },
    { id: "notifications", label: "Thông báo", icon: Bell },
    { id: "appearance", label: "Giao diện", icon: Palette },
  ];

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
        className="bg-neutral-800 rounded-lg border border-neutral-700 w-full max-w-4xl h-[80vh] flex flex-col"
      >
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-neutral-700">
          <div>
            <h2 className="text-white text-xl font-semibold">
              Cài Đặt Template
            </h2>
            <p className="text-neutral-400 text-sm">
              Quản lý cài đặt hệ thống template
            </p>
          </div>
          <div className="flex items-center space-x-3">
            <Button
              onClick={handleSave}
              className="bg-blue-600 hover:bg-blue-700 text-white"
            >
              <Save className="w-4 h-4 mr-2" />
              Lưu
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

        <div className="flex flex-1 overflow-hidden">
          {/* Sidebar */}
          <div className="w-64 border-r border-neutral-700 p-4">
            <div className="space-y-1">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`w-full flex items-center space-x-3 px-3 py-2 rounded-lg text-sm transition-colors ${
                    activeTab === tab.id
                      ? "bg-blue-600 text-white"
                      : "text-neutral-300 hover:text-white hover:bg-neutral-700"
                  }`}
                >
                  <tab.icon className="w-4 h-4" />
                  <span>{tab.label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Content */}
          <div className="flex-1 p-6 overflow-y-auto">
            {activeTab === "general" && (
              <div className="space-y-6">
                <h3 className="text-white text-lg font-medium">
                  Cài Đặt Chung
                </h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <Label className="text-white">Danh mục mặc định</Label>
                    <select
                      value={settings.defaultCategory}
                      onChange={(e) =>
                        setSettings((prev) => ({
                          ...prev,
                          defaultCategory: e.target.value,
                        }))
                      }
                      className="mt-1 w-full px-3 py-2 bg-neutral-700 border border-neutral-600 rounded-md text-white"
                    >
                      <option value="tax">Luật Thuế</option>
                      <option value="insurance">Bảo Hiểm</option>
                      <option value="legal">Pháp Lý</option>
                    </select>
                  </div>

                  <div>
                    <Label className="text-white">Số template tối đa</Label>
                    <Input
                      type="number"
                      value={settings.maxTemplates}
                      onChange={(e) =>
                        setSettings((prev) => ({
                          ...prev,
                          maxTemplates: Number.parseInt(e.target.value),
                        }))
                      }
                      className="mt-1 bg-neutral-700 border-neutral-600 text-white"
                    />
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      checked={settings.autoSave}
                      onChange={(e) =>
                        setSettings((prev) => ({
                          ...prev,
                          autoSave: e.target.checked,
                        }))
                      }
                      className="rounded border-neutral-600 bg-neutral-700 text-blue-500"
                    />
                    <Label className="text-white">Tự động lưu</Label>
                  </div>

                  <div className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      checked={settings.backupEnabled}
                      onChange={(e) =>
                        setSettings((prev) => ({
                          ...prev,
                          backupEnabled: e.target.checked,
                        }))
                      }
                      className="rounded border-neutral-600 bg-neutral-700 text-blue-500"
                    />
                    <Label className="text-white">
                      Kích hoạt backup tự động
                    </Label>
                  </div>
                </div>
              </div>
            )}

            {activeTab === "database" && (
              <div className="space-y-6">
                <h3 className="text-white text-lg font-medium">
                  Cài Đặt Cơ Sở Dữ Liệu
                </h3>

                <div className="space-y-4">
                  <div>
                    <Label className="text-white">API Endpoint</Label>
                    <Input
                      value={settings.apiEndpoint}
                      onChange={(e) =>
                        setSettings((prev) => ({
                          ...prev,
                          apiEndpoint: e.target.value,
                        }))
                      }
                      className="mt-1 bg-neutral-700 border-neutral-600 text-white"
                      placeholder="https://api.example.com"
                    />
                  </div>

                  <div>
                    <Label className="text-white">API Key</Label>
                    <Input
                      type="password"
                      value={settings.apiKey}
                      onChange={(e) =>
                        setSettings((prev) => ({
                          ...prev,
                          apiKey: e.target.value,
                        }))
                      }
                      className="mt-1 bg-neutral-700 border-neutral-600 text-white"
                      placeholder="Nhập API key..."
                    />
                  </div>
                </div>

                <div className="bg-neutral-700 rounded-lg p-4">
                  <h4 className="text-white font-medium mb-2">
                    Trạng thái kết nối
                  </h4>
                  <div className="flex items-center space-x-2">
                    <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                    <span className="text-green-400 text-sm">Đã kết nối</span>
                  </div>
                </div>
              </div>
            )}

            {activeTab === "security" && (
              <div className="space-y-6">
                <h3 className="text-white text-lg font-medium">
                  Cài Đặt Bảo Mật
                </h3>

                <div className="space-y-4">
                  <div className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      defaultChecked
                      className="rounded border-neutral-600 bg-neutral-700 text-blue-500"
                    />
                    <Label className="text-white">Yêu cầu xác thực 2FA</Label>
                  </div>

                  <div className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      defaultChecked
                      className="rounded border-neutral-600 bg-neutral-700 text-blue-500"
                    />
                    <Label className="text-white">
                      Mã hóa dữ liệu template
                    </Label>
                  </div>

                  <div className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      className="rounded border-neutral-600 bg-neutral-700 text-blue-500"
                    />
                    <Label className="text-white">
                      Cho phép chia sẻ public
                    </Label>
                  </div>
                </div>
              </div>
            )}

            {activeTab === "notifications" && (
              <div className="space-y-6">
                <h3 className="text-white text-lg font-medium">
                  Cài Đặt Thông Báo
                </h3>

                <div className="space-y-4">
                  <div className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      checked={settings.notifications}
                      onChange={(e) =>
                        setSettings((prev) => ({
                          ...prev,
                          notifications: e.target.checked,
                        }))
                      }
                      className="rounded border-neutral-600 bg-neutral-700 text-blue-500"
                    />
                    <Label className="text-white">Bật thông báo</Label>
                  </div>

                  <div className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      defaultChecked
                      className="rounded border-neutral-600 bg-neutral-700 text-blue-500"
                    />
                    <Label className="text-white">
                      Thông báo khi template được sử dụng
                    </Label>
                  </div>

                  <div className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      className="rounded border-neutral-600 bg-neutral-700 text-blue-500"
                    />
                    <Label className="text-white">
                      Email báo cáo hàng tuần
                    </Label>
                  </div>
                </div>
              </div>
            )}

            {activeTab === "appearance" && (
              <div className="space-y-6">
                <h3 className="text-white text-lg font-medium">
                  Cài Đặt Giao Diện
                </h3>

                <div className="space-y-4">
                  <div className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      checked={settings.darkMode}
                      onChange={(e) =>
                        setSettings((prev) => ({
                          ...prev,
                          darkMode: e.target.checked,
                        }))
                      }
                      className="rounded border-neutral-600 bg-neutral-700 text-blue-500"
                    />
                    <Label className="text-white">Chế độ tối</Label>
                  </div>

                  <div>
                    <Label className="text-white">Kích thước font</Label>
                    <select className="mt-1 w-full px-3 py-2 bg-neutral-700 border border-neutral-600 rounded-md text-white">
                      <option>Nhỏ</option>
                      <option>Trung bình</option>
                      <option>Lớn</option>
                    </select>
                  </div>

                  <div>
                    <Label className="text-white">Màu chủ đạo</Label>
                    <div className="mt-2 flex space-x-2">
                      {["blue", "green", "purple", "red"].map((color) => (
                        <button
                          key={color}
                          className={`w-8 h-8 rounded-full bg-${color}-500 border-2 border-neutral-600`}
                        />
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}
