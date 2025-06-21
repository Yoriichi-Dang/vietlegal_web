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
  id: string;
  title: string;
  domain: string;
  url: string;
  icon: string;
  description?: string;
  status?: "pending" | "reading" | "completed";
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
  showThoughts?: boolean;
  attachedFiles?: AttachedFile[];
  markdownContent?: string;
  showSourcesUsed?: boolean;
  sourcesUsed?: ResearchSource[];
  tableData?: any[];
  showTable?: boolean;
}

// Sample Excel data for insurance market
const insuranceMarketData = [
  {
    Năm: 2022,
    "Tổng Doanh thu phí bảo hiểm toàn thị trường (tỷ đồng)": 177303,
    "Tăng trường so với cùng kỳ (%)": 16.9,
    "Bảo hiểm nhân thọ (tỷ đồng)": 120850,
    "Bảo hiểm phi nhân thọ (tỷ đồng)": 56453,
  },
  {
    Năm: 2023,
    "Tổng Doanh thu phí bảo hiểm toàn thị trường (tỷ đồng)": 227398,
    "Tăng trường so với cùng kỳ (%)": -0.3,
    "Bảo hiểm nhân thọ (tỷ đồng)": 156720,
    "Bảo hiểm phi nhân thọ (tỷ đồng)": 70678,
  },
  {
    Năm: "2024 (ước tính)",
    "Tổng Doanh thu phí bảo hiểm toàn thị trường (tỷ đồng)": "227398 - 227500",
    "Tăng trường so với cùng kỳ (%)": "-0.3 đến -0.25",
    "Bảo hiểm nhân thọ (tỷ đồng)": 158000,
    "Bảo hiểm phi nhân thọ (tỷ đồng)": 69500,
  },
];

const sourcesUsedInReport: ResearchSource[] = [
  {
    id: "used-1",
    title:
      "Các loại hình bảo hiểm nhân thọ có bán tại Việt Nam hiện nay - Manulife",
    domain: "manulife.com.vn",
    url: "https://manulife.com.vn",
    icon: "🏢",
    status: "completed",
  },
  {
    id: "used-2",
    title: "Luật kinh doanh bảo hiểm và 4 điều cần biết - NewCA",
    domain: "newca.vn",
    url: "https://newca.vn",
    icon: "🏛️",
    status: "completed",
  },
  {
    id: "used-3",
    title:
      "Những điểm mới Luật Kinh doanh bảo hiểm có hiệu lực thi hành từ 01/01/2023",
    domain: "dbndhatinh.vn",
    url: "https://dbndhatinh.vn",
    icon: "⚖️",
    status: "completed",
  },
  {
    id: "used-4",
    title: "Các loại bảo hiểm phổ biến và cách phân biệt - Home Credit",
    domain: "homecredit.vn",
    url: "https://homecredit.vn",
    icon: "🏠",
    status: "completed",
  },
  {
    id: "used-5",
    title:
      "Bộ Tài chính có nhiệm vụ và quyền hạn gì trong công tác quản lý nhà nước về lĩnh vực bảo hiểm theo quy định...",
    domain: "thuvienphapluat.vn",
    url: "https://thuvienphapluat.vn",
    icon: "📋",
    status: "completed",
  },
  {
    id: "used-6",
    title:
      "Cơ quan nào là cơ quan quản lý Nhà nước về bảo hiểm xã hội? - Luật Hoàng Anh",
    domain: "luathoanganh.vn",
    url: "https://luathoanganh.vn",
    icon: "🛡️",
    status: "completed",
  },
  {
    id: "used-7",
    title: "CƠ QUAN NÀO THỰC HIỆN CHỨC NĂNG QUẢN LÝ NHÀ NƯỚC VỀ BẢO HIỂM Y TẾ?",
    domain: "tlklawfirm.vn",
    url: "https://tlklawfirm.vn",
    icon: "💊",
    status: "completed",
  },
  {
    id: "used-8",
    title:
      "Nghị định số 46/2023/NĐ-CP, ngày 1/7/2023 của Chính phủ quy định...",
    domain: "tulieuvanken.dangcongsan.vn",
    url: "https://tulieuvanken.dangcongsan.vn",
    icon: "📜",
    status: "completed",
  },
];

