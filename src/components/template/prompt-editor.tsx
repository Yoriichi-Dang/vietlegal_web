"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { X, Save, Play, Eye, Code, Settings, Plus, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import type { PromptTemplate } from "@/types/template";

interface PromptEditorProps {
  template: PromptTemplate | null;
  onClose: () => void;
}

export default function PromptEditor({ template, onClose }: PromptEditorProps) {
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    category: "tax",
    prompt: "",
    variables: [] as string[],
    tags: [] as string[],
    isActive: true,
    isDefault: false,
  });

  const [newVariable, setNewVariable] = useState("");
  const [newTag, setNewTag] = useState("");
  const [activeTab, setActiveTab] = useState("editor");
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (template) {
      setFormData({
        name: template.name || "",
        description: template.description || "",
        category: template.category || "tax",
        prompt: template.prompt || "",
        variables: template.variables ? [...template.variables] : [],
        tags: template.tags ? [...template.tags] : [],
        isActive: template.isActive !== undefined ? template.isActive : true,
        isDefault:
          template.isDefault !== undefined ? template.isDefault : false,
      });
    }
  }, [template]);

  const categories = [
    { value: "tax", label: "Luật Thuế" },
    { value: "insurance", label: "Bảo Hiểm" },
    { value: "consultation", label: "Tư Vấn" },
    { value: "legal", label: "Pháp Lý" },
    { value: "analysis", label: "Phân Tích" },
  ];

  const handleSave = async () => {
    // Validation
    const newErrors: Record<string, string> = {};

    if (!formData.name.trim()) {
      newErrors.name = "Tên template không được để trống";
    }

    if (!formData.prompt.trim()) {
      newErrors.prompt = "Nội dung prompt không được để trống";
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setIsLoading(true);
    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000));
      console.log("Saving template:", formData);
      onClose();
    } catch (error) {
      console.error("Error saving template:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleTest = async () => {
    if (!formData.prompt.trim()) {
      alert("Vui lòng nhập nội dung prompt trước khi test");
      return;
    }

    setIsLoading(true);
    try {
      // Simulate API test call
      await new Promise((resolve) => setTimeout(resolve, 2000));
      alert("Test thành công! Template hoạt động tốt.");
    } catch (error) {
      alert("Test thất bại. Vui lòng kiểm tra lại prompt.");
    } finally {
      setIsLoading(false);
    }
  };

  const addVariable = () => {
    if (newVariable && !formData.variables.includes(newVariable)) {
      setFormData((prev) => ({
        ...prev,
        variables: [...prev.variables, newVariable],
      }));
      setNewVariable("");
    }
  };

  const removeVariable = (variable: string) => {
    setFormData((prev) => ({
      ...prev,
      variables: prev.variables.filter((v) => v !== variable),
    }));
  };

  const addTag = () => {
    if (newTag && !formData.tags.includes(newTag)) {
      setFormData((prev) => ({
        ...prev,
        tags: [...prev.tags, newTag],
      }));
      setNewTag("");
    }
  };

  const removeTag = (tag: string) => {
    setFormData((prev) => ({
      ...prev,
      tags: prev.tags.filter((t) => t !== tag),
    }));
  };

  const insertVariable = (variable: string) => {
    const textarea = document.getElementById(
      "prompt-textarea"
    ) as HTMLTextAreaElement;
    if (textarea) {
      const start = textarea.selectionStart;
      const end = textarea.selectionEnd;
      const text = formData.prompt;
      const before = text.substring(0, start);
      const after = text.substring(end);
      const newText = before + `{${variable}}` + after;

      setFormData((prev) => ({ ...prev, prompt: newText }));

      // Set cursor position after inserted variable
      setTimeout(() => {
        textarea.focus();
        textarea.setSelectionRange(
          start + variable.length + 2,
          start + variable.length + 2
        );
      }, 0);
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
        className="bg-neutral-800 rounded-lg border border-neutral-700 w-full max-w-6xl h-[90vh] flex flex-col"
      >
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-neutral-700">
          <div>
            <h2 className="text-white text-xl font-semibold">
              {template ? "Chỉnh Sửa Template" : "Tạo Template Mới"}
            </h2>
            <p className="text-neutral-400 text-sm">
              Tạo và tùy chỉnh system prompt cho AI model
            </p>
          </div>
          <div className="flex items-center space-x-3">
            <Button
              onClick={handleTest}
              disabled={isLoading}
              variant="outline"
              className="border-neutral-600 text-neutral-300 hover:text-white hover:bg-neutral-700 disabled:opacity-50"
            >
              <Play className="w-4 h-4 mr-2" />
              {isLoading ? "Testing..." : "Test"}
            </Button>
            <Button
              onClick={handleSave}
              disabled={isLoading}
              className="bg-blue-600 hover:bg-blue-700 text-white disabled:opacity-50"
            >
              <Save className="w-4 h-4 mr-2" />
              {isLoading ? "Đang lưu..." : "Lưu"}
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

        {/* Tabs */}
        <div className="flex items-center border-b border-neutral-700">
          {[
            { id: "editor", label: "Editor", icon: Code },
            { id: "preview", label: "Preview", icon: Eye },
            { id: "settings", label: "Settings", icon: Settings },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center space-x-2 px-6 py-3 text-sm font-medium transition-colors relative ${
                activeTab === tab.id
                  ? "text-white border-b-2 border-blue-500"
                  : "text-neutral-400 hover:text-white"
              }`}
            >
              <tab.icon className="w-4 h-4" />
              <span>{tab.label}</span>
            </button>
          ))}
        </div>

        {/* Content */}
        <div className="flex-1 flex overflow-hidden">
          {activeTab === "editor" && (
            <>
              {/* Left Panel - Form */}
              <div className="w-1/3 border-r border-neutral-700 p-6 overflow-y-auto">
                <div className="space-y-6">
                  {/* Basic Info */}
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="name" className="text-white">
                        Tên Template
                      </Label>
                      <Input
                        id="name"
                        value={formData.name}
                        onChange={(e) => {
                          setFormData((prev) => ({
                            ...prev,
                            name: e.target.value,
                          }));
                          if (errors.name)
                            setErrors((prev) => ({ ...prev, name: "" }));
                        }}
                        className={`mt-1 bg-neutral-700 border-neutral-600 text-white ${
                          errors.name ? "border-red-500" : ""
                        }`}
                        placeholder="Nhập tên template..."
                      />
                      {errors.name && (
                        <p className="text-red-400 text-xs mt-1">
                          {errors.name}
                        </p>
                      )}
                    </div>

                    <div>
                      <Label htmlFor="description" className="text-white">
                        Mô Tả
                      </Label>
                      <textarea
                        id="description"
                        value={formData.description}
                        onChange={(e) =>
                          setFormData((prev) => ({
                            ...prev,
                            description: e.target.value,
                          }))
                        }
                        className="mt-1 w-full px-3 py-2 bg-neutral-700 border border-neutral-600 rounded-md text-white placeholder:text-neutral-400 focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                        rows={3}
                        placeholder="Mô tả chức năng của template..."
                      />
                    </div>

                    <div>
                      <Label htmlFor="category" className="text-white">
                        Danh Mục
                      </Label>
                      <select
                        id="category"
                        value={formData.category}
                        onChange={(e) =>
                          setFormData((prev) => ({
                            ...prev,
                            category: e.target.value,
                          }))
                        }
                        className="mt-1 w-full px-3 py-2 bg-neutral-700 border border-neutral-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                      >
                        {categories.map((cat) => (
                          <option key={cat.value} value={cat.value}>
                            {cat.label}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>

                  {/* Variables */}
                  <div>
                    <Label className="text-white">Variables</Label>
                    <div className="mt-2 space-y-2">
                      <div className="flex space-x-2">
                        <Input
                          value={newVariable}
                          onChange={(e) => setNewVariable(e.target.value)}
                          onKeyPress={(e) => e.key === "Enter" && addVariable()}
                          className="bg-neutral-700 border-neutral-600 text-white"
                          placeholder="Tên variable..."
                        />
                        <Button
                          onClick={addVariable}
                          size="sm"
                          className="bg-blue-600 hover:bg-blue-700"
                        >
                          <Plus className="w-4 h-4" />
                        </Button>
                      </div>
                      <div className="flex flex-wrap gap-2">
                        {formData.variables.map((variable) => (
                          <div
                            key={variable}
                            className="flex items-center space-x-1 bg-neutral-700 px-2 py-1 rounded text-sm"
                          >
                            <code
                              className="text-blue-400 cursor-pointer hover:text-blue-300"
                              onClick={() => insertVariable(variable)}
                            >
                              {`{${variable}}`}
                            </code>
                            <button
                              onClick={() => removeVariable(variable)}
                              className="text-red-400 hover:text-red-300"
                            >
                              <Trash2 className="w-3 h-3" />
                            </button>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Tags */}
                  <div>
                    <Label className="text-white">Tags</Label>
                    <div className="mt-2 space-y-2">
                      <div className="flex space-x-2">
                        <Input
                          value={newTag}
                          onChange={(e) => setNewTag(e.target.value)}
                          onKeyPress={(e) => e.key === "Enter" && addTag()}
                          className="bg-neutral-700 border-neutral-600 text-white"
                          placeholder="Thêm tag..."
                        />
                        <Button
                          onClick={addTag}
                          size="sm"
                          className="bg-blue-600 hover:bg-blue-700"
                        >
                          <Plus className="w-4 h-4" />
                        </Button>
                      </div>
                      <div className="flex flex-wrap gap-2">
                        {formData.tags.map((tag) => (
                          <div
                            key={tag}
                            className="flex items-center space-x-1 bg-neutral-600 px-2 py-1 rounded text-sm text-neutral-300"
                          >
                            <span>{tag}</span>
                            <button
                              onClick={() => removeTag(tag)}
                              className="text-red-400 hover:text-red-300"
                            >
                              <Trash2 className="w-3 h-3" />
                            </button>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Settings */}
                  <div className="space-y-3">
                    <div className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        id="isActive"
                        checked={formData.isActive}
                        onChange={(e) =>
                          setFormData((prev) => ({
                            ...prev,
                            isActive: e.target.checked,
                          }))
                        }
                        className="rounded border-neutral-600 bg-neutral-700 text-blue-500"
                      />
                      <Label htmlFor="isActive" className="text-white">
                        Kích hoạt template
                      </Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        id="isDefault"
                        checked={formData.isDefault}
                        onChange={(e) =>
                          setFormData((prev) => ({
                            ...prev,
                            isDefault: e.target.checked,
                          }))
                        }
                        className="rounded border-neutral-600 bg-neutral-700 text-blue-500"
                      />
                      <Label htmlFor="isDefault" className="text-white">
                        Đặt làm mặc định
                      </Label>
                    </div>
                  </div>
                </div>
              </div>

              {/* Right Panel - Prompt Editor */}
              <div className="flex-1 p-6">
                <div className="h-full flex flex-col">
                  <Label htmlFor="prompt-textarea" className="text-white mb-2">
                    System Prompt
                  </Label>
                  <textarea
                    id="prompt-textarea"
                    value={formData.prompt}
                    onChange={(e) => {
                      setFormData((prev) => ({
                        ...prev,
                        prompt: e.target.value,
                      }));
                      if (errors.prompt)
                        setErrors((prev) => ({ ...prev, prompt: "" }));
                    }}
                    className={`flex-1 w-full px-4 py-3 bg-neutral-700 border border-neutral-600 rounded-lg text-white placeholder:text-neutral-400 focus:outline-none focus:ring-2 focus:ring-blue-500 font-mono text-sm resize-none ${
                      errors.prompt ? "border-red-500" : ""
                    }`}
                    placeholder="Nhập system prompt của bạn ở đây...

Ví dụ:
Bạn là một chuyên gia tư vấn pháp lý với 15 năm kinh nghiệm trong lĩnh vực {category}. 
Nhiệm vụ của bạn là:
1. Phân tích các vấn đề pháp lý
2. Đưa ra lời khuyên chuyên nghiệp
3. Giải thích các quy định một cách dễ hiểu

Hãy trả lời một cách chính xác, chi tiết và phù hợp với luật pháp Việt Nam."
                  />
                  {errors.prompt && (
                    <p className="text-red-400 text-xs mt-2">{errors.prompt}</p>
                  )}
                  <div className="mt-4 text-sm text-neutral-400">
                    <p>
                      💡 Mẹo: Click vào variable bên trái để chèn vào prompt
                    </p>
                    <p>
                      📝 Sử dụng {`{variable_name}`} để tạo placeholder động
                    </p>
                  </div>
                </div>
              </div>
            </>
          )}

          {activeTab === "preview" && (
            <div className="flex-1 p-6">
              <div className="bg-neutral-700 rounded-lg p-6 h-full">
                <h3 className="text-white text-lg font-medium mb-4">
                  Preview Template
                </h3>
                <div className="space-y-4">
                  <div>
                    <h4 className="text-neutral-300 font-medium mb-2">
                      Rendered Prompt:
                    </h4>
                    <div className="bg-neutral-800 rounded-lg p-4 font-mono text-sm text-neutral-300 whitespace-pre-wrap">
                      {formData.prompt || "Chưa có nội dung prompt..."}
                    </div>
                  </div>
                  <div>
                    <h4 className="text-neutral-300 font-medium mb-2">
                      Variables:
                    </h4>
                    <div className="flex flex-wrap gap-2">
                      {formData.variables.map((variable) => (
                        <code
                          key={variable}
                          className="px-2 py-1 bg-neutral-800 text-blue-400 rounded text-sm"
                        >
                          {`{${variable}}`}
                        </code>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === "settings" && (
            <div className="flex-1 p-6">
              <div className="space-y-6">
                <h3 className="text-white text-lg font-medium">
                  Cài Đặt Nâng Cao
                </h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <h4 className="text-neutral-300 font-medium">
                      Model Settings
                    </h4>
                    <div>
                      <Label className="text-white">Temperature</Label>
                      <input
                        type="range"
                        min="0"
                        max="1"
                        step="0.1"
                        defaultValue="0.7"
                        className="w-full mt-2"
                      />
                      <div className="flex justify-between text-xs text-neutral-400 mt-1">
                        <span>Conservative</span>
                        <span>Creative</span>
                      </div>
                    </div>
                    <div>
                      <Label className="text-white">Max Tokens</Label>
                      <Input
                        type="number"
                        defaultValue="2048"
                        className="mt-1 bg-neutral-700 border-neutral-600 text-white"
                      />
                    </div>
                  </div>

                  <div className="space-y-4">
                    <h4 className="text-neutral-300 font-medium">
                      Access Control
                    </h4>
                    <div className="space-y-2">
                      <div className="flex items-center space-x-2">
                        <input
                          type="checkbox"
                          className="rounded border-neutral-600 bg-neutral-700 text-blue-500"
                        />
                        <Label className="text-white">Public template</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <input
                          type="checkbox"
                          className="rounded border-neutral-600 bg-neutral-700 text-blue-500"
                        />
                        <Label className="text-white">Allow sharing</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <input
                          type="checkbox"
                          className="rounded border-neutral-600 bg-neutral-700 text-blue-500"
                        />
                        <Label className="text-white">Version control</Label>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </motion.div>
    </motion.div>
  );
}
