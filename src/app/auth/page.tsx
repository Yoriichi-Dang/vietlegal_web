"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import LoginForm from "@/components/auth/login-form";
import RegisterForm from "@/components/auth/register-form";
import Link from "next/link";
import { Scale } from "lucide-react";
import { SparklesCore } from "@/components/home/sparkles";

export default function AuthPage() {
  const [isLogin, setIsLogin] = useState(true);

  return (
    <div className="min-h-screen bg-black/[0.96] antialiased bg-grid-white/[0.02] relative overflow-hidden">
      {/* Background particles */}
      <div className="h-full w-full absolute inset-0 z-0">
        <SparklesCore
          id="authparticles"
          background="transparent"
          minSize={0.6}
          maxSize={1.4}
          particleDensity={50}
          className="w-full h-full"
          particleColor="#FFFFFF"
        />
      </div>

      <div className="relative z-10 min-h-screen flex items-center justify-center p-6">
        <div className="w-full max-w-md">
          {/* Logo */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-8"
          >
            <Link href="/" className="inline-flex items-center space-x-2">
              <Scale className="w-10 h-10 text-blue-500" />
              <span className="text-white font-bold text-2xl">
                LegalWise AI
              </span>
            </Link>
          </motion.div>

          {/* Auth Container */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-white/5 backdrop-blur-sm rounded-lg border border-white/10 p-8"
          >
            {/* Toggle Buttons */}
            <div className="flex mb-6 bg-white/5 rounded-lg p-1">
              <button
                onClick={() => setIsLogin(true)}
                className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-all ${
                  isLogin
                    ? "bg-gradient-to-r from-blue-500 to-pink-500 text-white"
                    : "text-gray-400 hover:text-white"
                }`}
              >
                Đăng Nhập
              </button>
              <button
                onClick={() => setIsLogin(false)}
                className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-all ${
                  !isLogin
                    ? "bg-gradient-to-r from-blue-500 to-pink-500 text-white"
                    : "text-gray-400 hover:text-white"
                }`}
              >
                Đăng Ký
              </button>
            </div>

            {/* Forms */}
            <motion.div
              key={isLogin ? "login" : "register"}
              initial={{ opacity: 0, x: isLogin ? -20 : 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.3 }}
            >
              {isLogin ? <LoginForm /> : <RegisterForm />}
            </motion.div>
          </motion.div>

          {/* Back to Home */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="text-center mt-6"
          >
            <Link
              href="/"
              className="text-gray-400 hover:text-white transition-colors"
            >
              ← Quay về trang chủ
            </Link>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