const defaultSources: ResearchSource[] = [
  {
    id: "1",
    title: "Chính sách BHXH 2025 có gì thay đổi: 7 điều người dân cần biết",
    domain: "luatvietnam.vn",
    url: "https://luatvietnam.vn",
    icon: "🇻🇳",
    status: "completed",
  },
  {
    id: "2",
    title:
      "Từ 1/7/2025: Công ty bảo hiểm nhân thọ chính thức đứng bán các sản phẩm bảo hiểm sau",
    domain: "nguoiquansat.vn",
    url: "https://nguoiquansat.vn",
    icon: "📊",
    status: "completed",
  },
  {
    id: "3",
    title: "Công thông tin điện tử Bộ Tài Chính",
    domain: "mof.gov.vn",
    url: "https://mof.gov.vn",
    icon: "🏛️",
    status: "reading",
  },
  {
    id: "4",
    title: "Bảo hiểm xã hội",
    domain: "baohiemxahoi.gov.vn",
    url: "https://baohiemxahoi.gov.vn",
    icon: "🛡️",
    status: "completed",
  },
  {
    id: "5",
    title: "Dừng bán những dòng sản phẩm bảo hiểm nhân thọ từ ngày 1/7/2025",
    domain: "kenh14.vn",
    url: "https://kenh14.vn",
    icon: "📰",
    status: "pending",
  },
  {
    id: "6",
    title:
      "Manulife, Dai-ichi Life, AIA, Generali,... đồng loạt thông báo dừng triển khai nhiều sản phẩm bảo hiểm nhân thọ theo qui...",
    domain: "cafef.vn",
    url: "https://cafef.vn",
    icon: "💼",
    status: "reading",
  },
  {
    id: "7",
    title: "Tổng quan, số liệu thị trường Bảo hiểm",
    domain: "iav.vn",
    url: "https://iav.vn",
    icon: "📈",
    status: "completed",
  },
  {
    id: "8",
    title: "NGÀNH BẢO HIỂM",
    domain: "cafef1.mediacdn.vn",
    url: "https://cafef1.mediacdn.vn",
    icon: "📋",
    status: "pending",
  },
  {
    id: "9",
    title: "Mức hưởng lương hưu bảo hiểm xã hội năm 2025",
    domain: "ebh.vn",
    url: "https://ebh.vn",
    icon: "💰",
    status: "completed",
  },
  {
    id: "10",
    title: "THỊ TRƯỜNG BẢO HIỂM VIỆT NAM: THÁCH THỨC VÀ CƠ HỘI",
    domain: "b-alpha.vn",
    url: "https://b-alpha.vn",
    icon: "🎯",
    status: "reading",
  },
  {
    id: "11",
    title:
      "Cơ hội và thách thức của ngành bảo hiểm trong bối cảnh Việt Nam gia nhập CPTPP",
    domain: "trungtamwto.vn",
    url: "https://trungtamwto.vn",
    icon: "🌐",
    status: "completed",
  },
  {
    id: "12",
    title:
      "Mức đóng bảo hiểm y tế sẽ có nhiều thay đổi từ ngày 1-7 - Báo Tuổi Trẻ",
    domain: "tuoitre.vn",
    url: "https://tuoitre.vn",
    icon: "📰",
    status: "pending",
  },
  {
    id: "13",
    title:
      "Thay đổi mức đóng bảo hiểm y tế hộ gia đình từ 01/7/2025? - Thư Viện Pháp Luật",
    domain: "thuvienphapluat.vn",
    url: "https://thuvienphapluat.vn",
    icon: "⚖️",
    status: "completed",
  },
  {
    id: "14",
    title: "Mức hưởng bảo hiểm y tế theo nhóm đối tượng năm 2025",
    domain: "ebh.vn",
    url: "https://ebh.vn",
    icon: "💊",
    status: "reading",
  },
];

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
  sources = defaultSources,
  title = "Tổng hợp về bảo hiểm",
  showThoughts = true,
  showSourcesUsed = true,
  sourcesUsed = sourcesUsedInReport,
  markdownContent,
  tableData = insuranceMarketData,
  showTable = true,
}: ResearchPanelProps) {
  const [expandedThoughts, setExpandedThoughts] = useState(false);
  const [expandedSources, setExpandedSources] = useState(true);
  const [expandedSourcesUsed, setExpandedSourcesUsed] = useState(false);

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
                      key={source.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.05 }}
                      className="group cursor-pointer"
                    >
                      <div className="flex items-start gap-4 p-4 rounded-xl hover:bg-neutral-800/40 transition-colors">
                        <div className="flex items-center gap-3 min-w-0 flex-1">
                          <span className="text-lg shrink-0">
                            {source.icon}
                          </span>
                          <div className="min-w-0 flex-1">
                            <p className="text-neutral-200 text-sm leading-relaxed line-clamp-2 group-hover:text-white transition-colors">
                              {source.title}
                            </p>
                            <div className="flex items-center gap-2 mt-1.5">
                              <span className="text-neutral-400 text-xs">
                                {source.domain}
                              </span>
                              <div className="flex items-center gap-1">
                                {getStatusIcon(source.status)}
                                <span className="text-neutral-500 text-xs">
                                  {getStatusText(source.status)}
                                </span>
                              </div>
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

          {/* Unused Sources Section */}
          <div className="px-6 pb-6 border-t border-neutral-700/30">
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
          </div>

          {/* Sources Used Section */}
          {showSourcesUsed && (
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
          )}

          {/* Excel Table Section */}
          {showTable && tableData && tableData.length > 0 && (
            <div className="px-6 pb-6 border-t border-neutral-700/30">
              <div className="pt-6">
                <ExcelTable
                  data={tableData}
                  title="Bảng 1: Tổng hợp Doanh thu phí bảo hiểm toàn thị trường Việt Nam (2022-2024)"
                />
              </div>
            </div>
          )}

          {/* Thoughts Section */}
          {showThoughts && (
            <div className="px-6 pb-6 border-t border-neutral-700/30">
              <button
                onClick={() => setExpandedThoughts(!expandedThoughts)}
                className="flex items-center justify-between w-full text-left py-4 group"
              >
                <div className="flex items-center gap-3">
                  <motion.div
                    animate={{ rotate: expandedThoughts ? 90 : 0 }}
                    transition={{ duration: 0.2 }}
                    className="text-neutral-400 group-hover:text-neutral-200"
                  >
                    <IconChevronDown className="h-4 w-4" />
                  </motion.div>
                  <span className="text-neutral-100 text-base font-medium">
                    Thoughts
                  </span>
                </div>
              </button>

              <AnimatePresence>
                {expandedThoughts && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.2 }}
                    className="overflow-hidden"
                  >
                    <div className="bg-neutral-800/40 rounded-xl p-5 space-y-4">
                      <p className="text-neutral-300 text-sm leading-relaxed">
                        Tôi đã tổng hợp thành công các thông tin cốt lõi về thị
                        trường bảo hiểm Việt Nam, bao gồm các thay đổi quan
                        trọng trong chính sách BHXH 2025, quy định mới về bảo
                        hiểm nhân thọ, và xu hướng phát triển của ngành.
                      </p>
                      <p className="text-neutral-300 text-sm leading-relaxed">
                        Đặc biệt chú ý đến việc dừng bán một số sản phẩm bảo
                        hiểm nhân thọ từ 1/7/2025 và các thay đổi trong mức đóng
                        bảo hiểm y tế.
                      </p>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
}
