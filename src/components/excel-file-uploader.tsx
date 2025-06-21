"use client";

import React, { useCallback, useState } from "react";
import { motion } from "motion/react";
import {
  IconUpload,
  IconFileSpreadsheet,
  IconX,
  IconFileTypeCsv,
} from "@tabler/icons-react";
import * as XLSX from "xlsx";
import Papa from "papaparse";
import ExcelTable from "./excel-table";

interface DataFileUploaderProps {
  onDataLoaded?: (data: any[], fileName: string) => void;
  className?: string;
}

type FileType = "excel" | "csv";

export default function DataFileUploader({
  onDataLoaded,
  className = "",
}: DataFileUploaderProps) {
  const [isDragOver, setIsDragOver] = useState(false);
  const [tableData, setTableData] = useState<any[]>([]);
  const [fileName, setFileName] = useState<string>("");
  const [isLoading, setIsLoading] = useState(false);
  const [fileType, setFileType] = useState<FileType>("excel");

  const parseCSVFile = useCallback(
    (file: File) => {
      setIsLoading(true);
      Papa.parse(file, {
        header: true,
        skipEmptyLines: true,
        complete: (results) => {
          try {
            const processedData = results.data.filter((row: any) =>
              Object.values(row).some(
                (value) => value !== undefined && value !== ""
              )
            );

            setTableData(processedData);
            setFileName(file.name);
            setFileType("csv");
            onDataLoaded?.(processedData, file.name);
          } catch (error) {
            console.error("Error parsing CSV file:", error);
          } finally {
            setIsLoading(false);
          }
        },
        error: (error) => {
          console.error("Error parsing CSV file:", error);
          setIsLoading(false);
        },
      });
    },
    [onDataLoaded]
  );

  const parseExcelFile = useCallback(
    (file: File) => {
      setIsLoading(true);
      const reader = new FileReader();

      reader.onload = (e) => {
        try {
          const data = new Uint8Array(e.target?.result as ArrayBuffer);
          const workbook = XLSX.read(data, { type: "array" });

          // Get first worksheet
          const worksheetName = workbook.SheetNames[0];
          const worksheet = workbook.Sheets[worksheetName];

          // Convert to JSON
          const jsonData = XLSX.utils.sheet_to_json(worksheet, { header: 1 });

          // Process data - use first row as headers
          if (jsonData.length > 0) {
            const headers = jsonData[0] as string[];
            const rows = jsonData.slice(1) as any[][];

            const processedData = rows
              .filter((row) =>
                row.some((cell) => cell !== undefined && cell !== "")
              ) // Filter empty rows
              .map((row) => {
                const obj: any = {};
                headers.forEach((header, index) => {
                  obj[header || `Column ${index + 1}`] = row[index] || "";
                });
                return obj;
              });

            setTableData(processedData);
            setFileName(file.name);
            setFileType("excel");
            onDataLoaded?.(processedData, file.name);
          }
        } catch (error) {
          console.error("Error parsing Excel file:", error);
        } finally {
          setIsLoading(false);
        }
      };

      reader.readAsArrayBuffer(file);
    },
    [onDataLoaded]
  );

  const handleFileSelect = useCallback(
    (files: FileList | null) => {
      if (!files || files.length === 0) return;

      const file = files[0];
      const excelTypes = [
        "application/vnd.ms-excel",
        "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
        ".xlsx",
        ".xls",
      ];

      const csvTypes = ["text/csv", ".csv"];

      if (
        excelTypes.some(
          (type) => file.type === type || file.name.endsWith(type)
        )
      ) {
        parseExcelFile(file);
      } else if (
        csvTypes.some((type) => file.type === type || file.name.endsWith(type))
      ) {
        parseCSVFile(file);
      }
    },
    [parseExcelFile, parseCSVFile]
  );

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setIsDragOver(false);
      handleFileSelect(e.dataTransfer.files);
    },
    [handleFileSelect]
  );

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
  }, []);

  const clearData = () => {
    setTableData([]);
    setFileName("");
  };

  return (
    <div className={`space-y-4 ${className}`}>
      {/* Upload Area */}
      {tableData.length === 0 && (
        <motion.div
          onDrop={handleDrop}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          className={`border-2 border-dashed rounded-xl p-8 text-center transition-all duration-200 ${
            isDragOver
              ? "border-blue-400 bg-blue-500/10"
              : "border-neutral-600 hover:border-neutral-500"
          }`}
        >
          <div className="flex flex-col items-center gap-4">
            {isLoading ? (
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
              >
                <IconFileSpreadsheet className="h-12 w-12 text-blue-400" />
              </motion.div>
            ) : (
              <IconUpload className="h-12 w-12 text-neutral-400" />
            )}

            <div>
              <h3 className="text-white font-medium mb-2">
                {isLoading ? "Đang xử lý file..." : "Upload file Excel/CSV"}
              </h3>
              <p className="text-neutral-400 text-sm mb-4">
                Kéo thả file Excel hoặc CSV vào đây hoặc click để chọn file
              </p>

              {!isLoading && (
                <label className="inline-flex items-center gap-2 px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg cursor-pointer transition-colors">
                  <IconFileSpreadsheet className="h-4 w-4" />
                  Chọn file Excel/CSV
                  <input
                    type="file"
                    accept=".xlsx,.xls,.csv"
                    onChange={(e) => handleFileSelect(e.target.files)}
                    className="hidden"
                  />
                </label>
              )}
            </div>

            <p className="text-xs text-neutral-500">
              Hỗ trợ định dạng: .xlsx, .xls, .csv
            </p>
          </div>
        </motion.div>
      )}

      {/* Display Table */}
      {tableData.length > 0 && (
        <div className="space-y-4">
          {/* File Info */}
          <div className="flex items-center justify-between bg-neutral-800/30 rounded-lg p-4">
            <div className="flex items-center gap-3">
              {fileType === "csv" ? (
                <IconFileTypeCsv className="h-5 w-5 text-green-400" />
              ) : (
                <IconFileSpreadsheet className="h-5 w-5 text-green-400" />
              )}
              <div>
                <p className="text-white font-medium">{fileName}</p>
                <p className="text-neutral-400 text-sm">
                  {tableData.length} dòng dữ liệu • {fileType.toUpperCase()}
                </p>
              </div>
            </div>
            <button
              onClick={clearData}
              className="p-2 text-neutral-400 hover:text-white hover:bg-neutral-700 rounded-lg transition-colors"
            >
              <IconX className="h-4 w-4" />
            </button>
          </div>

          {/* Table */}
          <ExcelTable data={tableData} title={`Dữ liệu từ ${fileName}`} />
        </div>
      )}
    </div>
  );
}
