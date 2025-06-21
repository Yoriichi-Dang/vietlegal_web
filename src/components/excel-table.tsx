"use client";

import React, { useMemo } from "react";
import {
  useReactTable,
  getCoreRowModel,
  getSortedRowModel,
  getFilteredRowModel,
  flexRender,
  ColumnDef,
  SortingState,
} from "@tanstack/react-table";
import { useState } from "react";
import { IconChevronUp, IconChevronDown, IconTable } from "@tabler/icons-react";

interface ExcelTableProps {
  data: any[];
  title?: string;
  className?: string;
}

export default function ExcelTable({
  data,
  title,
  className = "",
}: ExcelTableProps) {
  const [sorting, setSorting] = useState<SortingState>([]);
  const [globalFilter, setGlobalFilter] = useState("");

  // Generate columns from data
  const columns = useMemo<ColumnDef<any>[]>(() => {
    if (!data || data.length === 0) return [];

    const keys = Object.keys(data[0]);
    return keys.map((key) => ({
      accessorKey: key,
      header: key,
      cell: ({ getValue }) => {
        const value = getValue();
        // Format numbers with thousand separators
        if (typeof value === "number") {
          return value.toLocaleString("vi-VN");
        }
        return value?.toString() || "";
      },
    }));
  }, [data]);

  const table = useReactTable({
    data,
    columns,
    state: {
      sorting,
      globalFilter,
    },
    onSortingChange: setSorting,
    onGlobalFilterChange: setGlobalFilter,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
  });

  if (!data || data.length === 0) {
    return (
      <div
        className={`bg-neutral-800/30 rounded-xl p-6 text-center ${className}`}
      >
        <IconTable className="h-8 w-8 text-neutral-500 mx-auto mb-2" />
        <p className="text-neutral-400">Không có dữ liệu để hiển thị</p>
      </div>
    );
  }

  return (
    <div
      className={`bg-neutral-800/30 rounded-xl overflow-hidden ${className}`}
    >
      {/* Header */}
      {title && (
        <div className="px-6 py-4 border-b border-neutral-700/30">
          <div className="flex items-center gap-3">
            <IconTable className="h-5 w-5 text-blue-400" />
            <h3 className="text-white font-medium text-base">{title}</h3>
          </div>
        </div>
      )}

      {/* Search */}
      <div className="px-6 py-4 border-b border-neutral-700/30">
        <input
          value={globalFilter ?? ""}
          onChange={(e) => setGlobalFilter(e.target.value)}
          placeholder="Tìm kiếm trong bảng..."
          className="w-full px-3 py-2 bg-neutral-700/50 border border-neutral-600/50 rounded-lg text-white placeholder-neutral-400 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 text-sm"
        />
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            {table.getHeaderGroups().map((headerGroup) => (
              <tr
                key={headerGroup.id}
                className="border-b border-neutral-700/30"
              >
                {headerGroup.headers.map((header) => (
                  <th
                    key={header.id}
                    className="px-6 py-4 text-left text-sm font-medium text-neutral-200 bg-neutral-800/50"
                  >
                    {header.isPlaceholder ? null : (
                      <div
                        className={`flex items-center gap-2 ${
                          header.column.getCanSort()
                            ? "cursor-pointer select-none hover:text-white"
                            : ""
                        }`}
                        onClick={header.column.getToggleSortingHandler()}
                      >
                        {flexRender(
                          header.column.columnDef.header,
                          header.getContext()
                        )}
                        {header.column.getCanSort() && (
                          <div className="flex flex-col">
                            <IconChevronUp
                              className={`h-3 w-3 ${
                                header.column.getIsSorted() === "asc"
                                  ? "text-blue-400"
                                  : "text-neutral-500"
                              }`}
                            />
                            <IconChevronDown
                              className={`h-3 w-3 -mt-1 ${
                                header.column.getIsSorted() === "desc"
                                  ? "text-blue-400"
                                  : "text-neutral-500"
                              }`}
                            />
                          </div>
                        )}
                      </div>
                    )}
                  </th>
                ))}
              </tr>
            ))}
          </thead>
          <tbody>
            {table.getRowModel().rows.map((row, index) => (
              <tr
                key={row.id}
                className={`border-b border-neutral-700/20 hover:bg-neutral-800/30 transition-colors ${
                  index % 2 === 0 ? "bg-neutral-900/20" : "bg-neutral-800/10"
                }`}
              >
                {row.getVisibleCells().map((cell) => (
                  <td
                    key={cell.id}
                    className="px-6 py-4 text-sm text-neutral-300"
                  >
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Footer */}
      <div className="px-6 py-4 border-t border-neutral-700/30 text-sm text-neutral-400">
        Hiển thị {table.getRowModel().rows.length} trên {data.length} dòng
      </div>
    </div>
  );
}
