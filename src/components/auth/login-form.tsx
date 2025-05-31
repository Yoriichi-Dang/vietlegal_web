"use client";

import type React from "react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Mail, Lock, Eye, EyeOff, AlertCircle } from "lucide-react";
import { GoogleIcon } from "@/components/auth/google-icon";
import loginSchema, { type LoginFormData } from "@/schemas/login";
import { signIn } from "next-auth/react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

export default function LoginForm() {
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState<LoginFormData>({
    email: "",
    password: "",
  });
  const [errors, setErrors] = useState<
    Partial<Record<keyof LoginFormData, string>>
  >({});
  const router = useRouter();

  const validateField = (field: keyof LoginFormData, value: string) => {
    try {
      loginSchema.shape[field].parse(value);
      setErrors((prev) => ({ ...prev, [field]: undefined }));
    } catch (error: any) {
      if (error.errors?.[0]?.message) {
        setErrors((prev) => ({ ...prev, [field]: error.errors[0].message }));
      }
    }
  };

  const handleInputChange = (field: keyof LoginFormData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    // Validate on change if there was an error
    if (errors[field]) {
      validateField(field, value);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      // Validate entire form
      const validatedData = loginSchema.parse(formData);
      const result = await signIn("credentials", {
        email: validatedData.email,
        password: validatedData.password,
        redirect: false,
      });
      if (result?.error) {
        toast.error("Email hoặc mật khẩu không chính xác");
      }
      router.push("/new");
      router.refresh();
    } catch (error: any) {
      if (error.errors) {
        const newErrors: Partial<Record<keyof LoginFormData, string>> = {};
        error.errors.forEach((err: any) => {
          if (err.path?.[0]) {
            newErrors[err.path[0] as keyof LoginFormData] = err.message;
          }
        });
        setErrors(newErrors);
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    setIsLoading(true);
    await signIn("google", { callbackUrl: "/new" });
    setIsLoading(false);
  };

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-white mb-2">
          Chào mừng trở lại
        </h2>
        <p className="text-gray-400">Đăng nhập vào tài khoản của bạn</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="email" className="text-white">
            Email
          </Label>
          <div className="relative">
            <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <Input
              id="email"
              type="email"
              placeholder="your@email.com"
              value={formData.email}
              onChange={(e) => handleInputChange("email", e.target.value)}
              onBlur={(e) => validateField("email", e.target.value)}
              className={`pl-10 bg-white/5 border-white/10 text-white placeholder:text-gray-400 focus:border-blue-500 ${
                errors.email ? "border-red-500" : ""
              }`}
              required
            />
          </div>
          {errors.email && (
            <div className="flex items-center space-x-1 text-red-400 text-sm">
              <AlertCircle className="w-4 h-4" />
              <span>{errors.email}</span>
            </div>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="password" className="text-white">
            Mật khẩu
          </Label>
          <div className="relative">
            <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <Input
              id="password"
              type={showPassword ? "text" : "password"}
              placeholder="••••••••"
              value={formData.password}
              onChange={(e) => handleInputChange("password", e.target.value)}
              onBlur={(e) => validateField("password", e.target.value)}
              className={`pl-10 pr-10 bg-white/5 border-white/10 text-white placeholder:text-gray-400 focus:border-blue-500 ${
                errors.password ? "border-red-500" : ""
              }`}
              required
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white"
            >
              {showPassword ? (
                <EyeOff className="w-5 h-5" />
              ) : (
                <Eye className="w-5 h-5" />
              )}
            </button>
          </div>
          {errors.password && (
            <div className="flex items-center space-x-1 text-red-400 text-sm">
              <AlertCircle className="w-4 h-4" />
              <span>{errors.password}</span>
            </div>
          )}
        </div>

        <div className="flex items-center justify-between">
          <label className="flex items-center space-x-2">
            <input
              type="checkbox"
              className="rounded border-white/10 bg-white/5 text-blue-500"
            />
            <span className="text-sm text-gray-400">Ghi nhớ đăng nhập</span>
          </label>
          <button
            type="button"
            className="text-sm text-blue-400 hover:text-blue-300"
          >
            Quên mật khẩu?
          </button>
        </div>

        <Button
          type="submit"
          disabled={isLoading}
          className="w-full bg-gradient-to-r from-blue-500 to-pink-500 hover:from-blue-600 hover:to-pink-600 text-white disabled:opacity-50"
        >
          {isLoading ? "Đang đăng nhập..." : "Đăng Nhập"}
        </Button>
      </form>

      <div className="relative">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-white/10" />
        </div>
        <div className="relative flex justify-center text-sm">
          <span className="px-2 bg-black/50 text-gray-400">Hoặc</span>
        </div>
      </div>

      <Button
        onClick={handleGoogleLogin}
        variant="outline"
        className="w-full border-white/10 bg-white/5 text-white hover:bg-white/10"
      >
        <GoogleIcon className="w-5 h-5 mr-2" />
        Đăng nhập bằng Google
      </Button>
    </div>
  );
}
