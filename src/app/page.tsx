"use client";

import { Button } from "@/components/ui/button";
import ThemeModeToggle from "@/components/ui/theme-mode-toggle";
import Link from "next/link";
import { motion } from "framer-motion";
import AuthButton from "@/components/home/auth-button";
export default function Home() {
  // Animation variants
  const fadeInUp = {
    hidden: { opacity: 0, y: 20 },
    visible: (i: number) => ({
      opacity: 1,
      y: 0,
      transition: {
        delay: i * 0.1,
        duration: 0.6,
        ease: [0.22, 1, 0.36, 1],
      },
    }),
  };

  return (
    <div className="min-h-svh text-center overflow-x-hidden px-4 sm:px-6 md:px-12">
      {/* Header/Navigation */}
      <motion.div
        className="flex justify-between items-center py-8"
        initial="hidden"
        animate="visible"
        variants={fadeInUp}
        custom={0}
      >
        <Link href="/">
          <div className="flex items-center space-x-2">
            <div className="rounded-lg bg-foreground text-background p-2 w-10 h-10 flex items-center justify-center">
              <span className="font-bold text-lg">VL</span>
            </div>
            <h1 className="text-xl md:text-2xl font-bold text-foreground">
              VietLegal
            </h1>
          </div>
        </Link>
        <div className="flex items-center gap-4 md:gap-8">
          <AuthButton />

          <ThemeModeToggle />
        </div>
      </motion.div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto">
        <main className="w-full flex flex-col-reverse md:flex-row items-center justify-between mt-8 md:mt-16 gap-12">
          {/* Left Column - Text Content */}
          <motion.div
            className="flex flex-col items-start text-left space-y-6 w-full md:w-1/2"
            initial="hidden"
            animate="visible"
            variants={fadeInUp}
            custom={1}
          >
            <h2 className="text-3xl md:text-5xl font-bold text-foreground leading-tight">
              Tư vấn pháp lý thông minh{" "}
              <span className="text-[#6366F1] dark:text-[#818CF8]">
                dành cho bạn
              </span>
            </h2>
            <p className="text-base md:text-lg text-foreground/80 max-w-lg">
              Giải pháp trí tuệ nhân tạo giúp doanh nghiệp và cá nhân dễ dàng
              giải quyết các vấn đề về thuế và bảo hiểm một cách nhanh chóng,
              chính xác.
            </p>

            <div className="flex flex-wrap gap-4 mt-4">
              <Button className="rounded-full bg-[#6366F1] hover:bg-[#4F46E5] text-white px-8 py-6">
                Bắt đầu ngay
              </Button>
              <Button
                className="rounded-full border-2 border-foreground/20 bg-transparent hover:bg-foreground/5 text-foreground px-8 py-6"
                variant="outline"
              >
                Tìm hiểu thêm
              </Button>
            </div>

            <div className="grid grid-cols-3 gap-4 mt-8 w-full">
              <div className="flex flex-col items-center">
                <div className="text-2xl md:text-3xl font-bold text-[#6366F1] dark:text-[#818CF8]">
                  98%
                </div>
                <div className="text-sm text-foreground/70">Độ chính xác</div>
              </div>
              <div className="flex flex-col items-center">
                <div className="text-2xl md:text-3xl font-bold text-[#6366F1] dark:text-[#818CF8]">
                  24/7
                </div>
                <div className="text-sm text-foreground/70">Hỗ trợ</div>
              </div>
              <div className="flex flex-col items-center">
                <div className="text-2xl md:text-3xl font-bold text-[#6366F1] dark:text-[#818CF8]">
                  10k+
                </div>
                <div className="text-sm text-foreground/70">Khách hàng</div>
              </div>
            </div>
          </motion.div>

          {/* Right Column - Chat UI */}
          <motion.div
            className="w-full md:w-1/2 relative"
            initial="hidden"
            animate="visible"
            variants={fadeInUp}
            custom={2}
          >
            <div className="relative mx-auto w-full max-w-md">
              <div className="absolute -top-6 -left-6 w-24 h-24 bg-[#6366F1]/20 rounded-full blur-xl"></div>
              <div className="absolute -bottom-10 -right-10 w-32 h-32 bg-[#818CF8]/20 rounded-full blur-xl"></div>

              <div className="relative z-10 bg-background/80 backdrop-blur-sm border border-foreground/10 rounded-2xl shadow-xl overflow-hidden">
                <div className="bg-[#6366F1] dark:bg-[#4F46E5] p-4 flex items-center">
                  <div className="w-3 h-3 rounded-full bg-red-400 mr-2"></div>
                  <div className="w-3 h-3 rounded-full bg-yellow-400 mr-2"></div>
                  <div className="w-3 h-3 rounded-full bg-green-400 mr-2"></div>
                  <div className="text-white ml-auto font-medium">
                    VietLegal Assistant
                  </div>
                </div>

                <div className="p-4 h-[500px] flex flex-col">
                  <div className="bg-foreground/5 rounded-lg p-3 mb-3 max-w-[80%] self-start">
                    <p className="text-sm text-foreground/90">
                      Chào bạn! Tôi là trợ lý VietLegal. Tôi có thể giúp gì cho
                      bạn về vấn đề thuế hoặc bảo hiểm?
                    </p>
                  </div>

                  <div className="bg-[#6366F1]/10 rounded-lg p-3 mb-3 max-w-[80%] self-end">
                    <p className="text-sm text-foreground/90">
                      Tôi cần tư vấn về thuế thu nhập doanh nghiệp.
                    </p>
                  </div>

                  <div className="bg-foreground/5 rounded-lg p-3 mb-3 max-w-[80%] self-start">
                    <p className="text-sm text-foreground/90">
                      Tôi có thể giúp bạn với thuế thu nhập doanh nghiệp. Bạn
                      muốn tìm hiểu về khía cạnh nào cụ thể?
                    </p>
                  </div>

                  <div className="bg-[#6366F1]/10 rounded-lg p-3 mb-3 max-w-[80%] self-end">
                    <p className="text-sm text-foreground/90">
                      Tôi cần biết các khoản chi phí được trừ khi tính thuế TNDN
                      năm 2024.
                    </p>
                  </div>

                  <div className="bg-foreground/5 rounded-lg p-3 mb-3 max-w-[80%] self-start">
                    <p className="text-sm text-foreground/90">
                      Dựa trên Luật Thuế TNDN hiện hành, các khoản chi phí được
                      trừ khi tính thuế TNDN năm 2024 bao gồm các khoản chi thực
                      tế phát sinh liên quan đến hoạt động sản xuất kinh doanh
                      của doanh nghiệp, có đầy đủ hóa đơn, chứng từ theo quy
                      định...
                    </p>
                  </div>

                  <div className="mt-auto border-t border-foreground/10 pt-4">
                    <div className="flex items-center bg-foreground/5 rounded-full px-4 py-2">
                      <input
                        type="text"
                        className="bg-transparent border-none outline-none flex-1 text-foreground/90 text-sm"
                        placeholder="Nhập câu hỏi của bạn..."
                      />
                      <button className="ml-2 bg-[#6366F1] text-white p-2 rounded-full">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="16"
                          height="16"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        >
                          <line x1="22" y1="2" x2="11" y2="13"></line>
                          <polygon points="22 2 15 22 11 13 2 9 22 2"></polygon>
                        </svg>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </main>

        {/* Features Section */}
        <motion.section
          className="mt-24 mb-16"
          initial="hidden"
          animate="visible"
          variants={fadeInUp}
          custom={3}
        >
          <h3 className="text-2xl md:text-3xl font-bold text-center mb-12">
            Tính năng nổi bật
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              {
                icon: (
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <circle cx="12" cy="12" r="10"></circle>
                    <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"></path>
                    <line x1="12" y1="17" x2="12.01" y2="17"></line>
                  </svg>
                ),
                title: "Tư vấn thuế",
                description:
                  "Giải đáp mọi thắc mắc về thuế thu nhập cá nhân, thuế doanh nghiệp và các loại thuế khác với thông tin chính xác, cập nhật theo luật hiện hành.",
              },
              {
                icon: (
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"></path>
                    <polyline points="7.5 4.21 12 6.81 16.5 4.21"></polyline>
                    <polyline points="7.5 19.79 7.5 14.6 3 12"></polyline>
                    <polyline points="21 12 16.5 14.6 16.5 19.79"></polyline>
                    <polyline points="3.27 6.96 12 12.01 20.73 6.96"></polyline>
                    <line x1="12" y1="22.08" x2="12" y2="12"></line>
                  </svg>
                ),
                title: "Tư vấn bảo hiểm",
                description:
                  "Hỗ trợ tư vấn các vấn đề về bảo hiểm xã hội, y tế và các loại bảo hiểm bắt buộc khác, giúp bạn và doanh nghiệp tuân thủ đúng quy định.",
              },
              {
                icon: (
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M12 2H2v10l9.29 9.29c.94.94 2.48.94 3.42 0l6.58-6.58c.94-.94.94-2.48 0-3.42L12 2Z"></path>
                    <path d="M7 7h.01"></path>
                  </svg>
                ),
                title: "Cập nhật luật",
                description:
                  "Cơ sở dữ liệu luật pháp Việt Nam được cập nhật liên tục theo thời gian, đảm bảo bạn luôn nhận được thông tin mới nhất về các thay đổi pháp lý.",
              },
              {
                icon: (
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M14 3v4a1 1 0 0 0 1 1h4"></path>
                    <path d="M17 21h-10a2 2 0 0 1 -2 -2v-14a2 2 0 0 1 2 -2h7l5 5v11a2 2 0 0 1 -2 2z"></path>
                    <path d="M9 17h6"></path>
                    <path d="M9 13h6"></path>
                  </svg>
                ),
                title: "Xử lý văn bản pháp luật",
                description:
                  "Phân tích và giải thích các văn bản pháp luật phức tạp, hỗ trợ soạn thảo hợp đồng và tài liệu pháp lý cho cá nhân và doanh nghiệp.",
              },
            ].map((feature, index) => (
              <motion.div
                key={index}
                className="bg-foreground/5 backdrop-blur-sm border border-foreground/10 rounded-xl p-6 transition-all hover:shadow-lg"
                whileHover={{ y: -5 }}
                initial="hidden"
                animate="visible"
                variants={fadeInUp}
                custom={index + 4}
              >
                <div className="w-12 h-12 bg-[#6366F1] text-white rounded-lg flex items-center justify-center mb-4">
                  {feature.icon}
                </div>
                <h4 className="text-xl font-bold mb-2">{feature.title}</h4>
                <p className="text-foreground/70">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </motion.section>

        {/* Testimonials Section */}
        <motion.section
          className="mb-24"
          initial="hidden"
          animate="visible"
          variants={fadeInUp}
          custom={8}
        >
          <h3 className="text-2xl md:text-3xl font-bold text-center mb-12">
            Khách hàng nói gì về chúng tôi
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                initial: "T",
                name: "Trần Minh Đức",
                position: "Giám đốc tài chính",
                rating: 5,
                text: "VietLegal đã giúp công ty chúng tôi tiết kiệm hàng chục giờ làm việc mỗi tháng trong việc tư vấn pháp lý và thuế. Hỗ trợ nhanh chóng và chính xác.",
              },
              {
                initial: "N",
                name: "Nguyễn Thị Hà",
                position: "Quản lý nhân sự",
                rating: 5,
                text: "Tôi đặc biệt ấn tượng với khả năng cập nhật luật lao động và bảo hiểm của VietLegal. Hệ thống giúp chúng tôi luôn tuân thủ đúng quy định mới nhất.",
              },
              {
                initial: "L",
                name: "Lê Văn Minh",
                position: "Chủ doanh nghiệp vừa và nhỏ",
                rating: 4,
                text: "Với quy mô doanh nghiệp nhỏ, việc thuê luật sư tư vấn thường xuyên là quá tốn kém. VietLegal là giải pháp tuyệt vời giúp tôi giải quyết các vấn đề pháp lý hằng ngày.",
              },
            ].map((testimonial, index) => (
              <motion.div
                key={index}
                className="bg-foreground/5 backdrop-blur-sm border border-foreground/10 rounded-xl p-6"
                initial="hidden"
                animate="visible"
                variants={fadeInUp}
                custom={index + 9}
              >
                <div className="flex items-center mb-4">
                  <div className="w-10 h-10 bg-[#6366F1] rounded-full flex items-center justify-center text-white font-bold mr-3">
                    {testimonial.initial}
                  </div>
                  <div>
                    <p className="font-semibold">{testimonial.name}</p>
                    <p className="text-sm text-foreground/60">
                      {testimonial.position}
                    </p>
                  </div>
                  <div className="ml-auto flex">
                    {[...Array(5)].map((_, i) => (
                      <svg
                        key={i}
                        xmlns="http://www.w3.org/2000/svg"
                        width="16"
                        height="16"
                        viewBox="0 0 24 24"
                        fill={i < testimonial.rating ? "#6366F1" : "#E5E7EB"}
                        stroke="none"
                      >
                        <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
                      </svg>
                    ))}
                  </div>
                </div>
                <p className="text-foreground/80 italic">
                  &ldquo;{testimonial.text}&rdquo;
                </p>
              </motion.div>
            ))}
          </div>
        </motion.section>
      </div>
    </div>
  );
}
