"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import ProjectSidebar from "@/components/project/project-sidebar";
import ProjectHeader from "@/components/project/project-header";
import ProjectGrid from "@/components/project/project-grid";
import CreateFolderModal from "@/components/project/create-folder-modal";
import UploadFileModal from "@/components/project/upload-file-modal";
import FileViewerModal from "@/components/project/file-viewer-modal";
import DeleteConfirmModal from "@/components/project/delete-confirm-modal";
import CreateProjectModal from "@/components/project/create-project-modal";
import ShareModal from "@/components/project/share-modal";
import ProjectDetailView from "@/components/project/project-detail-view";
import { toast } from "sonner";
import type { ProjectItem, ProjectFilter, SortOption } from "@/types/project";

export default function ProjectsPage() {
  const [activeTab, setActiveTab] = useState("recent");
  const [searchQuery, setSearchQuery] = useState("");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [sortOption, setSortOption] = useState<SortOption>("date-desc");
  const [filterOptions, setFilterOptions] = useState<ProjectFilter>({
    type: "all",
    date: "all",
    shared: false,
    starred: false,
  });

  // Modal states
  const [showCreateFolder, setShowCreateFolder] = useState(false);
  const [showUploadFile, setShowUploadFile] = useState(false);
  const [showFileViewer, setShowFileViewer] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [showCreateProject, setShowCreateProject] = useState(false);
  const [showShareModal, setShowShareModal] = useState(false);
  const [showProjectDetail, setShowProjectDetail] = useState(false);

  // Selected items
  const [selectedItem, setSelectedItem] = useState<ProjectItem | null>(null);
  const [selectedItems, setSelectedItems] = useState<string[]>([]);
  const [projects, setProjects] = useState<ProjectItem[]>([]);

  // Fetch projects (mock data for now)
  useEffect(() => {
    // In a real app, this would be an API call
    const mockProjects = [
      {
        id: "1",
        name: "Phân Tích Thuế TNDN Q4",
        type: "folder",
        items: "8 tài liệu",
        icon: "Calculator",
        lastModified: "2 ngày trước",
        shared: true,
        starred: false,
        owner: "Nguyễn Văn A",
        permissions: "admin",
        tags: ["thuế", "doanh nghiệp", "quý 4"],
        createdAt: new Date(2023, 11, 15),
      },
      {
        id: "2",
        name: "Hồ Sơ Bảo Hiểm XH",
        type: "folder",
        items: "5 video",
        icon: "Shield",
        lastModified: "1 tuần trước",
        shared: true,
        starred: true,
        owner: "Trần Thị B",
        permissions: "write",
        tags: ["bảo hiểm", "xã hội", "hồ sơ"],
        createdAt: new Date(2023, 11, 10),
      },
      {
        id: "3",
        name: "Báo cáo tài chính.xlsx",
        type: "file",
        fileType: "excel",
        size: "2.4 MB",
        icon: "FileText",
        lastModified: "3 ngày trước",
        shared: false,
        starred: false,
        content: "Nội dung báo cáo tài chính...",
        owner: "Lê Văn C",
        permissions: "read",
        tags: ["báo cáo", "tài chính", "excel"],
        createdAt: new Date(2023, 11, 18),
      },
      {
        id: "4",
        name: "Tư Vấn Thuế Cá Nhân",
        type: "project",
        items: "12 phân tích",
        icon: "Users",
        lastModified: "5 giờ trước",
        shared: false,
        starred: true,
        owner: "Phạm Thị D",
        permissions: "admin",
        tags: ["tư vấn", "thuế", "cá nhân"],
        createdAt: new Date(2023, 11, 20),
      },
      {
        id: "5",
        name: "Mẫu Đơn Khiếu Nại.docx",
        type: "file",
        fileType: "word",
        size: "156 KB",
        icon: "FileText",
        lastModified: "1 ngày trước",
        shared: true,
        starred: false,
        content: "Nội dung mẫu đơn khiếu nại...",
        owner: "Hoàng Văn E",
        permissions: "write",
        tags: ["mẫu đơn", "khiếu nại", "word"],
        createdAt: new Date(2023, 11, 19),
      },
      {
        id: "6",
        name: "Video hướng dẫn.mp4",
        type: "file",
        fileType: "video",
        size: "45.2 MB",
        icon: "Video",
        lastModified: "4 ngày trước",
        shared: false,
        starred: false,
        owner: "Ngô Thị F",
        permissions: "read",
        tags: ["video", "hướng dẫn", "mp4"],
        createdAt: new Date(2023, 11, 16),
      },
      {
        id: "7",
        name: "Phân tích luật thuế mới",
        type: "project",
        items: "15 tài liệu",
        icon: "Scale",
        lastModified: "1 ngày trước",
        shared: true,
        starred: true,
        owner: "Nguyễn Văn A",
        permissions: "admin",
        tags: ["luật", "thuế", "phân tích"],
        createdAt: new Date(2023, 11, 19),
      },
      {
        id: "8",
        name: "Ảnh biên lai.jpg",
        type: "file",
        fileType: "image",
        size: "1.2 MB",
        icon: "Image",
        lastModified: "6 giờ trước",
        shared: false,
        starred: false,
        owner: "Trần Thị B",
        permissions: "write",
        tags: ["ảnh", "biên lai", "jpg"],
        createdAt: new Date(2023, 11, 20),
      },
      // Thêm data cho danh mục Thuế
      {
        id: "9",
        name: "Khai báo thuế VAT.pdf",
        type: "file",
        fileType: "pdf",
        size: "1.8 MB",
        icon: "FileText",
        lastModified: "2 ngày trước",
        shared: false,
        starred: false,
        owner: "Nguyễn Văn A",
        permissions: "read",
        tags: ["thuế", "VAT", "khai báo"],
        createdAt: new Date(2023, 11, 17),
      },
      {
        id: "10",
        name: "Hướng dẫn tính thuế TNCN",
        type: "project",
        items: "8 tài liệu",
        icon: "Calculator",
        lastModified: "1 ngày trước",
        shared: true,
        starred: false,
        owner: "Lê Thị C",
        permissions: "write",
        tags: ["thuế", "TNCN", "hướng dẫn"],
        createdAt: new Date(2023, 11, 19),
      },
      // Thêm data cho danh mục Bảo hiểm
      {
        id: "11",
        name: "Quy trình bảo hiểm y tế",
        type: "project",
        items: "6 tài liệu",
        icon: "Shield",
        lastModified: "3 ngày trước",
        shared: true,
        starred: true,
        owner: "Phạm Văn D",
        permissions: "admin",
        tags: ["bảo hiểm", "y tế", "quy trình"],
        createdAt: new Date(2023, 11, 16),
      },
      {
        id: "12",
        name: "Mẫu đơn bảo hiểm xã hội.docx",
        type: "file",
        fileType: "word",
        size: "245 KB",
        icon: "FileText",
        lastModified: "4 ngày trước",
        shared: false,
        starred: false,
        owner: "Trần Thị B",
        permissions: "write",
        tags: ["bảo hiểm", "xã hội", "mẫu đơn"],
        createdAt: new Date(2023, 11, 15),
      },
      // Thêm data cho danh mục Pháp lý
      {
        id: "13",
        name: "Luật doanh nghiệp 2020",
        type: "file",
        fileType: "pdf",
        size: "5.2 MB",
        icon: "FileText",
        lastModified: "1 tuần trước",
        shared: true,
        starred: true,
        owner: "Hoàng Văn E",
        permissions: "read",
        tags: ["luật", "doanh nghiệp", "2020"],
        createdAt: new Date(2023, 11, 12),
      },
      {
        id: "14",
        name: "Tư vấn hợp đồng lao động",
        type: "project",
        items: "10 tài liệu",
        icon: "Scale",
        lastModified: "2 ngày trước",
        shared: false,
        starred: false,
        owner: "Ngô Thị F",
        permissions: "admin",
        tags: ["tư vấn", "hợp đồng", "lao động"],
        createdAt: new Date(2023, 11, 17),
      },
      // Thêm data cho bộ sưu tập Mẫu văn bản
      {
        id: "15",
        name: "Mẫu hợp đồng thuê nhà.docx",
        type: "file",
        fileType: "word",
        size: "180 KB",
        icon: "FileText",
        lastModified: "5 ngày trước",
        shared: true,
        starred: false,
        owner: "Lê Văn C",
        permissions: "write",
        tags: ["mẫu đơn", "hợp đồng", "thuê nhà"],
        createdAt: new Date(2023, 11, 14),
      },
      {
        id: "16",
        name: "Mẫu đơn xin việc.docx",
        type: "file",
        fileType: "word",
        size: "120 KB",
        icon: "FileText",
        lastModified: "1 tuần trước",
        shared: false,
        starred: true,
        owner: "Phạm Thị D",
        permissions: "read",
        tags: ["mẫu đơn", "xin việc", "word"],
        createdAt: new Date(2023, 11, 11),
      },
    ];

    setProjects(mockProjects as any);
  }, []);

  const handleCreateProject = () => {
    setShowCreateProject(true);
  };

  const handleViewFile = (item: ProjectItem) => {
    setSelectedItem(item);
    if (item.type === "project") {
      setShowProjectDetail(true);
    } else {
      setShowFileViewer(true);
    }
  };

  const handleDeleteItem = (item: ProjectItem) => {
    setSelectedItem(item);
    setShowDeleteConfirm(true);
  };

  const handleBulkDelete = () => {
    if (selectedItems.length > 0) {
      setShowDeleteConfirm(true);
    }
  };

  const handleShareItem = (item: ProjectItem) => {
    setSelectedItem(item);
    setShowShareModal(true);
  };

  const handleBulkShare = () => {
    if (selectedItems.length > 0) {
      setShowShareModal(true);
    }
  };

  const handleCreateFolder = (
    folderName: string,
    description: string,
    isPrivate: boolean
  ) => {
    // In a real app, this would be an API call
    const newFolder: ProjectItem = {
      id: `folder-${Date.now()}`,
      name: folderName,
      type: "folder",
      items: "0 tài liệu",
      icon: "Folder",
      lastModified: "Vừa xong",
      shared: !isPrivate,
      starred: false,
      owner: "Bạn",
      permissions: "admin",
      tags: [],
      createdAt: new Date(),
    };

    setProjects([newFolder, ...projects]);
    setShowCreateFolder(false);
    toast.success("Đã tạo thư mục mới");
  };

  const handleCreateNewProject = (
    projectName: string,
    description: string,
    projectType: string
  ) => {
    // In a real app, this would be an API call
    const newProject: ProjectItem = {
      id: `project-${Date.now()}`,
      name: projectName,
      type: "project",
      items: "0 tài liệu",
      icon:
        projectType === "tax"
          ? "Calculator"
          : projectType === "insurance"
          ? "Shield"
          : "Scale",
      lastModified: "Vừa xong",
      shared: false,
      starred: false,
      owner: "Bạn",
      permissions: "admin",
      description: description,
      tags: [projectType],
      createdAt: new Date(),
    };

    setProjects([newProject, ...projects]);
    setShowCreateProject(false);
    toast.success("Đã tạo dự án mới");
  };

  const handleUploadFiles = (files: File[]) => {
    // In a real app, this would be an API call
    const newFiles = files.map(
      (file): ProjectItem => ({
        id: `file-${Date.now()}-${file.name}`,
        name: file.name,
        type: "file",
        fileType: getFileType(file.type),
        size: formatFileSize(file.size),
        icon: getFileIcon(file.type),
        lastModified: "Vừa xong",
        shared: false,
        starred: false,
        owner: "Bạn",
        permissions: "admin",
        tags: [getFileType(file.type)],
        createdAt: new Date(),
      })
    );

    setProjects([...newFiles, ...projects]);
    setShowUploadFile(false);
    toast.success(`Đã tải lên ${files.length} tệp`);
  };

  const handleConfirmDelete = () => {
    if (selectedItem) {
      // Delete single item
      setProjects(projects.filter((p) => p.id !== selectedItem.id));
      toast.success(
        `Đã xóa ${
          selectedItem.type === "folder"
            ? "thư mục"
            : selectedItem.type === "project"
            ? "dự án"
            : "tệp"
        }`
      );
    } else if (selectedItems.length > 0) {
      // Delete multiple items
      setProjects(projects.filter((p) => !selectedItems.includes(p.id)));
      toast.success(`Đã xóa ${selectedItems.length} mục`);
      setSelectedItems([]);
    }
    setShowDeleteConfirm(false);
    setSelectedItem(null);
  };

  const handleShareConfirm = (
    emails: string[],
    permission: "read" | "write" | "admin"
  ) => {
    toast.success(`Đã chia sẻ với ${emails.length} người dùng`);
    setShowShareModal(false);
  };

  const handleToggleStarred = (itemId: string) => {
    setProjects(
      projects.map((p) => (p.id === itemId ? { ...p, starred: !p.starred } : p))
    );
  };

  // Helper functions
  const getFileType = (mimeType: string): string => {
    if (mimeType.startsWith("image/")) return "image";
    if (mimeType.startsWith("video/")) return "video";
    if (mimeType.startsWith("audio/")) return "audio";
    if (mimeType.includes("spreadsheet") || mimeType.includes("excel"))
      return "excel";
    if (mimeType.includes("document") || mimeType.includes("word"))
      return "word";
    if (mimeType.includes("pdf")) return "pdf";
    return "document";
  };

  const getFileIcon = (mimeType: string): string => {
    if (mimeType.startsWith("image/")) return "Image";
    if (mimeType.startsWith("video/")) return "Video";
    if (mimeType.startsWith("audio/")) return "Music";
    return "File";
  };

  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return (
      Number.parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i]
    );
  };

  return (
    <div className="h-screen bg-neutral-900 flex overflow-hidden">
      {/* Sidebar */}
      <ProjectSidebar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        setSelectedItem={setSelectedItem}
        setShowFileViewer={setShowFileViewer}
        className="h-screen overflow-y-auto"
      />

      {/* Main Content */}
      <div className="flex-1 flex flex-col h-screen overflow-hidden">
        {/* Header */}
        <ProjectHeader
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          viewMode={viewMode}
          setViewMode={setViewMode}
          selectedItems={selectedItems}
          onBulkDelete={handleBulkDelete}
          onBulkShare={handleBulkShare}
          sortOption={sortOption}
          setSortOption={setSortOption}
          filterOptions={filterOptions}
          setFilterOptions={setFilterOptions}
        />

        {/* Content Area */}
        <main className="flex-1 p-6 bg-neutral-900 overflow-y-auto">
          {/* Action Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex flex-wrap items-center gap-4 mb-6"
          >
            <button
              onClick={handleCreateProject}
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-all duration-200 shadow-lg hover:shadow-xl"
            >
              <svg
                className="w-4 h-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 4v16m8-8H4"
                />
              </svg>
              Tạo Dự Án
            </button>
            <button
              onClick={() => setShowUploadFile(true)}
              className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-all duration-200 shadow-lg hover:shadow-xl"
            >
              <svg
                className="w-4 h-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
                />
              </svg>
              Tải Lên
            </button>
            <button
              onClick={() => setShowCreateFolder(true)}
              className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-all duration-200 shadow-lg hover:shadow-xl"
            >
              <svg
                className="w-4 h-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2H5a2 2 0 00-2-2z"
                />
              </svg>
              Tạo Thư Mục
            </button>
            <button className="bg-orange-600 hover:bg-orange-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-all duration-200 shadow-lg hover:shadow-xl">
              <svg
                className="w-4 h-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z"
                />
              </svg>
              Ghi Âm
            </button>
          </motion.div>

          {/* Tabs */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="flex items-center gap-6 mb-6 border-b border-neutral-700"
          >
            {[
              { id: "recent", label: "Gần Đây" },
              { id: "starred", label: "Đã Đánh Dấu" },
              { id: "shared", label: "Đã Chia Sẻ" },
              { id: "trash", label: "Thùng Rác" },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`pb-3 px-1 text-sm font-medium transition-colors relative ${
                  activeTab === tab.id
                    ? "text-white border-b-2 border-blue-500"
                    : "text-neutral-400 hover:text-white"
                }`}
              >
                {tab.label}
              </button>
            ))}
          </motion.div>

          {/* Project Grid */}
          <ProjectGrid
            projects={projects}
            activeTab={activeTab}
            searchQuery={searchQuery}
            viewMode={viewMode}
            selectedItems={selectedItems}
            setSelectedItems={setSelectedItems}
            onViewFile={handleViewFile}
            onDeleteItem={handleDeleteItem}
            onShareItem={handleShareItem}
            onToggleStarred={handleToggleStarred}
            sortOption={sortOption}
            filterOptions={filterOptions}
          />
        </main>
      </div>

      {/* Modals */}
      {showCreateFolder && (
        <CreateFolderModal
          onClose={() => setShowCreateFolder(false)}
          onCreateFolder={handleCreateFolder}
        />
      )}

      {showUploadFile && (
        <UploadFileModal
          onClose={() => setShowUploadFile(false)}
          onUpload={handleUploadFiles}
        />
      )}

      {showFileViewer && selectedItem && (
        <FileViewerModal
          item={selectedItem}
          onClose={() => setShowFileViewer(false)}
        />
      )}

      {showDeleteConfirm && (
        <DeleteConfirmModal
          item={selectedItem}
          selectedItems={selectedItems}
          onClose={() => {
            setShowDeleteConfirm(false);
            setSelectedItem(null);
          }}
          onConfirm={handleConfirmDelete}
        />
      )}

      {showCreateProject && (
        <CreateProjectModal
          onClose={() => setShowCreateProject(false)}
          onCreateProject={handleCreateNewProject}
        />
      )}

      {showShareModal && (
        <ShareModal
          item={selectedItem}
          selectedItems={selectedItems}
          onClose={() => {
            setShowShareModal(false);
            setSelectedItem(null);
          }}
          onShare={handleShareConfirm}
        />
      )}

      {showProjectDetail && selectedItem && (
        <ProjectDetailView
          project={selectedItem}
          onClose={() => {
            setShowProjectDetail(false);
            setSelectedItem(null);
          }}
        />
      )}
    </div>
  );
}
