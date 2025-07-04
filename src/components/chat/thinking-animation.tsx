"use client";

import { motion } from "motion/react";
import { useState, useEffect, useRef } from "react";
import {
  IconBrain,
  IconSearch,
  IconFileText,
  IconCheck,
} from "@tabler/icons-react";

interface ThinkingStep {
  id: string;
  type: "thinking" | "searching" | "analyzing" | "completed";
  title: string;
  description: string;
  duration?: number;
  status: "pending" | "active" | "completed";
}

interface ThinkingAnimationProps {
  isVisible: boolean;
  isSearching?: boolean;
  isCompletedSearching?: boolean;
  isTransferToResearcher?: boolean;
}

const thinkingSteps: ThinkingStep[] = [
  {
    id: "1",
    type: "searching",
    title: "Đang tìm kiếm thông tin",
    description: "Đang tìm kiếm các nguồn tài liệu và dữ liệu liên quan...",
    duration: 2000,
    status: "pending",
  },
  {
    id: "2",
    type: "analyzing",
    title: "Hoàn tất tìm kiếm",
    description: "Đã thu thập đủ thông tin từ các nguồn đáng tin cậy...",
    duration: 1500,
    status: "pending",
  },
  {
    id: "3",
    type: "thinking",
    title: "Đang viết kết quả",
    description:
      "Đang phân tích và tạo báo cáo chi tiết dựa trên dữ liệu đã tìm được...",
    duration: 3000,
    status: "pending",
  },
];

const getStepIcon = (type: string, status: string) => {
  const iconClass = "h-3.5 w-3.5";

  if (status === "completed") {
    return (
      <div className="flex items-center justify-center w-5 h-5 rounded-full bg-green-500/20 border border-green-500/30">
        <IconCheck className={`h-3 w-3 text-green-400`} />
      </div>
    );
  }

  if (status === "active") {
    switch (type) {
      case "thinking":
        return (
          <div className="flex items-center justify-center w-5 h-5 rounded-full bg-blue-500/20 border border-blue-500/30">
            <motion.div
              animate={{ scale: [1, 1.2, 1] }}
              transition={{ duration: 1, repeat: Infinity }}
            >
              <IconBrain className={`${iconClass} text-blue-400`} />
            </motion.div>
          </div>
        );
      case "searching":
        return (
          <div className="flex items-center justify-center w-5 h-5 rounded-full bg-yellow-500/20 border border-yellow-500/30">
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
            >
              <IconSearch className={`${iconClass} text-yellow-400`} />
            </motion.div>
          </div>
        );
      case "analyzing":
        return (
          <div className="flex items-center justify-center w-5 h-5 rounded-full bg-purple-500/20 border border-purple-500/30">
            <motion.div
              animate={{ rotateY: [0, 180, 360] }}
              transition={{ duration: 1.5, repeat: Infinity }}
            >
              <IconFileText className={`${iconClass} text-purple-400`} />
            </motion.div>
          </div>
        );
      default:
        return (
          <div className="flex items-center justify-center w-5 h-5 rounded-full bg-green-500/20 border border-green-500/30">
            <IconCheck className={`h-3 w-3 text-green-400`} />
          </div>
        );
    }
  }

  return (
    <div className="flex items-center justify-center w-5 h-5 rounded-full bg-neutral-700/30 border border-neutral-600/30">
      <div className="w-2 h-2 rounded-full bg-neutral-500" />
    </div>
  );
};

export default function ThinkingAnimation({
  isVisible,
  isSearching = false,
  isCompletedSearching = false,
  isTransferToResearcher = false,
}: ThinkingAnimationProps) {
  const [steps, setSteps] = useState(thinkingSteps);
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const stepRefs = useRef<(HTMLDivElement | null)[]>([]);

  // Update steps based on props
  useEffect(() => {
    if (!isVisible) {
      setSteps(
        thinkingSteps.map((step) => ({ ...step, status: "pending" as const }))
      );
      return;
    }

    setSteps((prevSteps) => [
      {
        ...prevSteps[0],
        status: isSearching
          ? ("active" as const)
          : !isSearching && (isCompletedSearching || isTransferToResearcher)
          ? ("completed" as const)
          : ("pending" as const),
      },
      {
        ...prevSteps[1],
        status: isCompletedSearching
          ? ("active" as const)
          : !isCompletedSearching && isTransferToResearcher
          ? ("completed" as const)
          : ("pending" as const),
      },
      {
        ...prevSteps[2],
        status: isTransferToResearcher
          ? ("active" as const)
          : ("pending" as const),
      },
    ]);
  }, [isVisible, isSearching, isCompletedSearching, isTransferToResearcher]);

  // Auto-scroll to active step
  useEffect(() => {
    const activeIndex = steps.findIndex((step) => step.status === "active");
    if (activeIndex !== -1) {
      setTimeout(() => {
        const activeStepElement = stepRefs.current[activeIndex];
        if (activeStepElement && scrollContainerRef.current) {
          activeStepElement.scrollIntoView({
            behavior: "smooth",
            block: "center",
          });
        }
      }, 100);
    }
  }, [steps]);

  if (!isVisible) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="bg-neutral-900/95 border border-neutral-700/30 rounded-xl overflow-hidden"
    >
      {/* Header */}
      <div className="flex items-center gap-3 px-4 py-3 border-b border-neutral-700/30">
        <motion.div
          animate={{ rotate: [0, 360] }}
          transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
        >
          <IconBrain className="h-4 w-4 text-blue-400" />
        </motion.div>
        <h3 className="text-white font-medium text-sm">
          {isSearching
            ? "Đang tìm kiếm..."
            : isCompletedSearching
            ? "Đã tìm kiếm xong..."
            : isTransferToResearcher
            ? "Đang viết báo cáo..."
            : "Đang xử lý..."}
        </h3>
      </div>

      {/* Scrollable Content */}
      <div
        ref={scrollContainerRef}
        className="h-48 overflow-y-auto custom-scrollbar"
      >
        <div className="p-3 space-y-2">
          {steps.map((step, index) => (
            <motion.div
              key={step.id}
              ref={(el) => {
                stepRefs.current[index] = el;
              }}
              initial={{ opacity: 0, x: -20 }}
              animate={{
                opacity: step.status !== "pending" ? 1 : 0.5,
                x: 0,
              }}
              transition={{ delay: index * 0.1 }}
              className={`flex items-start gap-3 p-3 rounded-lg transition-all duration-300 ${
                step.status === "active"
                  ? "bg-blue-500/5 border border-blue-500/10"
                  : step.status === "completed"
                  ? "bg-green-500/5"
                  : "bg-transparent"
              }`}
            >
              <div className="flex-shrink-0">
                {getStepIcon(step.type, step.status)}
              </div>
              <div className="flex-1 min-w-0">
                <h4
                  className={`font-medium text-xs ${
                    step.status === "active"
                      ? "text-white"
                      : step.status === "completed"
                      ? "text-neutral-200"
                      : "text-neutral-400"
                  }`}
                >
                  {step.title}
                </h4>
                <p
                  className={`text-xs mt-1 leading-relaxed ${
                    step.status === "active"
                      ? "text-neutral-300"
                      : step.status === "completed"
                      ? "text-neutral-400"
                      : "text-neutral-500"
                  }`}
                >
                  {step.description}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </motion.div>
  );
}
