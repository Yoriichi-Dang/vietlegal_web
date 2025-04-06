"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import Link from "next/link";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex h-screen w-full overflow-hidden">
      {/* Left Side - Image and Branding */}
      <div className="hidden lg:flex lg:w-1/2 relative bg-black">
        <Image
          src="/banner_1.png"
          alt="Space with stars and planets"
          fill
          priority
          className="object-cover opacity-80"
        />

        <div className="absolute inset-0 flex flex-col justify-between p-12 z-10">
          <div>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6 }}
              className="h-12 w-12 bg-white rounded-full flex items-center justify-center"
            >
              <svg
                viewBox="0 0 24 24"
                width="24"
                height="24"
                className="text-black"
              >
                <path
                  fill="currentColor"
                  d="M12,2A10,10,0,1,0,22,12,10,10,0,0,0,12,2Zm0,18a8,8,0,1,1,8-8A8,8,0,0,1,12,20Z"
                />
                <path
                  fill="currentColor"
                  d="M12,6a1,1,0,0,0-1,1v5a1,1,0,0,0,.5.87l4,2.5a1,1,0,0,0,1-1.73L13,11.2V7A1,1,0,0,0,12,6Z"
                />
              </svg>
            </motion.div>
          </div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
          >
            <h1 className="text-3xl md:text-4xl text-white font-bold mb-2">
              VietLegal
            </h1>
            <p className="text-gray-300 text-lg md:text-xl mb-6">
              VietLegal là hệ thống quản lý pháp luật dành cho các cơ quan, tổ
              chức và cá nhân.
            </p>
          </motion.div>
        </div>
      </div>

      {/* Right Side - Auth Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center bg-background px-6 md:px-16">
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="w-full max-w-md"
        >
          {children}

          <div className="mt-4 text-center text-sm text-gray-500">
            <Link href="/">VietLegal</Link>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
