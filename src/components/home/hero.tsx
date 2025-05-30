"use client";

import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { MessageCircle } from "lucide-react";
import { FloatingLegal } from "./floating-legal";
import { LegalAnimation } from "./legal-animation";
import { useRouter } from "next/navigation";

export default function Hero() {
  const router = useRouter();
  return (
    <div className="relative min-h-[calc(100vh-76px)] flex items-center">
      {/* Floating legal documents background */}
      <div className="absolute inset-0 overflow-hidden">
        <FloatingLegal count={8} />
      </div>

      <div className="container mx-auto px-6 relative z-10">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold text-white mb-6">
              Tư Vấn Pháp Lý
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-pink-500">
                {" "}
                Thông Minh
              </span>
              <br />
              <span className="text-3xl md:text-4xl lg:text-5xl">
                Về Thuế & Bảo Hiểm
              </span>
            </h1>
          </motion.div>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="text-gray-400 text-xl mb-8 max-w-3xl mx-auto"
          >
            Nền tảng AI hàng đầu cung cấp tư vấn pháp lý chuyên sâu về luật thuế
            và bảo hiểm. Giải đáp mọi thắc mắc pháp lý một cách nhanh chóng và
            chính xác.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-12"
          >
            <Button
              size="lg"
              onClick={() => router.push("/new")}
              className="bg-gradient-to-r from-blue-500 to-pink-500 hover:from-blue-600 hover:to-pink-600 text-white px-8 cursor-pointer"
            >
              <MessageCircle className="mr-2 h-5 w-5" />
              Tư Vấn Ngay
            </Button>
            {/* <Button
              size="lg"
              variant="outline"
              className="text-white border-blue-500 hover:bg-blue-500/20 cursor-pointer"
            >
              <MessageCircle className="mr-2 h-5 w-5" />
              Đặt Câu Hỏi
            </Button> */}
          </motion.div>

          {/* Quick stats */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.6 }}
            className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-2xl mx-auto"
          >
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-400">10,000+</div>
              <div className="text-gray-400">Văn bản pháp luật</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-pink-400">5,000+</div>
              <div className="text-gray-400">Khách hàng tin tưởng</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-400">24/7</div>
              <div className="text-gray-400">Hỗ trợ tư vấn</div>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Animated legal scales */}
      <div className="absolute bottom-0 right-0 w-96 h-96">
        <LegalAnimation />
      </div>
    </div>
  );
}
