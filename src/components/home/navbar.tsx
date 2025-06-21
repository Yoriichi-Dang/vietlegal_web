"use client";

import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Scale, Menu, LogIn } from "lucide-react";
import { motion } from "framer-motion";
import Link from "next/link";
import type React from "react";
import { useSession } from "next-auth/react";
import { IconMessageChatbot } from "@tabler/icons-react";
import { useRouter } from "next/navigation";
import { Spinner } from "../ui/spinner";

export default function Navbar() {
  const { data: session, status } = useSession();
  const router = useRouter();
  return (
    <motion.nav
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      className="flex items-center justify-between px-6 py-4 backdrop-blur-sm border-b border-white/10"
    >
      <Link href="/" className="flex items-center space-x-2">
        <Scale className="w-8 h-8 text-blue-500" />
        <span className="text-white font-medium text-xl">LegalWise AI</span>
      </Link>

      {/* <div className="hidden md:flex items-center space-x-8">
        <NavLink href="/tax-law">Luật Thuế</NavLink>
        <NavLink href="/insurance-law">Luật Bảo Hiểm</NavLink>
        <NavLink href="/consultation">Tư Vấn</NavLink>
        <NavLink href="/projects">Dự Án</NavLink>
        <NavLink href="/pricing">Bảng Giá</NavLink>
      </div> */}

      <div className="hidden md:flex items-center space-x-4">
        {session ? (
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="flex items-center space-x-3"
          >
            <span className="text-white">Hello, {session.user?.name}</span>
            <Avatar
              className="cursor-pointer"
              onClick={() => {
                router.push("/new");
              }}
            >
              <AvatarImage src="/placeholder.svg?height=40&width=40" />
              <AvatarFallback className="bg-blue-500">
                <IconMessageChatbot className="h-5 w-5" />
              </AvatarFallback>
            </Avatar>
          </motion.div>
        ) : status === "loading" ? (
          <Spinner size="md" />
        ) : (
          <Button
            variant="ghost"
            className="text-white hover:text-blue-400 flex items-center space-x-2"
            onClick={() => (window.location.href = "/auth")}
          >
            <LogIn className="w-5 h-5 mr-1" />
            Đăng Nhập
          </Button>
        )}
        <Button className="bg-gradient-to-r from-blue-500 to-pink-500 hover:from-blue-600 hover:to-pink-600 text-white">
          Dùng Thử Miễn Phí
        </Button>
      </div>

      <Button variant="ghost" size="icon" className="md:hidden text-white">
        <Menu className="w-6 h-6" />
      </Button>
    </motion.nav>
  );
}

function NavLink({
  href,
  children,
}: {
  href: string;
  children: React.ReactNode;
}) {
  return (
    <Link
      href={href}
      className="text-gray-300 hover:text-white transition-colors relative group"
    >
      {children}
      <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-blue-500 to-pink-500 transition-all group-hover:w-full" />
    </Link>
  );
}
