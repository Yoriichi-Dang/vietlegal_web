"use client";

import { motion } from "motion/react";
import { IconRobot } from "@tabler/icons-react";
import { MarkdownContent } from "./markdown-content";
import MessageActions from "./message-actions";
import { Attachment } from "ai";
import ExcelTable from "../../excel-table";

interface AssistantMessageProps {
  content: string;
  messageId: string;
  onCopy: (content: string, messageId: string) => void;
  onRegenerate: (messageIndex: number) => void;
  messageIndex: number;
  isRegenerating: boolean;
  copiedId: string | null;
  experimental_attachments?: Attachment[];
}

// Function to detect if content contains table data
const detectTableData = (content: string) => {
  // Look for patterns that suggest tabular data
  const tablePatterns = [
    /\|.*\|.*\|/g, // Markdown table
    /\d+,.*,.*,/g, // CSV-like data
    /^\s*\w+\s*:\s*\d+/gm, // Key-value pairs with numbers
  ];

  return tablePatterns.some((pattern) => pattern.test(content));
};

// Function to extract sample table data from content
const extractSampleTableData = (content: string) => {
  // This is a simple example - in real implementation, you might want more sophisticated parsing
  if (content.includes("bảo hiểm") || content.includes("insurance")) {
    return [
      {
        Năm: 2022,
        "Doanh thu (tỷ đồng)": 177303,
        "Tăng trưởng (%)": 16.9,
        "Bảo hiểm nhân thọ": 120850,
        "Bảo hiểm phi nhân thọ": 56453,
      },
      {
        Năm: 2023,
        "Doanh thu (tỷ đồng)": 227398,
        "Tăng trưởng (%)": -0.3,
        "Bảo hiểm nhân thọ": 156720,
        "Bảo hiểm phi nhân thọ": 70678,
      },
    ];
  }
  return null;
};

export default function AssistantMessage({
  content,
  messageId,
  onCopy,
  onRegenerate,
  messageIndex,
  isRegenerating,
  copiedId,
  experimental_attachments,
}: AssistantMessageProps) {
  const shouldShowTable = detectTableData(content);
  const tableData = shouldShowTable ? extractSampleTableData(content) : null;
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex gap-3 group"
    >
      {/* Avatar */}
      <div className="flex-shrink-0 w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
        <IconRobot className="h-4 w-4 text-white" />
      </div>

      {/* Message content */}
      <div className="flex-1 min-w-0">
        <div className="bg-neutral-800 rounded-2xl px-4 py-3 relative">
          <MarkdownContent content={content} />

          {/* Table display for data-rich content */}
          {tableData && tableData.length > 0 && (
            <div className="mt-4 pt-4 border-t border-neutral-700">
              <ExcelTable
                data={tableData}
                title="Dữ liệu thống kê từ phân tích"
              />
            </div>
          )}

          {/* Attachments display */}
          {experimental_attachments && experimental_attachments.length > 0 && (
            <div className="mt-4 pt-4 border-t border-neutral-700">
              <div className="space-y-2">
                <h4 className="text-sm font-medium text-neutral-300">
                  Tệp đính kèm:
                </h4>
                <div className="space-y-2">
                  {experimental_attachments.map((attachment, index) => (
                    <div
                      key={index}
                      className="flex items-center gap-2 p-2 bg-neutral-700/50 rounded-lg"
                    >
                      <span className="text-sm text-neutral-300">
                        {attachment.name}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Message actions */}
          <MessageActions
            content={content}
            messageId={messageId}
            onCopy={onCopy}
            onRegenerate={() => onRegenerate(messageIndex)}
            isRegenerating={isRegenerating}
            copiedId={copiedId}
          />
        </div>
      </div>
    </motion.div>
  );
}
