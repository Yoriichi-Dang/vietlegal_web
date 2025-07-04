"use client";

import { motion, AnimatePresence } from "motion/react";
import {
  IconX,
  IconExternalLink,
  IconSearch,
  IconSparkles,
  IconCheck,
  IconChevronDown,
} from "@tabler/icons-react";
import { useState } from "react";
import ReactMarkdown from "react-markdown";
import ExcelTable from "../excel-table";

interface ResearchSource {
  title: string;
  url: string;
  status: "pending" | "reading" | "completed";
}

interface AttachedFile {
  id: string;
  name: string;
  type: string;
  size: number;
  url?: string;
}

interface ResearchPanelProps {
  isOpen: boolean;
  onClose: () => void;
  sources?: ResearchSource[];
  title?: string;
  attachedFiles?: AttachedFile[];
  markdownContent?: string;
}

const getStatusIcon = (status?: string) => {
  switch (status) {
    case "completed":
      return <IconCheck className="h-3 w-3 text-green-400" />;
    case "reading":
      return (
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
        >
          <IconSearch className="h-3 w-3 text-blue-400" />
        </motion.div>
      );
    case "pending":
    default:
      return <div className="h-3 w-3 rounded-full bg-neutral-500" />;
  }
};

const getStatusText = (status?: string) => {
  switch (status) {
    case "completed":
      return "Đã đọc";
    case "reading":
      return "Đang đọc";
    case "pending":
    default:
      return "Chờ xử lý";
  }
};

