import { handlers } from "@/auth";
import { NextResponse } from "next/server";

// Export the default NextAuth handlers for GET and POST
export const { GET, POST } = handlers;

// Add error handling function
export function middleware(request: Request) {
  console.log("NextAuth API route called:", request.url);
  return NextResponse.next();
}

export function onError(error: Error, request: Request) {
  console.error("NextAuth API error:", error.message, error.stack);
  return new Response(
    JSON.stringify({
      error: error.message || "Something went wrong",
      url: request.url,
    }),
    {
      status: 500,
      headers: {
        "Content-Type": "application/json",
      },
    }
  );
}
