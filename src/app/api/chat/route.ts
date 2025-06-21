export async function POST(req: Request) {
  try {
    const requestBody = await req.json();
    const { messages, chat_id, files } = requestBody;
    const port = process.env.NEXT_PUBLIC_SERVER_AI_PORT;
    const host = process.env.NEXT_PUBLIC_SERVER_AI_HOST;
    const url = `${host}:${port}/chat`;

    //   // Lấy tin nhắn cuối cùng từ user
    const lastMessage = messages[messages.length - 1];
    const body = {
      question: lastMessage.content,
      chat_id: chat_id,
      files: files,
    };

    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    });

    const data = await response.json();
    const resultText = data["result"];
    console.log("Full result text:", resultText);

    // Tạo streaming response với hiệu ứng typing
    const stream = new ReadableStream({
      start(controller) {
        const encoder = new TextEncoder();

        // Chia text thành các từ để streaming tự nhiên hơn
        const words = resultText.split(/(\s+)/); // Giữ lại spaces
        let wordIndex = 0;

        const sendChunk = () => {
          if (wordIndex < words.length) {
            // Thêm từ tiếp theo
            const nextWord = words[wordIndex];

            // Chỉ gửi phần text MỚI (incremental)
            // Format: 0:"new_word_or_chars"
            const chunk = `0:${JSON.stringify(nextWord)}\n`;
            controller.enqueue(encoder.encode(chunk));

            wordIndex++;

            // Delay tối ưu cho tốc độ nhanh
            const delay = nextWord.length > 10 ? 90 : 60;
            setTimeout(sendChunk, delay);
          } else {
            // Gửi finish signal đúng format để trigger onFinish
            const finishData = {
              finishReason: "stop",
              usage: {
                promptTokens: Math.ceil(resultText.length / 4), // Estimate
                completionTokens: words.length,
              },
            };

            const finishChunk = `d:${JSON.stringify(finishData)}\n`;
            controller.enqueue(encoder.encode(finishChunk));

            console.log("Sent finish signal:", finishData);

            // Đóng stream sau một chút delay
            setTimeout(() => {
              controller.close();
              console.log("Stream closed");
            }, 100);
          }
        };

        // Bắt đầu streaming
        setTimeout(sendChunk, 100);
      },
    });

    return new Response(stream, {
      headers: {
        "Content-Type": "text/plain; charset=utf-8",
        "Cache-Control": "no-cache",
        Connection: "keep-alive",
        "X-Accel-Buffering": "no", // Disable proxy buffering
      },
    });
  } catch (error) {
    console.error("Error in chat API:", error);
    return new Response("Error processing request", { status: 500 });
  }
}
