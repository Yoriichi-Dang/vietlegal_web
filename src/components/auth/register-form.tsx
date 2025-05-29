"use client";

import type React from "react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Mail,
  Lock,
  User,
  Eye,
  EyeOff,
  AlertCircle,
  CheckCircle,
} from "lucide-react";
import axios from "@/utils/axios";
import { authApiUrl } from "@/utils/config";
import { toast } from "sonner";
import { GoogleIcon } from "@/components/auth/google-icon";
import registerSchema, { type RegisterFormData } from "@/schemas/register";
import { signIn } from "next-auth/react";

export default function RegisterForm() {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState<RegisterFormData>({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    terms: false,
  });
  const [errors, setErrors] = useState<
    Partial<Record<keyof RegisterFormData, string>>
  >({});

  const validateField = (
    field: keyof RegisterFormData,
    value: string | boolean
  ) => {
    try {
      if (field === "terms") {
        registerSchema.parse(value);
      } else {
        registerSchema.parse(value);
      }
      setErrors((prev) => ({ ...prev, [field]: undefined }));
    } catch (error: any) {
      if (error.errors?.[0]?.message) {
        setErrors((prev) => ({ ...prev, [field]: error.errors[0].message }));
      }
    }
  };

  const handleInputChange = (
    field: keyof RegisterFormData,
    value: string | boolean
  ) => {
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
      const validatedData = registerSchema.parse(formData);
      console.log("Register data:", validatedData);
      const res = await axios.post(authApiUrl.register, {
        username: validatedData.name,
        email: validatedData.email,
        password: validatedData.password,
      });
      const data = res.data;
      if (res.status !== 200) {
        toast.error(data.message);
      }
      toast("Account has been created", {
        description: "Please login to continue",
      });
    } catch (error: any) {
      if (error.errors) {
        const newErrors: Partial<Record<keyof RegisterFormData, string>> = {};
        error.errors.forEach((err: any) => {
          if (err.path?.[0]) {
            newErrors[err.path[0] as keyof RegisterFormData] = err.message;
          }
        });
        setErrors(newErrors);
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleRegister = async () => {
    setIsLoading(true);
    await signIn("google", { callbackUrl: "/new" });
    setIsLoading(false);
  };

  const getPasswordStrength = (password: string) => {
    const checks = [
      password.length >= 8,
      /\d/.test(password),
      /[A-Z]/.test(password),
      /[^A-Za-z0-9]/.test(password),
    ];
    return checks.filter(Boolean).length;
  };

  const passwordStrength = getPasswordStrength(formData.password);

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-white mb-2">
          Tạo tài khoản mới
        </h2>
        <p className="text-gray-400">Đăng ký để sử dụng LegalWise AI</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="name" className="text-white">
            Tên người dùng
          </Label>
          <div className="relative">
            <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <Input
              id="name"
              type="text"
              placeholder="Tên của bạn"
              value={formData.name}
              onChange={(e) => handleInputChange("name", e.target.value)}
              onBlur={(e) => validateField("name", e.target.value)}
              className={`pl-10 bg-white/5 border-white/10 text-white placeholder:text-gray-400 focus:border-blue-500 ${
                errors.name ? "border-red-500" : ""
              }`}
              required
            />
          </div>
          {errors.name && (
            <div className="flex items-center space-x-1 text-red-400 text-sm">
              <AlertCircle className="w-4 h-4" />
              <span>{errors.name}</span>
            </div>
          )}
        </div>

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

          {/* Password strength indicator */}
          {formData.password && (
            <div className="space-y-2">
              <div className="flex space-x-1">
                {[1, 2, 3, 4].map((level) => (
                  <div
                    key={level}
                    className={`h-1 flex-1 rounded ${
                      passwordStrength >= level
                        ? passwordStrength === 4
                          ? "bg-green-500"
                          : passwordStrength >= 3
                          ? "bg-yellow-500"
                          : "bg-red-500"
                        : "bg-gray-600"
                    }`}
                  />
                ))}
              </div>
              <div className="text-xs space-y-1">
                <div
                  className={`flex items-center space-x-1 ${
                    formData.password.length >= 8
                      ? "text-green-400"
                      : "text-gray-400"
                  }`}
                >
                  {formData.password.length >= 8 ? (
                    <CheckCircle className="w-3 h-3" />
                  ) : (
                    <div className="w-3 h-3 border border-gray-400 rounded-full" />
                  )}
                  <span>Ít nhất 8 ký tự</span>
                </div>
                <div
                  className={`flex items-center space-x-1 ${
                    /\d/.test(formData.password)
                      ? "text-green-400"
                      : "text-gray-400"
                  }`}
                >
                  {/\d/.test(formData.password) ? (
                    <CheckCircle className="w-3 h-3" />
                  ) : (
                    <div className="w-3 h-3 border border-gray-400 rounded-full" />
                  )}
                  <span>Chứa số</span>
                </div>
                <div
                  className={`flex items-center space-x-1 ${
                    /[A-Z]/.test(formData.password)
                      ? "text-green-400"
                      : "text-gray-400"
                  }`}
                >
                  {/[A-Z]/.test(formData.password) ? (
                    <CheckCircle className="w-3 h-3" />
                  ) : (
                    <div className="w-3 h-3 border border-gray-400 rounded-full" />
                  )}
                  <span>Chữ hoa</span>
                </div>
                <div
                  className={`flex items-center space-x-1 ${
                    /[^A-Za-z0-9]/.test(formData.password)
                      ? "text-green-400"
                      : "text-gray-400"
                  }`}
                >
                  {/[^A-Za-z0-9]/.test(formData.password) ? (
                    <CheckCircle className="w-3 h-3" />
                  ) : (
                    <div className="w-3 h-3 border border-gray-400 rounded-full" />
                  )}
                  <span>Ký tự đặc biệt</span>
                </div>
              </div>
            </div>
          )}

          {errors.password && (
            <div className="flex items-center space-x-1 text-red-400 text-sm">
              <AlertCircle className="w-4 h-4" />
              <span>{errors.password}</span>
            </div>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="confirmPassword" className="text-white">
            Xác nhận mật khẩu
          </Label>
          <div className="relative">
            <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <Input
              id="confirmPassword"
              type={showConfirmPassword ? "text" : "password"}
              placeholder="••••••••"
              value={formData.confirmPassword}
              onChange={(e) =>
                handleInputChange("confirmPassword", e.target.value)
              }
              onBlur={(e) => validateField("confirmPassword", e.target.value)}
              className={`pl-10 pr-10 bg-white/5 border-white/10 text-white placeholder:text-gray-400 focus:border-blue-500 ${
                errors.confirmPassword ? "border-red-500" : ""
              }`}
              required
            />
            <button
              type="button"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white"
            >
              {showConfirmPassword ? (
                <EyeOff className="w-5 h-5" />
              ) : (
                <Eye className="w-5 h-5" />
              )}
            </button>
          </div>
          {errors.confirmPassword && (
            <div className="flex items-center space-x-1 text-red-400 text-sm">
              <AlertCircle className="w-4 h-4" />
              <span>{errors.confirmPassword}</span>
            </div>
          )}
        </div>

        <div className="space-y-2">
          <div className="flex items-start space-x-2">
            <input
              type="checkbox"
              checked={formData.terms}
              onChange={(e) => handleInputChange("terms", e.target.checked)}
              className="mt-1 rounded border-white/10 bg-white/5 text-blue-500"
              required
            />
            <span className="text-sm text-gray-400">
              Tôi đồng ý với{" "}
              <button
                type="button"
                className="text-blue-400 hover:text-blue-300"
              >
                Điều khoản dịch vụ
              </button>{" "}
              và{" "}
              <button
                type="button"
                className="text-blue-400 hover:text-blue-300"
              >
                Chính sách bảo mật
              </button>
            </span>
          </div>
          {errors.terms && (
            <div className="flex items-center space-x-1 text-red-400 text-sm">
              <AlertCircle className="w-4 h-4" />
              <span>{errors.terms}</span>
            </div>
          )}
        </div>

        <Button
          type="submit"
          disabled={isLoading}
          className="w-full bg-gradient-to-r from-blue-500 to-pink-500 hover:from-blue-600 hover:to-pink-600 text-white disabled:opacity-50"
        >
          {isLoading ? "Đang đăng ký..." : "Đăng Ký"}
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
        onClick={handleGoogleRegister}
        variant="outline"
        className="w-full border-white/10 bg-white/5 text-white hover:bg-white/10"
      >
        <GoogleIcon className="w-5 h-5 mr-2" />
        Đăng ký bằng Google
      </Button>
    </div>
  );
}
