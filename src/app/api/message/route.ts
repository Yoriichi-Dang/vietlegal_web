// app/api/messages/route.ts
import { NextResponse } from "next/server";
import DOMPurify, { WindowLike } from "dompurify";
import { JSDOM } from "jsdom";
import OpenAI from "openai";
const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});
const createDOMPurifyServer = () => {
  const window = new JSDOM("").window;
  return DOMPurify(window as unknown as WindowLike);
};

const sanitizeData = (data: any) => {
  const purify = createDOMPurifyServer();
  purify.setConfig({
    FORBID_TAGS: ["script", "style", "iframe", "frame", "object", "embed"],
    FORBID_ATTR: ["onerror", "onload", "onclick", "onmouseover"],
  });

  if (typeof data === "string") {
    return purify.sanitize(data, {
      ALLOWED_TAGS: [],
      ALLOWED_ATTR: [],
    });
  }

  if (typeof data === "object" && data !== null) {
    const sanitizedData: Record<string, any> = Array.isArray(data) ? [] : {};

    for (const key in data) {
      if (Object.prototype.hasOwnProperty.call(data, key)) {
        sanitizedData[key] = sanitizeData(data[key]);
      }
    }

    return sanitizedData;
  }

  // Trả về nguyên giá trị cho các kiểu dữ liệu khác
  return data;
};

export async function POST(request: Request) {
  try {
    // 1. Nhận dữ liệu từ client
    const body = await request.json();

    // 2. Lưu dữ liệu gốc để so sánh
    const originalData = JSON.stringify(body);

    // 3. Làm sạch dữ liệu sử dụng DOMPurify
    const sanitizedData = sanitizeData(body);

    // 4. So sánh để kiểm tra xem dữ liệu có thay đổi không
    const hasBeenModified = originalData !== JSON.stringify(sanitizedData);
    console.log(hasBeenModified);

    // Kiểm tra nếu là tin nhắn đầu tiên
    const isFirstMessage = sanitizedData.isFirstMessage === true;

    // Fix 1: Ensure the content is a string
    const content =
      typeof sanitizedData === "object"
        ? JSON.stringify(sanitizedData)
        : sanitizedData;

    // Nếu là tin nhắn đầu tiên, thêm yêu cầu tạo tiêu đề
    let suggestedTitle = "";
    if (isFirstMessage) {
      console.log(
        "Creating title for first message with content:",
        sanitizedData.message
      );
      try {
        // Gọi API OpenAI để tạo tiêu đề
        const titleCompletion = await client.chat.completions.create({
          model: "gpt-4o-mini", // Dùng model nhỏ hơn cho việc tạo tiêu đề
          messages: [
            {
              role: "system",
              content:
                "Bạn là một trợ lý có nhiệm vụ tạo tiêu đề ngắn gọn cho cuộc trò chuyện. Hãy tạo một tiêu đề ngắn gọn (không quá 30 ký tự) bằng tiếng Việt dựa trên nội dung tin nhắn đầu tiên của người dùng. Tiêu đề phải súc tích, thể hiện được chủ đề chính của tin nhắn và không được có dấu ngoặc kép. Chỉ trả về tiêu đề, không cần thêm bất kỳ thông tin nào khác.",
            },
            {
              role: "user",
              content: sanitizedData.message || "",
            },
          ],
          max_tokens: 50,
          temperature: 0.7,
        });

        suggestedTitle =
          titleCompletion.choices[0].message.content?.trim() || "";
        console.log("Generated title from OpenAI:", suggestedTitle);

        // Nếu vì lý do nào đó title trống, sử dụng phương pháp dự phòng
        if (!suggestedTitle) {
          suggestedTitle =
            sanitizedData.message?.substring(0, 30) +
              (sanitizedData.message?.length > 30 ? "..." : "") ||
            "Cuộc trò chuyện mới";
          console.log(
            "Generated title is empty, using fallback:",
            suggestedTitle
          );
        }
      } catch (error) {
        console.error("Error generating title:", error);
        // Nếu có lỗi, sử dụng một phần nội dung tin nhắn làm tiêu đề
        suggestedTitle =
          sanitizedData.message?.substring(0, 30) +
            (sanitizedData.message?.length > 30 ? "..." : "") ||
          "Cuộc trò chuyện mới";
        console.log("Error generating title, using fallback:", suggestedTitle);
      }
    }

    // Tiếp tục xử lý tin nhắn bình thường
    const completion = await client.chat.completions.create({
      model: "gpt-4.1",
      messages: [
        {
          role: "system",
          content:
            "You are an assistant for question-answering tasks. Use the following pieces of retrieved context to answer the question. If you don't know the answer, just say that you don't know. Use three sentences maximum and keep the answer concise. Return the answer in Vietnamese.",
        },
        {
          role: "user",
          content: content,
        },
      ],
    });

    // Parse the JSON response from OpenAI
    let aiResponseData;
    let responseContent = completion.choices[0].message.content || "";

    // Kiểm tra và bọc code C++ không được định dạng đúng
    // Xác định code C++ dựa trên các pattern phổ biến
    const cppPatterns = [
      /#include\s*</, // #include <...>
      /using namespace std;/,
      /int main\(\)/,
      /std::/,
      /vector<.+>/,
      /iostream>/,
    ];

    const hasCppPattern = cppPatterns.some((pattern) =>
      pattern.test(responseContent)
    );
    if (hasCppPattern && !responseContent.includes("```")) {
      // Thêm thẻ code block nếu phát hiện code C++ chưa được định dạng
      responseContent = "```cpp\n" + responseContent + "\n```";
    }

    try {
      aiResponseData = JSON.parse(responseContent || "{}");
    } catch (error) {
      console.error("Error parsing AI response as JSON:", error);
      aiResponseData = { raw: responseContent };
    }
    console.log(aiResponseData);

    // Return the structured response, including suggested title if this is the first message
    if (isFirstMessage) {
      return NextResponse.json({
        response: responseContent,
        title: suggestedTitle,
        status: "success",
        timestamp: new Date().toISOString(),
      });
    } else {
      return NextResponse.json({
        response: responseContent,
        status: "success",
        timestamp: new Date().toISOString(),
      });
    }
  } catch (error) {
    console.error("Error processing request:", error);

    return NextResponse.json(
      {
        success: false,
        message: "Error processing request",
        error: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}
