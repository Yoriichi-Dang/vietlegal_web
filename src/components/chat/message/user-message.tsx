"use client";

import { motion } from "motion/react";
import Image from "next/image";
import {
  IconFile,
  IconPhoto,
  IconFileText,
  IconVideo,
  IconDownload,
  IconFileSpreadsheet,
  IconFileTypeCsv,
} from "@tabler/icons-react";
import { Attachment } from "ai";
import { useState, useEffect } from "react";
import * as XLSX from "xlsx";
import Papa from "papaparse";
import ExcelTable from "../../excel-table";

interface UserMessageProps {
  content: string;
  experimental_attachments?: Attachment[];
}

const getFileIcon = (type: string, name?: string) => {
  if (type.startsWith("image/")) return <IconPhoto className="h-4 w-4" />;
  if (type.startsWith("video/")) return <IconVideo className="h-4 w-4" />;
  if (type.includes("pdf") || type.includes("document"))
    return <IconFileText className="h-4 w-4" />;
  if (name?.endsWith(".csv") || type.includes("csv"))
    return <IconFileTypeCsv className="h-4 w-4" />;
  if (
    name?.endsWith(".xlsx") ||
    name?.endsWith(".xls") ||
    type.includes("spreadsheet")
  )
    return <IconFileSpreadsheet className="h-4 w-4" />;
  return <IconFile className="h-4 w-4" />;
};

const isSpreadsheetFile = (type: string, name?: string) => {
  const excelTypes = [
    "application/vnd.ms-excel",
    "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
  ];
  const csvTypes = ["text/csv"];
  return (
    excelTypes.some((t) => type.includes(t)) ||
    csvTypes.some((t) => type.includes(t)) ||
    name?.endsWith(".xlsx") ||
    name?.endsWith(".xls") ||
    name?.endsWith(".csv")
  );
};

