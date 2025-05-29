"use client";

import { motion } from "motion/react";

export default function LoadingMessage() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex gap-4"
    >
      <div className="max-w-[80%]">
        <div className="text-neutral-100">
          <div className="flex space-x-2">
            <div className="w-2 h-2 bg-neutral-500 rounded-full animate-bounce"></div>
            <div
              className="w-2 h-2 bg-neutral-500 rounded-full animate-bounce"
              style={{ animationDelay: "0.1s" }}
            ></div>
            <div
              className="w-2 h-2 bg-neutral-500 rounded-full animate-bounce"
              style={{ animationDelay: "0.2s" }}
            ></div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
