"use client";

import { Search, Plus, Download, Upload } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Scale } from "lucide-react";

interface TemplateHeaderProps {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  onCreateNew: () => void;
}

export default function TemplateHeader({
  searchQuery,
  setSearchQuery,
  onCreateNew,
}: TemplateHeaderProps) {
  const handleImport = () => {
    const input = document.createElement("input");
    input.type = "file";
    input.accept = ".json";
    input.onchange = (e) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = (e) => {
          try {
            const templates = JSON.parse(e.target?.result as string);
            console.log("Imported templates:", templates);
            // TODO: Add to templates list
          } catch (error) {
            console.error("Error importing templates:", error);
          }
        };
        reader.readAsText(file);
      }
    };
    input.click();
  };

  const handleExport = () => {
    // TODO: Get templates from props or context
    const templates = [];
    const dataStr = JSON.stringify(templates, null, 2);
    const dataBlob = new Blob([dataStr], { type: "application/json" });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "templates.json";
    link.click();
    URL.revokeObjectURL(url);
  };

  return (
    <header className="bg-neutral-900 border-b border-neutral-700 px-6 py-4">
      <div className="flex items-center justify-between">
        {/* Logo & Title */}
        <div className="flex items-center space-x-4">
          <Link href="/new" className="flex items-center space-x-2">
            <Scale className="w-6 h-6 text-blue-500" />
            <span className="text-white font-medium">LegalWise AI</span>
          </Link>
          <div className="h-6 w-px bg-neutral-600"></div>
          <h1 className="text-white text-lg font-semibold">
            System Prompt Templates
          </h1>
        </div>

        {/* Search */}
        <div className="flex-1 max-w-md mx-8">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-neutral-400 w-4 h-4" />
            <input
              type="text"
              placeholder="Tìm kiếm template..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-neutral-800 border border-neutral-700 rounded-lg text-white placeholder:text-neutral-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center space-x-3">
          <Button
            variant="outline"
            size="sm"
            onClick={handleImport}
            className="border-neutral-600 text-neutral-300 hover:text-white hover:bg-neutral-700"
          >
            <Upload className="w-4 h-4 mr-2" />
            Import
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={handleExport}
            className="border-neutral-600 text-neutral-300 hover:text-white hover:bg-neutral-700"
          >
            <Download className="w-4 h-4 mr-2" />
            Export
          </Button>
          <Button
            onClick={onCreateNew}
            className="bg-blue-600 hover:bg-blue-700 text-white"
          >
            <Plus className="w-4 h-4 mr-2" />
            Tạo Template
          </Button>
        </div>
      </div>
    </header>
  );
}