// Component to handle spreadsheet files
const SpreadsheetAttachment = ({ attachment }: { attachment: Attachment }) => {
  const [tableData, setTableData] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [showTable, setShowTable] = useState(false);

  const parseSpreadsheetFile = async () => {
    if (!attachment.url) return;

    setIsLoading(true);
    try {
      const response = await fetch(attachment.url);
      const arrayBuffer = await response.arrayBuffer();

      if (attachment.name?.endsWith(".csv")) {
        // Parse CSV
        const text = new TextDecoder().decode(arrayBuffer);
        Papa.parse(text, {
          header: true,
          skipEmptyLines: true,
          complete: (results) => {
            const processedData = results.data.filter((row: any) =>
              Object.values(row).some(
                (value) => value !== undefined && value !== ""
              )
            );
            setTableData(processedData);
            setShowTable(true);
          },
        });
      } else {
        // Parse Excel
        const data = new Uint8Array(arrayBuffer);
        const workbook = XLSX.read(data, { type: "array" });
        const worksheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[worksheetName];
        const jsonData = XLSX.utils.sheet_to_json(worksheet, { header: 1 });

        if (jsonData.length > 0) {
          const headers = jsonData[0] as string[];
          const rows = jsonData.slice(1) as any[][];

          const processedData = rows
            .filter((row) =>
              row.some((cell) => cell !== undefined && cell !== "")
            )
            .map((row) => {
              const obj: any = {};
              headers.forEach((header, index) => {
                obj[header || `Column ${index + 1}`] = row[index] || "";
              });
              return obj;
            });

          setTableData(processedData);
          setShowTable(true);
        }
      }
    } catch (error) {
      console.error("Error parsing spreadsheet:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="relative rounded-lg overflow-hidden bg-neutral-900 p-3">
      <div className="flex items-center gap-3 mb-3">
        <div className="bg-neutral-700 p-2 rounded-lg">
          {getFileIcon(attachment.contentType || "", attachment.name)}
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-sm font-medium text-neutral-200 truncate">
            {attachment.name}
          </p>
          <p className="text-xs text-neutral-400">
            {attachment.name?.endsWith(".csv") ? "CSV File" : "Excel File"}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={parseSpreadsheetFile}
            disabled={isLoading}
            className="px-3 py-1 text-xs bg-blue-600 hover:bg-blue-700 disabled:bg-neutral-600 text-white rounded-lg transition-colors"
          >
            {isLoading ? "Loading..." : showTable ? "Refresh" : "View Table"}
          </button>
          <a
            href={attachment.url}
            download={attachment.name}
            target="_blank"
            rel="noopener noreferrer"
            className="p-1 text-neutral-400 hover:text-blue-400 transition-colors rounded-full hover:bg-neutral-700"
          >
            <IconDownload className="h-4 w-4" />
          </a>
        </div>
      </div>

      {showTable && tableData.length > 0 && (
        <div className="mt-3">
          <ExcelTable data={tableData} title={`Data from ${attachment.name}`} />
        </div>
      )}
    </div>
  );
};

export default function UserMessage({
  content,
  experimental_attachments,
}: UserMessageProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex flex-col items-end gap-2"
    >
      {/* Attachments - Separate from message content */}
      {experimental_attachments && experimental_attachments.length > 0 && (
        <div className="max-w-[80%] w-fit bg-neutral-800 rounded-xl p-3 border border-neutral-700 shadow-md">
          <div className="space-y-3">
            {experimental_attachments.map((attachment, index) => {
              // Handle spreadsheet files (Excel/CSV)
              if (
                isSpreadsheetFile(attachment.contentType || "", attachment.name)
              ) {
                return (
                  <SpreadsheetAttachment key={index} attachment={attachment} />
                );
              }

              // Handle image attachments
              if (attachment.contentType?.startsWith("image/")) {
                return (
                  <div key={index} className="relative">
                    <div className="relative rounded-lg overflow-hidden bg-neutral-900">
                      <Image
                        src={attachment.url}
                        alt={attachment.name || "Image attachment"}
                        width={300}
                        height={200}
                        className="w-full h-auto object-cover rounded-lg hover:scale-[1.02] transition-transform"
                      />
                    </div>
                    <div className="mt-2 flex items-center justify-between">
                      <span className="text-sm text-neutral-300 truncate max-w-[180px]">
                        {attachment.name}
                      </span>
                      <a
                        href={attachment.url}
                        download={attachment.name}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="p-1 text-neutral-400 hover:text-blue-400 transition-colors rounded-full hover:bg-neutral-700"
                      >
                        <IconDownload className="h-4 w-4" />
                      </a>
                    </div>
                  </div>
                );
              }

              // Handle video attachments
              if (attachment.contentType?.startsWith("video/")) {
                return (
                  <div
                    key={index}
                    className="relative rounded-lg overflow-hidden bg-neutral-900 p-3"
                  >
                    <div className="flex items-center gap-3">
                      <div className="bg-neutral-700 p-2 rounded-lg">
                        <IconVideo className="h-6 w-6 text-blue-400" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-neutral-200 truncate">
                          {attachment.name}
                        </p>
                      </div>
                      <a
                        href={attachment.url}
                        download={attachment.name}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="p-1 text-neutral-400 hover:text-blue-400 transition-colors rounded-full hover:bg-neutral-700"
                      >
                        <IconDownload className="h-4 w-4" />
                      </a>
                    </div>
                  </div>
                );
              }

              // Handle document/text attachments
              return (
                <div
                  key={index}
                  className="relative rounded-lg overflow-hidden bg-neutral-900 p-3"
                >
                  <div className="flex items-center gap-3">
                    <div className="bg-neutral-700 p-2 rounded-lg">
                      {getFileIcon(
                        attachment.contentType || "",
                        attachment.name
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-neutral-200 truncate">
                        {attachment.name}
                      </p>
                    </div>
                    <a
                      href={attachment.url}
                      download={attachment.name}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-1 text-neutral-400 hover:text-blue-400 transition-colors rounded-full hover:bg-neutral-700"
                    >
                      <IconDownload className="h-4 w-4" />
                    </a>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Message content - Original styling */}
      <div className="max-w-[80%] bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-2xl px-4 py-3">
        <div className="text-sm leading-relaxed whitespace-pre-wrap">
          {content}
        </div>
      </div>
    </motion.div>
  );
}
