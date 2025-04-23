"use client";
import ChatInput from "@/components/chat/chat-input";
import HeaderAvatar from "@/components/chat/header-avatar";
import Sidebar from "@/components/chat/sidebar";
import React, { useEffect, useState } from "react";
import { useWindowSize } from "@/hooks/useWindowSize";
import ChatContainer from "@/components/chat/chat-container";
import { Message } from "@/types/chat";
const Page = () => {
  const [isMounted, setIsMounted] = useState(false);
  const { width } = useWindowSize();

  // Đánh dấu component đã mount
  useEffect(() => {
    setIsMounted(true);
  }, []);

  // Chỉ sử dụng kích thước sau khi component đã mount
  const isSmallScreen = isMounted && width < 750;
  const sampleMessages: Message[] = [
    {
      content:
        "Minh mixes casual streetwear with a touch of retro flair, often throwing on a bomber jacket over a simple tee and topping it off with his signature messy hair and confident smile. He doesn't just dress differently; he thinks differently too. Whether he's solving complex mechanical problems or coming up with strange but genius ideas, he brings creativity and logic together in a way that's hard to match. Despite his impressive intellect and style, Minh is incredibly down-to-earth.",
      isUser: true,
      timestamp: new Date(),
      id: 1,
    },
    {
      content: "Dưới đây là bản dịch tiếng Việt của đoạn bạn yêu cầu:",
      isUser: false,
      timestamp: new Date(),
      id: 2,
    },
    {
      content:
        "Minh kết hợp phong cách đường phố giản dị với chút hơi hướng cổ điển, thường khoác áo khoác bomber bên ngoài áo phông đơn giản và hoàn thiện với mái tóc rối đặc trưng cùng nụ cười tự tin. Anh ấy không chỉ ăn mặc khác biệt; tư duy của anh ấy cũng vậy. Dù đang giải quyết các vấn đề cơ khí phức tạp hay nghĩ ra những ý tưởng kỳ lạ nhưng thiên tài, anh ấy kết hợp sự sáng tạo và logic theo cách khó ai sánh được. Dù có trí tuệ và phong cách ấn tượng, Minh vẫn cực kỳ giản dị và gần gũi.",
      isUser: false,
      timestamp: new Date(),
      id: 3,
    },
  ];
  return (
    <div className="flex relative">
      <Sidebar />

      <main className="w-full bg-white dark:bg-zinc-900 min-h-svh flex flex-col justify-center items-center relative">
        {/* Phần nội dung chính */}
        <div className="flex-grow w-full flex justify-center items-center">
          {/* Nội dung có thể thêm vào đây */}
        </div>

        {/* ChatInput nằm ở dưới cùng, giữa màn hình */}
        <div
          className={`w-full flex justify-center items-center ${
            isSmallScreen ? "mb-4 px-4" : "mb-8 px-8"
          } z-10`}
        >
          <div
            className={`w-full ${isSmallScreen ? "max-w-full" : "max-w-3xl"}`}
          >
            <ChatContainer messages={sampleMessages} />
            <ChatInput />
          </div>
        </div>
      </main>

      <HeaderAvatar />
    </div>
  );
};

export default Page;
