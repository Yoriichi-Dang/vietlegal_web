"use client";

import { motion } from "framer-motion";
import {
  Calculator,
  Shield,
  FileText,
  MessageCircle,
  Search,
  Users,
} from "lucide-react";

export default function Features() {
  const features = [
    {
      icon: Calculator,
      title: "Tính Thuế Thông Minh",
      description:
        "AI tính toán thuế chính xác theo quy định mới nhất, hỗ trợ mọi loại hình doanh nghiệp và cá nhân.",
    },
    {
      icon: Shield,
      title: "Tư Vấn Bảo Hiểm",
      description:
        "Phân tích và tư vấn các vấn đề phức tạp về luật bảo hiểm xã hội, y tế và thương mại.",
    },
    {
      icon: FileText,
      title: "Soạn Thảo Văn Bản",
      description:
        "Tự động soạn thảo đơn từ, khiếu nại, và các văn bản pháp lý theo đúng quy định.",
    },
    {
      icon: MessageCircle,
      title: "Chat Bot Pháp Lý",
      description:
        "Trò chuyện trực tiếp với AI để được giải đáp mọi thắc mắc về thuế và bảo hiểm.",
    },
    {
      icon: Search,
      title: "Tra Cứu Nhanh",
      description:
        "Tìm kiếm và tra cứu văn bản pháp luật, thông tư, nghị định một cách nhanh chóng.",
    },
    {
      icon: Users,
      title: "Hỗ Trợ Chuyên Gia",
      description:
        "Kết nối với đội ngũ luật sư chuyên nghiệp khi cần tư vấn sâu hơn.",
    },
  ];

  return (
    <section className="py-20 px-6">
      <div className="container mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl md:text-5xl font-bold text-white mb-4">
            Tính Năng
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-pink-500">
              {" "}
              Nổi Bật
            </span>
          </h2>
          <p className="text-gray-400 text-xl max-w-2xl mx-auto">
            Khám phá những tính năng mạnh mẽ giúp bạn giải quyết mọi vấn đề pháp
            lý về thuế và bảo hiểm
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="bg-white/5 backdrop-blur-sm rounded-lg border border-white/10 p-6 hover:bg-white/10 transition-all duration-300 group"
            >
              <div className="flex items-center mb-4">
                <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-pink-500 rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform">
                  <feature.icon className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-white font-semibold text-lg ml-4">
                  {feature.title}
                </h3>
              </div>
              <p className="text-gray-400 leading-relaxed">
                {feature.description}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
