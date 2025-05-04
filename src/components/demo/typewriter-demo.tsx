"use client";

import React, { useState } from "react";
import {
  TypewriterEffect,
  SimpleTypewriterEffect,
  useTypewriter,
} from "@/components/ui/typewriter-effect";
import { Button } from "@/components/ui/button";

export const TypewriterDemo = () => {
  const markdown = `
# Hiệu ứng Typewriter với Markdown

Đây là hiệu ứng Typewriter **đã cải tiến** để hỗ trợ *Markdown*.

## Các tính năng

- Hỗ trợ markdown
- Hiệu ứng gõ chữ mượt mà
- Con trỏ nhấp nháy
- Có thể tùy chỉnh tốc độ

### Code example

\`\`\`javascript
function hello() {
  console.log("Hello World!");
}
\`\`\`

> Bạn có thể click vào nội dung để bỏ qua hiệu ứng typing.
  `;

  const [isResetting, setIsResetting] = useState(false);

  const handleReset = () => {
    setIsResetting(true);
    setTimeout(() => {
      setIsResetting(false);
    }, 100);
  };

  return (
    <div className="max-w-4xl mx-auto p-8 space-y-8">
      <h1 className="text-2xl font-bold mb-4">Demo Hiệu Ứng Typewriter</h1>

      <div className="p-6 border rounded-xl shadow-md bg-white dark:bg-zinc-900">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-semibold">Typewriter với Markdown</h2>
          <Button onClick={handleReset} variant="outline" size="sm">
            Reset Demo
          </Button>
        </div>

        {!isResetting && (
          <TypewriterEffect
            content={markdown}
            typingSpeed={20}
            className="prose dark:prose-invert max-w-none"
            onComplete={() => console.log("Typing complete!")}
          />
        )}
      </div>

      <div className="p-6 border rounded-xl shadow-md bg-white dark:bg-zinc-900">
        <h2 className="text-lg font-semibold mb-4">
          Simple Typewriter (Text Only)
        </h2>

        {!isResetting && (
          <SimpleTypewriterEffect
            text="Đây là phiên bản đơn giản của hiệu ứng typewriter, không hỗ trợ markdown nhưng nhẹ hơn."
            typingSpeed={30}
            className="text-lg"
          />
        )}
      </div>

      <div className="p-6 border rounded-xl shadow-md bg-white dark:bg-zinc-900">
        <h2 className="text-lg font-semibold mb-4">
          Sử dụng useTypewriter Hook
        </h2>

        <CustomTypewriterExample isResetting={isResetting} />
      </div>
    </div>
  );
};

// Ví dụ sử dụng hook useTypewriter để tạo animation tùy chỉnh
const CustomTypewriterExample = ({ isResetting }: { isResetting: boolean }) => {
  const text =
    "Đây là ví dụ sử dụng hook useTypewriter để tạo hiệu ứng tùy chỉnh.";

  const { displayedContent, isTyping } = useTypewriter(text, {
    typingSpeed: 50,
    autoPlay: !isResetting,
  });

  return (
    <div className="relative p-4 rounded bg-gray-50 dark:bg-zinc-800">
      <p className="text-lg">
        {displayedContent}
        {isTyping && (
          <span className="inline-block w-2 h-5 ml-1 bg-blue-500 animate-pulse" />
        )}
      </p>
    </div>
  );
};

export default TypewriterDemo;
