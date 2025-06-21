"use client";

import DataFileUploader from "@/components/excel-file-uploader";
import ExcelTable from "@/components/excel-table";

// Sample data for demo
const sampleData = [
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

export default function ExcelDemoPage() {
  return (
    <div className="min-h-screen bg-neutral-900 p-6">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <div className="text-center">
          <h1 className="text-3xl font-bold text-white mb-4">
            Excel/CSV Table Demo
          </h1>
          <p className="text-neutral-400">
            Demo tính năng hiển thị bảng Excel và CSV trong Research Panel
          </p>
        </div>

        {/* Sample Table */}
        <div className="space-y-4">
          <h2 className="text-xl font-semibold text-white">
            Bảng mẫu - Dữ liệu thị trường bảo hiểm
          </h2>
          <ExcelTable
            data={sampleData}
            title="Bảng 1: Tổng hợp Doanh thu phí bảo hiểm toàn thị trường Việt Nam (2022-2024)"
          />
        </div>

        {/* File Uploader */}
        <div className="space-y-4">
          <h2 className="text-xl font-semibold text-white">
            Upload file Excel/CSV của bạn
          </h2>
          <DataFileUploader
            onDataLoaded={(data, fileName) => {
              console.log("Data loaded:", data, fileName);
            }}
          />
        </div>
      </div>
    </div>
  );
}
