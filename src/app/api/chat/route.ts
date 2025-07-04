// app/api/chat/route.ts
import { NextRequest } from "next/server";

// IMPORTANT: Set the runtime to edge
export const runtime = "edge";

export async function POST(req: NextRequest) {
  try {
    const { messages, chat_id, files } = await req.json();

    const port = process.env.NEXT_PUBLIC_SERVER_AI_PORT || "8000";
    const host = process.env.NEXT_PUBLIC_SERVER_AI_HOST || "http://localhost";
    const url = `${host}:${port}/chat/stream`;

    const lastMessage = messages[messages.length - 1];
    const body = {
      question: lastMessage.content,
      chat_id: chat_id,
      files: files || [],
    };

    console.log("Sending request to AI server:", url, body);

    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "text/event-stream",
        "Cache-Control": "no-cache",
      },
      body: JSON.stringify(body),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("FastAPI Error:", errorText);
      throw new Error(
        `FastAPI server responded with ${response.status}: ${errorText}`
      );
    }

    if (!response.body) {
      throw new Error("The response body is empty.");
    }

    // Create a custom ReadableStream to process FastAPI SSE
    const stream = new ReadableStream({
      async start(controller) {
        const reader = response.body!.getReader();
        const decoder = new TextDecoder();
        const encoder = new TextEncoder();

        let buffer = "";

        try {
          while (true) {
            const { done, value } = await reader.read();

            if (done) {
              // Process any remaining buffer content
              if (buffer.trim()) {
                processSSEBuffer(buffer, controller, encoder);
              }
              controller.close();
              return;
            }

            // Decode the chunk and add to buffer
            buffer += decoder.decode(value, { stream: true });

            // Process complete SSE events (events end with \n\n)
            let doubleNewlineIndex;
            while ((doubleNewlineIndex = buffer.indexOf("\n\n")) !== -1) {
              const event = buffer.substring(0, doubleNewlineIndex);
              buffer = buffer.substring(doubleNewlineIndex + 2);

              if (event.trim()) {
                processSSEBuffer(event, controller, encoder);
              }
            }
          }
        } catch (error) {
          console.error("Stream reading error:", error);
          const errorEvent = `data: ${JSON.stringify({
            error: "Stream processing error",
            details: error instanceof Error ? error.message : String(error),
          })}\n\n`;
          controller.enqueue(encoder.encode(errorEvent));
          controller.error(error);
        } finally {
          reader.releaseLock();
        }
      },
    });

    // Return the stream with proper headers
    return new Response(stream, {
      headers: {
        "Content-Type": "text/event-stream",
        "Cache-Control": "no-cache, no-transform",
        Connection: "keep-alive",
        "X-Accel-Buffering": "no", // Disable proxy buffering
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Headers": "*",
        "Access-Control-Allow-Methods": "*",
      },
    });
  } catch (error) {
    console.error("API Route Error:", error);
    const errorMessage =
      error instanceof Error ? error.message : "An unknown error occurred";

    return Response.json({ error: errorMessage }, { status: 500 });
  }
}

// Helper function to process SSE events from FastAPI
function processSSEBuffer(
  event: string,
  controller: ReadableStreamDefaultController<Uint8Array>,
  encoder: TextEncoder
) {
  const lines = event.split("\n");

  for (const line of lines) {
    if (line.startsWith("data: ")) {
      const jsonStr = line.substring(6).trim();

      if (!jsonStr) continue;

      try {
        const parsed = JSON.parse(jsonStr);

        // Handle different event types from FastAPI
        if (parsed.type === "content" && parsed.content) {
          // Forward content chunk to client
          const sseEvent = `data: ${JSON.stringify({
            type: "content",
            content: parsed.content,
            chat_id: parsed.chat_id,
            current_agent: parsed.current_agent || "unknown",
          })}\n\n`;
          controller.enqueue(encoder.encode(sseEvent));
        } else if (parsed.type === "start") {
          // Forward start event
          const startEvent = `data: ${JSON.stringify({
            type: "start",
            message: parsed.message || "Starting...",
            chat_id: parsed.chat_id,
          })}\n\n`;
          controller.enqueue(encoder.encode(startEvent));
        } else if (parsed.type === "end") {
          // Forward end event and close stream
          const endEvent = `data: ${JSON.stringify({
            type: "end",
            message: parsed.message || "Response completed",
            chat_id: parsed.chat_id,
          })}\n\n`;
          controller.enqueue(encoder.encode(endEvent));

          // Send final DONE signal
          const doneEvent = `data: [DONE]\n\n`;
          controller.enqueue(encoder.encode(doneEvent));
          controller.close();
          return;
        } else if (parsed.type === "error") {
          // Forward error event and close stream
          const errorEvent = `data: ${JSON.stringify({
            type: "error",
            error: parsed.error || "Unknown error",
            chat_id: parsed.chat_id,
          })}\n\n`;
          controller.enqueue(encoder.encode(errorEvent));
          controller.close();
          return;
        }
      } catch (parseError) {
        console.error("Failed to parse SSE JSON:", jsonStr, parseError);
        // Don't close the stream for parse errors, just log and continue
      }
    }
  }
}
