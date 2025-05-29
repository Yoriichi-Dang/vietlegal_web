"use client";

import { motion } from "framer-motion";
import {
  FileText,
  Calculator,
  Shield,
  Users,
  Calendar,
  MoreHorizontal,
  Star,
  Share2,
  Download,
  Trash2,
  Eye,
  Folder,
  File,
  ImageIcon,
  Video,
  Music,
  Scale,
} from "lucide-react";
import { useState, useMemo } from "react";
import type { ProjectItem, SortOption, ProjectFilter } from "@/types/project";

interface ProjectGridProps {
  projects: ProjectItem[];
  activeTab: string;
  searchQuery: string;
  viewMode: "grid" | "list";
  selectedItems: string[];
  setSelectedItems: (items: string[]) => void;
  onViewFile: (item: ProjectItem) => void;
  onDeleteItem: (item: ProjectItem) => void;
  onShareItem: (item: ProjectItem) => void;
  onToggleStarred: (itemId: string) => void;
  sortOption: SortOption;
  filterOptions: ProjectFilter;
}

export default function ProjectGrid({
  projects,
  activeTab,
  searchQuery,
  viewMode,
  selectedItems,
  setSelectedItems,
  onViewFile,
  onDeleteItem,
  onShareItem,
  onToggleStarred,
  sortOption,
  filterOptions,
}: ProjectGridProps) {
  const [hoveredItem, setHoveredItem] = useState<string | null>(null);

  // Filter and sort projects
  const filteredProjects = useMemo(() => {
    return projects
      .filter((project) => {
        // Search filter
        const matchesSearch =
          project.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          project.tags?.some((tag) =>
            tag.toLowerCase().includes(searchQuery.toLowerCase())
          ) ||
          project.owner?.toLowerCase().includes(searchQuery.toLowerCase()) ||
          false;

        // Tab filter
        const matchesTab =
          activeTab === "recent" ||
          (activeTab === "starred" && project.starred) ||
          (activeTab === "shared" && project.shared) ||
          (activeTab === "trash" && false); // Implement trash logic

        // Type filter
        const matchesType =
          filterOptions.type === "all" ||
          project.type === filterOptions.type ||
          (filterOptions.type === "file" && project.type === "file");

        // Date filter
        let matchesDate = true;
        if (filterOptions.date !== "all" && project.createdAt) {
          const now = new Date();
          const projectDate = new Date(project.createdAt);

          if (filterOptions.date === "today") {
            matchesDate = projectDate.toDateString() === now.toDateString();
          } else if (filterOptions.date === "week") {
            const weekAgo = new Date(now);
            weekAgo.setDate(now.getDate() - 7);
            matchesDate = projectDate >= weekAgo;
          } else if (filterOptions.date === "month") {
            const monthAgo = new Date(now);
            monthAgo.setMonth(now.getMonth() - 1);
            matchesDate = projectDate >= monthAgo;
          } else if (filterOptions.date === "year") {
            const yearAgo = new Date(now);
            yearAgo.setFullYear(now.getFullYear() - 1);
            matchesDate = projectDate >= yearAgo;
          }
        }

        // Shared and starred filters
        const matchesShared = !filterOptions.shared || project.shared;
        const matchesStarred = !filterOptions.starred || project.starred;

        return (
          matchesSearch &&
          matchesTab &&
          matchesType &&
          matchesDate &&
          matchesShared &&
          matchesStarred
        );
      })
      .sort((a, b) => {
        // Sort by selected option
        switch (sortOption) {
          case "name-asc":
            return a.name.localeCompare(b.name);
          case "name-desc":
            return b.name.localeCompare(a.name);
          case "date-asc":
            return (
              new Date(a.createdAt || "").getTime() -
              new Date(b.createdAt || "").getTime()
            );
          case "date-desc":
            return (
              new Date(b.createdAt || "").getTime() -
              new Date(a.createdAt || "").getTime()
            );
          case "size-asc":
            return a.size?.localeCompare(b.size || "") || 0;
          case "size-desc":
            return b.size?.localeCompare(a.size || "") || 0;
          default:
            return 0;
        }
      });
  }, [projects, activeTab, searchQuery, sortOption, filterOptions]);

  const handleSelectItem = (id: string) => {
    if (selectedItems.includes(id)) {
      setSelectedItems(selectedItems.filter((item) => item !== id));
    } else {
      setSelectedItems([...selectedItems, id]);
    }
  };

  const getFileIcon = (item: ProjectItem) => {
    if (item.type === "folder") return Folder;
    if (item.type === "project") {
      if (item.icon === "Calculator") return Calculator;
      if (item.icon === "Shield") return Shield;
      if (item.icon === "Users") return Users;
      if (item.icon === "Scale") return Scale;
      return FileText;
    }

    switch (item.fileType) {
      case "image":
        return ImageIcon;
      case "video":
        return Video;
      case "audio":
        return Music;
      case "excel":
        return FileText;
      case "word":
        return FileText;
      case "pdf":
        return FileText;
      default:
        return File;
    }
  };

  const getFileTypeColor = (item: ProjectItem) => {
    if (item.type === "folder") return "text-yellow-400";
    if (item.type === "project") return "text-blue-400";

    switch (item.fileType) {
      case "excel":
        return "text-green-400";
      case "word":
        return "text-blue-400";
      case "pdf":
        return "text-red-400";
      case "image":
        return "text-purple-400";
      case "video":
        return "text-pink-400";
      case "audio":
        return "text-orange-400";
      default:
        return "text-gray-400";
    }
  };

  if (viewMode === "list") {
    return (
      <div className="bg-neutral-800 rounded-lg border border-neutral-700 overflow-hidden">
        {/* Table Header */}
        <div className="grid grid-cols-12 gap-4 p-4 border-b border-neutral-700 text-sm font-medium text-neutral-400">
          <div className="col-span-1">
            <input
              type="checkbox"
              className="rounded border-neutral-600 bg-neutral-700 text-blue-500"
              onChange={(e) => {
                if (e.target.checked) {
                  setSelectedItems(filteredProjects.map((p) => p.id));
                } else {
                  setSelectedItems([]);
                }
              }}
              checked={
                selectedItems.length > 0 &&
                selectedItems.length === filteredProjects.length
              }
            />
          </div>
          <div className="col-span-4">Tên</div>
          <div className="col-span-2">Loại</div>
          <div className="col-span-2">Kích thước</div>
          <div className="col-span-2">Sửa đổi</div>
          <div className="col-span-1">Hành động</div>
        </div>

        {/* Table Body */}
        <div className="divide-y divide-neutral-700">
          {filteredProjects.map((project, index) => {
            const IconComponent = getFileIcon(project);
            const isSelected = selectedItems.includes(project.id);
            const isHovered = hoveredItem === project.id;

            return (
              <motion.div
                key={project.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                className={`grid grid-cols-12 gap-4 p-4 hover:bg-neutral-700 transition-colors cursor-pointer ${
                  isSelected ? "bg-blue-600/20" : ""
                }`}
                onClick={() => handleSelectItem(project.id)}
                onMouseEnter={() => setHoveredItem(project.id)}
                onMouseLeave={() => setHoveredItem(null)}
              >
                <div className="col-span-1">
                  <input
                    type="checkbox"
                    checked={isSelected}
                    onChange={() => handleSelectItem(project.id)}
                    className="rounded border-neutral-600 bg-neutral-700 text-blue-500"
                    onClick={(e) => e.stopPropagation()}
                  />
                </div>
                <div className="col-span-4 flex items-center space-x-3">
                  <IconComponent
                    className={`w-5 h-5 ${getFileTypeColor(project)}`}
                  />
                  <div>
                    <div className="text-white font-medium">{project.name}</div>
                    {project.owner && (
                      <div className="text-xs text-neutral-400">
                        Bởi {project.owner}
                      </div>
                    )}
                  </div>
                </div>
                <div className="col-span-2 text-neutral-400 capitalize">
                  {project.type}
                </div>
                <div className="col-span-2 text-neutral-400">
                  {project.size || project.items}
                </div>
                <div className="col-span-2 text-neutral-400">
                  {project.lastModified}
                </div>
                <div className="col-span-1">
                  <div className="flex items-center space-x-1">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onToggleStarred(project.id);
                      }}
                      className={`p-1 ${
                        project.starred
                          ? "text-yellow-400"
                          : "text-neutral-400 hover:text-yellow-400"
                      } transition-colors`}
                    >
                      <Star
                        className={`w-4 h-4 ${
                          project.starred ? "fill-current" : ""
                        }`}
                      />
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onViewFile(project);
                      }}
                      className="p-1 text-neutral-400 hover:text-white transition-colors"
                    >
                      <Eye className="w-4 h-4" />
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onShareItem(project);
                      }}
                      className="p-1 text-neutral-400 hover:text-green-400 transition-colors"
                    >
                      <Share2 className="w-4 h-4" />
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onDeleteItem(project);
                      }}
                      className="p-1 text-neutral-400 hover:text-red-400 transition-colors"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Empty State */}
        {filteredProjects.length === 0 && (
          <div className="p-8 text-center">
            <FileText className="w-12 h-12 text-neutral-500 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-white mb-2">
              Không tìm thấy dữ liệu
            </h3>
            <p className="text-neutral-400">
              Thử thay đổi bộ lọc hoặc tìm kiếm với từ khóa khác
            </p>
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {filteredProjects.map((project, index) => {
        const IconComponent = getFileIcon(project);
        const isSelected = selectedItems.includes(project.id);
        const isHovered = hoveredItem === project.id;

        return (
          <motion.div
            key={project.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className={`bg-neutral-800 rounded-lg border border-neutral-700 hover:border-neutral-600 transition-all duration-200 cursor-pointer group relative ${
              isSelected ? "ring-2 ring-blue-500 border-blue-500" : ""
            }`}
            onClick={() => handleSelectItem(project.id)}
            onMouseEnter={() => setHoveredItem(project.id)}
            onMouseLeave={() => setHoveredItem(null)}
          >
            {/* Selection Checkbox */}
            <div className="absolute top-3 left-3 z-10">
              <input
                type="checkbox"
                checked={isSelected}
                onChange={() => handleSelectItem(project.id)}
                className="rounded border-neutral-600 bg-neutral-700 text-blue-500"
                onClick={(e) => e.stopPropagation()}
              />
            </div>

            {/* Preview Area */}
            <div className="aspect-video bg-neutral-700 rounded-t-lg flex items-center justify-center relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 to-purple-500/10"></div>
              <IconComponent
                className={`w-12 h-12 ${getFileTypeColor(
                  project
                )} relative z-10`}
              />

              {/* Hover Actions */}
              <div className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity">
                <div className="flex items-center space-x-1">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onToggleStarred(project.id);
                    }}
                    className={`p-1 bg-neutral-800/80 rounded ${
                      project.starred
                        ? "text-yellow-400"
                        : "text-neutral-300 hover:text-yellow-400"
                    }`}
                  >
                    <Star
                      className={`w-4 h-4 ${
                        project.starred ? "fill-current" : ""
                      }`}
                    />
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onShareItem(project);
                    }}
                    className="p-1 bg-neutral-800/80 rounded text-neutral-300 hover:text-green-400"
                  >
                    <Share2 className="w-4 h-4" />
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      // More actions menu
                    }}
                    className="p-1 bg-neutral-800/80 rounded text-neutral-300 hover:text-white"
                  >
                    <MoreHorizontal className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>

            {/* Content */}
            <div className="p-4">
              <h3 className="text-white font-medium text-sm mb-1 line-clamp-2">
                {project.name}
              </h3>
              <div className="flex items-center justify-between text-xs text-neutral-400 mb-2">
                <span className="capitalize">{project.type}</span>
                <span>{project.size || project.items}</span>
              </div>

              {project.owner && (
                <div className="text-xs text-neutral-500 mb-2">
                  Bởi {project.owner}
                </div>
              )}

              {/* Tags */}
              {project.tags && project.tags.length > 0 && (
                <div className="flex flex-wrap gap-1 mb-3">
                  {project.tags.slice(0, 2).map((tag, index) => (
                    <span
                      key={index}
                      className="px-1.5 py-0.5 bg-neutral-700 text-neutral-300 text-xs rounded"
                    >
                      {tag}
                    </span>
                  ))}
                  {project.tags.length > 2 && (
                    <span className="px-1.5 py-0.5 bg-neutral-700 text-neutral-300 text-xs rounded">
                      +{project.tags.length - 2}
                    </span>
                  )}
                </div>
              )}

              <div className="flex items-center justify-between mt-3">
                <div className="flex items-center space-x-1 text-xs text-neutral-500">
                  <Calendar className="w-3 h-3" />
                  <span>{project.lastModified}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onViewFile(project);
                    }}
                    className="p-1 text-neutral-400 hover:text-blue-400 transition-colors"
                    title="Xem"
                  >
                    <Eye className="w-4 h-4" />
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      // Download logic
                    }}
                    className="p-1 text-neutral-400 hover:text-green-400 transition-colors"
                    title="Tải xuống"
                  >
                    <Download className="w-4 h-4" />
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onDeleteItem(project);
                    }}
                    className="p-1 text-neutral-400 hover:text-red-400 transition-colors"
                    title="Xóa"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          </motion.div>
        );
      })}

      {/* Empty State */}
      {filteredProjects.length === 0 && (
        <div className="col-span-full p-12 text-center">
          <FileText className="w-16 h-16 text-neutral-500 mx-auto mb-4" />
          <h3 className="text-xl font-medium text-white mb-2">
            Không tìm thấy dữ liệu
          </h3>
          <p className="text-neutral-400 mb-6">
            Thử thay đổi bộ lọc hoặc tìm kiếm với từ khóa khác
          </p>
        </div>
      )}
    </div>
  );
}
