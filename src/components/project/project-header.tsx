"use client";

import {
  Search,
  Bell,
  Grid3X3,
  List,
  Trash2,
  Download,
  Share2,
  User,
  Filter,
  SortAsc,
  SortDesc,
} from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Checkbox } from "@/components/ui/checkbox";
import type { SortOption, ProjectFilter } from "@/types/project";

interface ProjectHeaderProps {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  viewMode: "grid" | "list";
  setViewMode: (mode: "grid" | "list") => void;
  selectedItems: string[];
  onBulkDelete: () => void;
  onBulkShare: () => void;
  sortOption: SortOption;
  setSortOption: (option: SortOption) => void;
  filterOptions: ProjectFilter;
  setFilterOptions: (options: ProjectFilter) => void;
}

export default function ProjectHeader({
  searchQuery,
  setSearchQuery,
  viewMode,
  setViewMode,
  selectedItems,
  onBulkDelete,
  onBulkShare,
  sortOption,
  setSortOption,
  filterOptions,
  setFilterOptions,
}: ProjectHeaderProps) {
  const [showAdvancedSearch, setShowAdvancedSearch] = useState(false);
  const getSortLabel = (option: SortOption): string => {
    switch (option) {
      case "name-asc":
        return "Tên (A-Z)";
      case "name-desc":
        return "Tên (Z-A)";
      case "date-asc":
        return "Ngày (Cũ nhất)";
      case "date-desc":
        return "Ngày (Mới nhất)";
      case "size-asc":
        return "Kích thước (Nhỏ nhất)";
      case "size-desc":
        return "Kích thước (Lớn nhất)";
      default:
        return "Sắp xếp";
    }
  };

  return (
    <header className="bg-neutral-800 border-b border-neutral-700 px-6 py-4 shadow-lg">
      <div className="flex items-center justify-between">
        {/* Search */}
        <div className="flex-1 max-w-md">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-neutral-400 w-4 h-4" />
            <input
              type="text"
              placeholder="Tìm kiếm dự án, file, thư mục..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-neutral-700 border border-neutral-600 rounded-lg text-white placeholder:text-neutral-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
              onFocus={() => setShowAdvancedSearch(true)}
            />
            {showAdvancedSearch && (
              <div className="absolute top-full left-0 right-0 mt-2 bg-neutral-800 border border-neutral-700 rounded-lg shadow-xl p-4 z-10">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm text-neutral-400 mb-1 block">
                      Loại
                    </label>
                    <select
                      value={filterOptions.type}
                      onChange={(e) =>
                        setFilterOptions({
                          ...filterOptions,
                          type: e.target.value,
                        })
                      }
                      className="w-full bg-neutral-700 border border-neutral-600 rounded text-white p-2 text-sm"
                    >
                      <option value="all">Tất cả</option>
                      <option value="folder">Thư mục</option>
                      <option value="file">Tệp</option>
                      <option value="project">Dự án</option>
                    </select>
                  </div>
                  <div>
                    <label className="text-sm text-neutral-400 mb-1 block">
                      Thời gian
                    </label>
                    <select
                      value={filterOptions.date}
                      onChange={(e) =>
                        setFilterOptions({
                          ...filterOptions,
                          date: e.target.value,
                        })
                      }
                      className="w-full bg-neutral-700 border border-neutral-600 rounded text-white p-2 text-sm"
                    >
                      <option value="all">Tất cả</option>
                      <option value="today">Hôm nay</option>
                      <option value="week">Tuần này</option>
                      <option value="month">Tháng này</option>
                      <option value="year">Năm nay</option>
                    </select>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="shared"
                      checked={filterOptions.shared}
                      onCheckedChange={(checked) =>
                        setFilterOptions({
                          ...filterOptions,
                          shared: !!checked,
                        })
                      }
                    />
                    <label
                      htmlFor="shared"
                      className="text-sm text-neutral-400"
                    >
                      Đã chia sẻ
                    </label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="starred"
                      checked={filterOptions.starred}
                      onCheckedChange={(checked) =>
                        setFilterOptions({
                          ...filterOptions,
                          starred: !!checked,
                        })
                      }
                    />
                    <label
                      htmlFor="starred"
                      className="text-sm text-neutral-400"
                    >
                      Đã đánh dấu
                    </label>
                  </div>
                </div>
                <div className="flex justify-end mt-4">
                  <Button
                    size="sm"
                    variant="outline"
                    className="mr-2 border-neutral-600 text-neutral-300"
                    onClick={() => {
                      setFilterOptions({
                        type: "all",
                        date: "all",
                        shared: false,
                        starred: false,
                      });
                    }}
                  >
                    Đặt lại
                  </Button>
                  <Button
                    size="sm"
                    onClick={() => setShowAdvancedSearch(false)}
                  >
                    Áp dụng
                  </Button>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Bulk Actions */}
        {selectedItems.length > 0 && (
          <div className="flex items-center space-x-2 mx-4">
            <span className="text-sm text-neutral-400">
              {selectedItems.length} mục đã chọn
            </span>
            <Button
              size="sm"
              variant="outline"
              onClick={onBulkShare}
              className="border-neutral-600 text-neutral-300 hover:text-white hover:bg-neutral-700"
            >
              <Share2 className="w-4 h-4 mr-1" />
              Chia sẻ
            </Button>
            <Button
              size="sm"
              variant="outline"
              className="border-neutral-600 text-neutral-300 hover:text-white hover:bg-neutral-700"
            >
              <Download className="w-4 h-4 mr-1" />
              Tải xuống
            </Button>
            <Button
              size="sm"
              variant="outline"
              onClick={onBulkDelete}
              className="border-red-600 text-red-400 hover:bg-red-600 hover:text-white"
            >
              <Trash2 className="w-4 h-4 mr-1" />
              Xóa
            </Button>
          </div>
        )}

        {/* Right Actions */}
        <div className="flex items-center space-x-4">
          {/* Sort Dropdown */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="outline"
                size="sm"
                className="border-neutral-600 text-neutral-300"
              >
                {sortOption.includes("asc") ? (
                  <SortAsc className="w-4 h-4 mr-1" />
                ) : (
                  <SortDesc className="w-4 h-4 mr-1" />
                )}
                {getSortLabel(sortOption)}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56 bg-neutral-800 border-neutral-700 text-neutral-200">
              <DropdownMenuLabel>Sắp xếp theo</DropdownMenuLabel>
              <DropdownMenuSeparator className="bg-neutral-700" />
              <DropdownMenuGroup>
                <DropdownMenuItem onClick={() => setSortOption("name-asc")}>
                  <SortAsc className="w-4 h-4 mr-2" />
                  <span>Tên (A-Z)</span>
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setSortOption("name-desc")}>
                  <SortDesc className="w-4 h-4 mr-2" />
                  <span>Tên (Z-A)</span>
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setSortOption("date-desc")}>
                  <SortDesc className="w-4 h-4 mr-2" />
                  <span>Ngày (Mới nhất)</span>
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setSortOption("date-asc")}>
                  <SortAsc className="w-4 h-4 mr-2" />
                  <span>Ngày (Cũ nhất)</span>
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setSortOption("size-desc")}>
                  <SortDesc className="w-4 h-4 mr-2" />
                  <span>Kích thước (Lớn nhất)</span>
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setSortOption("size-asc")}>
                  <SortAsc className="w-4 h-4 mr-2" />
                  <span>Kích thước (Nhỏ nhất)</span>
                </DropdownMenuItem>
              </DropdownMenuGroup>
            </DropdownMenuContent>
          </DropdownMenu>

          {/* Filter Button */}
          <Button
            variant="outline"
            size="sm"
            className="border-neutral-600 text-neutral-300 hover:text-white hover:bg-neutral-700"
            onClick={() => setShowAdvancedSearch(!showAdvancedSearch)}
          >
            <Filter className="w-4 h-4 mr-1" />
            Lọc
          </Button>

          {/* View Mode Toggle */}
          <div className="flex items-center bg-neutral-700 rounded-lg p-1">
            <button
              onClick={() => setViewMode("grid")}
              className={`p-2 rounded transition-colors ${
                viewMode === "grid"
                  ? "bg-blue-600 text-white"
                  : "text-neutral-400 hover:text-white"
              }`}
            >
              <Grid3X3 className="w-4 h-4" />
            </button>
            <button
              onClick={() => setViewMode("list")}
              className={`p-2 rounded transition-colors ${
                viewMode === "list"
                  ? "bg-blue-600 text-white"
                  : "text-neutral-400 hover:text-white"
              }`}
            >
              <List className="w-4 h-4" />
            </button>
          </div>
          <Avatar className="w-8 h-8">
            <AvatarImage src={"/placeholder.svg?height=32&width=32"} />
            <AvatarFallback className="bg-blue-600">
              <User className="w-4 h-4" />
            </AvatarFallback>
          </Avatar>
        </div>
      </div>
    </header>
  );
}
