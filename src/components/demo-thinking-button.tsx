"use client";

import { useState } from "react";
import { motion } from "motion/react";
import { IconBrain } from "@tabler/icons-react";
import ThinkingAnimation from "./chat/thinking-animation";

export default function DemoThinkingButton() {
  const [showDemo, setShowDemo] = useState(false);

  const triggerDemo = () => {
    setShowDemo(true);
  };

  return (
    <div className="fixed bottom-4 right-4 z-50">
      {!showDemo ? (
        <motion.button
          onClick={triggerDemo}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="bg-blue-500 hover:bg-blue-600 text-white p-3 rounded-full shadow-lg transition-colors"
        >
          <IconBrain className="h-6 w-6" />
        </motion.button>
      ) : (
        <div className="bg-neutral-900 rounded-xl shadow-2xl max-w-md">
          <ThinkingAnimation
            isVisible={showDemo}
            onComplete={() => {
              setTimeout(() => setShowDemo(false), 2000);
            }}
          />
        </div>
      )}
    </div>
  );
}
