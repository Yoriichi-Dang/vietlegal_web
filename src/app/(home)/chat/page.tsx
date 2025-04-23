import ChatInput from "@/components/chat/chat-input";
import HeaderAvatar from "@/components/chat/header-avatar";
import Sidebar from "@/components/chat/sidebar";
import React from "react";

const Page = () => {
  return (
    <div className="flex relative">
      <Sidebar />
      <main className="w-full min-h-svh flex justify-center items-center">
        <ChatInput />
      </main>
      <HeaderAvatar />
    </div>
  );
};

export default Page;
