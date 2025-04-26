"use client";
import ChatInput from "@/components/chat/chat-input";
import HeaderAvatar from "@/components/chat/header-avatar";
import Sidebar from "@/components/chat/sidebar";
import React from "react";
import ChatContainer from "@/components/chat/chat-container";
import { useConversation } from "@/provider/conversation-provider";

// Create a chat component that will consume the conversation context
const ChatContent = () => {
  const { messages: conversationMessages, activeConversation } =
    useConversation();

  //   // Sample messages for demonstration
  //   const sampleMessages: Message[] = [
  //     {
  //       id: 1,
  //       content: "Xin chào, tôi cần tư vấn về luật thuế thu nhập cá nhân",
  //       isUser: true,
  //       timestamp: new Date(Date.now() - 1000 * 60 * 30), // 30 minutes ago
  //     },
  //     {
  //       id: 2,
  //       content:
  //         "Chào bạn! Tôi rất vui được hỗ trợ bạn về vấn đề thuế thu nhập cá nhân. Bạn có thắc mắc cụ thể nào về luật thuế TNCN không?",
  //       isUser: false,
  //       timestamp: new Date(Date.now() - 1000 * 60 * 29), // 29 minutes ago
  //     },
  //     {
  //       id: 3,
  //       content:
  //         "Tôi muốn biết mức thuế suất áp dụng cho thu nhập từ tiền lương, tiền công năm 2024",
  //       isUser: true,
  //       timestamp: new Date(Date.now() - 1000 * 60 * 28), // 28 minutes ago
  //     },
  //     {
  //       id: 4,
  //       content:
  //         "## Thuế suất thu nhập cá nhân 2024\n\nThuế suất thuế thu nhập cá nhân (TNCN) từ tiền lương, tiền công được áp dụng theo biểu thuế lũy tiến từng phần với 7 bậc thuế như sau:\n\n1. Thu nhập đến 5 triệu đồng/tháng: **5%**\n2. Thu nhập trên 5 đến 10 triệu đồng/tháng: **10%**\n3. Thu nhập trên 10 đến 18 triệu đồng/tháng: **15%**\n4. Thu nhập trên 18 đến 32 triệu đồng/tháng: **20%**\n5. Thu nhập trên 32 đến 52 triệu đồng/tháng: **25%**\n6. Thu nhập trên 52 đến 80 triệu đồng/tháng: **30%**\n7. Thu nhập trên 80 triệu đồng/tháng: **35%**\n\nCác khoản được giảm trừ khi tính thuế TNCN bao gồm:\n- Giảm trừ gia cảnh cho bản thân: 11 triệu đồng/tháng\n- Giảm trừ gia cảnh cho người phụ thuộc: 4.4 triệu đồng/người/tháng",
  //       isUser: false,
  //       timestamp: new Date(Date.now() - 1000 * 60 * 27), // 27 minutes ago
  //     },
  //     {
  //       id: 5,
  //       content: "Làm thế nào để tính thuế TNCN cho thu nhập 25 triệu/tháng?",
  //       isUser: true,
  //       timestamp: new Date(Date.now() - 1000 * 60 * 20), // 20 minutes ago
  //     },
  //     {
  //       id: 6,
  //       content:
  //         "Để tính thuế TNCN cho thu nhập 25 triệu đồng/tháng, tôi sẽ hướng dẫn bạn các bước cụ thể:\n\n### Bước 1: Xác định thu nhập tính thuế\nThu nhập trước thuế: 25,000,000 đồng\nGiảm trừ gia cảnh bản thân: 11,000,000 đồng\nThu nhập tính thuế = 25,000,000 - 11,000,000 = 14,000,000 đồng\n\n### Bước 2: Áp dụng biểu thuế lũy tiến từng phần\n\n```\n// Phần thu nhập đến 5 triệu\n5,000,000 × 5% = 250,000 đồng\n\n// Phần thu nhập trên 5 đến 10 triệu\n5,000,000 × 10% = 500,000 đồng\n\n// Phần thu nhập trên 10 đến 14 triệu\n4,000,000 × 15% = 600,000 đồng\n```\n\n### Bước 3: Tổng thuế phải nộp\nThuế TNCN phải nộp = 250,000 + 500,000 + 600,000 = 1,350,000 đồng\n\nVậy với thu nhập 25 triệu đồng/tháng, thuế TNCN phải nộp là 1,350,000 đồng và thu nhập sau thuế là 23,650,000 đồng.",
  //       isUser: false,
  //       timestamp: new Date(Date.now() - 1000 * 60 * 18), // 18 minutes ago
  //     },
  //     {
  //       id: 7,
  //       content:
  //         "Cảm ơn bạn đã giải thích rõ ràng. Tôi có thể kê khai thuế TNCN ở đâu?",
  //       isUser: true,
  //       timestamp: new Date(Date.now() - 1000 * 60 * 10), // 10 minutes ago
  //     },
  //     {
  //       id: 8,
  //       content:
  //         "Bạn có thể kê khai thuế TNCN qua các phương thức sau:\n\n1. **Kê khai trực tuyến**:\n   * Cổng thông tin điện tử của Tổng cục Thuế: https://thuedientu.gdt.gov.vn\n   * Ứng dụng eTax Mobile trên điện thoại\n   * Cổng dịch vụ công quốc gia: https://dichvucong.gov.vn\n\n2. **Kê khai trực tiếp**:\n   * Nộp tại cơ quan thuế địa phương nơi bạn cư trú\n   * Thông qua người sử dụng lao động (nếu bạn là người lao động)\n\nThời hạn kê khai và nộp thuế TNCN:\n* Đối với cá nhân trực tiếp kê khai: chậm nhất là ngày 30/3 năm sau\n* Đối với tổ chức trả thu nhập: chậm nhất là ngày cuối cùng của tháng tiếp theo quý kê khai",
  //       isUser: false,
  //       timestamp: new Date(Date.now() - 1000 * 60 * 8), // 8 minutes ago
  //     },
  //   ];

  // Use sample messages for demonstration or real messages from conversation
  //   const displayMessages =
  //     sampleMessages.length > 0 ? sampleMessages : conversationMessages;

  return (
    <div className="w-full h-screen flex relative overflow-hidden">
      <Sidebar />
      <main className="bg-white dark:bg-zinc-900 w-full h-full flex flex-col overflow-auto">
        <div className="flex-1 overflow-hidden relative">
          <ChatContainer
            messages={conversationMessages}
            title={activeConversation?.title || "New Conversation"}
          />
        </div>
        <div className="w-full md:px-32 px-6 z-10">
          <div className="w-full bg-white dark:bg-zinc-900 pb-4 pt-2 mx-auto">
            <ChatInput />
          </div>
        </div>
      </main>
      <HeaderAvatar />
    </div>
  );
};

export default ChatContent;