export default function ResearchPanel({
  isOpen,
  onClose,
  sources = [],
  title = "Tổng hợp về bảo hiểm",
  markdownContent,
}: ResearchPanelProps) {
  const [expandedSources, setExpandedSources] = useState(true);

  // Function để mở URL trong tab mới
  const handleOpenUrl = (url: string) => {
    if (url) {
      window.open(url, "_blank", "noopener,noreferrer");
    }
  };

  if (!isOpen) return null;
  // custom-scrollbar [scrollbar-gutter:stable] overflow-y-auto
  return (
    <motion.div
      initial={{ width: 0, opacity: 0 }}
      animate={{ width: "48%", opacity: 1 }}
      exit={{ width: 0, opacity: 0 }}
      transition={{ duration: 0.3, ease: "easeInOut" }}
      className="pt-4 pb-6"
    >
      <div className="bg-neutral-900/95 border border-neutral-700/30 flex flex-col h-full custom-scrollbar [scrollbar-gutter:stable] overflow-y-auto rounded-xl">
        {/* Header */}
        <div className="p-6 border-b border-neutral-700/30 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <IconSparkles className="h-5 w-5 text-blue-400" />
            <h2 className="text-white font-medium text-base">{title}</h2>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-neutral-400 hover:text-white hover:bg-neutral-800/50 rounded-lg transition-colors"
          >
            <IconX className="h-4 w-4" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto">
          {/* Markdown Content Section - First */}
          {markdownContent && (
            <div className="px-6 py-6">
              <div className="prose prose-invert prose-sm max-w-none">
                <ReactMarkdown>{markdownContent}</ReactMarkdown>
              </div>
            </div>
          )}

          {/* Sources Section */}
          <div
            className={`p-6 ${
              markdownContent ? "border-t border-neutral-700/30" : ""
            }`}
          >
            <button
              onClick={() => setExpandedSources(!expandedSources)}
              className="flex items-center justify-between w-full text-left mb-4 group"
            >
              <div className="flex items-center gap-2">
                <motion.div
                  animate={{ rotate: expandedSources ? 90 : 0 }}
                  transition={{ duration: 0.2 }}
                  className="text-neutral-400 group-hover:text-neutral-200"
                >
                  <svg
                    className="h-4 w-4"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
                      clipRule="evenodd"
                    />
                  </svg>
                </motion.div>
                <span className="text-neutral-100 text-base font-medium">
                  Sources ({sources.length})
                </span>
              </div>
            </button>

            <AnimatePresence>
              {expandedSources && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.2 }}
                  className="space-y-2 overflow-hidden"
                >
                  {sources.map((source, index) => (
                    <motion.div
                      key={source.url}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.05 }}
                      className="group cursor-pointer"
                    >
                      <div className="flex items-start gap-4 p-4 rounded-xl hover:bg-neutral-800/40 transition-colors">
                        <div className="flex items-center gap-3 min-w-0 flex-1">
                          <div className="min-w-0 flex-1">
                            <p className="text-neutral-200 text-sm leading-relaxed line-clamp-2 group-hover:text-white transition-colors">
                              {source.title}
                            </p>
                            <div className="flex items-center gap-2 mt-1.5">
                              <div className="flex items-center gap-1">
                                {getStatusIcon(source.status)}
                                <span className="text-neutral-500 text-xs">
                                  {getStatusText(source.status)}
                                </span>
                              </div>
                            </div>
                          </div>
                        </div>
                        <button
                          onClick={() => handleOpenUrl(source.url)}
                          className="opacity-0 group-hover:opacity-100 p-2 text-neutral-400 hover:text-white transition-all rounded-lg hover:bg-neutral-700/50"
                          title={`Mở ${source.url}`}
                        >
                          <IconExternalLink className="h-4 w-4" />
                        </button>
                      </div>
                    </motion.div>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Unused Sources Section */}
          {/* <div className="px-6 pb-6 border-t border-neutral-700/30">
            <button className="flex items-center justify-between w-full text-left py-4 group">
              <div className="flex items-center gap-3">
                <motion.div className="text-neutral-400 group-hover:text-neutral-200">
                  <svg
                    className="h-4 w-4"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
                      clipRule="evenodd"
                    />
                  </svg>
                </motion.div>
                <span className="text-neutral-400 text-base">
                  Sources read but not used in the report
                </span>
              </div>
            </button>
          </div> */}

          {/* Sources Used Section */}
          {/* {showSourcesUsed && (
            <div className="px-6 pb-6 border-t border-neutral-700/30">
              <button
                onClick={() => setExpandedSourcesUsed(!expandedSourcesUsed)}
                className="flex items-center justify-between w-full text-left py-4 group"
              >
                <div className="flex items-center gap-3">
                  <motion.div
                    animate={{ rotate: expandedSourcesUsed ? 90 : 0 }}
                    transition={{ duration: 0.2 }}
                    className="text-neutral-400 group-hover:text-neutral-200"
                  >
                    <IconChevronDown className="h-4 w-4" />
                  </motion.div>
                  <span className="text-neutral-100 text-base font-medium">
                    Sources used in the report
                  </span>
                </div>
              </button>

              <AnimatePresence>
                {expandedSourcesUsed && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.2 }}
                    className="space-y-3 overflow-hidden"
                  >
                    {sourcesUsed?.map((source, index) => (
                      <motion.div
                        key={source.id}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.05 }}
                        className="group cursor-pointer"
                      >
                        <div className="flex items-start gap-4 p-4 rounded-xl hover:bg-neutral-800/40 transition-colors border border-neutral-700/30">
                          <div className="flex items-center gap-3 min-w-0 flex-1">
                            <span className="text-lg shrink-0">
                              {source.icon}
                            </span>
                            <div className="min-w-0 flex-1">
                              <p className="text-neutral-200 text-sm leading-relaxed line-clamp-2 group-hover:text-white transition-colors">
                                {source.title}
                              </p>
                              <div className="flex items-center gap-2 mt-1.5">
                                <span className="text-blue-400 text-xs font-medium">
                                  {source.domain}
                                </span>
                              </div>
                            </div>
                          </div>
                          <button className="opacity-0 group-hover:opacity-100 p-2 text-neutral-400 hover:text-white transition-all rounded-lg hover:bg-neutral-700/50">
                            <IconExternalLink className="h-4 w-4" />
                          </button>
                        </div>
                      </motion.div>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          )} */}

          {/* Excel Table Section */}
          {/* {showTable && tableData && tableData.length > 0 && (
            <div className="px-6 pb-6 border-t border-neutral-700/30">
              <div className="pt-6">
                <ExcelTable
                  data={tableData}
                  title="Bảng 1: Tổng hợp Doanh thu phí bảo hiểm toàn thị trường Việt Nam (2022-2024)"
                />
              </div>
            </div>
          )} */}

          {/* Thoughts Section */}
        </div>
      </div>
    </motion.div>
  );
}
