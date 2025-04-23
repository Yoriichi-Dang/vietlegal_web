// app/api/messages/route.ts
import { NextResponse } from "next/server";
import DOMPurify from "dompurify";
import { JSDOM } from "jsdom";
import OpenAI from "openai";
const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});
const createDOMPurifyServer = () => {
  const window = new JSDOM("").window;
  return DOMPurify(window);
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
    // 6. Gửi dữ liệu đã được làm sạch tới API khác
    // Ví dụ sử dụng fetch để gửi dữ liệu tới API khác
    // const apiResponse = await fetch("https://your-external-api.com/endpoint", {
    //   method: "POST",
    //   headers: {
    //     "Content-Type": "application/json",
    //     // Có thể thêm các headers cần thiết khác như Authorization
    //   },
    //   body: JSON.stringify(sanitizedData),
    // });

    // if (!apiResponse.ok) {
    //   throw new Error(
    //     `External API responded with status: ${apiResponse.status}`
    //   );
    // }
    // Fix 1: Ensure the content is a string
    const content =
      typeof sanitizedData === "object"
        ? JSON.stringify(sanitizedData)
        : sanitizedData;

    const completion = await client.chat.completions.create({
      model: "gpt-4.1",
      messages: [
        {
          role: "system",
          content:
            "You are a helpful assistant that always responds in JSON format.",
        },
        {
          role: "user",
          content: content,
        },
      ],
      response_format: { type: "json_object" },
    });

    // Parse the JSON response from OpenAI
    let aiResponseData;
    try {
      aiResponseData = JSON.parse(
        completion.choices[0].message.content || "{}"
      );
    } catch (error) {
      console.error("Error parsing AI response as JSON:", error);
      aiResponseData = { raw: completion.choices[0].message.content };
    }
    console.log(aiResponseData);
    // Return the structured response
    return NextResponse.json({
      response: completion.choices[0].message.content || "",
      status: "success",
      timestamp: new Date().toISOString(),
    });
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
