"use client";

import { motion } from "framer-motion";
import { X, Trash2, AlertTriangle } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { ProjectItem } from "@/types/project";

interface DeleteConfirmModalProps {
  item: ProjectItem | null;
  selectedItems: string[];
  onClose: () => void;
  onConfirm: () => void;
}

export default function DeleteConfirmModal({
  item,
  selectedItems,
  onClose,
  onConfirm,
}: DeleteConfirmModalProps) {
  const isMultiple = selectedItems.length > 1;
  const itemCount = selectedItems.length || 1;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
    >
      <motion.div
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.95, opacity: 0 }}
        className="bg-neutral-800 rounded-lg border border-neutral-700 w-full max-w-md"
      >
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-neutral-700">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-red-500/20 rounded-lg flex items-center justify-center">
              <AlertTriangle className="w-5 h-5 text-red-400" />
            </div>
            <div>
              <h2 className="text-white text-lg font-semibold">Xác nhận xóa</h2>
              <p className="text-neutral-400 text-sm">
                Hành động này không thể hoàn tác
              </p>
            </div>
          </div>
          <Button
            onClick={onClose}
            variant="outline"
            size="icon"
            className="border-neutral-600 text-neutral-400 hover:text-white"
          >
            <X className="w-4 h-4" />
          </Button>
        </div>

        {/* Content */}
        <div className="p-6">
          <div className="text-center">
            <Trash2 className="w-16 h-16 text-red-400 mx-auto mb-4" />

            {isMultiple ? (
              <div>
                <h3 className="text-white text-lg font-medium mb-2">
                  Xóa {itemCount} mục đã chọn?
                </h3>
                <p className="text-neutral-400">
                  Bạn có chắc chắn muốn xóa {itemCount} mục đã chọn? Tất cả dữ
                  liệu sẽ bị mất vĩnh viễn.
                </p>
              </div>
            ) : (
              <div>
                <h3 className="text-white text-lg font-medium mb-2">
                  Xóa "{item?.name}"?
                </h3>
                <p className="text-neutral-400">
                  Bạn có chắc chắn muốn xóa{" "}
                  {item?.type === "folder" ? "thư mục" : "tệp"} này? Tất cả dữ
                  liệu sẽ bị mất vĩnh viễn.
                </p>
              </div>
            )}
          </div>

          {/* Warning */}
          <div className="mt-6 p-4 bg-red-500/10 border border-red-500/20 rounded-lg">
            <div className="flex items-start space-x-3">
              <AlertTriangle className="w-5 h-5 text-red-400 flex-shrink-0 mt-0.5" />
              <div>
                <h4 className="text-red-400 font-medium text-sm">Cảnh báo</h4>
                <p className="text-red-300 text-sm mt-1">
                  {isMultiple
                    ? "Các mục đã xóa sẽ được chuyển vào thùng rác và có thể khôi phục trong 30 ngày."
                    : `${
                        item?.type === "folder" ? "Thư mục" : "Tệp"
                      } đã xóa sẽ được chuyển vào thùng rác và có thể khôi phục trong 30 ngày.`}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end space-x-3 p-6 border-t border-neutral-700">
          <Button
            onClick={onClose}
            variant="outline"
            className="border-neutral-600 text-neutral-300 hover:text-white hover:bg-neutral-700"
          >
            Hủy
          </Button>
          <Button
            onClick={onConfirm}
            className="bg-red-600 hover:bg-red-700 text-white"
          >
            <Trash2 className="w-4 h-4 mr-2" />
            Xóa {isMultiple ? `${itemCount} mục` : ""}
          </Button>
        </div>
      </motion.div>
    </motion.div>
  );
}
