"use client";

import React, { useState, useEffect, useRef } from "react";
import ChatContainerAnimated from "@/components/chat/chat-container-animated";
import { Message } from "@/types/chat";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { SendIcon } from "lucide-react";

export default function ChatAnimatedDemoPage() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [typingSpeed, setTypingSpeed] = useState(20);
  const [isTypingComplete, setIsTypingComplete] = useState(true);
  const [inputMessage, setInputMessage] = useState("");
  const messageQueueRef = useRef<Message[]>([]);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Demo message sequence
  const demoMessages: Message[] = [
    {
      id: 1,
      content:
        "Xin chào, bạn có thể giúp tôi hiểu về Hiệu ứng Typewriter không?",
      isUser: true,
      timestamp: new Date(Date.now() - 60000 * 5),
    },
    {
      id: 2,
      content:
        "Chào bạn! Tôi rất vui được giúp bạn hiểu về Hiệu ứng Typewriter. Đây là một kỹ thuật thường được sử dụng trong thiết kế web và giao diện người dùng.",
      isUser: false,
      timestamp: new Date(Date.now() - 60000 * 4),
    },
    {
      id: 3,
      content: "Nó hoạt động như thế nào?",
      isUser: true,
      timestamp: new Date(Date.now() - 60000 * 3),
    },
    {
      id: 4,
      content:
        "Hiệu ứng Typewriter mô phỏng hành động gõ văn bản lần lượt từng ký tự một, giống như đang sử dụng máy đánh chữ cổ điển. \n\nSau đây là cách nó hoạt động:\n\n1. **Hiển thị theo thời gian**: Văn bản không xuất hiện cùng một lúc mà được hiển thị từng ký tự một theo thời gian.\n\n2. **Tốc độ có thể điều chỉnh**: Bạn có thể thiết lập tốc độ hiển thị để tạo cảm giác gõ chữ nhanh hay chậm.\n\n3. **Con trỏ nhấp nháy**: Thường có một con trỏ nhấp nháy ở cuối văn bản đang được hiển thị để tạo cảm giác giống như đang gõ.",
      isUser: false,
      timestamp: new Date(Date.now() - 60000 * 2),
    },
    {
      id: 5,
      content: "Có thể kết hợp với markdown để định dạng nội dung được không?",
      isUser: true,
      timestamp: new Date(Date.now() - 60000),
    },
    {
      id: 6,
      content:
        'Tuyệt đối có thể! Hiệu ứng Typewriter có thể được kết hợp với Markdown để tạo ra nội dung có định dạng phong phú. Ví dụ:\n\n**Đây là văn bản in đậm**\n\n*Đây là văn bản in nghiêng*\n\n## Đây là tiêu đề cấp 2\n\n### Và đây là danh sách:\n- Item 1\n- Item 2\n- Item 3\n\n```javascript\n// Thậm chí có thể hiển thị code với syntax highlighting\nfunction demo() {\n  console.log("Hello, world!");\n}\n```\n\nViệc kết hợp với Markdown giúp tạo ra nội dung phong phú hơn, đặc biệt hữu ích cho các ứng dụng chat, nơi cần hiển thị định dạng văn bản phức tạp.',
      isUser: false,
      timestamp: new Date(),
    },
  ];

  // Xử lý tin nhắn khi animation hoàn tất
  const handleTypingComplete = () => {
    setIsTypingComplete(true);

    // Nếu có tin nhắn trong hàng đợi, hiển thị tin nhắn tiếp theo
    if (messageQueueRef.current.length > 0) {
      const nextMessage = messageQueueRef.current.shift();
      if (nextMessage) {
        setIsTypingComplete(false);
        setMessages((prev) => [...prev, nextMessage]);
      }
    }
  };

  // Add messages one by one with delay
  useEffect(() => {
    const addMessageWithDelay = (index: number) => {
      if (index < demoMessages.length) {
        const message = demoMessages[index];

        // Nếu là tin nhắn của user, hiển thị ngay lập tức
        if (message.isUser) {
          setMessages((prev) => [...prev, message]);

          // Đợi một chút trước khi hiển thị câu trả lời
          timeoutRef.current = setTimeout(() => {
            if (index + 1 < demoMessages.length) {
              if (isTypingComplete) {
                setIsTypingComplete(false);
                setMessages((prev) => [...prev, demoMessages[index + 1]]);
                addMessageWithDelay(index + 2);
              } else {
                // Nếu tin nhắn hiện tại chưa hiển thị xong, thêm vào hàng đợi
                messageQueueRef.current.push(demoMessages[index + 1]);
              }
            }
          }, 1000);
        } else if (index === 0) {
          // Trường hợp tin nhắn đầu tiên là của bot
          setIsTypingComplete(false);
          setMessages([message]);
          addMessageWithDelay(index + 1);
        }
      }
    };

    addMessageWithDelay(0);

    return () => {
      // Cleanup timeouts when component unmounts
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
      setMessages([]);
      messageQueueRef.current = [];
    };
  }, []);

  const resetDemo = () => {
    // Clear current state
    setMessages([]);
    messageQueueRef.current = [];
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    setIsTypingComplete(true);
    setInputMessage("");

    // Restart animation sequence after a brief delay
    setTimeout(() => {
      addFirstMessage();
    }, 500);
  };

  const addFirstMessage = () => {
    setMessages([demoMessages[0]]);

    // Đợi một chút trước khi hiển thị câu trả lời đầu tiên
    timeoutRef.current = setTimeout(() => {
      setIsTypingComplete(false);
      setMessages((prev) => [...prev, demoMessages[1]]);
    }, 1000);
  };

  // Hàm xử lý khi người dùng gửi tin nhắn mới
  const handleSendMessage = () => {
    if (!inputMessage.trim() || !isTypingComplete) return;

    // Tạo tin nhắn mới từ người dùng
    const newUserMessage: Message = {
      id: Date.now(),
      content: inputMessage.trim(),
      isUser: true,
      timestamp: new Date(),
    };

    // Thêm tin nhắn vào danh sách
    setMessages((prev) => [...prev, newUserMessage]);
    setInputMessage("");

    // Tạo tin nhắn phản hồi từ bot
    setTimeout(() => {
      // Chỉ gửi tin nhắn phản hồi nếu animation đã hoàn tất
      if (isTypingComplete) {
        setIsTypingComplete(false);

        const botReply: Message = {
          id: Date.now() + 1,
          content:
            "Cảm ơn câu hỏi của bạn! Đây là một tin nhắn trả lời để minh họa rằng người dùng phải đợi cho đến khi tôi đã hiển thị toàn bộ nội dung này thì mới có thể gửi tin nhắn tiếp theo.\n\nViệc này giúp tạo ra trải nghiệm tự nhiên hơn cho người dùng, đảm bảo rằng họ không bỏ lỡ thông tin quan trọng mà tôi cung cấp.\n\nBạn có thể thử nhập một tin nhắn khác sau khi toàn bộ tin nhắn này được hiển thị hoàn tất.",
          isUser: false,
          timestamp: new Date(),
        };

        setMessages((prev) => [...prev, botReply]);
      } else {
        // Nếu animation chưa hoàn tất, đưa tin nhắn vào hàng đợi
        messageQueueRef.current.push({
          id: Date.now() + 1,
          content:
            "Cảm ơn câu hỏi của bạn! Đây là một tin nhắn trả lời để minh họa rằng người dùng phải đợi cho đến khi tôi đã hiển thị toàn bộ nội dung này thì mới có thể gửi tin nhắn tiếp theo.\n\nViệc này giúp tạo ra trải nghiệm tự nhiên hơn cho người dùng, đảm bảo rằng họ không bỏ lỡ thông tin quan trọng mà tôi cung cấp.\n\nBạn có thể thử nhập một tin nhắn khác sau khi toàn bộ tin nhắn này được hiển thị hoàn tất.",
          isUser: false,
          timestamp: new Date(),
        });
      }
    }, 1000);
  };

  return (
    <div className="flex flex-col h-screen">
      <div className="bg-white dark:bg-zinc-900 border-b p-4 flex justify-between items-center">
        <h1 className="text-xl font-bold">Demo Chat với Hiệu ứng Typewriter</h1>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <label className="text-sm">Tốc độ: </label>
            <select
              className="bg-white dark:bg-zinc-800 border border-zinc-300 dark:border-zinc-700 rounded px-2 py-1"
              value={typingSpeed}
              onChange={(e) => setTypingSpeed(Number(e.target.value))}
            >
              <option value={10}>Nhanh</option>
              <option value={30}>Trung bình</option>
              <option value={50}>Chậm</option>
            </select>
          </div>
          <Button onClick={resetDemo} variant="outline" size="sm">
            Khởi động lại
          </Button>
        </div>
      </div>

      <div className="flex-1 overflow-hidden bg-zinc-50 dark:bg-zinc-950 relative">
        <ChatContainerAnimated
          messages={messages}
          typingSpeed={typingSpeed}
          onTypingComplete={handleTypingComplete}
        />

        {/* Input chat */}
        <div className="absolute bottom-0 left-0 right-0 p-4 bg-white dark:bg-zinc-900 border-t">
          <div className="max-w-3xl mx-auto flex gap-2 items-center">
            <Input
              placeholder={
                isTypingComplete
                  ? "Nhập tin nhắn..."
                  : "Vui lòng đợi trợ lý trả lời..."
              }
              value={inputMessage}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                setInputMessage(e.target.value)
              }
              onKeyPress={(e: React.KeyboardEvent) =>
                e.key === "Enter" && handleSendMessage()
              }
              disabled={!isTypingComplete}
              className={!isTypingComplete ? "opacity-50" : ""}
            />
            <Button
              onClick={handleSendMessage}
              disabled={!isTypingComplete || !inputMessage.trim()}
              size="icon"
              className={
                !isTypingComplete || !inputMessage.trim() ? "opacity-50" : ""
              }
            >
              <SendIcon className="h-4 w-4" />
            </Button>
          </div>
          {!isTypingComplete && (
            <div className="text-center text-sm text-gray-500 mt-2 max-w-3xl mx-auto">
              Trợ lý đang trả lời... Vui lòng đợi hiển thị hoàn tất
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
