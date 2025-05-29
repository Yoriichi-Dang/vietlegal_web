"use client";

import { useState, useMemo } from "react";
import { motion } from "framer-motion";
import {
  MoreVertical,
  Edit,
  Copy,
  Trash2,
  Star,
  Play,
  Pause,
  Eye,
  Clock,
  Heart,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";
import type { PromptTemplate } from "@/types/template";
import { toast } from "sonner";

interface TemplateGridProps {
  searchQuery: string;
  selectedCategory: string;
  onEditTemplate: (template: PromptTemplate) => void;
}

// Mock data với thêm thông tin recent và favorite
const mockTemplates: PromptTemplate[] = [
  {
    id: "1",
    name: "Phân tích hợp đồng bảo hiểm",
    description: "Template để phân tích các điều khoản trong hợp đồng bảo hiểm",
    prompt: "Phân tích hợp đồng bảo hiểm sau đây và đưa ra nhận xét về...",
    variables: ["contract_text", "analysis_type"],
    tags: ["bảo hiểm", "phân tích", "hợp đồng"],
    category: "insurance",
    isActive: true,
    createdAt: new Date("2024-01-15"),
    updatedAt: new Date("2024-01-20"),
    usageCount: 45,
    isFavorite: true,
    lastUsed: new Date("2024-01-25"), // Recent
  },
  {
    id: "2",
    name: "Tư vấn thuế thu nhập cá nhân",
    description: "Hỗ trợ tư vấn về thuế thu nhập cá nhân cho khách hàng",
    prompt: "Dựa trên thông tin thu nhập sau, hãy tư vấn về thuế...",
    variables: ["income_info", "tax_year"],
    tags: ["thuế", "tư vấn", "cá nhân"],
    category: "tax",
    isActive: true,
    createdAt: new Date("2024-01-10"),
    updatedAt: new Date("2024-01-22"),
    usageCount: 78,
    isFavorite: false,
    lastUsed: new Date("2024-01-24"), // Recent
  },
  {
    id: "3",
    name: "Soạn thảo đơn khiếu nại",
    description: "Template để soạn thảo đơn khiếu nại pháp lý",
    prompt: "Soạn thảo đơn khiếu nại với các thông tin sau...",
    variables: ["complaint_details", "defendant_info"],
    tags: ["pháp lý", "khiếu nại", "soạn thảo"],
    category: "legal",
    isActive: false,
    createdAt: new Date("2024-01-05"),
    updatedAt: new Date("2024-01-18"),
    usageCount: 23,
    isFavorite: true,
    lastUsed: new Date("2024-01-20"),
  },
  {
    id: "4",
    name: "Tính toán bồi thường bảo hiểm",
    description: "Hỗ trợ tính toán số tiền bồi thường bảo hiểm",
    prompt: "Tính toán bồi thường dựa trên thông tin sau...",
    variables: ["damage_info", "policy_details"],
    tags: ["bảo hiểm", "bồi thường", "tính toán"],
    category: "insurance",
    isActive: true,
    createdAt: new Date("2024-01-12"),
    updatedAt: new Date("2024-01-21"),
    usageCount: 56,
    isFavorite: true,
    lastUsed: new Date("2024-01-23"), // Recent
  },
  {
    id: "5",
    name: "Kiểm tra tính hợp lệ hợp đồng",
    description: "Kiểm tra tính hợp lệ của các điều khoản hợp đồng",
    prompt: "Kiểm tra tính hợp lệ của hợp đồng sau...",
    variables: ["contract_content", "legal_framework"],
    tags: ["pháp lý", "hợp đồng", "kiểm tra"],
    category: "legal",
    isActive: true,
    createdAt: new Date("2024-01-08"),
    updatedAt: new Date("2024-01-19"),
    usageCount: 34,
    isFavorite: false,
    lastUsed: new Date("2024-01-15"),
  },
];

export default function TemplateGrid({
  searchQuery,
  selectedCategory,
  onEditTemplate,
}: TemplateGridProps) {
  const [templates, setTemplates] = useState<PromptTemplate[]>(mockTemplates);

  const filteredTemplates = useMemo(() => {
    let filtered = templates;

    // Filter by category
    if (selectedCategory === "recent") {
      // Show templates used in last 7 days, sorted by last used
      const sevenDaysAgo = new Date();
      sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
      filtered = templates
        .filter(
          (template) => template.lastUsed && template.lastUsed > sevenDaysAgo
        )
        .sort(
          (a, b) => (b.lastUsed?.getTime() || 0) - (a.lastUsed?.getTime() || 0)
        );
    } else if (selectedCategory === "favorites") {
      // Show only favorite templates
      filtered = templates.filter((template) => template.isFavorite);
    } else if (selectedCategory !== "all") {
      // Filter by regular category
      filtered = templates.filter(
        (template) => template.category === selectedCategory
      );
    }

    // Filter by search query
    if (searchQuery) {
      filtered = filtered.filter(
        (template) =>
          template.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          template.description
            .toLowerCase()
            .includes(searchQuery.toLowerCase()) ||
          template.tags.some((tag) =>
            tag.toLowerCase().includes(searchQuery.toLowerCase())
          )
      );
    }

    return filtered;
  }, [templates, selectedCategory, searchQuery]);

  const toggleFavorite = (templateId: string) => {
    setTemplates((prev) =>
      prev.map((template) =>
        template.id === templateId
          ? { ...template, isFavorite: !template.isFavorite }
          : template
      )
    );
    const template = templates.find((t) => t.id === templateId);
    if (template) {
      toast.success(
        template.isFavorite ? "Đã xóa khỏi yêu thích" : "Đã thêm vào yêu thích"
      );
    }
  };

  const toggleActive = (templateId: string) => {
    setTemplates((prev) =>
      prev.map((template) =>
        template.id === templateId
          ? { ...template, isActive: !template.isActive }
          : template
      )
    );
    const template = templates.find((t) => t.id === templateId);
    if (template) {
      toast.success(
        template.isActive ? "Đã tạm dừng template" : "Đã kích hoạt template"
      );
    }
  };

  const copyTemplate = (template: PromptTemplate) => {
    const newTemplate = {
      ...template,
      id: Date.now().toString(),
      name: `${template.name} (Copy)`,
      createdAt: new Date(),
      updatedAt: new Date(),
      usageCount: 0,
      isFavorite: false,
    };
    setTemplates((prev) => [newTemplate, ...prev]);
    toast.success("Đã sao chép template");
  };

  const deleteTemplate = (templateId: string) => {
    setTemplates((prev) =>
      prev.filter((template) => template.id !== templateId)
    );
    toast.success("Đã xóa template");
  };

  const getCategoryTitle = () => {
    switch (selectedCategory) {
      case "recent":
        return "Templates Gần Đây";
      case "favorites":
        return "Templates Yêu Thích";
      case "all":
        return "Tất Cả Templates";
      case "tax":
        return "Luật Thuế";
      case "insurance":
        return "Bảo Hiểm";
      case "consultation":
        return "Tư Vấn";
      case "legal":
        return "Pháp Lý";
      case "analysis":
        return "Phân Tích";
      default:
        return "Templates";
    }
  };

  const getEmptyStateMessage = () => {
    switch (selectedCategory) {
      case "recent":
        return "Chưa có template nào được sử dụng gần đây";
      case "favorites":
        return "Chưa có template nào được đánh dấu yêu thích";
      default:
        return searchQuery
          ? `Không tìm thấy template nào với từ khóa "${searchQuery}"`
          : "Chưa có template nào trong danh mục này";
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-white">
            {getCategoryTitle()}
          </h2>
          <p className="text-neutral-400 mt-1">
            {filteredTemplates.length} template
            {filteredTemplates.length !== 1 ? "s" : ""}
            {selectedCategory === "recent" && " trong 7 ngày qua"}
          </p>
        </div>
        {selectedCategory === "recent" && (
          <div className="flex items-center text-neutral-400 text-sm">
            <Clock className="w-4 h-4 mr-2" />
            Sắp xếp theo thời gian sử dụng
          </div>
        )}
        {selectedCategory === "favorites" && (
          <div className="flex items-center text-neutral-400 text-sm">
            <Heart className="w-4 h-4 mr-2" />
            Templates đã đánh dấu
          </div>
        )}
      </div>

      {/* Empty State */}
      {filteredTemplates.length === 0 ? (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center py-12"
        >
          <div className="text-neutral-500 text-lg mb-2">
            {selectedCategory === "recent" ? (
              <Clock className="w-12 h-12 mx-auto mb-4" />
            ) : selectedCategory === "favorites" ? (
              <Heart className="w-12 h-12 mx-auto mb-4" />
            ) : (
              <Eye className="w-12 h-12 mx-auto mb-4" />
            )}
          </div>
          <h3 className="text-neutral-300 text-lg font-medium mb-2">
            {getEmptyStateMessage()}
          </h3>
          {selectedCategory === "favorites" && (
            <p className="text-neutral-500 text-sm">
              Nhấn vào biểu tượng ⭐ trên template để thêm vào yêu thích
            </p>
          )}
        </motion.div>
      ) : (
        /* Template Grid */
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredTemplates.map((template, index) => (
            <motion.div
              key={template.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="bg-neutral-900 rounded-lg border border-neutral-700 p-6 hover:border-neutral-600 transition-colors"
            >
              {/* Header */}
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <h3 className="text-white font-semibold text-lg mb-2">
                    {template.name}
                  </h3>
                  <p className="text-neutral-400 text-sm line-clamp-2">
                    {template.description}
                  </p>
                </div>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="text-neutral-400 hover:text-white"
                    >
                      <MoreVertical className="w-4 h-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent
                    align="end"
                    className="bg-neutral-800 border-neutral-700"
                  >
                    <DropdownMenuItem onClick={() => onEditTemplate(template)}>
                      <Edit className="w-4 h-4 mr-2" />
                      Chỉnh sửa
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => copyTemplate(template)}>
                      <Copy className="w-4 h-4 mr-2" />
                      Sao chép
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onClick={() => toggleFavorite(template.id)}
                    >
                      <Star
                        className={`w-4 h-4 mr-2 ${
                          template.isFavorite
                            ? "fill-yellow-400 text-yellow-400"
                            : ""
                        }`}
                      />
                      {template.isFavorite ? "Bỏ yêu thích" : "Yêu thích"}
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => toggleActive(template.id)}>
                      {template.isActive ? (
                        <Pause className="w-4 h-4 mr-2" />
                      ) : (
                        <Play className="w-4 h-4 mr-2" />
                      )}
                      {template.isActive ? "Tạm dừng" : "Kích hoạt"}
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem
                      onClick={() => deleteTemplate(template.id)}
                      className="text-red-400 hover:text-red-300"
                    >
                      <Trash2 className="w-4 h-4 mr-2" />
                      Xóa
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>

              {/* Tags */}
              <div className="flex flex-wrap gap-2 mb-4">
                {template.tags.slice(0, 3).map((tag) => (
                  <Badge
                    key={tag}
                    variant="secondary"
                    className="bg-neutral-800 text-neutral-300"
                  >
                    {tag}
                  </Badge>
                ))}
                {template.tags.length > 3 && (
                  <Badge
                    variant="secondary"
                    className="bg-neutral-800 text-neutral-300"
                  >
                    +{template.tags.length - 3}
                  </Badge>
                )}
              </div>

              {/* Stats */}
              <div className="flex items-center justify-between text-sm text-neutral-400">
                <div className="flex items-center space-x-4">
                  <span>Sử dụng: {template.usageCount}</span>
                  {template.isFavorite && (
                    <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                  )}
                </div>
                <div className="flex items-center space-x-2">
                  <div
                    className={`w-2 h-2 rounded-full ${
                      template.isActive ? "bg-green-400" : "bg-red-400"
                    }`}
                  />
                  <span>{template.isActive ? "Hoạt động" : "Tạm dừng"}</span>
                </div>
              </div>

              {/* Last used info for recent category */}
              {selectedCategory === "recent" && template.lastUsed && (
                <div className="mt-3 pt-3 border-t border-neutral-700">
                  <div className="flex items-center text-xs text-neutral-500">
                    <Clock className="w-3 h-3 mr-1" />
                    Sử dụng lần cuối:{" "}
                    {template.lastUsed.toLocaleDateString("vi-VN")}
                  </div>
                </div>
              )}
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}
